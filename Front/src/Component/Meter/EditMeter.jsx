import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';  // Import dayjs to handle date formatting

const EditMeter = () => {
  const { id } = useParams();
  const [meter, setMeter] = useState({
    meter_name: "",
    meter_unit: "",
    zone: "",
    school: "",
    install_on: "",
    warranty_till: "",
    asset_id: "",
    asset_location: "",
    block: "",
    level: ""
  });

  const [schools, setSchools] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch School data
    axios.get("http://localhost:3000/auth/school")
      .then((result) => {
        if (result.data.Status) {
          setSchools(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch Asset data
    axios.get('http://localhost:3000/auth/asset')
      .then(result => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

    // Fetch Meter data
    axios.get(`http://localhost:3000/meter/meter/${id}`)
      .then(result => {
        const fetchedMeter = result.data.Result[0];
        setMeter({
          ...meter,
          meter_name: fetchedMeter.meter_name,
          meter_unit: fetchedMeter.meter_unit,
          zone: fetchedMeter.zone,
          school: fetchedMeter.school,
          install_on: fetchedMeter.install_on ? dayjs(fetchedMeter.install_on).format('YYYY-MM-DD') : "",
          warranty_till: fetchedMeter.warranty_till ? dayjs(fetchedMeter.warranty_till).format('YYYY-MM-DD') : "",
          asset_id: fetchedMeter.asset_id,
          asset_location: fetchedMeter.asset_location,
          block: fetchedMeter.block,
          level: fetchedMeter.level
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedMeter = {
      ...meter,
      install_on: meter.install_on ? dayjs(meter.install_on).format('YYYY-MM-DD') : "",
      warranty_till: meter.warranty_till ? dayjs(meter.warranty_till).format('YYYY-MM-DD') : ""
    };

    axios.put(`http://localhost:3000/meter/edit_meter/${id}`, formattedMeter)
      .then(result => {
        if (result.data.Status) {
          navigate('/display');
          setTimeout(() => {
            alert('Updated Successfully');
          }, 300);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content pt-1">
            <div className="tab-content">
              <div className="container-fluid">
                <section className="content-header">
                  <h4>Meter List</h4>
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
                                    <h3 className="text-secondary text-center">Edit Meter</h3>
                                    <form className="row g-1" onSubmit={handleSubmit}>
                                      <div className="col-12">
                                        <label htmlFor="inputName" className="form-label">Meter Name</label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputName"
                                          placeholder="Enter Meter Name"
                                          value={meter.meter_name}
                                          onChange={(e) =>
                                            setMeter({ ...meter, meter_name: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputType" className="form-label">Meter Type</label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputType"
                                          placeholder="Enter Meter Type"
                                          value={meter.meter_unit}
                                          onChange={(e) =>
                                            setMeter({ ...meter, meter_unit: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputZone" className="form-label">Zone</label>
                                        <select
                                          id="inputZone"
                                          className="form-select"
                                          value={meter.zone}
                                          onChange={(e) => setMeter({ ...meter, zone: e.target.value })}
                                          required
                                        >
                                          <option value="">Choose Zone</option>
                                          {schools.map((s) => (
                                            <option key={s.id} value={s.zone}>
                                              {s.zone}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputSchool" className="form-label">School Name</label>
                                        <select
                                          id="inputSchool"
                                          className="form-select"
                                          value={meter.school}
                                          onChange={(e) => setMeter({ ...meter, school: e.target.value })}
                                          required
                                        >
                                          <option value="">Choose School</option>
                                          {schools.map((s) => (
                                            <option key={s.id} value={s.school_name}>
                                              {s.school_name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputInstall" className="form-label">Install</label>
                                        <input
                                          type="date"
                                          className="form-control rounded-0"
                                          id="inputInstall"
                                          value={meter.install_on}
                                          onChange={(e) =>
                                            setMeter({ ...meter, install_on: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputWarranty" className="form-label">Warranty Till</label>
                                        <input
                                          type="date"
                                          className="form-control rounded-0"
                                          id="inputWarranty"
                                          value={meter.warranty_till}
                                          onChange={(e) =>
                                            setMeter({ ...meter, warranty_till: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputCategory" className="form-label">Link to Asset ID (Equipment)</label>
                                        <select
                                          id="inputCategory"
                                          className="form-select"
                                          value={meter.asset_id}
                                          onChange={(e) => setMeter({ ...meter, asset_id: e.target.value })}
                                        >
                                          <option value="">Choose Asset</option>
                                          {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                              {c.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputAssetLocation" className="form-label">Asset Location (LOCQRID)</label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputAssetLocation"
                                          placeholder="Enter Asset Location"
                                          value={meter.asset_location}
                                          onChange={(e) =>
                                            setMeter({ ...meter, asset_location: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputBlock" className="form-label">Block</label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputBlock"
                                          placeholder="Enter Block"
                                          value={meter.block}
                                          onChange={(e) =>
                                            setMeter({ ...meter, block: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12 mb-4">
                                        <label htmlFor="inputLevel" className="form-label">Level</label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputLevel"
                                          placeholder="Enter Level"
                                          value={meter.level}
                                          onChange={(e) =>
                                            setMeter({ ...meter, level: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success me-md-2" type="submit">Update</button>
                                        <button
                                          className="btn btn-danger"
                                          type="button"
                                          onClick={() => navigate('/display')}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMeter;
