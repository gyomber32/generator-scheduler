var express = require('express');
var router = express.Router();
var http = require('http');
//var Promise = require('bluebird');
var request = require('request');
//var request = Promise.promisify(require('request'));

router.get('/gender=:gender&age=:age&height=:height&weight=:weight&systolicBloodPressure=:systolicBloodPressure&diastolicBloodPressure=:diastolicBloodPressure&bloodGlucose=:bloodGlucose&bloodOxygen=:bloodOxygen&tobaccoUse=:tobaccoUse&lungSound=:lungSound&quantity=:quantity', function (req, res) {

  var gender = req.params.gender;
  var age = req.params.age;
  var height = req.params.height;
  var weight = req.params.weight;
  var systolicBloodPressure = req.params.systolicBloodPressure;
  var diastolicBloodPressure = req.params.diastolicBloodPressure;
  var bloodGlucose = req.params.bloodGlucose;
  var bloodGlucose = req.params.bloodOxygen;
  var tobaccoUse = req.params.tobaccoUse;
  var lungSound = req.params.lungSound;
  var quantity = req.params.quantity;
  initialize(gender, quantity).then(data => {
    console.log(data);
  });
  initialize2().then(data => {
    console.log(data);
  });
  initialize3().then(data => {
    console.log(data);
  });
});

function initialize(gender, quantity) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/Genders/getGender?gender=' + gender + '&quantity=' + quantity,
    headers: {
      'User-Agent': 'request'
    }
  };
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    })
  })
}

function initialize2() {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/Ages/getAge?age=25&quantity=5',
    headers: {
      'User-Agent': 'request'
    }
  };
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    })
  })
}

function initialize3() {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/BloodOxygens/getBloodOxygen?quantity=5',
    headers: {
      'User-Agent': 'request'
    }
  };
  // Return new promise 
  return new Promise(function (resolve, reject) {
    // Do async job
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    })
  })
}

function gender() {
  var genderUrl = 'http://localhost:3100/api/Genders/getGender?gender=F&quantity=5';

  var body = '';
  http.get(genderUrl, function (res) {
    res.on('data', data => {
      body += data;
      console.log(body);
    });
  });
  return body;
}

function age() {
  var ageUrl = 'http://localhost:3100/api/Ages/getAge?age=25&quantity=5';

  var body = '';
  http.get(ageUrl, function (res) {
    res.on('data', data => {
      body += data;
      console.log(body);
      //callback.send(body)
    });
  });
  return body;
}

const runAsyncFunctions = async () => {
  let x = await gender();
  console.log('x: ' + x);
  await age();
}

async function load() {
  let myUrls = ['http://localhost:3100/api/Ages/getAge?quantity=5', 'http://localhost:3100/api/Genders/getGender?quantity=5'];
  try {
    // map myUrls array into array of request promises
    // wait until all request promises in the array resolve
    let results = await Promise.all(myUrls.map(request));
    // don't know if Babel await supports syntax below
    // let results = await* myUrls.map(request));
    // print array of results or use forEach 
    // to process / collect them in any other way
    console.log(results)
  } catch (e) {
    console.log(e);
  }
}

/*async.parallel([
  function (callback) {
   
  },
  function (callback) {
    var genderUrl = 'http://localhost:3100/api/Genders/getGender?' + 'gender=' + gender + '&' + 'quantity=' + quantity;

    var body = '';
    http.get(genderUrl, function (res) {
      res.on('data', data => {
        body += data;
      });
    });
  }
],
  // optional callback
  function (err, results) {
    // the results array will be array of result from the callback
    console.log(results);
  });*/


/*Promise.all([agePromise]).then(function (result) {
  res.send(result);
}).catch(function (error) {
  res.send(error);
});*/

/*var agePromise = new Promise(function (resolve, reject) {
  let ageUrl = 'http://localhost:3100/api/Ages/getAge?age=25&quantity=5';
  http.get(ageUrl, function (res, req) {
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
});*/

/*router.get('/age=:age&quantity=:quantity', function (req, res, next) {
 
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
  })
});*/

module.exports = router;
