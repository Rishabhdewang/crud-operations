const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
//Configuring express server
app.use(bodyparser.json());

//MySQL details
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '8085',
    database: 'learner',
    multipleStatements: true
    });

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Connection Established Successfully');
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

//Creating GET Router to fetch all the learner details from the MySQL Database
app.get('/learners' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails', (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );


//Router to GET specific learner detail from the MySQL database
app.get('/learners/:id' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails WHERE learnerId = ?',[req.params.id], (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );

//Router to INSERT/POST a learner's detail
app.post('/learners', (req, res) => {
    let learner = req.body;
    let data = {learnerId : learner.learnerId, learnerName : learner.learnerName, learnerEmail : learner.learnerEmail, courseID : learner.courseID};
    // var sql = "SET @learnerId = ?;SET @learnerName = ?;SET @learnerEmail = ?;SET @courseID = ?; CALL learnerAddOrEdit(@learnerId,@learnerName,@learnerEmail,@courseID);"
    var sql = "insert into learnerdetails SET ?";
    let query = mysqlConnection.query(sql, data, (err, rows, fields) => {
    if (!err)
    res.send('New Learner ID : '+ data.learnerId);
    else
    console.log(err);
    })
    });

//Router to UPDATE a learner's detail
app.put('/learners', (req, res) => {
    let learner = req.body;
    let sql = "UPDATE learnerdetails SET learnerId='"+learner.learnerId +"', learnerName ='"+ learner.learnerName+ "', learnerEmail ='" + learner.learnerEmail+ "', courseID ='"+ learner.courseID+"' WHERE learnerID ='"+learner.learnerId+"' ";
    let data = { Id : req.params.id,learnerId : learner.learnerId, learnerName : learner.learnerName, learnerEmail : learner.learnerEmail, courseID : learner.courseID};
    let query = mysqlConnection.query(sql, data, (err, rows, fields) => {
        if (!err)
        res.send('New Learner ID : '+ data.learnerId);
        else
        console.log(err);
        })
        });

//Router to DELETE a learner's detail
app.delete('/learners/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM learnerdetails WHERE learnerId = ?', [req.params.id], (err, rows, fields) => {
    if (!err)
    res.send('Learner Record deleted successfully.');
    else
    console.log(err);
    })
    });


