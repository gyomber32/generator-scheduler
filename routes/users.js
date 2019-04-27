var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');

/* Socket setup */

const server = require('http').createServer(express);
const io = require('socket.io')(server);

var genderTemp = new Array();
var ageTemp = new Array();
var heightTemp = new Array();
var weightTemp = new Array();
var bloodPressureTemp = new Array();
var bloodGlucoseTemp = new Array();
var bloodOxygenTemp = new Array();
var tobaccoUseTemp = new Array();
var lungSoundTemp = new Array();

io.on('connection', socket => {
  socket.on("config", config => {

    let gender = config.gender;
    let age = config.age;
    let height = config.height;
    let weight = config.weight;
    let systolicBloodPressure = config.systolicBloodPressure;
    let diastolicBloodPressure = config.diastolicBloodPressure;
    let bloodGlucose = config.bloodGlucose;
    let bloodOxygen = config.bloodOxygen;
    let tobaccoUse = config.tobaccoUse;
    let lungSound = config.lungSound;
    let quantity = config.quantity;

    getPat(gender, age, height, weight, systolicBloodPressure, diastolicBloodPressure, bloodGlucose, bloodOxygen, tobaccoUse, lungSound, quantity).then(data => {
      socket.emit('data', data);
    });

  });
});

async function getPat(gender, age, height, weight, systolicBloodPressure, diastolicBloodPressure, bloodGlucose, bloodOxygen, tobaccoUse, lungSound, quantity) {
  await getData(gender, age, height, weight, systolicBloodPressure, diastolicBloodPressure, bloodGlucose, bloodOxygen, tobaccoUse, lungSound, quantity);
  return await makePatient(quantity);
}

async function getData(gender, age, height, weight, systolicBloodPressure, diastolicBloodPressure, bloodGlucose, bloodOxygen, tobaccoUse, lungSound, quantity) {

  if (gender) {
    await getGender(quantity, gender).then(gender => {
      console.log(gender);
      for (let i = 0; i < quantity; i++) {
        if (gender[i].gender === 'F') {
          genderTemp[i] = 'Nő';
        } else {
          genderTemp[i] = 'Férfi';
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (age) {
    await getAge(quantity, age).then(age => {
      console.log(age);
      for (let i = 0; i < quantity; i++) {
        ageTemp[i] = age[i].age;
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (height) {
    await getHeight(quantity, height).then(height => {
      console.log(height);
      for (let i = 0; i < quantity; i++) {
        heightTemp[i] = height[i].valuenum;
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (weight) {
    await getWeight(quantity, weight).then(weight => {
      console.log(weight);
      for (let i = 0; i < quantity; i++) {
        weightTemp[i] = weight[i].valuenum;
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (systolicBloodPressure && diastolicBloodPressure) {
    await getSystolicBloodPressure(quantity, systolicBloodPressure).then(systolicBloodPressure => {
      for (let i = 0; i < quantity; i++) {
        bloodPressureTemp[i] = systolicBloodPressure[i].valuenum + ' / ';
      }
    });
    await getDiastolicBloodPressure(quantity, diastolicBloodPressure).then(diastolicBloodPressure => {
      console.log(diastolicBloodPressure);
      for (let i = 0; i < quantity; i++) {
        bloodPressureTemp[i] += diastolicBloodPressure[i].valuenum;
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (bloodGlucose) {
    await getBloodGlucose(quantity, bloodGlucose).then(bloodGlucose => {
      console.log(bloodGlucose);
      for (let i = 0; i < quantity; i++) {
        bloodGlucoseTemp[i] = +((bloodGlucose[i].valuenum / 18).toFixed(1));
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (bloodOxygen) {
    await getBloodOxygen(quantity, bloodOxygen).then(bloodOxygen => {
      console.log(bloodOxygen);
      for (let i = 0; i < quantity; i++) {
        bloodOxygenTemp[i] = bloodOxygen[i].valuenum;
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (tobaccoUse) {
    await getTobaccoUse(quantity, tobaccoUse).then(tobaccoUse => {
      console.log(tobaccoUse);
      for (let i = 0; i < quantity; i++) {
        if (tobaccoUse[i].value === 'Never used') {
          tobaccoUseTemp[i] = 'Nem doházik';
        }
        if (tobaccoUse[i].value === 'Current use or use within 1 month of admission') {
          tobaccoUseTemp[i] = 'Dohányzó';
        }
        if (tobaccoUse[i].value === 'Former user - stopped more than 1 year ago') {
          tobaccoUseTemp[i] = 'Leszokott (több mint egy éve)';
        }
        if (tobaccoUse[i].value === 'Stopped more than 1 month ago, but less than 1 year ago') {
          tobaccoUseTemp[i] = 'Leszokott (több mint egy hónapja)';
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  if (lungSound) {
    await getLeftLowerLung(quantity, lungSound).then(leftLowerLung => {
      console.log(leftLowerLung);
      for (let i = 0; i < quantity; i++) {
        if (leftLowerLung[i].value === 'Bronchial') {
          lungSoundTemp[i] = 'Hörgő' + ' / ';
        }
        if (leftLowerLung[i].value === 'Exp Wheeze') {
          lungSoundTemp[i] = 'Kilégzéskor ziháló' + ' / ';
        }
        if (leftLowerLung[i].value === 'Diminished') {
          lungSoundTemp[i] = 'Gyenge' + ' / ';
        }
        if (leftLowerLung[i].value === 'Crackles') {
          lungSoundTemp[i] = 'Ropogó' + ' / ';
        }
        if (leftLowerLung[i].value === 'Clear') {
          lungSoundTemp[i] = 'Tiszta' + ' / ';
        }
        if (leftLowerLung[i].value === 'Absent') {
          lungSoundTemp[i] = 'Hiányos' + ' / ';
        }
        if (leftLowerLung[i].value === 'Rhonchi') {
          lungSoundTemp[i] = 'Zajos' + ' / ';
        }
        if (leftLowerLung[i].value === 'Insp Wheeze') {
          lungSoundTemp[i] = 'Belégzéskor ziháló' + ' / ';
        }
        if (leftLowerLung[i].value === 'Pleural Friction') {
          lungSoundTemp[i] = 'Pleurális dörzszörej' + ' / ';
        }
        if (leftLowerLung[i].value === 'Coarse') {
          lungSoundTemp[i] = 'Dúrva' + ' / ';
        }
        if (leftLowerLung[i].value === 'Ins/Exp Wheeze') {
          lungSoundTemp[i] = 'Be- és kilégzéskor ziháló' + ' / ';
        }
      }
    }, (error) => {
      console.log(error);
    });

    await getLeftUpperLung(quantity, lungSound).then(leftUpperLung => {
      console.log(leftUpperLung);
      for (let i = 0; i < quantity; i++) {
        if (leftUpperLung[i].value === 'Bronchial') {
          lungSoundTemp[i] += 'Hörgő' + ' / ';
        }
        if (leftUpperLung[i].value === 'Exp Wheeze') {
          lungSoundTemp[i] += 'Kilégzéskor ziháló' + ' / ';
        }
        if (leftUpperLung[i].value === 'Diminished') {
          lungSoundTemp[i] += 'Gyenge' + ' / ';
        }
        if (leftUpperLung[i].value === 'Crackles') {
          lungSoundTemp[i] += 'Ropogó' + ' / ';
        }
        if (leftUpperLung[i].value === 'Clear') {
          lungSoundTemp[i] += 'Tiszta' + ' / ';
        }
        if (leftUpperLung[i].value === 'Absent') {
          lungSoundTemp[i] += 'Hiányos' + ' / ';
        }
        if (leftUpperLung[i].value === 'Rhonchi') {
          lungSoundTemp[i] += 'Zajos' + ' / ';
        }
        if (leftUpperLung[i].value === 'Insp Wheeze') {
          lungSoundTemp[i] += 'Belégzéskor ziháló' + ' / ';
        }
        if (leftUpperLung[i].value === 'Pleural Friction') {
          lungSoundTemp[i] += 'Pleurális dörzszörej' + ' / ';
        }
        if (leftUpperLung[i].value === 'Coarse') {
          lungSoundTemp[i] += 'Dúrva' + ' / ';
        }
        if (leftUpperLung[i].value === 'Ins/Exp Wheeze') {
          lungSoundTemp[i] += 'Be- és kilégzéskor ziháló' + ' / ';
        }
      }
    }, (error) => {
      console.log(error);
    });

    await getRightLowerLung(quantity, lungSound).then(rightLowerLung => {
      console.log(rightLowerLung);
      for (let i = 0; i < quantity; i++) {
        if (rightLowerLung[i].value === 'Bronchial') {
          lungSoundTemp[i] += 'Hörgő' + ' / ';
        }
        if (rightLowerLung[i].value === 'Exp Wheeze') {
          lungSoundTemp[i] += 'Kilégzéskor ziháló' + ' / ';
        }
        if (rightLowerLung[i].value === 'Diminished') {
          lungSoundTemp[i] += 'Gyenge' + ' / ';
        }
        if (rightLowerLung[i].value === 'Crackles') {
          lungSoundTemp[i] += 'Ropogó' + ' / ';
        }
        if (rightLowerLung[i].value === 'Clear') {
          lungSoundTemp[i] += 'Tiszta' + ' / ';
        }
        if (rightLowerLung[i].value === 'Absent') {
          lungSoundTemp[i] += 'Hiányos' + ' / ';
        }
        if (rightLowerLung[i].value === 'Rhonchi') {
          lungSoundTemp[i] += 'Zajos' + ' / ';
        }
        if (rightLowerLung[i].value === 'Insp Wheeze') {
          lungSoundTemp[i] += 'Belégzéskor ziháló' + ' / ';
        }
        if (rightLowerLung[i].value === 'Pleural Friction') {
          lungSoundTemp[i] += 'Pleurális dörzszörej' + ' / ';
        }
        if (rightLowerLung[i].value === 'Coarse') {
          lungSoundTemp[i] += 'Dúrva' + ' / ';
        }
        if (rightLowerLung[i].value === 'Ins/Exp Wheeze') {
          lungSoundTemp[i] += 'Be- és kilégzéskor ziháló' + ' / ';
        }
      }
    }, (error) => {
      console.log(error);
    });

    await getRightUpperLung(quantity, lungSound).then(rightUpperLung => {
      console.log(rightUpperLung);
      for (let i = 0; i < quantity; i++) {
        if (rightUpperLung[i].value === 'Bronchial') {
          lungSoundTemp[i] += 'Hörgő';
        }
        if (rightUpperLung[i].value === 'Exp Wheeze') {
          lungSoundTemp[i] += 'Kilégzéskor ziháló';
        }
        if (rightUpperLung[i].value === 'Diminished') {
          lungSoundTemp[i] += 'Gyenge';
        }
        if (rightUpperLung[i].value === 'Crackles') {
          lungSoundTemp[i] += 'Ropogó';
        }
        if (rightUpperLung[i].value === 'Clear') {
          lungSoundTemp[i] += 'Tiszta';
        }
        if (rightUpperLung[i].value === 'Absent') {
          lungSoundTemp[i] += 'Hiányos';
        }
        if (rightUpperLung[i].value === 'Rhonchi') {
          lungSoundTemp[i] += 'Zajos';
        }
        if (rightUpperLung[i].value === 'Insp Wheeze') {
          lungSoundTemp[i] += 'Belégzéskor ziháló';
        }
        if (rightUpperLung[i].value === 'Pleural Friction') {
          lungSoundTemp[i] += 'Pleurális dörzszörej';
        }
        if (rightUpperLung[i].value === 'Coarse') {
          lungSoundTemp[i] += 'Dúrva';
        }
        if (rightUpperLung[i].value === 'Ins/Exp Wheeze') {
          lungSoundTemp[i] += 'Be- és kilégzéskor ziháló';
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

}

function getGender(quantity, gender) {
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
    });
  });
}

function getAge(quantity, age) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/Ages/getAge?age=' + age + '&quantity=' + quantity,
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
    });
  });
}

function getHeight(quantity, height) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/Heights/getHeight?height=' + height + '&quantity=' + quantity,
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
    });
  });
}

function getWeight(quantity, weight) {
  var options = {
    url: 'http://localhost:3100/api/Weights/getWeight?weight=' + weight + '&quantity=' + quantity,
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
    });
  });
}

function getSystolicBloodPressure(quantity, systolicBloodPressure) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/SystolicBloodPressures/systolic?systolicBloodPressure=' + systolicBloodPressure + '&quantity=' + quantity,
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
    });
  });
}

function getDiastolicBloodPressure(quantity, diastolicBloodPressure) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/DiastolicBloodPressures/diastolic?diastolicBloodPressure=' + diastolicBloodPressure + '&quantity=' + quantity,
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
    });
  });
}

function getBloodGlucose(quantity, bloodGlucose) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/BloodGlucoses/getBloodGlucose?bloodGlucose=' + bloodGlucose + '&quantity=' + quantity,
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
    });
  });
}

function getBloodOxygen(quantity, bloodOxygen) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/BloodOxygens/getBloodOxygen?bloodOxygen=' + bloodOxygen + '&quantity=' + quantity,
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
    });
  });
}

function getTobaccoUse(quantity, tobaccoUse) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/TobaccoUses/getTobaccoUse?tobaccoUse=' + tobaccoUse + '&quantity=' + quantity,
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
    });
  });
}

function getLeftLowerLung(quantity, lungSound) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/LeftLowerLungs/LLL?lll=' + lungSound + '&quantity=' + quantity,
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
    });
  });
}
function getLeftUpperLung(quantity, lungSound) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/LeftUpperLungs/LUL?lul=' + lungSound + '&quantity=' + quantity,
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
    });
  });
}
function getRightLowerLung(quantity, lungSound) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/RightLowerLungs/RLL?rll=' + lungSound + '&quantity=' + quantity,
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
    });
  });
}
function getRightUpperLung(quantity, lungSound) {
  // Setting URL and headers for request
  var options = {
    url: 'http://localhost:3100/api/RightUpperLungs/RUL?rul=' + lungSound + '&quantity=' + quantity,
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
    });
  });
}

function clearVariables() {
  genderTemp = [];
  ageTemp = [];
  heightTemp = [];
  weightTemp = [];
  bloodPressureTemp = [];
  bloodGlucoseTemp = [];
  bloodOxygenTemp = [];
  tobaccoUseTemp = [];
  lungSoundTemp = [];
}

async function makePatient(quantity) {
  return new Promise((resolve, reject) => {
    let patient = {};
    for (let i = 0; i < quantity; i++) {
      patient["patient_" + i] = {};
      if (genderTemp != null) {
        patient["patient_" + i].gender = genderTemp[i];
      }
      if (ageTemp != null) {
        patient["patient_" + i].age = ageTemp[i];
      }
      if (heightTemp != null) {
        patient["patient_" + i].height = heightTemp[i];
      }
      if (weightTemp != null) {
        patient["patient_" + i].weight = weightTemp[i];
      }
      if (bloodPressureTemp != null) {
        patient["patient_" + i].bloodPressure = bloodPressureTemp[i];
      }
      if (bloodGlucoseTemp != null) {
        patient["patient_" + i].bloodGlucose = bloodGlucoseTemp[i];
      }
      if (bloodOxygenTemp != null) {
        patient["patient_" + i].bloodOxygen = bloodOxygenTemp[i];
      }
      if (tobaccoUseTemp != null) {
        patient["patient_" + i].tobaccoUse = tobaccoUseTemp[i];
      }
      if (lungSoundTemp != null) {
        patient["patient_" + i].lungSound = lungSoundTemp[i];
      }
    }
    clearVariables();
    resolve(patient);
  });
}

server.listen(3001);

module.exports = router;
