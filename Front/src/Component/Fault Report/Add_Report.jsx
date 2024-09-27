import React, { useEffect, useState, useRef } from "react";
import { CiCircleRemove, CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axiosInstance from "axios";
import { BrowserMultiFormatReader } from "@zxing/library"; // Import from ZXing library

const Add_Report = () => {
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
    requestor_contact: "",
    description: "",
    images: [], // Store image data for submission
    report_said: "App",
  });

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // State for image previews
  const fileInputRef = useRef(null); // Reference for file input
  const navigate = useNavigate();

  const [showScanner, setShowScanner] = useState(false);
  const qrReaderRef = useRef(null);
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance
      .get("http://localhost:3000/auth/school")
      .then((result) => {
        if (result.data.Status) {
          setSchoolOptions(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    if (showScanner) {
      if (qrReaderRef.current === null) {
        const codeReader = new BrowserMultiFormatReader();
        qrReaderRef.current = codeReader;

        codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
          if (result) {
            handleScan(result.text);
            setError(''); // Clear any previous errors when a scan is successful
          } else if (error) {
            setError('Camera not found or other issue: ' + error.message); // Handle errors
          }
        }).catch((err) => setError('Error initializing camera: ' + err.message)); // Handle initialization errors
      }
    } else {
      if (qrReaderRef.current) {
        qrReaderRef.current.reset(); // Reset the QR code reader when scanner is toggled off
        qrReaderRef.current = null; // Clear the reference to the codeReader
      }
    }

    return () => {
      if (qrReaderRef.current) {
        qrReaderRef.current.reset();
        qrReaderRef.current = null; // Clear the reference to the codeReader
      }
    };
  }, [showScanner]);

  const handleScan = (data) => {
    try {
      const urlParams = new URLSearchParams(new URL(data).search);
      const locationData = {
        school_name: urlParams.get('school_name'),
        zone: urlParams.get('zone'),
        block: urlParams.get('block'),
        level: urlParams.get('level'),
        room_no: urlParams.get('room_no'),
        room_name: urlParams.get('room_name'),
      };

      setFaultreport((prev) => ({
        ...prev,
        school: locationData.school_name || '',
        zone: locationData.zone || '',
        block: locationData.block || '',
        level: locationData.level || '',
        room_number: locationData.room_no || '',
        room_name: locationData.room_name || '',
      }));

      setShowScanner(false); // Close scanner after successful scan
    } catch (err) {
      setError('Invalid QR code data: ' + err.message); // Handle invalid QR code data
    }
  };

  const handleChange = (event) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
      });

      Promise.all(fileArray).then((images) => {
        setFaultreport((prevState) => ({
          ...prevState,
          images: [...prevState.images, ...images],
        }));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...images]);
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFaultreport((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

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
    formData.append("report_said", faultreport.report_said);

    // Append each image to the form data
    faultreport.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    axiosInstance
      .post("http://localhost:3000/report/add_request", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/display/report");
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
                    <h4>Fault Report</h4>
                  </section>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="main-card mb-3 card">
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <div className="container">
                              <div className="row justify-content-center">
                                <div className="col-md-13">
                                  <div className="p-1 rounded">
                                  <form
                                      className="row g-3"
                                      onSubmit={handleSubmit}
                                    >
                                      <div className="col-12">
                                                                            <div className="form-check form-switch">
                                                                                <input className="form-check-input"
                                                                                    type="checkbox" role="switch" id="flexSwitchCheckDefault"
                                                                                    onChange={(e) => setShowScanner(e.target.checked)}
                                                                                />
                                                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                                                    Scan QR Code
                                                                                </label>
                                                                            </div>

                                                                            {showScanner && (
                                                                                <div>
                                                                                    <video ref={videoRef} id="qr-reader" style={{ width: "300px" }}></video>
                                                                                </div>
                                                                            )}

                                                                            {/* {error && <div className="alert alert-danger mt-2">{error}</div>} Display error message */}
                                                                        </div>
                                      <div className="form-control p-2 ">
                                        <div className="mb-2 text-secondary">
                                          What can we help you with?
                                        </div>

                                        <div className="col-12 mb-2">
                                          <label
                                            htmlFor="fault_type"
                                            className="form-label"
                                          >
                                            Fault Type :
                                          </label>
                                          <select
                                            required
                                            name="fault_type"
                                            id="fault_type"
                                            className="form-select"
                                            onChange={(e) =>
                                              setFaultreport({
                                                ...faultreport,
                                                fault_type: e.target.value,
                                              })
                                            }
                                          >
                                            <option selected disabled>
                                              {" "}
                                              Select Type
                                            </option>
                                            <option value="Fault Report">
                                              Fault Report
                                            </option>
                                            <option value="Service Request">
                                              Service Request
                                            </option>
                                          </select>
                                        </div>

                                        <div className="col-12 ">
                                          <label
                                            htmlFor="priority"
                                            className="form-label"
                                          >
                                            Priority :
                                          </label>
                                          <select
                                            required
                                            id="priority"
                                            className="form-select"
                                            onChange={(e) =>
                                              setFaultreport({
                                                ...faultreport,
                                                priority: e.target.value,
                                              })
                                            }
                                          >
                                            <option selected disabled>
                                              Select Priority{" "}
                                            </option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">
                                              Medium
                                            </option>
                                            <option value="High">High</option>
                                          </select>
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="droup_down"
                                            className="form-label"
                                          >
                                            which equipment from drop down :
                                          </label>
                                          <select
                                            required
                                            id="droup_down"
                                            className="form-select"
                                            onChange={(e) =>
                                              setFaultreport({
                                                ...faultreport,
                                                droup_down: e.target.value,
                                              })
                                            }
                                          >
                                            <option selected disabled>
                                              {" "}
                                              Select equipment
                                            </option>
                                            <option value="Fan System">
                                              Fan System
                                            </option>
                                            <option value="Light fitting and accessories">
                                              Light fitting and accessories
                                            </option>
                                            <option value="Dryer system">
                                              Dryer system
                                            </option>
                                            <option value="Electrical installation ( LOW)">
                                              Electrical installation ( LOW)
                                            </option>
                                            <option value="Switchboard">
                                              Switchboard
                                            </option>
                                            <option value="LPS">LPS</option>
                                            <option value="ACMV System">
                                              ACMV System
                                            </option>
                                            <option value="">
                                              Automatic/Motorised Gates/Roller
                                              Shutters
                                            </option>
                                            <option value="Fresh Air / Extraction Systems">
                                              Fresh Air / Extraction Systems
                                            </option>
                                            <option value="Synthetic Field Water Sprinkler System">
                                              Synthetic Field Water Sprinkler
                                              System
                                            </option>
                                            <option value="Stomwater Detection Tank System">
                                              Stomwater Detection Tank System
                                            </option>
                                            <option value="Carpark Barrier">
                                              Carpark Barrier
                                            </option>
                                            <option value="Automatic Irrigation System">
                                              Automatic Irrigation System
                                            </option>
                                          </select>
                                        </div>
                                      </div>

                                      <div className='form-control p-3 '>
                                                                            <div className='mb-2 text-secondary'>Where is the issue?</div>
                                                                            
                                                                            <div className="col-12 mb-2">
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
                                                                                    <option defaultValue disabled value="">Choose Zone</option>
                                                                                    {schoolOptions.map((c) => (
                                                                                        <option key={c.id} value={c.zone}>
                                                                                            {c.zone}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            
                                                                            <div className="col-12 mb-2">
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
                                                                                    <option defaultValue disabled value="">Choose school</option>
                                                                                    {schoolOptions.map((c) => (
                                                                                        <option key={c.id} value={c.school_name}>
                                                                                            {c.school_name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>

                                                                            <div className="col-12 mb-2">
                                                                                <label htmlFor="block" className="form-label">Block:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="block"
                                                                                    required 
                                                                                    autoComplete="off"
                                                                                    value={faultreport.block}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, block: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            
                                                                            <div className="col-12 mb-2">
                                                                                <label htmlFor="level" className="form-label">Level:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="level"
                                                                                    required 
                                                                                    autoComplete="off"
                                                                                    value={faultreport.level}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, level: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12 mb-2">
                                                                                <label htmlFor="room_number" className="form-label">Room Number:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="room_number"
                                                                                    required 
                                                                                    autoComplete="off"
                                                                                    value={faultreport.room_number}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, room_number: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="col-12 mb-2">
                                                                                <label htmlFor="room_name" className="form-label">Room Name:</label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    id="room_name"
                                                                                    required 
                                                                                    autoComplete="off"
                                                                                    value={faultreport.room_name}
                                                                                    onChange={(e) =>
                                                                                        setFaultreport({ ...faultreport, room_name: e.target.value })
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>

                                      <div className="form-control p-3 ">
                                        <div className="mb-2 text-secondary">
                                          How can we contact you?
                                        </div>

                                        <div className="col-12 mb-2">
                                          <label
                                            htmlFor="requestor_name"
                                            className="form-label"
                                          >
                                            Requestor Name :
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="requestor_name"
                                            required
                                            autoComplete="off"
                                            onChange={(e) =>
                                              setFaultreport({
                                                ...faultreport,
                                                requestor_name: e.target.value,
                                              })
                                            }
                                          />
                                        </div>

                                        <div className="col-12 ">
                                          <label
                                            htmlFor="requestor_contact"
                                            className="form-label"
                                          >
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
                                              setFaultreport({
                                                ...faultreport,
                                                requestor_contact:
                                                  e.target.value,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="form-control p-3">
                                        <div className="mb-2 text-secondary">
                                          Tell us more?
                                        </div>

                                        {/* Image Previews in Vertical Layout */}
                                        <div className="col-12 mb-2">
                                          <label className="form-label">
                                            Uploaded Images:
                                          </label>
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "start",
                                              gap: "10px",
                                              maxHeight: "400px", // Set a max height for the container
                                              overflowY: "auto", // Scroll if too many images
                                            }}
                                          >
                                            {imagePreviews.map(
                                              (image, index) => (
                                                <div
                                                  key={index}
                                                  className="image-preview"
                                                  style={{
                                                    position: "relative", // Enable absolute positioning for the remove icon
                                                    width: "100px",
                                                    height: "100px",
                                                    marginBottom: "10px",
                                                  }}
                                                >
                                                  <img
                                                    src={image}
                                                    alt={`Preview ${index}`}
                                                    style={{
                                                      width: "100%", // Ensure the image fits within its container
                                                      height: "100%",
                                                      objectFit: "cover", // Keep the image aspect ratio without overflow
                                                      borderRadius: "8px", // Optional: Add rounded corners
                                                    }}
                                                  />
                                                  {/* Remove Icon */}
                                                  <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() =>
                                                      handleRemoveImage(index)
                                                    }
                                                    style={{
                                                      position: "absolute",
                                                      top: "-10px", // Adjust to place above the image
                                                      right: "-10px", // Adjust to place above the image
                                                      padding: "2px", // Smaller button size
                                                      borderRadius: "50%", // Make the button circular
                                                    }}
                                                  >
                                                    <CiCircleRemove size={16} />
                                                  </button>
                                                </div>
                                              )
                                            )}

                                            {/* Add Image Button */}
                                            <button
                                              type="button"
                                              className="btn btn-light"
                                              onClick={handleAddImageClick}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "100px",
                                                height: "100px",
                                                border: "1px dashed #ccc", // Dashed border to indicate add action
                                                borderRadius: "8px",
                                              }}
                                            >
                                              <CiCirclePlus size={40} />
                                            </button>
                                          </div>

                                          {/* Hidden file input */}
                                          <input
                                            type="file"
                                            ref={fileInputRef}
                                            name="images"
                                            accept="image/*"
                                            multiple
                                            onChange={handleChange}
                                            style={{ display: "none" }}
                                          />
                                        </div>

                                        <div className="col-12">
                                          <label
                                            htmlFor="description"
                                            className="form-label"
                                          >
                                            Description:
                                          </label>
                                          <textarea
                                            name="description"
                                            id="description"
                                            rows="2"
                                            className="form-control"
                                            required
                                            onChange={(e) =>
                                              setFaultreport({
                                                ...faultreport,
                                                description: e.target.value,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>

                                      <div className="col-12">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                          <button
                                            className="btn btn-success me-md-2"
                                            type="submit"
                                          >
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

export default Add_Report;
