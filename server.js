/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Saroj Niraula Student ID: 154184238 Date: 07/16/2024
*
* Online (Vercel) Link: https://web700-app-gray.vercel.app
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require('path');
var app = express();

app.use(express.urlencoded({ extended: true }));

// app.use(express.static('public'));
app.use(express.static(path.join(path.resolve(), 'public')));


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

app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body).then(() => {
        res.redirect('/students');
    }).catch(err => {
        res.redirect('/students');
    });
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

app.get('/student/:num', (req, res) => {
    collegeData.getStudentsByNum(req.params.num)
        .then(data => res.json(data))
        .catch(err => res.json({ message: err }));
});

app.get('/courses', (req, res) => {
    collegeData.getCourses().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({ message: err });
    });
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404error.html'));
});

collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, ()=> {console.log("Server listening on port "+ HTTP_PORT)});
    })
    .catch((err) => {
        console.error(err);
    });

module.exports = app;