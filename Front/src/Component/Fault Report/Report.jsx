import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { IoMdBulb } from "react-icons/io";

const Report = () => {
  const [faultreport, setFaultreport] = useState([]);  // State to store fault reports
  const [filterrequest, setFilterRequest] = useState([]);  // State to store filtered requests
  const [selectedItem, setSelectedItem] = useState(null);  // State to store selected item

  // Fetch fault reports from the server
  useEffect(() => {    
    axios.get('http://localhost:3000/auth/report')
      .then(response => {
        setFaultreport(response.data.data);
        setFilterRequest(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedItem(response.data.data[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Set selected item on click
  const handleItemClick = (item) => {
    setSelectedItem(item);  
  };

  // Delete a fault report
  const handleDelete = (id) => {    
    axios.delete('http://localhost:3000/auth/delete_request/' + id)
      .then(result => {
        if (result.data.Status) {
          const updatedFaultReport = faultreport.filter(item => item.id !== id);
          setFaultreport(updatedFaultReport);
          setFilterRequest(updatedFaultReport);
          if (selectedItem && selectedItem.id === id) {
            setSelectedItem(updatedFaultReport.length > 0 ? updatedFaultReport[0] : null);
          }
        } else {
          alert(result.data.Error);
        }
      }).catch(err => {
        console.error("Error deleting meter:", err);
        alert("Error deleting meter. Please try again.");
      });
  };

  // Search function
  const handleSearchChange = (a) => {
    const searchText = a.target.value.toLowerCase();
    const filteredRequest = faultreport.filter((e) =>
      e.zone.toLowerCase().includes(searchText) ||
      e.school.toLowerCase().includes(searchText) ||
      e.fault_type.toLowerCase().includes(searchText) ||
      e.priority.toLowerCase().includes(searchText) ||
      e.requestor_name.toLowerCase().includes(searchText) ||
      e.id.toString().toLowerCase().includes(searchText)  // Ensuring ID is treated as a string
    );
    setFilterRequest(filteredRequest);
    setSelectedItem(filteredRequest.length > 0 ? filteredRequest[0] : null);
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
                      <div className="card-body">
                        <div className="box-header with-border">

                          <div className="input-search">
                            <label htmlFor="" className="search-label">Search : </label> {/* Search Input */}
                            <input type="search" placeholder="Search" onChange={handleSearchChange} />
                          </div>

                          <div className="box_add">
                            <button><Link to="/display/add_request">Add Request</Link></button> {/* Add Request Button */}
                          </div>

                        </div>
                        <div className=" p-2 ">
                          <div><span className="blub-icon"><IoMdBulb/></span>Both fault reports and Service request types will be listed here.</div>
                        </div>
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <div className="container-fluid grid-line">
                              <div className="container-fluid grid-bax">

                                <div className="container continar">
                                  {filterrequest.map((item, index) => (
                                    <div key={index}
                                      className={`row-container ${selectedItem && selectedItem.id === item.id ? 'selected' : ''}`}
                                      onClick={() => handleItemClick(item)}> {/* Fault Report List Item */}

                                      <div className="item-heading">
                                        <span className="item-heading-main">{item.fault_type}</span>
                                      </div>

                                      <div className="item-contents">
                                        <div className="content">
                                          <span className="text-secondary">case id</span>
                                          <span>{item.id}</span>
                                        </div>

                                        <div className="content">
                                          <span className="text-secondary">Created at</span>
                                          <span>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                                        </div>

                                        <div className="content">
                                          <span className="text-secondary">Priority</span>
                                          <span>{item.priority}</span>
                                        </div>

                                        <div className="content">
                                          <span className="text-secondary">Request by</span>
                                          <span>{item.requestor_name}</span>
                                        </div>

                                        <div className="content">
                                          <span className="text-secondary">Zone</span>
                                          <span>{item.zone}</span>
                                        </div>
                                      
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right Side: Selected Fault Report Details */}
                              <div className=" grid-box">
                                {selectedItem && (
                                  <div className="details-content">
                                    <div className="request-drawer__title">
                                      <div>Request Details</div>
                                      <div>
                                        <Link                                        
                                        onClick={() => {
                                          const isConfirmed = window.confirm("Are you sure you want to Edit?");
                                          if (isConfirmed) {
                                            // Redirect to the edit request page after deletion
                                            window.location.href = `/display/edit_request/${selectedItem.id}`;
                                          }
                                        }}
                                          title="Edit"
                                          className="btn btn-success btn-sm me-2"
                                        >
                                          <HiPencilSquare />
                                        </Link>
                                        <button
                                          title="Delete"
                                          className="btn btn-danger btn-sm me-2"
                                          //ALERT MESSAGE
                                          onClick={() => {
                                            const isConfirmed = window.confirm("Are you sure you want to delete?");
                                            if (isConfirmed) {
                                              handleDelete(selectedItem.id);
                                            }
                                          }}
                                          // onClick={() => handleDelete(selectedItem.id)}
                                        >
                                          <MdDelete />
                                        </button>
                                      </div>
                                    </div>
                                    <ul className="full-content-detail-list">
                                      <li>
                                        <span>Case ID</span>
                                        <span>{selectedItem.id}</span>
                                      </li>
                                      <li>
                                        <span>Request Type</span>
                                        <span>{selectedItem.fault_type}</span>
                                      </li>
                                      <li>
                                        <span>Priority</span>
                                        <span>{selectedItem.priority}</span>
                                      </li>
                                      <li>
                                        <span>Equipment from drop down </span>
                                        <span>{selectedItem.droup_down}</span>
                                      </li>
                                      <li>
                                        <span>Description</span>
                                        <span>{selectedItem.description}</span>
                                      </li>
                                      <li>
                                        <span>Zone Name</span>
                                        <span>{selectedItem.zone}</span>
                                      </li>
                                      <li>
                                        <span>School Name</span>
                                        <span>{selectedItem.school}</span>
                                      </li>
                                      <li>
                                        <span>Block</span>
                                        <span>{selectedItem.block}</span>
                                      </li>
                                      <li>
                                        <span>Level</span>
                                        <span>{selectedItem.level}</span>
                                      </li>
                                      <li>
                                        <span>Room Number</span>
                                        <span>{selectedItem.room_number}</span>
                                      </li>
                                      <li>
                                        <span>Room Name</span>
                                        <span>{selectedItem.room_name}</span>
                                      </li>
                                      <li>
                                        <span>Request by</span>
                                        <span>{selectedItem.requestor_name}</span>
                                      </li>
                                      <li>
                                        <span>Request Contact Number</span>
                                        <span>{selectedItem.requestor_contact}</span>
                                      </li>
                                    </ul>
                                    <div role="separator" className="ant-divider ant-divider-horizontal ant-divider-with-text-center" fragment="ed93cefd1e">
                                      <span className="ant-divider-inner-text">Fault Images</span>
                                    </div>
                                    <div className="full-content-images card-request-images">
                                      <div>
                                        <img src={`http://localhost:3000/Public/Images/${selectedItem.image}`} className="img-thumbnail" alt="upload" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {/* End of Right Side */}
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
}

export default Report;
