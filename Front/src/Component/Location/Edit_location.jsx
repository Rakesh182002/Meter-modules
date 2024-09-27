import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Edit_Location = () => {
  const { id } = useParams();
  const [location, setLocation] = useState({
    locQRID: "",
    block: "",
    level: "",
    room_no: "",
    room_name: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
  axios.get(`http://localhost:3000/auth/locations/${id}`)
      .then(result => {
        if (result.data && result.data.Result && result.data.Result.length > 0) {
          const locData = result.data.Result[0];
          setLocation({
            locQRID: locData.locQRID,
            block: locData.block,
            level: locData.level,
            room_no: locData.room_no,
            room_name: locData.room_name,
          });
        } else {
          console.error('No location data found.');
        }
      })
      .catch(err => console.error('Error fetching location:', err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/auth/edit_location/${id}`, location)
      .then(result => {
        if (result.data.Status) {
          navigate(-1);
          setTimeout(() => {
            alert('Updated Successfully');
          }, 300);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error("Error updating location:", err);
        alert("Error updating location. Please try again.");
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
                  <h4>Location List</h4>
                </section>
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-card mb-3 card">
                      <div className="card-body">
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <div className="container">
                              <div className="row justify-content-center">
                                <div className="col-md-9">
                                  <div className="p-3 rounded">
                                    <h3 className="text-secondary text-center">Edit Location</h3>
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
    </div>
  );
};

export default Edit_Location;
