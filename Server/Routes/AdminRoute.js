import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cron from 'node-cron'


const router = express.Router();
// const bodyParser = require('body-parser');

// LogIn

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    } else {
        return res.json({ loginStatus: false, Error:"wrong email or password" });
    }
  });
});

//Log Out
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

                            //  Asset

router.get('/asset', (req, res) => {
    const sql = "SELECT * FROM asset";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// router.post('/add_asset', (req, res) => {
//     const sql = "INSERT INTO asset (`name`) VALUES (?)"
//     con.query(sql, [req.body.category], (err, result) => {
//         if(err) return res.json({Status: false, Error: "Query Error"})
//         return res.json({Status: true})
//     })
// })

//////////////////////////////////////////////////////////////////////////

                        //! Meter

//////////////////////////////////////////////////////////////////

                            //! Reading


/////////////////////////////////////////////////////////////
                            //! School 

router.post('/add_school', (req, res) => {
    const sql = `INSERT INTO school (zone, school_name,address) VALUES (?, ?, ?)`;
    const values = [       
        req.body.zone,        
        req.body.school_name,
        req.body.address
    ];
    console.log(req.body)  
        
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        
        return res.json({ Status: true });
    });
});

router.get('/school', (req, res) => {
    const sql = "SELECT  * from school ";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})


//   Edit School
  router.get('/school/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM school WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_school/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE school
    SET zone = ?,
     school_name = ?, 
     address = ?
     WHERE id = ?`
    const values = [
       req.body.zone,
       req.body.school_name,
       req.body.address
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//Delete School
router.delete('/delete_school/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from school where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})
///////////////////////////////////////////////////////////////
                                //!Location

router.post('/add_location', (req, res) => {
    
    const sql = `INSERT INTO  location
    (locQRID, block, level, room_no, room_name, school_id,school_name) 
    VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.locQRID,
        req.body.block,
        req.body.level,
        req.body.room_no,
        req.body.room_name,
        req.body.school_id,
        req.body.school_name
    ];   
    con.query(sql,values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result});
    })
});

router.get('/location/:id',(req,res)=>{
    const id = req.params.id;
    const sql = "SELECT * FROM location where school_id=?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Edit LOCATION 

router.get('/locations/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM location WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_location/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE location 
        set locQRID = ?, block = ?, level = ? , room_no = ? , room_name = ?
        Where id = ?`
    const values = [
        req.body.locQRID,
        req.body.block,
        req.body.level,
        req.body.room_no,
        req.body.room_name
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//  Delete LOCATION

router.delete('/delete_location/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM location WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})
                                
                    
//////////////////////////////////////////////////////////
                                // !Attendance


///////////////////////////////////////////////////////////////////////////
                // ! Fault Report


////////////////////////////////////////////////////////////////////
                                //!Booking



// CREATE TABLE admin (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     email VARCHAR(255) NOT NULL,
//     password VARCHAR(255) NOT NULL
// );


// CREATE TABLE asset (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     VARCHAR(50) NOT NULL
// );


// CREATE TABLE meter (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     meter_name VARCHAR(100) NOT NULL,
//     meter_unit VARCHAR(30) ,
//     zone VARCHAR(255),
//     school VARCHAR(255),
//     warranty_till DATE,
//     install_on DATE,
//     asset_id VARCHAR(50),
//     asset_location VARCHAR(255),
//     block VARCHAR(50),
//     level VARCHAR(50),
//     image BLOB
//   );


// CREATE TABLE mreading (
//     reading_id INT AUTO_INCREMENT PRIMARY KEY,
//     meter_name VARCHAR(100),
//     meter_reading INT NOT NULL,
//     meter_unit VARCHAR(100),
//     update_on DATETIME NOT NULL,
//     update_by VARCHAR(30),
//     image BLOB,
//     meter_id INT NOT NULL,
//     FOREIGN KEY (meter_id) REFERENCES meter(id)
//   );


// CREATE TABLE attendance (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     zone VARCHAR(255) NOT NULL,
//     school VARCHAR(255) NOT NULL,
//     tech_name VARCHAR(100) NOT NULL,
//     date DATE not null,
//     checkin time NOT NULL,
//     checkout time NOT NULL,
//     image BLOB
// );

// CREATE TABLE school (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     zone VARCHAR(50) NOT NULL,
//     school_name VARCHAR(100) NOT NULL,
//     address VARCHAR(255) NOT NULL
// );

// CREATE TABLE location (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     locQRID VARCHAR(55) NOT NULL,
//     block VARCHAR(25) NOT NULL,
//     level VARCHAR(50) NOT NULL,
//     room_no VARCHAR(55) NOT NULL,
//     room_name VARCHAR(155) NOT NULL,
//     school_name VARCHAR(155) NOT NULL,
//     school_id INT,
//     FOREIGN KEY (school_id) REFERENCES school(id)
//   );

// INSERT INTO school (id, zone, school_name, address) VALUES
// (1, 'EAST-G1', 'Haig Girls School', '51, Koon Seng Rd,S(427072)'),
// (2, 'EAST-G1', 'Canossa Catholic Primary School', '1, Salim Rd,S(387621)'),
// (3, 'EAST-G1', 'CHIJ (Katong) Primary', '17,Martia Rd,S(424821)'),
// (4, 'EAST-G1', 'Geylang Methodist School (Primary)', '4, Geylang East Central,S(389706)'),
// (5, 'EAST-G1', 'Kong Hwa School', '350,Guillemard Rd,S(399772)'),
// (6, 'EAST-G1', 'Maha Bodhi School', '10, Ubi Ave 1,S(408931)'),
// (7, 'EAST-G1', 'St Margaret''s Primary School (Holding @ Former Macpherson Primary School', '2, Mattar Road,S(387724)'),
// (8, 'EAST-G1', 'Tao Nan School', '49, Marine Crescent,S(449761)'),
// (9, 'EAST-G1', 'Broadrick Secondary School', '61, Dakota Crescent,S(399935)'),
// (10, 'EAST-G1', 'Dunman High School', '10, Tanjong Rhu Rd,S(436895)'),
// (11, 'EAST-G1', 'Tanjong Katong Primary School', '10 Seraya Road,S(437259)'),
// (12, 'EAST-G1', 'Tanjong Katong Girls'' School', '20 Dunman Lane,S(439272)'),
// (13, 'EAST-G1', 'Tanjong Katong Secondary School', '130, Haig Rd,S(438796)'),
// (14, 'EAST-G1', 'Geylang Methodist School (Secondary)', '2, Geylang East Central,S(389705)'),
// (15, 'EAST-G1', 'Manjusri Secondary School', '20, Ubi Ave 1,S(408940)'),
// (16, 'EAST-G1', 'Dunman High School Hostel', '61, Kampong Arang Rd,S(438181)'),
// (17, 'EAST-G2', 'Victoria School Hostel', '4, Siglap Link,S(448879)'),
// (18, 'EAST-G2', 'St Hilda''s Secondary School', '2, Tampines St 82,S(528986)'),
// (19, 'EAST-G2', 'St Patrick''s School', '490, East Coast Rd,S(429058)'),
// (20, 'EAST-G2', 'Tampines Primary School - [inclusive MOE Kindergarten & Kindergarten Care]', '250, Tampines St 12,S(529426)'),
// (21, 'EAST-G2', 'Temasek Secondary School', '600, Upper East Coast Rd,S(465561)'),
// (22, 'EAST-G2', 'Victoria School', '2, Siglap Link,S(448880)'),
// (23, 'EAST-G2', 'CHIJ Katong Convent', '346, Marine Terrace,S(449150)'),
// (24, 'EAST-G2', 'Temasek Primary School', '501, Bedok South Ave 3,S(469300)'),
// (25, 'EAST-G2', 'Springfield Secondary School', '30, Tampines Ave 8,S(529593)'),
// (26, 'EAST-G2', 'Tampines Secondary School', '252, Tampines St 12,S(529427)'),
// (27, 'EAST-G2', 'Ngee Ann Primary School', '344, Marine Terrace,S(449149)'),
// (28, 'EAST-G2', 'Poi Ching School', '21, Tampines St 71,S(529067)'),
// (29, 'EAST-G2', 'St Hilda''s Primary School', '2, Tampines Ave 3,S(529706)'),
// (30, 'EAST-G2', 'St Stephen''s School', '20, Siglap View,S(455789)'),
// (31, 'EAST-G2', 'Junyuan Primary School [inclusive MOE Kindergarten & Kindergarten Care]', '2, Tampines St 91,S(528906)'),
// (32, 'EAST-G2', 'Angsana Primary School - [inclusive MOE Kindergarten & Kindergarten Care]', '51, Tampines Street 61,S(528565)'),
// (33, 'EAST-G3', 'Casuarina Primary School', '30, Pasir Ris St 41,S(518935)'),
// (34, 'EAST-G3', 'East Spring Primary School', '31, Tampines St 33,S(529258)'),
// (35, 'EAST-G3', 'Elias Park Primary School', '11, Pasir Ris St 52,S(518866)'),
// (36, 'EAST-G3', 'Gongshang Primary School [inclusive MOE Kindergarten & Kindergarten Care]', '1, Tampines St 42,S(529176)'),
// (37, 'EAST-G3', 'Meridian Primary School [inclusive MOE Kindergarten & Kindergarten Care]', '20, Pasir Ris St 71,S(518798)'),
// (38, 'EAST-G3', 'Pasir Ris Primary School', '5, Pasir Ris St 21,S(518968)'),
// (39, 'EAST-G3', 'Tampines North Primary School', '30, Tampines Ave 9,S(529565)'),
// (40, 'EAST-G3', 'Loyang View Secondary School', '12, Pasir Ris St 11,S(519073)'),
// (41, 'EAST-G3', 'Meridian Secondary School', '31, Pasir Ris St 51,S(518901)'),
// (42, 'EAST-G3', 'Pasir Ris Crest Secondary School', '11, Pasir Ris St 41,S(518934)'),
// (43, 'EAST-G3', 'Pasir Ris Secondary School', '390, Tampines St 21,S(529400)'),
// (44, 'EAST-G3', 'Dunman Secondary School', '21, Tampines St 45,S(529093)'),
// (45, 'EAST-G3', 'East Spring Secondary School', '30, Tampines St 34,S(529231)'),
// (46, 'EAST-G3', 'White Sands Primary School', '2, Pasir Ris St 11,S(519075)'),
// (47, 'EAST-G3', 'Tampines Meridian Junior College', '21, Pasir Ris St 71,S(518799)'),
// (48, 'EAST-G3', 'Ngee Ann Secondary School', '1, Tampines St 32,S(529283)'),
// (49, 'EAST-G3', 'Hai Sing Catholic School (Holding @ Former Greenview Secondary School)', '15, Pasir Ris St 21,S(518969)'),
// (50, 'EAST-G3', 'Temasek Junior College', '2 Tampines Avenue 9, S(529564)');



// CREATE TABLE fault_report (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     fault_type VARCHAR(255) NOT NULL,
//     priority  VARCHAR(255) NOT NULL,
//     zone VARCHAR(255) NOT NULL,
//     school VARCHAR(255) NOT NULL,
//     block VARCHAR(255) NOT NULL,
//     level VARCHAR(50) NOT NULL,
//     room_number VARCHAR(50) NOT NULL,
//     room_name VARCHAR(255) NOT NULL,
//     droup_down VARCHAR(255) NOT NULL,
//     requestor_name VARCHAR(255) NOT NULL,
//     requestor_contact VARCHAR(255) NOT NULL,
//     description  VARCHAR(255),
//     image BLOB,
//     created_at DATE NOT NULL
// );

// CREATE TABLE bookings (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     zone VARCHAR(255),
//     schoolName VARCHAR(255),
//     block VARCHAR(255),
//     level VARCHAR(255),
//     roomNo VARCHAR(255),
//     roomName VARCHAR(255),
//     date DATE,
//     timeStart TIME,
//     timeEnd TIME,
//     remarks TEXT,
//     equipment JSON,
//     status ENUM('upcoming', 'ongoing', 'completed', 'cancelled ') DEFAULT 'upcoming',
    
// );







export { router as adminRouter };
