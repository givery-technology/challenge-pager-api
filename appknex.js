//"use strict";

var express = require('express');
var app = express();

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./data/database.db"
    }
});

//middleware to populate req.body.
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(8888, function() {
    console.log("Server listening at port: 8888");
});

//Testing database
/*knex.table('challenges').then(function(rows) {
    console.log(rows);
});*/

app.get('/api/challenges', upload.array(), function (req, res, next) {
    var data = req.query;

    //knex('challenges').where('id', req.params.id);
    //knex.select().from('challenges');

    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = this.getDate().toString();
        return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
    };
    d = new Date();

    /*knex.table('challenges').first('date').then(function(row) {
        console.log(row);
    });*/

    // Set defaults
    data.offset = data.offset ? data.offset : 0;
    data.take = data.take ? data.take : 10;
    data.orderDesc = data.orderDesc ? "DESC" : "ASC";
    //data.fromDate = data.fromDate ? data.fromDate : knex.table('challenges').first('date').then(function(row) { row });
    data.toDate = data.toDate ? data.toDate : d.yyyymmdd();

    //console.log("data.fromDate" + data.fromDate);
    //console.log("data.toDate" + data.toDate);

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

    var total, totalFilter;

    // Check for filter
    if (data.filter) {
        var datalike;
        datalike = "%" + data.filter + "%";
    }

    knex('challenges').first('date').then(function (row) {
        data.fromDate = data.fromDate ? data.fromDate : row.date;
        //console.log(data.fromDate);
        return knex('challenges').count('id as cnt')
    }).then(function (c) {
        total = c[0].cnt;  //total count of entries in challenge
        //console.log(total);
        return knex('challenges')
                .count('id as cnt')
                .where(function() {
                    this.where('owner', 'like', datalike).orWhereNotNull('owner')
                }).andWhere(function () {
                    this.where('title', 'like', datalike).orWhereNotNull('title')
                })
                .whereBetween('date', [data.fromDate, data.toDate]);
    }).then(function (c) {
        totalFilter = c[0].cnt;
        //console.log(totalFilter);
        return knex('challenges')
                .where(function() {
                    this.where('owner', 'like', datalike).orWhereNotNull('owner')
                }).andWhere(function () {
                    this.where('title', 'like', datalike).orWhereNotNull('title')
                })
                .whereBetween('date', [data.fromDate, data.toDate])
                .limit(data.take)
                .offset(data.offset)
                .orderBy(data.orderCol,  data.orderDesc);
    }).then(function (challenges) {
        //console.log(challenges);
        res.send ({
            total: total,
            totalFilter: totalFilter,
            challenges: challenges
        });
        next();
    });
});
