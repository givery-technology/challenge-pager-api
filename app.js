//"use strict";

var express = require('express'),
    database = require("./database.js");
var app = express();

//middleware to populate req.body.
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(8888, function() {
    console.log("Server listening at port: 8888");
});

app.get('/api/challenges', upload.array(), function (req, res, next) {
    var data = req.query;
    
    // Set defaults
    data.offset = data.offset ? data.offset : 0;
    data.take = data.take ? data.take : 10;
    data.orderDesc = data.orderDesc ? "DESC" : "ASC";
    
    // Set order columns
    switch (data.orderCol) {
        case "3":
            data.orderCol = "Date";
            break;
        case "2":
            data.orderCol = "Title";
            break;
        case "1":
            data.orderCol = "Owner";
            break;
        case "0":
        default:
            data.orderCol = "Id";
            break;
    }
    
    var total, totalFilter, where = {};
    
    // Check for filter
    if (data.filter) {
        where["$or"] = [
            {
                Owner: {
                    $like: "%" + data.filter + "%"
                }
            },
            {
                Title: {
                    $like: "%" + data.filter + "%"
                }
            },
            {
                Date: {
                    $like: "%" + data.filter + "%"
                }
            }
        ]
    }
    
    // Check for date filters
    if (data.fromDate || data.toDate) {
        var dFilter = {};
                
        if (data.fromDate)
            dFilter["$gte"] = data.fromDate;
        if (data.toDate)
            dFilter["$lte"] = data.toDate;

        where["Date"] = dFilter;
    }
    
    // Get complete count
    database.Challenges.count().then(function (c) {
        total = c;
        // Get filter count
        return database.Challenges.count({ where: where });
    }).then(function (c) {
        totalFilter = c;
        // Get filter data
        return database.Challenges.findAll({
            raw: true,
            limit: data.take,
            offset: data.offset,
            order: [[data.orderCol, data.orderDesc]],
            where: where
        });
    }).then(function (challenges) {
        // Send data to client
        res.send({
            total: total,
            totalFilter: totalFilter,
            challenges: challenges
        });
        next();
    });
});