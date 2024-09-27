import express from 'express';
import con from "../utils/db.js"
import multer from "multer";
import path from "path";

const router = express.Router();

// image upload 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'Public/Images')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage
})

const created_at = new Date().toISOString().slice(0, 10);
//   Add Report Fault
router.post('/add_request', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO fault_report 
    (fault_type, priority, zone, school, block, level, room_number, room_name, droup_down, requestor_name, requestor_contact, description, image, created_at, report_said) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.fault_type,        
        req.body.priority,        
        req.body.zone,        
        req.body.school,      
        req.body.block,        
        req.body.level,        
        req.body.room_number,        
        req.body.room_name,        
        req.body.droup_down,        
        req.body.requestor_name,        
        req.body.requestor_contact,        
        req.body.description, 
        req.file ? req.file.filename : null, // Access uploaded file using req.file
        created_at , 
        req.body.report_said,
    ];
    console.log(req.body)  
        
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });

         return res.send({ Status: 'Data received successfully' });
    });
});





router.get('/report', (req, res) => {
    const sql = 'SELECT * FROM fault_report ORDER BY id DESC';  
    con.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ Status: false, Error: 'Error fetching data' });
      } else {
        res.status(200).json({ Status: true, data: results });
      }
    });
  });

//   Edit Report Fault
  router.get('/report/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM fault_report WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/request/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE fault_report
    SET 
        fault_type = ?, 
        priority = ?, 
        zone = ?, 
        school = ?, 
        block = ?, 
        level = ?, 
        room_number = ?, 
        room_name = ?, 
        droup_down = ?, 
        requestor_name = ?, 
        requestor_contact = ?
    WHERE id = ?`
    const values = [
        req.body.fault_type,
       req.body.priority,
       req.body.zone,
       req.body.school,
       req.body.block,
       req.body.level,
       req.body.room_number,
       req.body.room_name,
       req.body.droup_down,
       req.body.requestor_name,
       req.body.requestor_contact,
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//Delete Attendance
router.delete('/delete_request/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from fault_report where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


router.get('/api/:locQRID', (req, res) => {
    const locQRID = req.params.locQRID;

    const query = `
      SELECT
        l.id AS location_id,
        l.locQRID,
        l.block,
        l.level,
        l.room_no,
        l.room_name,
        l.school_name AS location_school_name,
        s.zone,
        s.school_name AS school_table_school_name
      FROM 
        location l
      LEFT JOIN 
        school s 
      ON 
        l.school_id = s.id
      WHERE 
        l.locQRID = ?`;

    con.query(query, [locQRID], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.status(500).json({ Status: false, Error: "Query Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ Status: false, Error: "Location not found" });
        }

        return res.status(200).json({ Status: true, Data: result[0] });
    });
});



export { router as fault_reportRouter };