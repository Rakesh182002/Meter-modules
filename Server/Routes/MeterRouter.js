import express from "express";
import con from "../utils/db.js";
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

// Add-Meter ==>

router.post('/add_meter', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO meter 
    (meter_name, meter_unit, zone, school, warranty_till, install_on, asset_id, asset_location,block,level, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.meter_name,
        req.body.meter_unit,        
        req.body.zone,        
        req.body.school,
        req.body.warranty_till,
        req.body.install_on, 
        req.body.asset_id,
        req.body.asset_location,
        req.body.block,
        req.body.level,
        req.file.filename,
    ];
    con.query(sql, values, (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
    });
});


router.get('/meter', (req, res) => {
    const sql = "SELECT * FROM meter";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Edit Meter ==>

router.get('/meter/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM meter WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_meter/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE meter 
        set  meter_name = ?,meter_unit = ?, zone = ?, school = ?, install_on = ?, warranty_till= ?, asset_id = ?, asset_location = ?, block= ?, level = ?
        Where id = ?`
    const values = [
        req.body.meter_name,
        req.body.meter_unit,
        req.body.zone,
        req.body.school,
        req.body.install_on, 
        req.body.warranty_till,        
        req.body.asset_id,
        req.body.asset_location,
        req.body.block,
        req.body.level,
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


//  Deleter Meter ==>

router.delete('/delete_meter/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from meter where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


export { router as meterRouter };