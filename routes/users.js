var express = require('express');
var router = express.Router();
var http = require('http');

const baseURL = 'http://localhost:3100/api/Ages/getAge?'

router.get('/', function (req, res, next) {
  /* config json will come from the request */
  Promise.all([agePromise]).then(function (result) {
    res.send(result);
  }).catch(function (error) {
    res.send(error);
  });
});

var agePromise = new Promise(function (resolve, reject) {
  http.get('http://localhost:3100/api/Ages/getAge?quantity=1', function (res, req) {
    var body = '';
    res.on("data", function (data) {
      body += data;
    });
    res.on("end", function () {
      resolve(body);
    });
    res.on('error', function (error) {
      reject(error);
    });
  });
});

router.get('/age=:age&quantity=:quantity', function (req, res, next) {

  let parameters = {
    age: req.params.age,
    quantity: req.params.quantity
  }

  var url = ''
  if (req.params.age === undefined) {
    url = baseURL + 'quantity=' + parameters.quantity;
  } else {
    url = baseURL + 'weight=' + parameters.age + '&' + 'quantity=' + parameters.quantity;
  }

  http.get(url, function (error) {
    var body = '';
    if (error) {
      res.status(404).send(error);
      return res;
    } else {
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        body = JSON.parse(body);
      });
      res.send(body);
    }
  });
});


Promise.all([agePromise]).then(
  function ([agePromise]) {
    return agePromise;
  }
)

module.exports = router;
