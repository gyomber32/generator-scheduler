var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');

/* Scheduler config */
var schedule = require('node-schedule');

/* XMLHttpRequest */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var httpRequest = new XMLHttpRequest();

/* Socket setup */
const server = require('http').createServer(express);
const io = require('socket.io')(server);
//io.listen(3000);

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
        let saveToFile = config.saveToFile;
        let watching = config.watching;
        let typeOfGenerating = config.typeOfGenerating;
        let dateAndTime = config.dateAndTime;
        let endPoints = config.endPoints;

        if (typeOfGenerating == 'Egyszeri adatgenerálás') {
            getData(gender, age, height, weight, systolicBloodPressure, diastolicBloodPressure, bloodGlucose, bloodOxygen, tobaccoUse, lungSound, quantity).then(patients => {

                if (saveToFile == true) {
                    fs.writeFile('savedPatients/' + fileName(), JSON.stringify(patients), function (err) {
                        if (err) throw err;
                        console.log('File saved');
                    });
                }

                if (watching == false) {
                    for (let i = 0; i < quantity; i++) {
                        console.log("patient_" + i);
                        endPoints.forEach(endpoint => {
                            patient = JSON.stringify(patients["patient_" + i]);
                            httpRequest.open('POST', endpoint, false);
                            httpRequest.send(patient);
                            requestStatus(endpoint, httpRequest.status);
                        });
                    }
                }

                if (watching == true) {
                    for (let i = 0; i < quantity; i++) {
                        console.log("patient_" + i);
                        endPoints.forEach(endpoint => {
                            patient = JSON.stringify(patients["patient_" + i]);
                            httpRequest.open('POST', endpoint, true);
                            httpRequest.send(patient);
                            requestStatus(endpoint, httpRequest.status);
                            if (httpRequest.status == '200') {
                                patients["patient_" + i].outcome = 'Sikeres';
                            } else {
                                patients["patient_" + i].outcome = 'Sikertelen';
                            }
                        });
                        socket.emit('data', patients["patient_" + i]);
                    }
                }
            });
        }

        if (typeOfGenerating == 'Ütemezett adatgenerálás') {
            getData(gender, age, height, weight, systolicBloodPressure, diastolicBloodPressure, bloodGlucose, bloodOxygen, tobaccoUse, lungSound, quantity).then(patients => {
                /* parameters are: year, month, day, hours, minutes, seconds*/
                const date = new Date(dateAndTime[0], dateAndTime[1], dateAndTime[2], dateAndTime[3], dateAndTime[4], 0);
                let job = schedule.scheduleJob(date, function () {

                    if (saveToFile == true) {
                        fs.writeFile('savedPatients/' + fileName(), JSON.stringify(patients), function (err) {
                            if (err) throw err;
                            console.log('File saved');
                        });
                    }

                    if (watching == false) {
                        for (let i = 0; i < quantity; i++) {
                            console.log("patient_" + i);
                            endPoints.forEach(endpoint => {
                                patient = JSON.stringify(patients["patient_" + i]);
                                httpRequest.open('POST', endpoint, false);
                                httpRequest.send(patient);
                                requestStatus(endpoint, httpRequest.status);
                            });
                        }
                    }

                    if (watching == true) {
                        for (let i = 0; i < quantity; i++) {
                            console.log("patient_" + i);
                            endPoints.forEach(endpoint => {
                                patient = JSON.stringify(patients["patient_" + i]);
                                httpRequest.open('POST', endpoint, true);
                                httpRequest.send(patient);
                                requestStatus(endpoint, httpRequest.status);
                                if (httpRequest.status == '200') {
                                    patients["patient_" + i].outcome = 'Sikeres';
                                } else {
                                    patients["patient_" + i].outcome = 'Sikertelen';
                                }
                            });
                            socket.emit('data', patients["patient_" + i]);
                        }
                    }
                });
            });
        }
    });
});

async function getData(gender, age, height, weight, systolicBloodPressure, diastolicBloodPressure, bloodGlucose, bloodOxygen, tobaccoUse, lungSound, quantity) {

    if (gender) {
        await getGender(quantity, gender).then(gender => {
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
            for (let i = 0; i < quantity; i++) {
                ageTemp[i] = age[i].age;
            }
        }, (error) => {
            console.log(error);
        });
    }

    if (height) {
        await getHeight(quantity, height).then(height => {
            for (let i = 0; i < quantity; i++) {
                heightTemp[i] = height[i].valuenum;
            }
        }, (error) => {
            console.log(error);
        });
    }

    if (weight) {
        await getWeight(quantity, weight).then(weight => {
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
            for (let i = 0; i < quantity; i++) {
                bloodPressureTemp[i] += diastolicBloodPressure[i].valuenum;
            }
        }, (error) => {
            console.log(error);
        });
    }

    if (bloodGlucose) {
        await getBloodGlucose(quantity, bloodGlucose).then(bloodGlucose => {
            for (let i = 0; i < quantity; i++) {
                bloodGlucoseTemp[i] = +((bloodGlucose[i].valuenum / 18).toFixed(1));
            }
        }, (error) => {
            console.log(error);
        });
    }

    if (bloodOxygen) {
        await getBloodOxygen(quantity, bloodOxygen).then(bloodOxygen => {
            for (let i = 0; i < quantity; i++) {
                bloodOxygenTemp[i] = bloodOxygen[i].valuenum;
            }
        }, (error) => {
            console.log(error);
        });
    }

    if (tobaccoUse) {
        await getTobaccoUse(quantity, tobaccoUse).then(tobaccoUse => {
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
    return await makePatient(quantity);
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

function fileName() {
    let today = new Date();
    let YYYY = today.getFullYear();
    let MM = today.getMonth() + 1;
    let DD = today.getDate();
    let hh = today.getHours();
    let mm = today.getMinutes();

    if (DD < 10) {
        DD = '0' + DD;
    }

    if (MM < 10) {
        MM = '0' + MM;
    }

    if (hh < 10) {
        hh = '0' + hh;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return 'patients_' + YYYY + '-' + MM + '-' + DD + '_' + hh + ':' + mm + '.json';
}

function requestStatus(endpoint, status) {
    if (status == 200) {
        console.log("200 OK - Successful POST request to " + endpoint);
    }
    if (status == 400) {
        console.log("400 Bad Request - Unsuccessful POST request to " + endpoint);
    }
    if (status == 401) {
        console.log("401 Unauthorized - Unsuccessful POST request to " + endpoint);
    }
    if (status == 403) {
        console.log("403 Forbidden - Unsuccessful POST request to " + endpoint);
    }
    if (status == 404) {
        console.log("404 Not Found - Unsuccessful POST request to " + endpoint);
    }
    if (status == 405) {
        console.log("405 Method Not Allowed - Unsuccessful POST request to " + endpoint);
    }
    if (status == 500) {
        console.log("500 Internal Server Error - Unsuccessful POST request to " + endpoint);
    }
    if (status == 501) {
        console.log("501 Not Implemented - Unsuccessful POST request to " + endpoint);
    }
    if (status == 502) {
        console.log("502 Bad Gateway - Unsuccessful POST request to " + endpoint);
    }
    if (status == 503) {
        console.log("503 Service Unavailable - Unsuccessful POST request to " + endpoint);
    }
    if (status == 504) {
        console.log("504 Gateway Timeout - Unsuccessful POST request to " + endpoint);
    }
    if (status == 0) {
        console.log("Unexpected Error - Unsuccessful POST request to " + endpoint);
    }
}

server.listen(3001);

module.exports = router;