import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Add_Reading = () => {

  const {id} = useParams();  
  const [mreading, setReading] = useState({   
    meter_name: "",
    meter_reading:"",
    meter_unit:"",
    update_on:"",
    update_by:"",        
    image:"",
    meter_id:id, 
  });
   
  const navigate = useNavigate();
  const [meter, setMeter] = useState({})
 
useEffect(() => {
    //Get Meter Table 
    axios.get(`http://localhost:3000/auth/meter/${id}`)
    .then(result => {
        const firstResult = result.data.Result[0];
        if (firstResult) {
          const { meter_name, meter_unit,school, zone , block, level} = firstResult;
          setMeter({
            ...meter,
            meter_name ,
            meter_unit, 
            school,
            zone,
            block,
            level, 
          });
          setReading(prevState => ({
            ...prevState,
            meter_name: meter_name,
            meter_unit: meter_unit,
           }));
        }
    }).catch(err => console.log(err));
}, []);

//Submit Operation
const handleSubmit = (e) => {
      e.preventDefault();           
      const formData = new FormData();
      formData.append("meter_name", mreading.meter_name);
      formData.append("meter_reading", mreading.meter_reading);
      formData.append("meter_unit", mreading.meter_unit);
      formData.append("update_on", mreading.update_on);
      formData.append("update_by", mreading.update_by);
      formData.append("image", mreading.image);
      formData.append("meter_id", mreading.meter_id);

      axios.post("http://localhost:3000/auth/add_readings", formData)
          .then((result) => {
            if (result.data.Status) {

              navigate(`/display/reading/${id}`)
              
            }  else {
                  alert(result.data.Error);
              }
          })
          .catch((err) => console.log(err));
  };

return (
  <div id="page-wrapper">
            <div class="app-inner-layout app-inner-layout-page">
                <div class="app-inner-layout__wrapper">
                    <div class="app-inner-layout__content pt-1">
                        <div class="tab-content">
                            <div class="container-fluid">
                                <section class="content-header">
                                    <h4>Meter List</h4>
                                </section>
                                    <div className="text-uppercase fs-6 fw-bold p-2">
                                        <span className="text-secondary"> Zone :</span> {meter.zone} <span className="text-secondary"> - School : </span> {meter.school}
                                    </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="main-card mb-3 card">
                                            <div class="card-body">
                                                <div class="box-body">
                                                    <div class="dataTables_wrapper">
                                                        <div className="container">
                                                            <div className="row justify-content-center">
                                                                <div className="col-md-9 ">
                                                                   
                                                                    <div className="p-3 rounded">
                                                                        <h3 className="text-secondary text-center ">Add Reading</h3>
                                                                        <form className="row g-3 mt-3" >
                            <div className="col-12 ">
                                <label htmlFor="inputreading" className="form-label">
                                    {meter.meter_name}  :
                                </label>

                                <div className='input-group col-12'>    
                                
                                <input
                                    type="number"
                                    className="form-control"
                                    id="inputreading"
                                    required                        
                                    placeholder="Enter meter Reading"
                                    onChange={(e) =>
                                            setReading({ ...mreading, meter_reading: e.target.value })
                                          }
                                />
                                <div class="input-append">
                                  <label class="input-group-text bg-transparent border-0" for="inputGroupSelect02"> {meter.meter_unit}  </label>
                                </div>
                                </div>
                            </div>
                                        
                            <div className="col-12">
                              <label htmlFor="datetimeInput" className="form-label">
                                  Updated on :
                              </label>
                              <input
                                name="datetimeInput"
                                className="form-control"
                                required
                                type="datetime-local"
                                id="datetimeInput"
                                onChange={(e) =>
                                  setReading({ ...mreading, update_on: e.target.value })
                              }        
                              />
                            </div>
                                        
                            <div className="col-12">
                                <label htmlFor="inputLocation" className="form-label">
                                Updated By :
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputLocation"
                                    required                                        
                                    placeholder="User Name"
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setReading({ ...mreading, update_by: e.target.value })
                                    }
                                />
                            </div>                           
                                        
                                      
                                        
                            <div className="col-12 mb-3">
                                        
                                <label htmlFor="image" className="form-label">
                                  Image :
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    required
                                    autoComplete="off"
                                    onChange={(e) =>
                                        setReading({ ...mreading, image: e.target.files[0]})
                                    }
                                />
                            </div>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button className="btn btn-success me-md-2" onClick={handleSubmit} type="submit">Save</button>
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


export default Add_Reading;
