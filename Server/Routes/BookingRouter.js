import express, { query } from 'express';
import con from "../utils/db.js";

const router = express.Router();

// Add Booking Route
router.post('/add_booking', (req, res) => {
    const { zone, schoolName, block, level, roomNo, roomName, date, timeStart, timeEnd, remarks, equipment } = req.body;


        // Insert the new booking if no overlap is found
        const sql = `INSERT INTO bookings 
            (zone, schoolName, block, level, roomNo, roomName, date, timeStart, timeEnd, remarks, equipment) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            zone,
            schoolName,
            block,
            level,
            roomNo,
            roomName,
            date,
            timeStart,
            timeEnd,
            remarks || null,
            JSON.stringify(equipment)
        ];
        con.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error adding booking:', err);
                return res.status(500).json({ success: false, Error: err.message });
            }
            res.json({ success: true });
        });
    })        

const updateBookingStatuses = () => {
        // Query to update status to 'ongoing'
        const updateOngoing = `
          UPDATE bookings
          SET status = 'ongoing'
          WHERE CURRENT_DATE = date
          AND CURRENT_TIME >= timeStart
          AND CURRENT_TIME <= timeEnd
          AND status = 'upcoming'`;
    
        // Query to update status to 'completed'
        const updateCompleted = `
          UPDATE bookings
          SET status = 'completed'
          WHERE CURRENT_DATE = date
          AND CURRENT_TIME > timeEnd
          AND status IN ('upcoming', 'ongoing')`;
    
        // Query to update status back to 'upcoming' for bookings that are not started yet
        const updateUpcoming = `
          UPDATE bookings
          SET status = 'upcoming'
          WHERE CURRENT_DATE = date
          AND CURRENT_TIME < timeStart
          AND status != 'upcoming'`;
    
        // Execute the 'ongoing' update query
        con.query(updateOngoing, (err) => {
            if (err) {
                // Handle error silently or log to a file
            }
        });
    
        // Execute the 'completed' update query
        con.query(updateCompleted, (err) => {
            if (err) {
                // Handle error silently or log to a file
            }
        });
    
        // Execute the 'upcoming' update query
        con.query(updateUpcoming, (err) => {
            if (err) {
                // Handle error silently or log to a file
            }
        });
    };
    // Call the function every minute (60 seconds)
    setInterval(updateBookingStatuses, 60 * 1000);
    
  

//Edit Booking
router.get('/get_booking/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM bookings WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_booking/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        UPDATE bookings 
        SET 
            zone = ?, schoolName = ?, block = ?, level = ?, roomNo = ?, roomName = ?, date = ?, timeStart = ?, 
            timeEnd = ?, remarks = ?, equipment = ? 
        WHERE id = ?`;

    const values = [
        req.body.zone,        // Zone of the booking
        req.body.schoolName,  // School name
        req.body.block,       // Block
        req.body.level,       // Level
        req.body.roomNo,      // Room number
        req.body.roomName,    // Room name
        req.body.date,        // Date of the booking (make sure it's in 'YYYY-MM-DD' format)
        req.body.timeStart,   // Start time (make sure it's in 'HH:mm' format)
        req.body.timeEnd,     // End time (make sure it's in 'HH:mm' format)
        req.body.remarks,     // Remarks
        JSON.stringify(req.body.equipment), // Equipment details as a JSON string
    ];
    con.query(sql, [...values, id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error: " + err });
        }
        return res.json({ Status: true, Result: result });
    });
});



// Get booking
router.get('/booking', (req, res) => {
    const sql = "SELECT * FROM bookings WHERE status IN ('upcoming', 'ongoing')";

    con.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ Status: false, Error: 'Error fetching data' });
      } else {
        res.status(200).json({ Status: true, data: results });
      }
    });
});

  //Delete booking
router.delete('/delete_booking/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete from bookings where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

// Endpoint to get zones
router.get('/get_zones', (req, res) => {
    const getZonesQuery = 'SELECT DISTINCT zone FROM school';

    con.query(getZonesQuery, (err, zones) => {
        if (err) {
            console.error('Error fetching zones:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ zones: zones.map(z => z.zone) });
    });
});

// Endpoint to get schools by zone
router.post('/get_schools_by_zone', (req, res) => {
    const { zone } = req.body;

    if (!zone) {
        return res.status(400).json({ error: 'Missing required field: zone' });
    }

    const getSchoolsQuery = 'SELECT id, school_name FROM school WHERE zone = ?';

    con.query(getSchoolsQuery, [zone], (err, schools) => {
        if (err) {
            console.error('Error fetching schools:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ schools });
    });
});

// Endpoint to get blocks by school
router.post('/get_blocks_by_school', (req, res) => {
    const { schoolId } = req.body;

    if (!schoolId) {
        return res.status(400).json({ error: 'Missing required field: schoolId' });
    }

    const getBlocksQuery = 'SELECT DISTINCT block FROM location WHERE school_id = ?';

    con.query(getBlocksQuery, [schoolId], (err, blocks) => {
        if (err) {
            console.error('Error fetching blocks:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ blocks: blocks.map(b => b.block) });
    });
});

// Endpoint to get levels by school and block
router.post('/get_levels_by_school_and_block', (req, res) => {
    const { schoolId, block } = req.body;

    if (!schoolId || !block) {
        return res.status(400).json({ error: 'Missing required fields: schoolId or block' });
    }

    const getLevelsQuery = 'SELECT DISTINCT level FROM location WHERE school_id = ? AND block = ?';

    con.query(getLevelsQuery, [schoolId, block], (err, levels) => {
        if (err) {
            console.error('Error fetching levels:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ levels: levels.map(l => l.level) });
    });
});

// Endpoint to get rooms by school, block, and level
router.post('/get_rooms_by_school_block_level', (req, res) => {
    const { schoolId, block, level } = req.body;

    if (!schoolId || !block || !level) {
        return res.status(400).json({ error: 'Missing required fields: schoolId, block, or level' });
    }

    const getRoomsQuery = 'SELECT room_no FROM location WHERE school_id = ? AND block = ? AND level = ?';

    con.query(getRoomsQuery, [schoolId, block, level], (err, rooms) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ rooms });
    });
});

// Endpoint to get room details including the school based on room number
router.post('/get_room_details', (req, res) => {
    const { roomNo } = req.body;

    if (!roomNo) {
        return res.status(400).json({ error: 'Missing required field: roomNo' });
    }

    const getRoomDetailsQuery = `
        SELECT room_no, room_name, level, block, school_id
        FROM location
        WHERE room_no = ?
    `;

    con.query(getRoomDetailsQuery, [roomNo], (err, results) => {
        if (err) {
            console.error('Error fetching room details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const room = results[0];

        // Fetch school details based on the school_id from the room
        const getSchoolQuery = 'SELECT school_name FROM school WHERE id = ?';

        con.query(getSchoolQuery, [room.school_id], (err, schoolResults) => {
            if (err) {
                console.error('Error fetching school details:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (schoolResults.length === 0) {
                return res.status(404).json({ error: 'School not found' });
            }

            const school = schoolResults[0];

            res.json({
                room_name: room.room_name,
                school_name: school.school_name
            });
        });
    });
});



// Export the router
export { router as bookingRouter };
