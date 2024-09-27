import express from 'express';
import con from "../utils/db.js"
import multer from "multer";
import path from "path";

const router = express.Router();

// image upload 

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: imageStorage
});

// module.exports = imageUpload;



// Add-Reading ==>

router.post('/add_readings', imageUpload.single('image'), (req, res) => {
    
    const sql = `INSERT INTO  mreading
    (meter_name, meter_reading, meter_unit, update_on, update_by, image, meter_id) 
    VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.meter_name,
        req.body.meter_reading,
        req.body.meter_unit,
        req.body.update_on,
        req.body.update_by,
        req.file.filename,
        req.body.meter_id
    ];   
    con.query(sql,values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result});
    })
});


router.get('/meter_reading/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM meter WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

//  Fetch Reading  *
router .get('/readings/:id',(req,res)=>{
    const id = req.params.id;
    const sql = "SELECT * FROM mreading where meter_id=?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Edit Reading 

router.get('/reading/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM mreading WHERE reading_id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_reading/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE mreading 
        set meter_reading = ?, update_on = ?, update_by = ?
        Where reading_id = ?`
    const values = [
        req.body.meter_reading,
        req.body.update_on,
        req.body.update_by, 
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//  Delete Reading

router.delete('/delete_reading/:reading_id', (req, res) => {
    const id = req.params.reading_id;
    const sql = "DELETE FROM mreading WHERE reading_id = ?";
    // console.log(sql); // For debugging purposes
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


export { router as readingRouter };