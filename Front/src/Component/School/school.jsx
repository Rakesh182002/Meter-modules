import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";

const School = () => {
  const [school, setSchool] = useState([]);
  const [filterSchool, setFilterSchool] = useState([]);

  useEffect(() => {
    // Get school data
    axios.get("http://localhost:3000/auth/School")
      .then((result) => {
        if (result.data.Status) {
          setSchool(result.data.Result);
          setFilterSchool(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        alert("Error fetching schools. Please try again.");
      });
  }, []);

  // Delete Operation
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/auth/delete_school/${id}`)
      .then(result => {
        if (result.data.Status) {
          setSchool(school.filter(item => item.id !== id));
          setFilterSchool(filterSchool.filter(item => item.id !== id));
          // alert("Deleted Successfully");
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => {
        console.error("Error deleting school:", err);
        alert("Error deleting school. Please try again.");
      });
  };

  // Search function
  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredSchools = school.filter((e) =>
      e.school_name.toLowerCase().includes(searchText) ||
      e.address.toLowerCase().includes(searchText) ||
      e.zone.toLowerCase().includes(searchText)
    );
    setFilterSchool(filteredSchools);
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
                        <div className="box-header with-border">
                          <div className="box_add">
                            <button>
                              <Link to="/display/add_school">Add School</Link>
                            </button>
                          </div>
                          <div className="input-search">
                            <input type="search" placeholder="Search" onChange={handleSearchChange} />
                          </div>
                        </div>
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <table className="meter_table" >
                              <thead>
                                <tr>
                                  <th>SI NO</th>
                                  <th>Zone</th>
                                  <th>School Name</th>
                                  <th>Address</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filterSchool.map((e) => (
                                  <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.zone}</td>
                                    <td>{e.school_name}</td>
                                    <td>{e.address}</td>
                                    <td>
                                      <Link
                                        to={`/display/edit_school/${e.id}`}
                                        title="Edit"
                                        className="btn btn-success btn-sm me-2"
                                      >
                                        <HiPencilSquare />
                                      </Link>
                                      <button
                                        title="Delete"
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => {
                                          const isConfirmed = window.confirm("Are you sure you want to delete?");
                                          if (isConfirmed) {
                                            handleDelete(e.id);
                                          }
                                        }}
                                      >
                                        <MdDelete />
                                      </button>
                                      <Link
                                        to={`/display/location/${e.id}`}
                                        title="Add Location"
                                        className="btn btn-primary btn-sm"
                                      >
                                        <IoMdAdd />
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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

export default School;
