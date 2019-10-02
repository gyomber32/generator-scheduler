const Patients = require("../routes/patients");
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;
const Request = require("request");

var address = 'ws://localhost:3001/';

/*it("should return error", async () => {
    var data = await Patients.getGender(10, 'F');
    expect(data.length).toEqual(10);
});*/

describe("Patients", () => {

    describe("getGender function", () => {
        var data;
        Patients.getGender(5, 'F').then(gender => {
            data = gender;
        });
        it("should contain 'F'", async () => {
            expect(data).toContain({ gender: 'F' });
        });
        it("should not contain 'M'", async () => {
            expect(data).not.toContain({ gender: 'M' });
        });
        it("should have length 5", async () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getAge function", () => {
        var data;
        Patients.getAge(5, 25).then(age => {
            data = age;
        });
        it("should contain 25", async () => {
            expect(data).toContain({ age: 25 });
        });
        it("should not contain 50", async () => {
            expect(data).not.toContain({ age: 50 });
        });
        it("should have length 5", async () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getHeight function", () => {
        var data;
        Patients.getHeight(5, 170).then(height => {
            data = height;
        });
        it("should contain 175", () => {
            expect(data).toContain({ valuenum: 175 });
        });
        it("should not contain 190", () => {
            expect(data).not.toContain({ valuenum: 190 });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getWeight function", () => {
        var data;
        Patients.getWeight(5, 80).then(height => {
            data = height;
        });
        it("should contain 80", () => {
            expect(data).toContain({ valuenum: 80 });
        });
        it("should not contain 90", () => {
            expect(data).not.toContain({ valuenum: 90 });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getSystolicBloodPressure function", () => {
        var data;
        Patients.getSystolicBloodPressure(5, 120).then(height => {
            data = height;
        });
        it("should contain 120", () => {
            expect(data).toContain({ valuenum: 120 });
        });
        it("should not contain 150", () => {
            expect(data).not.toContain({ valuenum: 150 });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getDiastolicBloodPressure function", () => {
        var data;
        Patients.getDiastolicBloodPressure(5, 80).then(height => {
            data = height;
        });
        it("should contain 80", () => {
            expect(data).toContain({ valuenum: 80 });
        });
        it("should not contain 60", () => {
            expect(data).not.toContain({ valuenum: 60 });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getBloodGlucose function", () => {
        var data;
        Patients.getBloodGlucose(5, 6).then(height => {
            data = height;
        });
        it("should contain 6", () => {
            expect(data).toContain({ valuenum: 6 });
        });
        it("should not contain 60", () => {
            expect(data).not.toContain({ valuenum: 10 });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getBloodOxygen function", () => {
        var data;
        Patients.getBloodOxygen(5, 98).then(height => {
            data = height;
        });
        it("should contain 98", () => {
            expect(data).toContain({ valuenum: 98 });
        });
        it("should not contain 100", () => {
            expect(data).not.toContain({ valuenum: 100 });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getTobaccoUse function", () => {
        var data;
        Patients.getTobaccoUse(5, 98).then(height => {
            data = height;
        });
        it("should contain 'Never used'", () => {
            expect(data).toContain({ value: "Never used" });
        });
        it("should not contain 'Former user - stopped more than 1 year ago'", () => {
            expect(data).not.toContain({ value: "Former user - stopped more than 1 year ago" });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getLeftLowerLung function", () => {
        var data;
        Patients.getLeftLowerLung(5, "Clear").then(height => {
            data = height;
        });
        it("should contain 'Clear'", () => {
            expect(data).toContain({ "value": "Clear" });
        });
        it("should not contain 'Diminished'", () => {
            expect(data).not.toContain({ value: "Diminished" });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getLeftUpperLung function", () => {
        var data;
        Patients.getLeftUpperLung(5, "Clear").then(height => {
            data = height;
        });
        it("should contain 'Clear'", () => {
            expect(data).toContain({ "value": "Clear" });
        });
        it("should not contain 'Diminished'", () => {
            expect(data).not.toContain({ value: "Diminished" });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getRightLowerLung function", () => {
        var data;
        Patients.getRightLowerLung(5, "Clear").then(height => {
            data = height;
        });
        it("should contain 'Clear'", () => {
            expect(data).toContain({ "value": "Clear" });
        });
        it("should not contain 'Diminished'", () => {
            expect(data).not.toContain({ value: "Diminished" });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("getRightUpperLung function", () => {
        var data;
        Patients.getRightUpperLung(5, "Clear").then(height => {
            data = height;
        });
        it("should contain 'Clear'", () => {
            expect(data).toContain({ "value": "Clear" });
        });
        it("should not contain 'Diminished'", () => {
            expect(data).not.toContain({ value: "Diminished" });
        });
        it("should have length 5", () => {
            expect(data.length).toBe(5);
        });
    });

    describe("makePatient function", () => {
        var data;
        Patients.makePatient(5).then(patient => {
            data = patient;
        });
        it("should contain patient", async () => {
            expect(JSON.stringify(data)).toContain('patient');
        });
    });

    describe("fileName function", () => {
        var data = Patients.fileName();
        it("returned filename should starts with word 'patients'", () => {
            expect(data).toContain('patients');
        });
        it("returned filename should starts with word '.json'", () => {
            expect(data).toContain('.json');
        });
        it("returned filename should contain the year", () => {
            const year = new Date().getFullYear();
            expect(data).toContain(year);
        });
        it("returned filename should cointain the month", () => {
            let month = new Date().getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            expect(data).toContain(month);
        });
        it("returned filename should contain the day", () => {
            let day = new Date().getDate();
            if (day < 10) {
                day = '0' + day;
            }
            expect(data).toContain(day);
        });
        it("returned filename should contain the hours", () => {
            let hours = new Date().getHours();
            if (hours < 10) {
                hours = '0' + hours;
            }
            expect(data).toContain(hours);
        });
        it("returned filename should contain the minutes", () => {
            let minutes = new Date().getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            expect(data).toContain(minutes);
        });
        it("returned filename should has length", () => {
            expect(data.length).toBe(30);
        });
    });

    describe("requestStatus function", () => {
        const mockEndPoint = "http://testserver:3000";
        it("should return status 200", () => {
            var data = Patients.requestStatus(mockEndPoint, 200);
            expect(data).toEqual("200 OK - Successful POST request to http://testserver:3000");
        });
        it("should return status 400", () => {
            var data = Patients.requestStatus(mockEndPoint, 400);
            expect(data).toEqual("400 Bad Request - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 401", () => {
            var data = Patients.requestStatus(mockEndPoint, 401);
            expect(data).toEqual("401 Unauthorized - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 403", () => {
            var data = Patients.requestStatus(mockEndPoint, 403);
            expect(data).toEqual("403 Forbidden - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 404", () => {
            var data = Patients.requestStatus(mockEndPoint, 404);
            expect(data).toEqual("404 Not Found - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 405", () => {
            var data = Patients.requestStatus(mockEndPoint, 405);
            expect(data).toEqual("405 Method Not Allowed - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 500", () => {
            var data = Patients.requestStatus(mockEndPoint, 500);
            expect(data).toEqual("500 Internal Server Error - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 501", () => {
            var data = Patients.requestStatus(mockEndPoint, 501);
            expect(data).toEqual("501 Not Implemented - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 502", () => {
            var data = Patients.requestStatus(mockEndPoint, 502);
            expect(data).toEqual("502 Bad Gateway - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 503", () => {
            var data = Patients.requestStatus(mockEndPoint, 503);
            expect(data).toEqual("503 Service Unavailable - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 504", () => {
            var data = Patients.requestStatus(mockEndPoint, 504);
            expect(data).toEqual("504 Gateway Timeout - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return status 0", () => {
            var data = Patients.requestStatus(mockEndPoint, 0);
            expect(data).toEqual("Unexpected Error - Unsuccessful POST request to http://testserver:3000");
        });
        it("should return error when status is missing", () => {
            var data = Patients.requestStatus(mockEndPoint);
            expect(data).toEqual("Error occured");
        });
        it("should return error when endpoint is missing", () => {
            var data = Patients.requestStatus(200);
            expect(data).toEqual("Error occured");
        });
        it("should return error when both parameters are missing", () => {
            var data = Patients.requestStatus();
            expect(data).toEqual("Error occured");
        });
    });
});