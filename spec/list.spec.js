"use strict";

var assert = require("chai").assert,
    spec = require("api-first-spec"),
    config = require("../config.json");

var API = spec.define({
    "endpoint": config.endpoints.list,
    "method": "GET",
    "request": {
        "contentType": spec.ContentType.URLENCODED,
        "params": {
            "offset": "int",
            "take": "int",
            "orderCol": "int",
            "orderDesc": "boolean",
            "filter": "string",
            "fromDate": "string",
            "toDate": "string"
        }
    },
    "response": {
        "contentType": spec.ContentType.JSON,
        "data": {
            "total": "int",
            "totalFilter": "int",
            "challenges": [{
                "owner": "string",
                "title": "string",
                "date": "datetime"
            }]
        },
        "rules": {
            "total": {
                "required": true
            },
            "totalFilter": {
                "required": true
            },
            "challenges": {
                "required": true
            },
            "challenges.owner": {
                "required": true
            },
            "challenges.title": {
                "required": true
            },
            "challenges.date": {
                "required": true,
                "format": "YYYY-MM-DD"
            }
        }
    }
});

describe("list challenges", function () {
    var host = spec.host(config.host);

    it("Step1 without parameters", function (done) {
        host.api(API)
            .params({})
            .success(function (data, res) {
                assert.equal(data.total, 27);
                assert.equal(data.totalFilter, data.total);
                assert.equal(data.challenges.length, 10);
                assert.equal(data.challenges[0].title, "Challenge 1");
                done();
            });
    });

    it("Step2 with offset", function (done) {
        host.api(API)
            .params({
                "offset": 5
            })
            .success(function (data, res) {
                assert.equal(data.total, 27);
                assert.equal(data.totalFilter, data.total);
                assert.equal(data.challenges.length, 10);
                assert.equal(data.challenges[0].title, "Challenge 6");
                done();
            });
    });

    it("Step3 with take", function (done) {
        host.api(API)
            .params({
                "take": 15
            })
            .success(function (data, res) {
                assert.equal(data.total, 27);
                assert.equal(data.totalFilter, data.total);
                assert.equal(data.challenges.length, 15);
                assert.equal(data.challenges[0].title, "Challenge 1");
                assert.equal(data.challenges[14].title, "API 5");
                done();
            });
    });

    it("Step4 with orderCol and orderDesc", function (done) {
        host.api(API)
            .params({
                "orderCol": 2,
                "orderDesc": true
            })
            .success(function (data, res) {
                assert.equal(data.total, 27);
                assert.equal(data.totalFilter, data.total);
                assert.equal(data.challenges.length, 10);
                assert.equal(data.challenges[0].title, "Framework 8");
                assert.equal(data.challenges[9].title, "Challenge 8");
                done();
            });
    });

    it("Step5 with filter", function (done) {
        host.api(API)
            .params({
                "filter": "mew"
            })
            .success(function (data, res) {
                assert.equal(data.total, 27);
                assert.equal(data.totalFilter, 8);
                assert.equal(data.challenges.length, 8);
                assert.equal(data.challenges[0].title, "Framework 1");
                done();
            });
    });

    it("Step6 with fromDate and toDate", function (done) {
        host.api(API)
            .params({
                "fromDate": "2015-10-28",
                "toDate": "2015-10-30",
                "orderCol": 3,
                "orderDesc": true
            })
            .success(function (data, res) {
                assert.equal(data.challenges.length, 9);
                assert.equal(data.challenges[0].title, "Challenge 8");
                assert.equal(data.challenges[8].title, "Framework 6");
                done();
            });
    })
});