"use strict";

var restify = require("restify"),
    server = restify.createServer(),
    database = require("./database.js");

server.use(restify.queryParser());
server.get("/api/challenges", handleRequests);
server.listen(8888, function () {
    console.log("Server listening");
});

function handleRequests(req, res, next) {
    var data = req.params;
    
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
}