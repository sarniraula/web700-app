/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Saroj Niraula Student ID: 154184238 Date: 07/16/2024
*
* Online (Vercel) Link: https://web700-app.vercel.app/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require('express-handlebars');
const path = require('path');
var app = express();

// This will tell our server that any file with the “.hbs” 
// extension (instead of “.html”) will use the handlebars “engine” (template engine).
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

// app.use(express.static('public'));
app.use(express.static(path.join(path.resolve(), 'public')));


const collegeData = require('./modules/collegeData');

// Middleware to set the active route
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
   });

app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'home.html'));
    res.render('home');
});

app.get("/about", (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'about.html'));
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    // res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
    res.render('htmlDemo');
});

app.get('/students/add', (req, res) => {
    res.render('addStudent');
    // res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
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
            .then((data) => {
                // res.json(students);
                res.render("students", {students: data}); 
            })
            .catch((err) => {
                // res.json({ message: "No results" });
                res.render("students", {message: "no results"});
            });
    }
});

// app.get("/tas", (req, res) => {
//     collegeData.getTAs()
//         .then((tas) => {
//             res.json(tas);  
//         })
//         .catch((err) => {
//             res.json({ message: "No results" });
//         });
// });

app.get('/student/:num', (req, res) => {
    collegeData.getStudentsByNum(req.params.num)
        .then(data => {
            // res.json(data))
            res.render("student", {student: data[0]});
        })
        .catch(err => {
            // res.json({ message: err })
            res.render("student", {message: "no results"});
        });
});

app.post('/student/update', (req, res) => {
    let studentNum = parseInt(req.body.studentNum, 10);
    let course = parseInt(req.body.course, 10);

    if (isNaN(studentNum) || isNaN(course)) {
        return res.status(400).send('Invalid input: studentNum and course must be numbers');
    }

    const updatedStudent = {
        studentNum: studentNum,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        addressStreet: req.body.addressStreet,
        addressCity: req.body.addressCity,
        addressProvince: req.body.addressProvince,
        TA: req.body.TA === 'on',
        status: req.body.status,
        course: course
    };

    collegeData.updateStudent(updatedStudent)
        .then(() => {
            res.redirect('/students');
        })
        .catch(err => {
            res.redirect('/students');
            // res.status(500).send("Unable to update student: " + err);
        });
});

app.get('/courses', (req, res) => {
    collegeData.getCourses().then(data => {
        // res.json(data);
        res.render("courses", {courses: data});
    }).catch(err => {
        // res.json({ message: err });
        res.render("courses", {message: "no results"});
    });
});

app.get('/course/:id', (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then(data => {
            res.render("course", {course: data[0]});
        })
        .catch(err => {
            res.render("course",{ message: "no results" });
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