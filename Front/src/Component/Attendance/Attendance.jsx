import axios from "axios";
// import 'main.css'
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
    
const Attendance = () => {

  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {

    //Get Attendance Table
    axios.get('http://localhost:3000/auth/attendance')
      .then(response => {
        setAttendanceData(response.data.data);
        setFilterAttendance(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  },[]);


//Delete operation
const handleDelete = (id) => {
    axios.delete('http://localhost:3000/auth/delete_attendance/'+id)
    .then(result => {
        if(result.data.Status) {
            // Remove the deleted item from state instead of reloading window
            setAttendanceData(attendanceData.filter(item => item.id !== id));
            setFilterAttendance(attendanceData.filter(item => item.id !== id));
        } else {
            alert(result.data.Error)            
        }
      }).catch(err => {
        console.error("Error deleting meter:", err);
        alert("Error deleting meter. Please try again.");
  });
}

// Search function
const [filterattendance, setFilterAttendance] = useState([]);

const handleSearchchange = (a) =>{
  const searchText = a.target.value.toLowerCase();
  const filterattendance = attendanceData.filter((e)=>
    e.zone.toLowerCase().includes(searchText) ||
    e.school.toLowerCase().includes(searchText) ||
    e.tech_name.toLowerCase().includes(searchText) ||
    e.zone.toLowerCase().includes(searchText));
  setFilterAttendance(filterattendance);
}
      
    
return (
        <div id="page-wrapper">
          <div className="app-inner-layout app-inner-layout-page">
            <div className="app-inner-layout__wrapper">
              <div className="app-inner-layout__content pt-1">
                <div className="tab-content">
                  <div className="container-fluid">
                    <section className="content-header">
                      <h4>Attendance List</h4>
                    </section>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="main-card mb-3 card">
                          <div className="card-body">
                            <div className="box-header with-border">
                              <div className="box_add">  
                                <button><Link to='/display/add_attendance'>New Attendance</Link></button>
                              </div>
                              <div className="input-search">
                                <input type="search" placeholder="Search ..." onChange={handleSearchchange}/>
                              </div>
                            </div>
                            <div className="box-body">
                              <div className="dataTables_wrapper">
                                <table className="meter_table" >
                                <thead>
                                  <tr>
                                    <th>Zone</th>
                                    <th>School</th>
                                    <th>Technician Name</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {filterattendance.map(attendance => (
                                    <tr key={attendance.id}>
                                      <td>{attendance.zone}</td>
                                      <td>{attendance.school}</td>
                                      <td>{attendance.tech_name}</td>
                                      <td>{attendance.checkin}</td>
                                      <td>{attendance.checkout}</td>
                                      <td>
                                      <Link
                                       onClick={() => {
                                        const isConfirmed = window.confirm("Are you sure you want to Edit?");
                                        if (isConfirmed) {
                                          // Redirect to the edit request page after deletion
                                          window.location.href = `/display/edit_attendance/${attendance.id}`;
                                        }
                                      }}
                                        title="Edit"
                                        className="btn btn-success btn-sm me-2"
                                      >
                                        <HiPencilSquare />
                                      </Link>
                                      <button
                                        title="Delete"
                                        className="btn btn-danger btn-sm me-2"
                                         //ALERT MESSAGE
                                         onClick={() => {
                                          const isConfirmed = window.confirm("Are you sure you want to delete?");
                                          if (isConfirmed) {
                                            handleDelete(attendance.id);
                                          }
                                        }}
                                        // onClick={() => handleDelete(attendance.id)}
                                      >
                                        <MdDelete />
                                      </button>                                      
                                    </td>
                                    </tr>
                                  ))}
                                </tbody>
                                </table>
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
    
    

export default Attendance