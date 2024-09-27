import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSchool = () => {
    const [school, setSchool] = useState({
        zone: "",
        school_name: "",
        address: ""
    });

    const navigate = useNavigate();

    // Submit operation
    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post("http://localhost:3000/auth/add_school", school)
            .then((result) => {
                if (result.data.Status) {
                    navigate('/display/school');
                    setTimeout(() => {
                    alert('Added Successful');
                    }, 300);
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
                                    <h4>School List</h4>
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
                                                                        <h3 className="text-secondary text-center">Add School</h3>
                                                                        <form className="row g-3" onSubmit={handleSubmit}>

                                                                            <div className="col-12">
                                                                                <label htmlFor="inputZone" className="form-label">
                                                                                    Zone:
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="inputZone"
                                                                                    className="form-control"
                                                                                    required
                                                                                    onChange={(e) => setSchool({ ...school, zone: e.target.value })}
                                                                                />
                                                                            </div>

                                                                            <div className="col-12">
                                                                                <label htmlFor="inputSchool" className="form-label">
                                                                                    School Name:
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="inputSchool"
                                                                                    className="form-control"
                                                                                    required
                                                                                    onChange={(e) => setSchool({ ...school, school_name: e.target.value })}
                                                                                />
                                                                            </div>

                                                                            <div className="col-12 mb-3">
                                                                                <label htmlFor="inputAddress" className="form-label">
                                                                                    Address:
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    id="inputAddress"
                                                                                    className="form-control"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    onChange={(e) => setSchool({ ...school, address: e.target.value })}
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
        </div>
    );
};

export default AddSchool;
