import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Edit_Attendance = () => {

    const { id } = useParams();
    const [attendance, setAttendance] = useState({
        zone:"",
        school:"",
        tech_name:"",
        checkin:"",
        checkout:"",
    });

    
  const [school, setschool] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        
      //Get School Table
        axios.get("http://localhost:3000/auth/school")
          .then((result) => {
              if (result.data.Status) {
                  setschool(result.data.Result);
              } else {
                  alert(result.data.Error);
              }
          }).catch((err) => console.log(err));

  // const [message, setMessage] = useState('');
    //Get Attendance Table
        axios.get(`http://localhost:3000/auth/attendance/${id}`)
          .then(result => {
            setAttendance({
              ...attendance,
              zone: result.data.Result[0].zone,
              school: result.data.Result[0].school, 
              tech_name: result.data.Result[0].tech_name,
              checkin : result.data.Result[0].checkin,
              checkout : result.data.Result[0].checkout,
            });
          }).catch(err => console.log(err));
      }, []);
   

      const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/auth/edit_attendance/${id}`, attendance)
          .then(result => {
            if (result.data.Status) {
              navigate('/display/attendance');
              
            } else {
              alert(result.data.Error);
            }
          }).catch(err => console.log(err));
      };
    
return (
        <div id="page-wrapper">
          <div class="app-inner-layout app-inner-layout-page">
            <div class="app-inner-layout__wrapper">
              <div class="app-inner-layout__content pt-1">
                <div class="tab-content">
                  <div class="container-fluid">
                    <section class="content-header">
                      <h4> Attendance List</h4>
                    </section>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="main-card mb-3 card">
                          <div class="card-body">
                            <div class="box-body">
                              <div class="dataTables_wrapper">
                                <div className="container">
                                  <div className="row justify-content-center">
                                    <div className="col-md-9">
                                      <div className="p-3 rounded">
                                        <h3 className="text-secondary text-center">Edit Attendance</h3>
                                     <form className="row g-1" onSubmit={handleSubmit}>

                                    <div className="col-12 ">
                                        <label htmlFor="inputzone" className="form-label">
                                          Zone :
                                        </label>
                                        <select
                                          name="inputzone"
                                          id="inputzone"
                                          className="form-select"
                                          required
                                          value={attendance.zone}
                                          onChange={(e) => setAttendance({ ...attendance, zone: e.target.value })}
                                        >
                                          <option selected disabled value="">Choose Zone</option>
                                          {school.map((c) => (
                                              <option key={c.id} value={c.zone}>
                                                  {c.zone}
                                              </option>
                                          ))}
                                         </select>
                                    </div>
                                    
                                    <div className="col-12 ">
                                        <label htmlFor="inputschool" className="form-label">
                                          School :
                                        </label>
                                        <select
                                          name="inputschool"
                                          id="inputschool"
                                          className="form-select"
                                          required
                                          value={attendance.school}
                                          onChange={(e) => setAttendance({ ...attendance, school: e.target.value })}
                                        >
                                          <option selected disabled value="">Choose school</option>
                                          {school.map((c) => (
                                              <option key={c.id} value={c.school_name}>
                                                  {c.school_name}
                                              </option>
                                          ))}
                                      </select>
                                    </div>
                                    
                                    <div className="col-12 ">
                                        <label htmlFor="inputtName" className="form-label">
                                          Technician Name :
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputtName"
                                            required
                                            value={attendance.tech_name}
                                            placeholder="Enter Name"   
                                            onChange={(e) => setAttendance({ ...attendance, tech_name: e.target.value })}                                     
                                        />
                                    </div>
                                    
                                    <div className="col-12 ">
                                        <label htmlFor="inputcheckin" className="form-label">
                                          Check In :
                                        </label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="inputcheckin"
                                            required
                                            value={attendance.checkin}
                                            placeholder="Enter Name"
                                            onChange={(e) => setAttendance({ ...attendance, checkin: e.target.value })}                                                                                  
                                        />
                                    </div>

                                    <div className="col-12 mb-4">
                                        <label htmlFor="inputcheckout" className="form-label">
                                        Check Out :
                                        </label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="inputcheckout"
                                            required
                                            value={attendance.checkout}
                                            placeholder="Enter Name" 
                                            onChange={(e) => setAttendance({ ...attendance, checkout: e.target.value })}                                                                                                                                                                   
                                        />
                                    </div>

                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success me-md-2" type="submit">
                                            Save
                                        </button>

                                        <button className="btn btn-danger" onClick={() => navigate(-1)} type="button">
                                            Back
                                        </button>

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
        </div>
      );
    };
export default Edit_Attendance