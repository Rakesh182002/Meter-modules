import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Edit_Report = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [school, setschool] = useState([]);

    const [faultreport, setFaultreport] = useState({
        fault_type: "",
        priority: "",
        zone: "",
        school: "",
        block: "",
        level: "",
        room_number: "",
        room_name: "",
        droup_down: "",
        requestor_name: "",
        requestor_contact: ""
    });

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

        axios.get(`http://localhost:3000/auth/report/${id}`)
            .then(result => {
                // const report = result.data.Result[0];
                setFaultreport({
                    fault_type:  result.data.Result[0].fault_type,
                    priority:  result.data.Result[0].priority,
                    zone:  result.data.Result[0].zone,
                    school:  result.data.Result[0].school,
                    block:  result.data.Result[0].block,
                    level:  result.data.Result[0].level,
                    room_number:  result.data.Result[0].room_number,
                    room_name:  result.data.Result[0].room_name,
                    droup_down:  result.data.Result[0].droup_down,
                    requestor_name:  result.data.Result[0].requestor_name,
                    requestor_contact:  result.data.Result[0].requestor_contact
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFaultreport(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/auth/request/${id}`, faultreport)
            .then(result => {
                if (result.data.Status) {
                    navigate('/display/report');
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
                                    <h4>Fault Report</h4>
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
                                                                    <h3 className="text-secondary text-center mb-4">Edit Request</h3>
                                                                    <form className="row g-3" onSubmit={handleSubmit}>
                                                                        <div className='form-control p-4'>
                                                                            <div className='mb-4 text-secondary'>
                                                                                What can we help you with?
                                                                            </div>
                                                                            <div className="col-12 mt-4 mb-4">
                                                                                <label htmlFor="fault_type" className="form-label">Fault Type:</label>
                                                                                <select
                                                                                    required
                                                                                    name="fault_type"
                                                                                    id="fault_type"
                                                                                    className="form-select"
                                                                                    value={faultreport.fault_type}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, fault_type: e.target.value })
                                                                                      }
                                                                                >
                                                                                    <option value="" disabled>Select Type</option>
                                                                                    <option value="Fault Report">Fault Report</option>
                                                                                    <option value="Service Request">Service Request</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <label htmlFor="priority" className="form-label">Priority:</label>
                                                                                <select
                                                                                    required
                                                                                    id="priority"
                                                                                    name="priority"
                                                                                    className="form-select"
                                                                                    value={faultreport.priority}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, priority: e.target.value })
                                                                                      }
                                                                                >
                                                                                    <option value="" disabled>Select Priority</option>
                                                                                    <option value="Low">Low</option>
                                                                                    <option value="Medium">Medium</option>
                                                                                    <option value="High">High</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className='form-control p-4'>
                                                                            <div className='mb-4 text-secondary'>
                                                                                Where is the issue?
                                                                            </div>
                                                                            <div className="col-12 mb-4">
                                                                                <label htmlFor="zone" className="form-label">Zone:</label>
                                                                                <select
                                                                                    name="inputzone"
                                                                                    id="inputzone"
                                                                                    className="form-select"
                                                                                    required
                                                                                    value={faultreport.zone}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, zone: e.target.value })
                                                                                    }                                                                                    
                                                                                >
                                                                                    <option selected disabled value="">Choose Zone</option>
                                                                                    {school.map((c) => (
                                                                                        <option key={c.id} value={c.zone}>
                                                                                            {c.zone}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-12 mb-4">
                                                                                <label htmlFor="school" className="form-label">School:</label>
                                                                                <select
                                                                                    name="inputschool"
                                                                                    id="inputschool"
                                                                                    className="form-select"
                                                                                    required
                                                                                    value={faultreport.school}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, school: e.target.value })
                                                                                    }
                                                                                >
                                                                                    <option selected disabled value="">Choose school</option>
                                                                                    {school.map((c) => (
                                                                                        <option key={c.id} value={c.school_name}>
                                                                                            {c.school_name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-12 mb-4">
                                                                                <label htmlFor="block" className="form-label">Block:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="block"
                                                                                    name="block"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    value={faultreport.block}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, block: e.target.value })
                                                                                      }
                                                                                />
                                                                            </div>
                                                                            <div className="col-12 mb-4">
                                                                                <label htmlFor="level" className="form-label">Level:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="level"
                                                                                    name="level"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    value={faultreport.level}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, level: e.target.value })
                                                                                      }
                                                                                />
                                                                            </div>
                                                                            <div className="col-12 mb-4">
                                                                                <label htmlFor="room_number" className="form-label">Room Number:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="room_number"
                                                                                    name="room_number"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    value={faultreport.room_number}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, room_number: e.target.value })
                                                                                      }
                                                                                />
                                                                            </div>
                                                                            <div className="col-12 mb-4">
                                                                                <label htmlFor="room_name" className="form-label">Room Name:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="room_name"
                                                                                    name="room_name"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    value={faultreport.room_name}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, room_name: e.target.value })
                                                                                      }
                                                                                />
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <label htmlFor="droup_down" className="form-label">Which equipment from drop down:</label>
                                                                                <select
                                                                                    required
                                                                                    id="droup_down"
                                                                                    name="droup_down"
                                                                                    className="form-select"
                                                                                    value={faultreport.droup_down}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, droup_down: e.target.value })
                                                                                      }
                                                                                >
                                                                                    <option value="" disabled>Select equipment</option>
                                                                                    <option value="Fan System">Fan System</option>
                                                                                    <option value="Light fitting and accessories">Light fitting and accessories</option>
                                                                                    <option value="Dryer system">Dryer system</option>
                                                                                    <option value="Electrical installation (LOW)">Electrical installation (LOW)</option>
                                                                                    <option value="Switchboard">Switchboard</option>
                                                                                    <option value="LPS">LPS</option>
                                                                                    <option value="ACMV System">ACMV System</option>
                                                                                    <option value="Automatic/Motorised Gates/Roller Shutters">Automatic/Motorised Gates/Roller Shutters</option>
                                                                                    <option value="Fresh Air / Extraction Systems">Fresh Air / Extraction Systems</option>
                                                                                    <option value="Synthetic Field Water Sprinkler System">Synthetic Field Water Sprinkler System</option>
                                                                                    <option value="Stomwater Detection Tank System">Stomwater Detection Tank System</option>
                                                                                    <option value="Carpark Barrier">Carpark Barrier</option>
                                                                                    <option value="Automatic Irrigation System">Automatic Irrigation System</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className='form-control p-4'>
                                                                            <div className='mb-4 text-secondary'>
                                                                                How can we contact you?
                                                                            </div>
                                                                            <div className="col-12 mb-4">
                                                                                <label htmlFor="requestor_name" className="form-label">Requestor Name:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="requestor_name"
                                                                                    name="requestor_name"
                                                                                    required
                                                                                    autoComplete="off"
                                                                                    value={faultreport.requestor_name}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, requestor_name: e.target.value })
                                                                                      }
                                                                                />
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <label htmlFor="requestor_contact" className="form-label">Requestor Contact Number:</label>
                                                                                <input
                                                                                    type="tel"
                                                                                    className="form-control"
                                                                                    id="requestor_contact"
                                                                                    name="requestor_contact"
                                                                                    required
                                                                                    pattern="[0-9]{8,10}"
                                                                                    autoComplete="off"
                                                                                    value={faultreport.requestor_contact}
                                                                                    // onChange={handleChange}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, requestor_contact: e.target.value })
                                                                                      }
                                                                                />
                                                                            </div>
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

export default Edit_Report;
