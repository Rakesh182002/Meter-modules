import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditMeter = () => {

const { id } = useParams();
const [meter, setMeter] = useState({
    meter_name: "",
    meter_unit: "",
    zone:"",
    school:"",
    install_on: "",
    warranty_till: "",
    asset_id: "",
    asset_location: "",
});

const [school, setschool] = useState([]);
const [category, setCategory] = useState([]);
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
      })
      .catch((err) => console.log(err));

      //Get Asset Table
    axios.get('http://localhost:3000/auth/asset')
      .then(result => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

     //Get meter Table
    axios.get(`http://localhost:3000/auth/meter/${id}`)
      .then(result => {
        setMeter({
          ...meter,
          meter_name: result.data.Result[0].meter_name,
          meter_unit: result.data.Result[0].meter_unit,
          zone: result.data.Result[0].zone,
          school: result.data.Result[0].school,
          install_on : result.data.Result[0].install_on,
          warranty_till : result.data.Result[0].warranty_till,          
          asset_id : result.data.Result[0].asset_id,
          asset_location : result.data.Result[0].asset_location,
          block:result.data.Result[0].block,
          level:result.data.Result[0].level,
        });
      }).catch(err => console.log(err));
  }, []);


  //Submit Operation
const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/auth/edit_meter/${id}`, meter)
      .then(result => {
        if (result.data.Status) {
          navigate('/display');
                    setTimeout(() => {
                        alert('update Successfully');
                    }, 300);
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
                  <h4> Meter List</h4>
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
                                    <h3 className="text-secondary text-center">Edit Meter</h3>
                                    <form className="row g-1" onSubmit={handleSubmit}>
                                      <div className="col-12">
                                        <label for="inputName" className="form-label">
                                          Meter Name
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputName"
                                          placeholder="Enter meter Name"
                                          value={meter.meter_name}
                                          onChange={(e) =>
                                            setMeter({ ...meter, meter_name: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label for="inputType" className="form-label">
                                          Meter Type
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputType"
                                          placeholder="Enter meter Type"
                                          value={meter.meter_unit}
                                          onChange={(e) =>
                                            setMeter({ ...meter, meter_unit: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                          <label htmlFor="inputzone" className="form-label">
                                             Zone :
                                          </label>
                                          <select
                                              name="inputzone"
                                              id="inputzone"
                                              className="form-select"
                                              required
                                              value={meter.zone}
                                              onChange={(e) => setMeter({ ...meter, zone: e.target.value })}
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
                                          <label htmlFor="inputschool" className="form-label">
                                             School Name :
                                          </label>
                                          <select
                                              name="inputschool"
                                              id="inputschool"
                                              className="form-select"
                                              required
                                              value={meter.school}
                                              onChange={(e) => setMeter({ ...meter, school: e.target.value })}
                                          >
                                              <option selected disabled value="">Choose school</option>
                                              {school.map((c) => (
                                                  <option key={c.id} value={c.school_name}>
                                                      {c.school_name}
                                                  </option>
                                              ))}
                                          </select>
                                      </div>

                                      <div className="col-12">
                                        <label for="inputLocation" className="form-label">
                                          Install
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control rounded-0"
                                          id="inputLocation"
                                          autoComplete="off"
                                          value={meter.install_on ? new Date(meter.install_on).toISOString().split('T')[0] : ""}
                                          onChange={(e) =>
                                            setMeter({ ...meter, install: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                          <label htmlFor="inputLocation" className="form-label">
                                              Warranty till
                                          </label>
                                          <input
                                              type="date"
                                              className="form-control rounded-0"
                                              id="inputLocation"
                                              autoComplete="off"
                                              value={meter.warranty_till ? new Date(meter.warranty_till).toISOString().split('T')[0] : ""}
                                              onChange={(e) =>
                                                  setMeter({ ...meter, warranty_till: e.target.value })
                                              }
                                          />
                                      </div>

                                      <div className="col-12">
                                        <label for="category" className="form-label">
                                          Link to Asset Id (Equipment)
                                        </label>
                                        <select
                                          name="category"
                                          id="category"
                                          className="form-select"
                                          value={meter.asset_id}
                                          onChange={(e) =>
                                            setMeter({ ...meter, asset_id: e.target.value })
                                          }
                                        >
                                        <option selected disabled value="">Choose Asset</option>
                                         {category.map((c) => (
                                            <option key={c.name} value={c.name}>
                                              {c.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="col-12 ">
                                        <label for="inputAssetLocatioin" className="form-label">
                                          Asset Location (LOCQRID)
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control rounded-0"
                                          id="inputAssetLocatioin"
                                          autoComplete="off"
                                          value={meter.asset_location}
                                          onChange={(e) =>
                                            setMeter({ ...meter, asset_location: e.target.value })
                                          }
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label htmlFor="inputblock" className="form-label">
                                            Block:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputblock"
                                            required
                                            placeholder="Enter Block"
                                            value={meter.block}
                                            onChange={(e) =>
                                                setMeter({ ...meter, block: e.target.value })
                                            }
                                        />
                                      </div>

                                      <div className="col-12 mb-4">
                                          <label htmlFor="inputlevel" className="form-label">
                                              Level :
                                          </label>
                                          <input
                                              type="text"
                                              className="form-control"
                                              id="inputlevel"
                                              required
                                              placeholder="Enter  Level"
                                              value={meter.level}
                                              onChange={(e) =>
                                                  setMeter({ ...meter, level: e.target.value })
                                              }
                                          />
                                      </div>

                                      {/* <div className="col-12 mb-3">
                                        <label className="form-label" for="inputGroupFile01">
                                          Select Image
                                        </label>
                                        <input
                                          type="file"
                                          // required
                                          className="form-control rounded-0"
                                          id="inputGroupFile01"
                                          name="image"
                                          // value={meter.image}
                                          onChange={(e) =>
                                            setMeter({ ...meter, image: e.target.files[0] })
                                          }
                                        />
                                      </div> */}

                                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success me-md-2" type="submit">
                                          Save
                                        </button>
                                        <button
                                          className="btn btn-danger"
                                          onClick={() => navigate(-1)}
                                          type="button"
                                        >
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

export default EditMeter;
