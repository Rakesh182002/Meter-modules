import mysql from 'mysql2'

// const mysql = require('mysql')
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sfm"
})

con.connect(function(err) {
    if(err) {
        console.log("connection error")
    } else {
        console.log("Connected to Mysql ")
    }
})
// con.connect((err) => {
//     if (err) {
//       console.error('Error connecting: ' + err.stack);
//       return;
//     }
//     console.log('Connected as id ' + con.threadId);
//   });


export default con;