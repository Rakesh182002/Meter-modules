import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddMeter = () => {
    const [meter, setMeter] = useState({
        meter_name :"",
        meter_unit :"",
        zone :"",   
        school:"",     
        install_on :"", 
        warranty_till :"",
        asset_id :"",
        asset_location :"",
        block:"",
        level:"",
        image :"",
        
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

        //Get Asset table
        axios.get("http://localhost:3000/auth/asset")
            .then((result) => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const [message, setMessage] = useState('');
    //Submit operation
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("meter_name", meter.meter_name);
        formData.append("meter_unit", meter.meter_unit);
        formData.append("zone", meter.zone);
        formData.append("school", meter.school);
        formData.append("install_on", meter.install_on);
        formData.append("warranty_till", meter.warranty_till);        
        formData.append("asset_id", meter.asset_id);
        formData.append("asset_location", meter.asset_location);
        formData.append("block", meter.block);
        formData.append("level", meter.level);
        formData.append("image", meter.image);

        axios.post("http://localhost:3000/auth/add_meter", formData)
            .then((result) => {
                if (result.data.Status) {
                    navigate('/display');
                    
                } else {
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
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="main-card mb-3 card">
                                                <div class="box-body">
                                                    <div class="dataTables_wrapper">
                                                        <div className="container">
                                                            <div className="row justify-content-center">
                                                                <div className="col-md-9 ">
                                                                    <div className="p-3 rounded">
                                                                        <h3 className="text-secondary text-center">Add Meter</h3>
                                                                        <form className="row g-3" onSubmit={handleSubmit}>
                                                                           
                                                                            <div className="col-12 ">
                                                                                <label htmlFor="inputName" className="form-label">
                                                                                    Meter Name :
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="inputName"
                                                                                    required
                                                                                    placeholder="Enter meter Name"
                                                                                    onChange={(e) =>
                                                                                        setMeter({ ...meter, meter_name: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12">
                                                                                <label htmlFor="inputType" className="form-label">
                                                                                    Meter Type :
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="inputType"
                                                                                    required
                                                                                    placeholder="Enter meter Type"
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
                                                                                    onChange={(e) => setMeter({ ...meter, zone: e.target.value })}
                                                                                    onClick={(e) => {
                                                                                        const selectedZone = e.target.value;
                                                                                        console.log(selectedZone);
                                                                                    }}
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
                                                                                <label htmlFor="inputInstall" className="form-label">
                                                                                    Install on :
                                                                                </label>
                                                                                <input
                                                                                    type="date"
                                                                                    className="form-control"
                                                                                    id="inputInstall"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    onChange={(e) =>
                                                                                        setMeter({ ...meter, install_on: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12">
                                                                                <label htmlFor="inputWarranty" className="form-label">
                                                                                    Warranty till :
                                                                                </label>
                                                                                <input
                                                                                    type="date"
                                                                                    className="form-control"
                                                                                    id="inputWarranty"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    onChange={(e) =>
                                                                                        setMeter({ ...meter, warranty_till: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12">
                                                                                <label htmlFor="category" className="form-label">
                                                                                    Link to Asset Id (Equipment) :
                                                                                </label>
                                                                                <select
                                                                                    name="category"
                                                                                    id="category"
                                                                                    className="form-select"
                                                                                    required

                                                                                    onChange={(e) => setMeter({ ...meter, asset_id: e.target.value })}
                                                                                >
                                                                                    <option selected disabled value="">Choose Asset</option>
                                                                                    {category.map((c) => (
                                                                                        <option key={c.name} value={c.name}>
                                                                                            {c.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>

                                                                            <div className="col-12">
                                                                                <label htmlFor="inputAssetLocation" className="form-label">
                                                                                    Asset Location (LOCQRID) :
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="inputAssetLocation"
                                                                                    required                                                                                    
                                                                                    placeholder="Eg.55432"
                                                                                    autoComplete="off"
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
                                                                                    onChange={(e) =>
                                                                                        setMeter({ ...meter, block: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12">
                                                                                <label htmlFor="inputlevel" className="form-label">
                                                                                    Level :
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="inputlevel"
                                                                                    required
                                                                                    placeholder="Enter  Level"
                                                                                    onChange={(e) =>
                                                                                        setMeter({ ...meter, level: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12 mb-3">
                                                                                <label className="form-label" htmlFor="inputGroupFile01">
                                                                                    Select Image :
                                                                                </label>
                                                                                <input
                                                                                    type="file"
                                                                                    className="form-control"
                                                                                    id="inputGroupFile01"
                                                                                    name="image"
                                                                                    required
                                                                                    onChange={(e) => setMeter({ ...meter, image: e.target.files[0] })}
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

export default AddMeter;

