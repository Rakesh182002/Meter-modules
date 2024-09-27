import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';  // Import dayjs to handle date formatting

const Edit_Reading = () => {
  const { id } = useParams();
  const [mreading, setReading] = useState({
    meter_name: "",
    meter_reading: "",
    meter_unit: "",
    meter_location: "",
    update_on: "",
    update_by: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/reading/reading/${id}`)
      .then(result => {
        const data = result.data.Result[0];

        // Format the datetime for the input field as per the local time
        const formattedDate = data.update_on 
          ? dayjs(data.update_on).format('YYYY-MM-DDTHH:mm') // Adjust to local time format
          : "";

        setReading({
          meter_name: data.meter_name,
          meter_reading: data.meter_reading,
          meter_unit: data.meter_unit,
          update_on: formattedDate,
          update_by: data.update_by,
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert the datetime-local input value to MySQL format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = dayjs(mreading.update_on).format('YYYY-MM-DD HH:mm:ss');

    const updatedReading = {
      ...mreading,
      update_on: formattedDate,  // Send the formatted date
    };

    axios.put(`http://localhost:3000/reading/edit_reading/${id}`, updatedReading)
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
      .catch(err => console.log(err));
  };

  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content pt-1">
            <div className="tab-content">
              <div className="container-fluid">
                <section className="content-header">
                  <h4> Reading List</h4>
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
                                    <h3 className="text-secondary text-center">Edit Reading</h3>
                                    <form className="row g-1" onSubmit={handleSubmit}>
                                      <div className="col-12">
                                        <label htmlFor="inputreading" className="form-label">
                                          {mreading.meter_name} :
                                        </label>
                                        <div className="input-group col-12">
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
                                          <div className="input-append">
                                            <label className="input-group-text bg-transparent border-0 search-label" htmlFor="inputGroupSelect02">
                                              {mreading.meter_unit}
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <label htmlFor="datetimeInput" className="form-label">
                                          Updated on:
                                        </label>
                                        <input
                                          name="datetimeInput"
                                          className="form-control"
                                          value={mreading.update_on}
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
                                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button className="btn btn-success me-md-2" type="submit">
                                          Update
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
