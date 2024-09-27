import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddLocation = () => {
  const { id } = useParams();
  const [location, setLocation] = useState({
    locQRID: "",
    block: "",
    level: "",
    room_no: "",
    room_name: "",
    school_id: id,
    school_name: "" // Initialize school_name
  });

  const [school, setSchool] = useState({});
  const navigate = useNavigate();

  // Fetch school data
  useEffect(() => {
    axios.get(`http://localhost:3000/auth/school/${id}`)
      .then(result => {
        const firstResult = result.data.Result[0];
        if (firstResult) {
          const { school_name, zone } = firstResult;
          setSchool({ school_name, zone });
          // Update location with fetched school_name
          setLocation(prevState => ({ ...prevState, school_name }));
        }
      })
      .catch(err => console.error("Error fetching school data:", err));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/auth/add_location", location)
      .then((result) => {
        if (result.data.Status) {
          navigate(`/display/location/${id}`);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error("Error adding location:", err);
        alert('An error occurred. Please check the console for details.' + err);
      });
  };

  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content pt-1">
            <div className="tab-content">
              <div className="container-fluid">
                <section className="content-header">
                  <h4>Add Location</h4>
                </section>
                <div className="text-uppercase fs-6 fw-bold p-2">
                  <span className="text-secondary">Zone:</span> {school.zone} <span className="text-secondary"> - School:</span> {school.school_name}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-card mb-3 card">
                      <div className="card-body">
                        <div className="box-body">
                          <div className="container">
                            <div className="row justify-content-center">
                              <div className="col-md-9">
                                <div className="p-3 rounded">
                                  <h3 className="text-secondary text-center">Add Location</h3>
                                  <form className="row g-3 mt-3" onSubmit={handleSubmit}>
                                    <div className="col-12">
                                      <label htmlFor="inputlocQRID" className="form-label">LocQRID:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="inputlocQRID"
                                        value={location.locQRID}
                                        required
                                        autoComplete="off"
                                        onChange={(e) => setLocation({ ...location, locQRID: e.target.value })}
                                      />
                                    </div>
                                    <div className="col-12">
                                      <label htmlFor="inputblock" className="form-label">Block:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="inputblock"
                                        value={location.block}
                                        required
                                        autoComplete="off"
                                        onChange={(e) => setLocation({ ...location, block: e.target.value })}
                                      />
                                    </div>
                                    <div className="col-12">
                                      <label htmlFor="inputlevel" className="form-label">Level:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="inputlevel"
                                        value={location.level}
                                        required
                                        autoComplete="off"
                                        onChange={(e) => setLocation({ ...location, level: e.target.value })}
                                      />
                                    </div>
                                    <div className="col-12">
                                      <label htmlFor="inputroom_no" className="form-label">Room No:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="inputroom_no"
                                        value={location.room_no}
                                        required
                                        autoComplete="off"
                                        onChange={(e) => setLocation({ ...location, room_no: e.target.value })}
                                      />
                                    </div>
                                    <div className="col-12 mb-3">
                                      <label htmlFor="inputroom_name" className="form-label">Room Name:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="inputroom_name"
                                        value={location.room_name}
                                        required
                                        autoComplete="off"
                                        onChange={(e) => setLocation({ ...location, room_name: e.target.value })}
                                      />
                                    </div>
                                    <div className="col-12 mb-3">
                                      <label htmlFor="inputschool_name" className="form-label">School Name:</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="inputschool_name"
                                        value={location.school_name}
                                        readOnly // Make the field read-only since it's auto-filled
                                      />
                                    </div>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                      <button className="btn btn-success me-md-2" type="submit">Save</button>
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

export default AddLocation;
