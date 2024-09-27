import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const Edit_Booking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({
    zone: '',
    schoolName: '',
    block: '',
    level: '',
    roomNo: '',
    roomName: '',
    date: '',
    timeStart: '',
    timeEnd: '',
    remarks: '',
    equipment: [],
  });

  const [equipmentInput, setEquipmentInput] = useState('');
  const navigate = useNavigate();

  // Fetch booking details when component mounts
  useEffect(() => {
    axios.get(`http://localhost:3000/booking/get_booking/${id}`)
      .then(result => {
        const fetchedbooking = result.data.Result[0];
        setBooking({
          ...booking,
          zone: fetchedbooking.zone,
          schoolName: fetchedbooking.schoolName,
          block: fetchedbooking.block,
          level: fetchedbooking.level,
          roomNo: fetchedbooking.roomNo,
          roomName: fetchedbooking.roomName,
          date: fetchedbooking.date ? dayjs(fetchedbooking.date).format('YYYY-MM-DD') : '',
          timeStart: fetchedbooking.timeStart,
          timeEnd: fetchedbooking.timeEnd,
          remarks: fetchedbooking.remarks,
          equipment: fetchedbooking.equipment || [],
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  // Handle equipment addition
  const handleAddEquipment = () => {
    if (equipmentInput.trim()) {
      setBooking(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipmentInput.trim()]
      }));
      setEquipmentInput('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const { date, timeStart, timeEnd } = booking;

    // Create Date objects for start and end times
    const startDateTime = new Date(`${date}T${timeStart}`);
    const endDateTime = new Date(`${date}T${timeEnd}`);

    // Get the current date and time
    const now = new Date();

    // Check if the booking date is today or in the future
    if (startDateTime < now) {
      alert("Start time cannot be in the past.");
      return;
    }

    // Check if the end time is at least 30 minutes after the start time
    const minTimeDifference = 30 * 60000; // 30 minutes in milliseconds
    const timeDifference = endDateTime - startDateTime;

    if (timeDifference < minTimeDifference) {
      alert("End time must be at least 30 minutes after the start time.");
      return;
    }

    // Ensure the end time is after the start time
    if (endDateTime <= startDateTime) {
      alert("End time must be after the start time.");
      return;
    }

    // Update booking
    axios.put(`http://localhost:3000/booking/edit_booking/${id}`, booking) 
      .then(result => {
        if (result.data.Status) {
          navigate('/display/space_management');
          setTimeout(() => {
            alert('Updated Successfully');
          }, 300);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content pt-1">
            <div className="tab-content">
              <div className="container-fluid">
                <section className="content-header">
                  <h4>Edit Booking</h4>
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
                                  <h3 className="text-secondary text-center">Edit Booking</h3>
                                  <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="form-group">
                                      <label htmlFor="zone" className="form-label">Zone</label>
                                      <input
                                        type="text"
                                        id="zone"
                                        name="zone"
                                        className="form-control"
                                        value={booking.zone}
                                        onChange={(e) => setBooking({ ...booking, zone: e.target.value })}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="schoolName" className="form-label">School Name</label>
                                      <input
                                        type="text"
                                        id="schoolName"
                                        name="schoolName"
                                        className="form-control"
                                        value={booking.schoolName}
                                        onChange={(e) => setBooking({ ...booking, schoolName: e.target.value })}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="block" className="form-label">Block</label>
                                      <input
                                        type="text"
                                        id="block"
                                        name="block"
                                        className="form-control"
                                        value={booking.block}
                                        onChange={(e) => setBooking({ ...booking, block: e.target.value })}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="level" className="form-label">Level</label>
                                      <input
                                        type="text"
                                        id="level"
                                        name="level"
                                        className="form-control"
                                        value={booking.level}
                                        onChange={(e) => setBooking({ ...booking, level: e.target.value })}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="roomNo" className="form-label">Room No</label>
                                      <input
                                        type="text"
                                        id="roomNo"
                                        name="roomNo"
                                        className="form-control"
                                        value={booking.roomNo}
                                        onChange={(e) => setBooking({ ...booking, roomNo: e.target.value })}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="roomName" className="form-label">Room Name</label>
                                      <input
                                        type="text"
                                        id="roomName"
                                        name="roomName"
                                        className="form-control"
                                        value={booking.roomName}
                                        onChange={(e) => setBooking({ ...booking, roomName: e.target.value })}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="date" className="form-label">Date</label>
                                      <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        className="form-control"
                                        value={booking.date ? dayjs(booking.date).format('YYYY-MM-DD') : ''}
                                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
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
                                        onChange={(e) => setBooking({ ...booking, timeStart: e.target.value })}
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
                                        onChange={(e) => setBooking({ ...booking, timeEnd: e.target.value })}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="remarks" className="form-label search-label">Remarks</label>
                                      <textarea
                                        id="remarks"
                                        name="remarks"
                                        className="form-control"
                                        value={booking.remarks}
                                        onChange={(e) => setBooking({ ...booking, remarks: e.target.value })}
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
                                          onChange={(e) => setEquipmentInput(e.target.value)}
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
                                        {booking.equipment.map((item, index) => (
                                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            {item}
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-sm"
                                              onClick={() => setBooking(prev => ({
                                                ...prev,
                                                equipment: prev.equipment.filter((_, i) => i !== index)
                                              }))}
                                            >
                                              Remove
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success me-md-2" type="submit">Update</button>
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
};

export default Edit_Booking;
