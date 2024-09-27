import express from "express";
import con from "../utils/db.js";


const router = express.Router();


// POST route to insert JSON data into the database
router.post('/addSensorData', (req, res) => {
  const { schoolName, block, level, RoomNo, RoomName, data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).send({ error: 'Invalid data format' });
  }

  const query = `
    INSERT INTO sensor_data (schoolName, block, level, RoomNo, RoomName, device_id, time, pm25, pm10, co2_ppm, temperature, humidity )
    VALUES ?
  `;

  const values = data.map(entry => [
    schoolName,
    block,
    level,
    RoomNo,
    RoomName,
    entry.device_id,
    entry.time,
    entry.pm25,
    entry.pm10,
    entry.co2_ppm,
    entry.temperature,
    entry.humidity,
    
  ]);

  con.query(query, [values], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'Failed to insert data' });
    }
    res.status(200).send({ message: 'Data inserted successfully', result });
  });
});


// API endpoint to fetch sensor data based on filters
router.get('/getSensorData', (req, res) => {
    const { schoolName, block, level, RoomNo, month, year, device_id } = req.query;

    // Create the base query
    let query = `SELECT * FROM sensor_data WHERE 1=1`;

    // Apply filters dynamically
    if (schoolName) {
        query += ` AND schoolName = ${con.escape(schoolName)}`;
    }
    if (block) {
        query += ` AND block = ${con.escape(block)}`;
    }
    if (level) {
        query += ` AND level = ${con.escape(level)}`;
    }
    if (RoomNo) {
        query += ` AND RoomNo = ${con.escape(RoomNo)}`;
    }
    if (device_id) {
        query += ` AND device_id = ${con.escape(device_id)}`;
    }
    if (month) {
        query += ` AND MONTH(time) = ${con.escape(month)}`;
    }
    if (year) {
        query += ` AND YEAR(time) = ${con.escape(year)}`;
    }

    // Execute the query
    con.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

// CREATE TABLE sensor_data (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   schoolName VARCHAR(255),
//   block VARCHAR(10),
//   level VARCHAR(10),
//   RoomNo VARCHAR(10),
//   RoomName VARCHAR(255),
//   device_id INT,
//   time DATETIME,
//   pm25 DECIMAL(10,8),
//   pm10 DECIMAL(10,8),
//   co2_ppm INT,
//   temperature DECIMAL(10,8),
//   humidity DECIMAL(10,8)  
// );


export { router as iaqRouter };