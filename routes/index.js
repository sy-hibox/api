var express = require('express');
var router = express.Router();
var fs = require('fs');
var xml2js = require('xml2js');
var builder = new xml2js.Builder();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buy', function(req, res, next){
  var xml = fs.readFileSync('test/buy.xml', 'utf8');
  var objRet = {
    returncode: '0000',
    returnmessage: '交易成功'
  };
  xml2js.parseString(xml, function(err, result){

    if(err === null){
      var timestamp = result.request.timestamp[0];
      var salessysid = result.request.salessysid[0];
      var salessysorderno = result.request.salessysorderno[0];
      var userid = result.request.userid[0];
      var merchantid = result.request.merchantid[0];
      var goodid = result.request.goodid[0];
      var num = result.request.num[0];
      var paymoney = result.request.paymoney[0];
      // STEP 01: Check Timestamp
      

    } else {
      objRet.returncode = '9001';
      objRet.returnmessage = '报文格式错误';
    }
    
    var resXml = builder.buildObject({'response': objRet});
    res.send(resXml);
  });
});

module.exports = router;
