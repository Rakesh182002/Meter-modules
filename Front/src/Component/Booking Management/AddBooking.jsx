// AddBooking.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize state with data from the location state
    const [booking, setBooking] = useState({
        zone: '',
        schoolName: '',
        block: '',
        level: '',
        roomNo: '',
        roomName: '',
        date: location.state?.date || '',
        timeStart: location.state?.timeStart || '',
        timeEnd: location.state?.timeEnd || '',
        remarks: '' || null,
        equipment: [],
    });

    const [equipmentInput, setEquipmentInput] = useState('');
    const [zones, setZones] = useState([]);
    const [schools, setSchools] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [levels, setLevels] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/booking/get_zones")
            .then((result) => {
                setZones(result.data.zones || []);
            })
            .catch((err) => console.error("Error fetching zones:", err));
    }, []);

    useEffect(() => {
        if (booking.zone) {
            axios.post("http://localhost:3000/booking/get_schools_by_zone", { zone: booking.zone })
                .then((result) => {
                    setSchools(result.data.schools || []);
                    setBooking(prev => ({
                        ...prev,
                        schoolName: '',
                        block: '',
                        level: '',
                        roomNo: '',
                        roomName: '',
                    }));
                    setBlocks([]);
                    setLevels([]);
                    setRooms([]);
                })
                .catch((err) => console.error("Error fetching schools:", err));
        } else {
            setSchools([]);
            setBlocks([]);
            setLevels([]);
            setRooms([]);
            setBooking(prev => ({
                ...prev,
                schoolName: '',
                block: '',
                level: '',
                roomNo: '',
                roomName: '',
            }));
        }
    }, [booking.zone]);

    useEffect(() => {
        if (booking.schoolName) {
            const selectedSchool = schools.find(school => school.school_name === booking.schoolName);
            if (selectedSchool) {
                axios.post("http://localhost:3000/booking/get_blocks_by_school", { schoolId: selectedSchool.id })
                    .then((result) => {
                        setBlocks(result.data.blocks || []);
                        setBooking(prev => ({
                            ...prev,
                            block: '',
                            level: '',
                            roomNo: '',
                            roomName: '',
                        }));
                        setLevels([]);
                        setRooms([]);
                    })
                    .catch((err) => console.error("Error fetching blocks:", err));
            }
        } else {
            setBlocks([]);
            setLevels([]);
            setRooms([]);
            setBooking(prev => ({
                ...prev,
                block: '',
                level: '',
                roomNo: '',
                roomName: '',
            }));
        }
    }, [booking.schoolName, schools]);

    useEffect(() => {
        if (booking.schoolName && booking.block) {
            const selectedSchool = schools.find(school => school.school_name === booking.schoolName);
            if (selectedSchool) {
                axios.post("http://localhost:3000/booking/get_levels_by_school_and_block", {
                    schoolId: selectedSchool.id,
                    block: booking.block
                })
                    .then((result) => {
                        setLevels(result.data.levels || []);
                        setBooking(prev => ({
                            ...prev,
                            level: '',
                            roomNo: '',
                            roomName: '',
                        }));
                        setRooms([]);
                    })
                    .catch((err) => console.error("Error fetching levels:", err));
            }
        } else {
            setLevels([]);
            setRooms([]);
            setBooking(prev => ({
                ...prev,
                level: '',
                roomNo: '',
                roomName: '',
            }));
        }
    }, [booking.schoolName, booking.block, schools]);

    useEffect(() => {
        if (booking.schoolName && booking.block && booking.level) {
            const selectedSchool = schools.find(school => school.school_name === booking.schoolName);
            if (selectedSchool) {
                axios.post("http://localhost:3000/booking/get_rooms_by_school_block_level", {
                    schoolId: selectedSchool.id,
                    block: booking.block,
                    level: booking.level
                })
                    .then((result) => {
                        setRooms(result.data.rooms || []);
                        setBooking(prev => ({
                            ...prev,
                            roomNo: '',
                            roomName: '',
                        }));
                    })
                    .catch((err) => console.error("Error fetching rooms:", err));
            }
        } else {
            setRooms([]);
            setBooking(prev => ({
                ...prev,
                roomNo: '',
                roomName: '',
            }));
        }
    }, [booking.schoolName, booking.block, booking.level, schools]);

    useEffect(() => {
        if (booking.roomNo) {
            axios.post("http://localhost:3000/booking/get_room_details", { roomNo: booking.roomNo })
                .then((result) => {
                    setBooking(prev => ({ ...prev, roomName: result.data.room_name || '' }));
                })
                .catch((err) => console.error("Error fetching room details:", err));
        } else {
            setBooking(prev => ({ ...prev, roomName: '' }));
        }
    }, [booking.roomNo]);

    const handleAddEquipment = () => {
        if (equipmentInput.trim()) {
            setBooking(prev => ({
                ...prev,
                equipment: [...prev.equipment, equipmentInput.trim()]
            }));
            setEquipmentInput(''); // Clear input after adding
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { date, timeStart, timeEnd } = booking;

        const startDateTime = new Date(`${date}T${timeStart}`);
        const endDateTime = new Date(`${date}T${timeEnd}`);

        const now = new Date();

        if (startDateTime < now) {
            alert("Start time cannot be in the past.");
            return;
        }

        const minTimeDifference = 30 * 60000; // 30 minutes in milliseconds
        const timeDifference = endDateTime - startDateTime;

        if (timeDifference < minTimeDifference) {
            alert("End time must be at least 30 minutes after the start time.");
            return;
        }

        if (endDateTime <= startDateTime) {
            alert("End time must be after the start time.");
            return;
        }

        axios.post("http://localhost:3000/booking/add_booking", booking)
            .then((result) => {
                if (result.data.success) {
                    navigate('/display/space_management');
                } else {
                    alert(`Error: ${result.data.error || 'Unknown error occurred'}`);
                }
            })
            .catch((err) => console.error("Error adding booking:", err));
    }

    return (
        <div id="page-wrapper">
            <div className="app-inner-layout app-inner-layout-page">
                <div className="app-inner-layout__wrapper">
                    <div className="app-inner-layout__content pt-1">
                        <div className="tab-content">
                            <div className="container-fluid">
                                <section className="content-header">
                                    <h4>Room Booking</h4>
                                </section>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="main-card mb-3 card">
                                            <div className="box-body">
                                                <div className="dataTables_wrapper">
                                                    <div className="container">
                                                        <div className="row justify-content-center">
                                                            <div className="col-md-9">
                                                                <div className="p-3 rounded">
                                                                    <h3 className="text-secondary text-center">Add Booking</h3>
                                                                    <form className="row g-3" onSubmit={handleSubmit}>
                                                                    <div className="form-group">
                                                                            <label htmlFor="zone" className="form-label">Zone</label>
                                                                            <select
                                                                                name="zone"
                                                                                id="zone"
                                                                                className="form-select"
                                                                                value={booking.zone}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, zone: e.target.value })
                                                                                }
                                                                                required
                                                                            >
                                                                                <option value="" disabled>Choose Zone</option>
                                                                                {zones.length > 0 ? (
                                                                                    zones.map((z, index) => (
                                                                                        <option key={index} value={z}>
                                                                                            {z}
                                                                                        </option>
                                                                                    ))
                                                                                ) : (
                                                                                    <option value="" disabled>No Data Available</option>
                                                                                )}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="schoolName" className="form-label">School Name</label>
                                                                            <select
                                                                                name="schoolName"
                                                                                id="schoolName"
                                                                                className="form-select"
                                                                                value={booking.schoolName}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, schoolName: e.target.value })
                                                                                }
                                                                                required
                                                                            >
                                                                                <option value="" disabled>Choose School</option>
                                                                                {schools.length > 0 ? (
                                                                                    schools.map((school) => (
                                                                                        <option key={school.id} value={school.school_name}>
                                                                                            {school.school_name}
                                                                                        </option>
                                                                                    ))
                                                                                ) : (
                                                                                    <option value="" disabled>No Data Available</option>
                                                                                )}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="block" className="form-label">Block</label>
                                                                            <select
                                                                                name="block"
                                                                                id="block"
                                                                                className="form-select"
                                                                                value={booking.block}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, block: e.target.value })
                                                                                }
                                                                                required
                                                                            >
                                                                                <option value="" disabled>Choose Block</option>
                                                                                {blocks.length > 0 ? (
                                                                                    blocks.map((block) => (
                                                                                        <option key={block} value={block}>
                                                                                            {block}
                                                                                        </option>
                                                                                    ))
                                                                                ) : (
                                                                                    <option value="" disabled>No Data Available</option>
                                                                                )}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="level" className="form-label">Level</label>
                                                                            <select
                                                                                name="level"
                                                                                id="level"
                                                                                className="form-select"
                                                                                value={booking.level}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, level: e.target.value })
                                                                                }
                                                                                required
                                                                            >
                                                                                <option value="" disabled>Choose Level</option>
                                                                                {levels.length > 0 ? (
                                                                                    levels.map((level) => (
                                                                                        <option key={level} value={level}>
                                                                                            {level}
                                                                                        </option>
                                                                                    ))
                                                                                ) : (
                                                                                    <option value="" disabled>No Data Available</option>
                                                                                )}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="roomNo" className="form-label">Room Number</label>
                                                                            <select
                                                                                name="roomNo"
                                                                                id="roomNo"
                                                                                className="form-select"
                                                                                value={booking.roomNo}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, roomNo: e.target.value })
                                                                                }
                                                                                required
                                                                            >
                                                                                <option value="" disabled>Choose Room</option>
                                                                                {rooms.length > 0 ? (
                                                                                    rooms.map((room) => (
                                                                                        <option key={room.room_no} value={room.room_no}>
                                                                                            {room.room_no}
                                                                                        </option>
                                                                                    ))
                                                                                ) : (
                                                                                    <option value="" disabled>No Data Available</option>
                                                                                )}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="roomName" className="form-label">Room Name</label>
                                                                            <input
                                                                                type="text"
                                                                                id="roomName"
                                                                                name="roomName"
                                                                                className="form-control"
                                                                                value={booking.roomName}
                                                                                readOnly
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="date" className="form-label">Date</label>
                                                                            <input
                                                                                type="date"
                                                                                id="date"
                                                                                name="date"
                                                                                className="form-control"
                                                                                value={booking.date}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, date: e.target.value })
                                                                                }
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="timeStart" className="form-label">Start Time</label>
                                                                            <input
                                                                                type="time"
                                                                                id="timeStart"
                                                                                name="timeStart"
                                                                                className="form-control"
                                                                                value={booking.timeStart}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, timeStart: e.target.value })
                                                                                }
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="timeEnd" className="form-label">End Time</label>
                                                                            <input
                                                                                type="time"
                                                                                id="timeEnd"
                                                                                name="timeEnd"
                                                                                className="form-control"
                                                                                value={booking.timeEnd}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, timeEnd: e.target.value })
                                                                                }
                                                                                required
                                                                            />
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label htmlFor="remarks" className="form-label search-label">Remarks</label>
                                                                            <textarea
                                                                                id="remarks"
                                                                                name="remarks"
                                                                                className="form-control"
                                                                                value={booking.remarks || ''}
                                                                                onChange={(e) =>
                                                                                    setBooking({ ...booking, remarks: e.target.value })
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="equipment" className="form-label search-label">Equipment</label>
                                                                            <div className="input-group mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    id="equipment"
                                                                                    name="equipment"
                                                                                    className="form-control"
                                                                                    value={equipmentInput}
                                                                                    onChange={(e) =>
                                                                                        setEquipmentInput(e.target.value)
                                                                                    }
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-primary"
                                                                                    onClick={handleAddEquipment}
                                                                                >
                                                                                    Add
                                                                                </button>
                                                                            </div>
                                                                            <ul className="list-group">
                                                                                {booking.equipment.length > 0 ? (
                                                                                    booking.equipment.map((item, index) => (
                                                                                        <li key={index} className="list-group-item">
                                                                                            {item}
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-sm btn-danger float-end"
                                                                                                onClick={() => {
                                                                                                    setBooking(prev => ({
                                                                                                        ...prev,
                                                                                                        equipment: prev.equipment.filter((_, i) => i !== index)
                                                                                                    }));
                                                                                                }}
                                                                                            >
                                                                                                Remove
                                                                                            </button>
                                                                                        </li>
                                                                                    ))
                                                                                ) : (
                                                                                    <li className="list-group-item">No Equipment Added</li>
                                                                                )}
                                                                            </ul>
                                                                        </div>

                                                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                                            <button className="btn btn-success me-md-2" type="submit">Submit</button>
                                                                            <button className="btn btn-danger" onClick={() => navigate(-1)} type="button">Back</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddBooking;
