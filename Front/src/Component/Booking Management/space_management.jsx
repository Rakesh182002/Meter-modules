import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
  DayPilotMonth,
} from "@daypilot/daypilot-lite-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import "./calendar.css";

const Calendar = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("Week");
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/booking/booking");      
      if (response.data.Status) {
        setEvents(
          response.data.data
            .map(({ id, roomName ,schoolName, date, timeStart, timeEnd,isBooked }) => {
              const originalDate = new Date(date);
              const formattedDate = new Date(originalDate.getTime() - originalDate.getTimezoneOffset() * 60000); 
              const localFormattedDate = formattedDate.toISOString().split("T")[0];
              const start = DayPilot.Date.parse(`${localFormattedDate}T${timeStart}`, "yyyy-MM-ddTHH:mm:ss");
              const end = DayPilot.Date.parse(`${localFormattedDate}T${timeEnd}`, "yyyy-MM-ddTHH:mm:ss");
 
              // Return event object if both start and end are valid
              return start && end
                ? { id, text: `${schoolName}                 
                (${roomName})`, start, end, barColor: isBooked ? "#FF6F61" : "#4CAF50" }
                : null;
            })
            .filter(Boolean) 
        );
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  const isTimeInPast = (start, end) => {
    const now = new Date();
    return start < now || end < now;
  };

  const onTimeRangeSelected = (args) => {
    const start = args.start.toDate();
    const end = args.end.toDate();
    const formattedDate = args.start.toString("yyyy-MM-dd");
    const formattedTimeStart = args.start.toString("HH:mm:ss");
    const formattedTimeEnd = args.end.toString("HH:mm:ss");

    if (isTimeInPast(start, end)) {
      setErrorMessage("The selected time slot is in the past. Please choose a future time.");
      setShowModal(true);
      args.control.clearSelection();
      return;
    }

    const isOverlap = events.some(
      (event) =>
        event.start < args.end.toString() && event.end > args.start.toString()
    );
    if (isOverlap) {
      setErrorMessage("This time slot is already booked. Please choose another time.");
      setShowModal(true);
    } else {
      setSelectedTimeRange({
        date: formattedDate,
        timeStart: formattedTimeStart,
        timeEnd: formattedTimeEnd,
      });
      setErrorMessage("");
      setShowModal(true);
    }

    args.control.clearSelection();
  };
  
  const onEventClick = async (args) => {
    const event = args.e.data; // Access the event's data field
    const id = event.id; // Get the event ID from the data
    
    try {
      const response = await axios.get(`http://localhost:3000/booking/get_booking/${id}`);
  
      if (response.data && response.data.Result && response.data.Result.length > 0) {
        const eventDetails = response.data.Result[0]; // Access the first item in the Result array
  
        // Update the state with the correct field names from your response
        setSelectedEvent({
          id: eventDetails.id || "N/A",
          roomName: eventDetails.roomName || "N/A", // Match your DB field names
          schoolName: eventDetails.schoolName || "N/A",
          block: eventDetails.block || "N/A",
          level: eventDetails.level || "N/A",
          date: eventDetails.date || "N/A", // This should already be in the correct format
          timeStart: eventDetails.timeStart || "N/A",
          timeEnd: eventDetails.timeEnd || "N/A",
          status: eventDetails.status ||"N/A"
        });
        setShowModal(true); // Show modal with event details
      } else {
        console.error("No event details found in the response:", response.data);
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
    }
  };
  

  const confirmBooking = () => {
    if (selectedTimeRange) {
      navigate("/display/add_booking", {
        state: selectedTimeRange,
      });
      setSelectedTimeRange(null);
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/booking/delete_booking/${id}`);
      if (response.data.Status) {
        setEvents(events.filter(event => event.id !== id));
        setShowModal(false);
      } else {
        alert("Failed to delete booking");
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const cancelBooking = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // Prevent event move (disable dragging)
  const onEventMove = (args) => {
    args.preventDefault(); // Disable the move
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  };
  
  const formatTime = (time) => {
    return time ? time.slice(0, 5) : "N/A"; // Display as HH:mm
  };
  
  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content">
            <div className="tab-content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-card mb-3 card">
                      <div className="box-body">
                        <div className="dataTables_wrapper">
                          <div className="container">
                            <div className="row justify-content-center">
                              <div className="container">
                                <div className="navigator">
                                  <DayPilotNavigator
                                    selectMode={view}
                                    showMonths={2}
                                    skipMonths={2}
                                    onTimeRangeSelected={(args) => setStartDate(args.day)}
                                    events={events}
                                  />
                                </div>
                                <div className="contents">
                                  <div className="toolbar">

                                    <div className="toolbar-group">
                                      <button onClick={() => setView("Day")} className={view === "Day" ? "selected" : ""}>Day</button>
                                      <button onClick={() => setView("Week")} className={view === "Week" ? "selected" : ""}>Week</button>
                                      <button onClick={() => setView("Month")} className={view === "Month" ? "selected" : ""}>Month</button>
                                    </div>

                                    <button onClick={() => setStartDate(DayPilot.Date.today())} className="standalone" >Today</button>
                                  </div>

                                  {view === "Day" && (
                                    <DayPilotCalendar
                                      viewType="Day"
                                      startDate={startDate}
                                      events={events}
                                      businessBeginsHour={8}
                                      businessEndsHour={18}
                                      timeRangeSelectedHandling="Enabled"
                                      onTimeRangeSelected={onTimeRangeSelected}
                                      onEventClick={onEventClick} // Handle event click
                                      onEventMove={onEventMove} // Disable dragging
                                      durationBarVisible={false}
                                    />
                                  )}

                                  {view === "Week" && (
                                    <DayPilotCalendar
                                      viewType="Week"
                                      startDate={startDate}
                                      events={events}
                                      businessBeginsHour={8}
                                      businessEndsHour={18}
                                      timeRangeSelectedHandling="Enabled"
                                      onTimeRangeSelected={onTimeRangeSelected}
                                      onEventClick={onEventClick} // Handle event click
                                      onEventMove={onEventMove} // Disable dragging
                                      durationBarVisible={false}
                                    />
                                  )}

                                {view === "Month" && (
                                <div style={{ width: '699px',paddingBottom:'15px' }}> {/* Adjust the width as needed */}
                                  <DayPilotMonth
                                    startDate={startDate}
                                    events={events}
                                    onEventMove={onEventMove} // Disable dragging
                                    onEventClick={onEventClick} // Handle event click
                                    // style={{ width: '100%' }} // Ensure the component takes full width of the wrapper
                                  />
                                </div>
                              )}



<div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ display: showModal ? "block" : "none" }}>

  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h3>{selectedEvent ? "Event Details" : "Confirm Booking"}</h3>
        {selectedEvent && (
          <>
            <Link
              to={`/display/edit_booking/${selectedEvent.id}`}
              title="Edit"
              // className="btn btn-success btn-sm me-2"
              style={{
                borderRadius: '50%',
                background:'#d9dedb',
                font: 'caption', // You can also use '1rem', '16px', or other units if needed
                position: 'absolute',
                right: '90px', // Adjust as needed
                top: '19px', // Adjust as needed if you need vertical positioning
                padding: '5px' // Adjust padding to fit the content
              }}
            >
              <HiPencilSquare />
            </Link>
            <button
              title="Delete Booking"
               className="btn btn-sm btn-circle"
              onClick={() => handleDelete(selectedEvent.id)}
              style={{
                borderRadius: '50%',
                background:'#d9dedb',
                font: 'caption', // You can also use '1rem', '16px', or other units if needed
                position: 'absolute',
                right: '50px', // Adjust as needed
                top: '19px', // Adjust as needed if you need vertical positioning
                padding: '5px' // Adjust padding to fit the content
              }}
            >
              <MdDelete />
            </button>
          </>
        )}
        <button type="button" className="btn-close" onClick={cancelBooking}></button>
      </div>
      <div className="modal-body">
  {selectedEvent ? (
    <div>
      <p><strong>Room Name:</strong> {selectedEvent.roomName || "N/A"}</p>
      <p><strong>School Name:</strong> {selectedEvent.schoolName || "N/A"}</p>
      <p><strong>Block:</strong> {selectedEvent.block || "N/A"}</p>
      <p><strong>Level:</strong> {selectedEvent.level || "N/A"}</p>
      <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
      <p><strong>Time:</strong> {formatTime(selectedEvent.timeStart)} - {formatTime(selectedEvent.timeEnd)}</p>
      <p><strong>Status:</strong> {selectedEvent.status ||"N/A"}</p>
    </div>
  ) : (
    <p>
      {errorMessage || (
        <>
          Selected Date: {formatDate(selectedTimeRange?.date)}
          <br />
          Time: {formatTime(selectedTimeRange?.timeStart)} - {formatTime(selectedTimeRange?.timeEnd)}
        </>
      )}
    </p>
  )}
</div>



      {!errorMessage && !selectedEvent && (
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={confirmBooking}>
            Confirm
          </button>
        </div>
      )}
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
        </div>
      </div>
    </div>
  );
};

export default Calendar;
