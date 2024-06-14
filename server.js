/*********************************************************************************
* WEB700 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name:  Student_ID:  Date: 
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require('path');
var app = express();

const collegeData = require('./modules/collegeData');


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});


app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: err });
            });
    } else {
        collegeData.getAllStudents()
            .then((students) => {
                res.json(students);
            })
            .catch((err) => {
                res.json({ message: "No results" });
            });
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => {
            res.json(tas);
        })
        .catch((err) => {
            res.json({ message: "No results" });
        });
});

app.get('/courses', (req, res) => {
    collegeData.getCourses().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    });
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, ()=> {console.log("Server listening on port "+ HTTP_PORT)});
    })
    .catch((err) => {
        console.error(err);
    });