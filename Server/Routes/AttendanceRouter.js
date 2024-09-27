import express from 'express';
import con from "../utils/db.js"
const router = express.Router();
import multer from 'multer';


const storage = multer.memoryStorage(); // Stores files in memory
const upload = multer({ storage: storage });

// Route to handle adding attendance
router.post('/add_attendance', upload.single('image'), (req, res) => {
  const { zone, school, tech_name, date, checkin, checkout } = req.body;
  const image = req.file ? req.file.buffer.toString('base64') : ''; // Convert file buffer to Base64

  // SQL query
  const sql = `INSERT INTO attendance 
    (zone, school, tech_name, date, checkin, checkout, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    zone,
    school,
    tech_name,
    date,
    checkin,
    checkout,
    image // Save Base64 string of the image
  ];

  // Execute SQL query
  con.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ Status: false, Error: 'Database error occurred' });
    }
    return res.json({ Status: true });
  });
});




// Add Attendance route
router.post('/add_attendance', (req, res) => {

  // SQL query
  const sql = `INSERT INTO attendance 
  (zone, school, tech_name, date, checkin, checkout, image) 
  VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    req.body.zone,
    req.body.school,
    req.body.tech_name,
    req.body.date,
    req.body.checkin,
    req.body.checkout,
    req.body.image// Save Base64 string of the image
  ];
console.log(values)
  // Execute SQL query
  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});


  router.get('/attendance', (req, res) => {
    const sql = 'SELECT * FROM attendance';
  
    con.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ Status: false, Error: 'Error fetching data' });
      } else {
        // Convert binary image data to Base64 string
        const data = results.map(record => {
          if (record.image) {
            record.image = Buffer.from(record.image).toString('base64');
          }
          return record;
        });
  
        res.status(200).json({ Status: true, data });
      }
    });
  });



//Edit Attendance
  
router.get('/attendance/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM attendance WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_attendance/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE attendance 
        set  zone = ?, school = ?, tech_name = ?, date=?, checkin = ?, checkout= ?
        Where id = ?`
    const values = [
        req.body.zone,        
        req.body.school,
        req.body.tech_name,
        req.body.date,
        req.body.checkin,
        req.body.checkout,
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


//Delete Attendance
router.delete('/delete_attendance/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from attendance where id = ?"
    console.log(sql) 
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

// Export the router
export { router as attendanceRouter };