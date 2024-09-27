import  { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Add_Request = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(search);

    const [faultreport, setFaultreport] = useState({
        fault_type: "",
        priority: "",
        zone: queryParams.get('zone'),
        school: queryParams.get('school_name'),
        block: queryParams.get('block'),
        level: queryParams.get('level'),
        room_number: queryParams.get('room_no'),
        room_name: queryParams.get('room_name'),
        droup_down: "",
        requestor_name: "",
        requestor_contact: "",
        description: "",
        image: "",
        report_said:"Public",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fault_type", faultreport.fault_type);
        formData.append("priority", faultreport.priority);
        formData.append("zone", faultreport.zone);
        formData.append("school", faultreport.school);
        formData.append("block", faultreport.block);
        formData.append("level", faultreport.level);
        formData.append("room_number", faultreport.room_number);
        formData.append("room_name", faultreport.room_name);
        formData.append("droup_down", faultreport.droup_down);
        formData.append("requestor_name", faultreport.requestor_name);
        formData.append("requestor_contact", faultreport.requestor_contact);
        formData.append("description", faultreport.description);
        formData.append("image", faultreport.image);
        formData.append("report_said", faultreport.report_said);

        axios.post("http://localhost:3000/report/add_request", faultreport)
        .then((result) => {
            if (result.data.Status) {
                alert("Your Fault Report was successfully submitted. We will resolve your issue soon.");
                setTimeout(() => {
                    window.close();
                }, 1000);
            } else {
                alert(result.data.Error);
                console.error(result.data.Error); // Log the actual error message from the server
            }
        })
        .catch((err) => {
            console.log(err); // Log the error if the request fails
        });
        }

return (
        <div id="page-wrapper">
            <div className="app-inner-layout app-inner-layout-page">
                <div className="app-inner-layout__wrapper">
                    <div className="app-inner-layout__content pt-1">
                        <div className="tab-content">
                            <div className="container-fluid">
                               
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="main-card mb-3 card bg-subtle">
                                            <div className="box-body ">
                                                <div className="dataTables_wrapper ">
                                                    <div className="container ">
                                                         <section className="content-header" >
                                <h4 style={{ textAlign: 'center' }}>Fault Report</h4>
                                </section>
                                                        <div className="row justify-content-center ">
                                                            <div className="col-md-9 ">
                                                                <div className="p-2 rounded">
                                                                    <form className="row g-2" onSubmit={handleSubmit}>
                                                                    
                                                                    <div className='form-control p-2 '>
                                                                               <div className='mb-2 text-secondary'>
                                                                                What can we help you with?
                                                                               </div>                                                                            

                                                                            <div className="col-13 mb-2">
                                                                                <label htmlFor="fault_type" className="form-label">
                                                                                    Fault Type :
                                                                                </label>
                                                                                <select 
                                                                                    required
                                                                                    name="fault_type" 
                                                                                    id="fault_type"
                                                                                    className="form-select"
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, fault_type: e.target.value })
                                                                                    }
                                                                                >
                                                                                    <option selected disabled> Select Type</option>
                                                                                    <option value="Fault Report">Fault Report</option>
                                                                                    <option value="Service Request">Service Request</option>
                                                                                </select>
                                                                            </div>

                                                                            <div className="col-12 ">
                                                                                <label htmlFor="priority" className="form-label">
                                                                                    Priority :
                                                                                </label>
                                                                                <select 
                                                                                    required
                                                                                    id="priority"
                                                                                    className="form-select"
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, priority: e.target.value })
                                                                                    }
                                                                                >
                                                                                    <option selected disabled>Select Priority </option>
                                                                                    <option value="Low">Low</option>
                                                                                    <option value="Medium">Medium</option>
                                                                                    <option value="High">High</option>
                                                                                </select>
                                                                            </div>

                                                                            <div className="col-12">
                                                                                <label htmlFor="droup_down" className="form-label">
                                                                                which equipment from drop down :
                                                                                </label>
                                                                                <select 
                                                                                    required
                                                                                    id="droup_down"
                                                                                    className="form-select"
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, droup_down: e.target.value })
                                                                                    }
                                                                                >
                                                                                    
                                                                                    <option selected disabled> Select equipment</option>
                                                                                    <option value="Fan System">Fan System</option>
                                                                                    <option value="Light fitting and accessories">Light fitting and accessories</option>
                                                                                    <option value="Dryer system">Dryer system</option>
                                                                                    <option value="Electrical installation ( LOW)">Electrical installation ( LOW)</option>
                                                                                    <option value="Switchboard">Switchboard</option>
                                                                                    <option value="LPS">LPS</option>
                                                                                    <option value="ACMV System">ACMV System</option>
                                                                                    <option value="">Automatic/Motorised Gates/Roller Shutters</option>
                                                                                    <option value="Fresh Air / Extraction Systems">Fresh Air / Extraction Systems</option>
                                                                                    <option value="Synthetic Field Water Sprinkler System">Synthetic Field Water Sprinkler System</option>
                                                                                    <option value="Stomwater Detection Tank System">Stomwater Detection Tank System</option>
                                                                                    <option value="Carpark Barrier">Carpark Barrier</option>
                                                                                    <option value="Automatic Irrigation System">Automatic Irrigation System</option>
                                                                                </select>
                                                                            </div> 
                                                                            
                                                                        </div>

                                                                        <div className='form-control p-2'>
                                                                            <div className='mb-2 text-secondary'>
                                                                                What can we help you with?
                                                                            </div>
                                                                            <div className='form-control p-3'>
                                                                                <div className='mb-2 text-secondary'>
                                                                                    Where is the issue?
                                                                                </div>
                                                                                <div className="col-12 mb-2">
                                                                                    <label htmlFor="zone" className="form-label">Zone:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        id="zone"
                                                                                        value={faultreport.zone}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                                <div className="col-12 mb-2">
                                                                                    <label htmlFor="school" className="form-label">School:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        id="school"
                                                                                        value={faultreport.school}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                                <div className="col-12 mb-2">
                                                                                    <label htmlFor="block" className="form-label">Block:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        id="block"
                                                                                        value={faultreport.block}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                                <div className="col-12 mb-2">
                                                                                    <label htmlFor="level" className="form-label">Level:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        id="level"
                                                                                        value={faultreport.level}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                                <div className="col-12 mb-2">
                                                                                    <label htmlFor="room_info" className="form-label">Room Number/Room Name:</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        id="room_info"
                                                                                        value={`${faultreport.room_number} / ${faultreport.room_name}`}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className='form-control p-2 '>

                                                                            <div className='mb-2 text-secondary'>
                                                                                How can we contact you?
                                                                            </div>

                                                                            <div className="col-12 mb-2">
                                                                                <label htmlFor="requestor_name" className="form-label">
                                                                                Requestor Name :
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="requestor_name"
                                                                                    required 
                                                                                    autoComplete="off"
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, requestor_name: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12 ">
                                                                                <label htmlFor="requestor_contact" className="form-label">
                                                                                Requestor Contact Number :
                                                                                </label>
                                                                                <input
                                                                                
                                                                                    type="tel"
                                                                                    className="form-control"
                                                                                    id="requestor_contact"
                                                                                    required 
                                                                                    pattern="[0-9]{8,10}"
                                                                                    autoComplete="off"
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, requestor_contact: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                        </div>

                                                                        <div className='form-control p-2 '>

                                                                            <div className='mb-2 text-secondary'>
                                                                                Tell us more?
                                                                            </div>

                                                                            <div className="col-12 mb-2">
                                                                                <label htmlFor="image" className="form-label">
                                                                                 Upload :
                                                                                </label>
                                                                                <input
                                                                                    type="file"
                                                                                    className="form-control"
                                                                                    id="image"
                                                                                    required 
                                                                                    autoComplete="off"
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, image:e.target.files[0] })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12 ">
                                                                                <label htmlFor="description" className="form-label">
                                                                                Description :
                                                                                </label>
                                                                                <textarea name="description" 
                                                                                id="description" 
                                                                                rows='2' 
                                                                                className='form-control'
                                                                                required
                                                                                onChange={(e) =>
                                                                                    setFaultreport({ ...faultreport, description: e.target.value })
                                                                                }
                                                                                >
                                                                                </textarea>
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

export default Add_Request;
