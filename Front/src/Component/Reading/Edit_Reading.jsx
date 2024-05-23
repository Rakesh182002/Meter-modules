import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Edit_Reading = () => {
  const { id } = useParams();
  const [mreading, setReading] = useState({
    meter_name: "",
    meter_reading:"",
    meter_unit:"",
    meter_location:"",
    update_on:"",
    update_by:"",
  });

  const navigate = useNavigate();

  useEffect(() => {

    axios.get(`http://localhost:3000/auth/reading/${id}`)
      .then(result => {
        setReading({
          ...mreading,
          meter_name: result.data.Result[0].meter_name,
          meter_reading: result.data.Result[0].meter_reading,
          meter_unit: result.data.Result[0].meter_unit,
          update_on : result.data.Result[0].update_on,
          update_by : result.data.Result[0].update_by,
        });
      }).catch(err => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/auth/edit_reading/${id}`, mreading)
      .then(result => {
        if (result.data.Status) {
          navigate(-1);
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
                  <h4> Reading List</h4>
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
                                    <h3 className="text-secondary text-center">Edit Reading</h3>
                                    <form className="row g-1" onSubmit={handleSubmit}>
                                    
                                    <div className="col-12 ">
                                <label htmlFor="inputreading" className="form-label">
                                    {mreading.meter_name}  :
                                </label>

                                <div className='input-group col-12'>    
                                
                                <input
                                    type="number"
                                    className="form-control"
                                    id="inputreading"
                                    required  
                                    value={mreading.meter_reading}                      
                                    placeholder="Enter meter Reading"
                                    onChange={(e) =>
                                            setReading({ ...mreading, meter_reading: e.target.value })
                                          }
                                />
                                <div class="input-append">
                                  <label class="input-group-text bg-transparent border-0" for="inputGroupSelect02"> {mreading.meter_unit}  </label>
                                </div>
                                </div>
                            </div>

                            {/* <div className="col-12">
                                <label htmlFor="inputLocation" className="form-label">
                               Location :
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputLocation"
                                    required
                                    value={mreading.meter_location}
                                    autoComplete="off" 
                                      onChange={(e) =>
                                        setReading({ ...mreading, meter_location: e.target.value })
                                      }
                                />
                            </div> */}
                                        
                            <div className="col-12">
                                <label htmlFor="datetimeInput" className="form-label">
                                    Updated on:
                                </label>
                                <input
                                    name="datetimeInput"
                                    className="form-control"                                
                                    value={mreading.update_on ? new Date(mreading.update_on).toISOString().slice(0, -8) : ""}                 
                                    type="datetime-local"
                                    id="datetimeInput"
                                    onChange={(e) =>
                                        setReading({ ...mreading, update_on: e.target.value })
                                    }        
                                />
                            </div>

                                        
                            <div className="col-12 mb-4">
                                <label htmlFor="inputLocation" className="form-label">
                                Updated By :
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputLocation"
                                    value={mreading.update_by}                                  
                                    placeholder="User Name"
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setReading({ ...mreading, update_by: e.target.value })
                                    }
                                />
                            </div>
                            

                                      <div className=" d-grid gap-2 d-md-flex justify-content-md-end">
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

export default Edit_Reading;
