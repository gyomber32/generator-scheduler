var express = require('express');
var router = express.Router();
var http = require('http');

const baseURL = 'http://localhost:3100/api/Weights/getWeight?'

router.get('/weight/quantity=:quantity', function (request, result) {
  
  let parameters = {
    quantity: request.params.quantity
  }

  const url = baseURL + 'quantity=' + parameters.quantity;
  var body = '';
  http.get(url, function (res) {
    res.on('data', data => {
      body += data;
      result.send(body);
    });
  });
});

router.get('/weight=:weight&quantity=:quantity', function (req, res, next) {

  let parameters = {
    weight: req.params.weight,
    quantity: req.params.quantity
  }

  var url = ''
  if (req.params.weight === undefined) {
    url = baseURL + 'quantity=' + parameters.quantity;
  } else {
    url = baseURL + 'weight=' + parameters.weight + '&' + 'quantity=' + parameters.quantity;
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

module.exports = router;
