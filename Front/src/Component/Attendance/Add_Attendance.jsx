import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Add_Attendance = () => {
  const [attendance, setAttendance] = useState({
    zone: "",
    school: "",
    tech_name: "",
    date: "",
    checkin: "",
    checkout: "",
    image: "", // Base64 string
  });

  const [school, setSchool] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get School Table
    axios.get("http://localhost:3000/auth/school")
      .then((result) => {
        if (result.data.Status) {
          setSchool(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("zone", attendance.zone);
    formData.append("school", attendance.school);
    formData.append("tech_name", attendance.tech_name);
    formData.append("date", attendance.date);
    formData.append("checkin", attendance.checkin);
    formData.append("checkout", attendance.checkout);
    if (attendance.image) {
      formData.append("image", attendance.image); // The file object
    }
  
    axios.post("http://localhost:3000/attendance/add_attendance", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate('/display/attendance');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  
  

  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content pt-1">
            <div className="tab-content">
              <div className="container-fluid">
                <section className="content-header">
                  <h4>Add Attendance</h4>
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
                                  <h3 className="text-secondary text-center">Add Attendance</h3>
                                  <form className="row g-3" onSubmit={handleSubmit}>
                                    <div className="col-12">
                                      <label htmlFor="inputzone" className="form-label">Zone:</label>
                                      <select
                                        name="inputzone"
                                        id="inputzone"
                                        className="form-select"
                                        required
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

                                    <div className="col-12">
                                      <label htmlFor="inputschool" className="form-label">School:</label>
                                      <select
                                        name="inputschool"
                                        id="inputschool"
                                        className="form-select"
                                        required
                                        onChange={(e) => setAttendance({ ...attendance, school: e.target.value })}
                                      >
                                        <option selected disabled value="">Choose School</option>
                                        {school.map((c) => (
                                          <option key={c.id} value={c.school_name}>
                                            {c.school_name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="col-12">
                                      <label htmlFor="inputtName" className="form-label">Technician Name:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="inputtName"
                                        required
                                        placeholder="Enter Name"
                                        onChange={(e) => setAttendance({ ...attendance, tech_name: e.target.value })}
                                      />
                                    </div>

                                    <div className="col-12">
                                      <label htmlFor="inputdate" className="form-label">Date:</label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        id="inputdate"
                                        required
                                        onChange={(e) => setAttendance({ ...attendance, date: e.target.value })}
                                      />
                                    </div>

                                    <div className="col-12">
                                      <label htmlFor="inputcheckin" className="form-label">Check In:</label>
                                      <input
                                        type="time"
                                        className="form-control"
                                        id="inputcheckin"
                                        required
                                        onChange={(e) => setAttendance({ ...attendance, checkin: e.target.value })}
                                      />
                                    </div>

                                    <div className="col-12">
                                      <label htmlFor="inputcheckout" className="form-label">Check Out:</label>
                                      <input
                                        type="time"
                                        className="form-control"
                                        id="inputcheckout"
                                        required
                                        onChange={(e) => setAttendance({ ...attendance, checkout: e.target.value })}
                                      />
                                    </div>

                                    <div className="col-12">
                                      <label htmlFor="image" className="form-label">Attachment:</label>
                                      <input
  type="file"
  className="form-control"
  id="image"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setAttendance({ ...attendance, image: e.target.files[0] });
    }
  }}
/>

                                    </div>

                                    <div className="col-12">
                                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success me-md-2" type="submit">Save</button>
                                        <button className="btn btn-danger" onClick={() => navigate(-1)} type="button">Back</button>
                                      </div>
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

export default Add_Attendance;
