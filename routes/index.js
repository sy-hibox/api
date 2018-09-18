var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js');
var builder = new xml2js.Builder();
var crypto = require('crypto');
var datetime = require('node-datetime');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buy', function (req, res, next) {
  var xml = fs.readFileSync('test/buy.xml', 'utf8');
  var objRet = {
    returncode: '0000',
    returnmessage: '交易成功'
  };
  xml2js.parseString(xml, function (err, result) {

    if (err) {
      objRet.returncode = '9001';
      objRet.returnmessage = '报文格式错误';
    } else procbody: {
      if(result.request.timestamp === undefined){
        objRet.returncode = '9014';
        objRet.returnmessage = '时间戳值为空';
        break procbody;
      }

      if(result.request.salessysid === undefined){
        objRet.returncode = '9006';
        objRet.returnmessage = '宽连二维码平台接入编号为空';
        break procbody;
      }

      if(result.request.salessysorderno === undefined){
        objRet.returncode = '9008';
        objRet.returnmessage = '业务订单为空';
        break procbody;
      }

      if(result.request.userid === undefined){
        objRet.returncode = '9009';
        objRet.returnmessage = '用户手机号为空';
        break procbody;
      }

      if(result.request.merchantid === undefined){
        objRet.returncode = '9010';
        objRet.returnmessage = '商户编号为空';
        break procbody;
      }

      if(result.request.goodid === undefined){
        objRet.returncode = '9004';
        objRet.returnmessage = '商品ID为空';
        break procbody;
      }

      if(result.request.num === undefined){
        objRet.returncode = '9011';
        objRet.returnmessage = '购买数量为空';
        break procbody;
      }

      if(result.request.paymoney === undefined){
        objRet.returncode = '9012';
        objRet.returnmessage = '支付金额为空';
        break procbody;
      }

      var timestamp = result.request.timestamp[0];
      var salessysid = result.request.salessysid[0];
      var salessysorderno = result.request.salessysorderno[0];
      var userid = result.request.userid[0];
      var merchantid = result.request.merchantid[0];
      var goodid = result.request.goodid[0];
      var num = result.request.num[0];
      var paymoney = result.request.paymoney[0];
      /* STEP 01: Check Timestamp */
      if (timestamp.length !== 17 || timestamp === undefined) {
        objRet.returncode = '9014';
        objRet.returnmessage = '时间戳值为空';
        break procbody;
      }

      if(userid.length !== 11 || userid === undefined){
        objRet.returncode = '9004';
        objRet.returnmessage = '商品ID为空';
        break procbody;
      }
      
      /* STEP 02: Create Password */
      var keyString = 'TestKeyValue';
      var serialcode = 'EVA-2018-09-18';

      var key = Buffer.from(keyString, 'ascii');
      var cipher = crypto.createCipheriv('des-ecb', key, '');
      var password = cipher.update(serialcode, 'utf8', 'base64');
      password += cipher.final('base64');
      objRet.password = password;

      objRet.salessysid = salessysid;
      objRet.salessysorderno = salessysorderno;

      /* STEP 03: Create OrderNumber */
      var dt = datetime.create();
      objRet.ordernumber = 'EV' + dt.format('ymdHMSN') + userid.substring(7, 11);
      /* STEP 04: Create TimeStamp */
      objRet.tradetime = dt.format('YmdHMS');
      objRet.timestamp = dt.format('YmdHMSN');
    }
    var resXml = builder.buildObject({ 'response': objRet });
    res.send(resXml);
  });
});

module.exports = router;
