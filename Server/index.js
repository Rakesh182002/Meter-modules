import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { bookingRouter } from './Routes/BookingRouter.js';
import { meterRouter } from './Routes/MeterRouter.js';
import {attendanceRouter} from './Routes/AttendanceRouter.js'
import {fault_reportRouter} from './Routes/Fault_ReportRouter.js'
import {readingRouter} from './Routes/ReadingRouter.js'
import {iaqRouter} from './Routes/IaqRouter.js'
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', adminRouter);
app.use('/booking', bookingRouter);
app.use('/meter', meterRouter);
app.use('/attendance',attendanceRouter);
app.use('/report',fault_reportRouter);
app.use('/reading',readingRouter);
app.use('/iaq', iaqRouter);

// app.use('/Public', express.static('Public'));

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
