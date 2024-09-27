import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { MdQrCodeScanner } from "react-icons/md";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [school, setSchool] = useState({});
  const { id } = useParams();

  // Fetch location and school data
  useEffect(() => {
    // Get Location Table
    axios.get(`http://localhost:3000/auth/location/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setLocations(result.data.Result);
          setFilteredLocations(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error fetching location data:", err);
        alert("Error fetching location data. Please try again.");
      });

    // Get School Table
    axios.get(`http://localhost:3000/auth/school/${id}`)
      .then(result => {
        const firstResult = result.data.Result[0];
        if (firstResult) {
          const { zone, school_name } = firstResult;
          setSchool({
            ...school,
            school_name,
            zone,
          });
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  //Delete Location
  
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/auth/delete_location/${id}`)
    .then(result => {
        if(result.data.Status) {
            setLocations(locations.filter(item => item.id !== id));
            setFilteredLocations(filteredLocations.filter(item => item.id !== id));
        } else {
            alert(result.data.Error);
        }
    }).catch(err => {
        console.error("Error deleting Location:", err);
        alert("Error deleting Location. Please try again.");
  });
}
  

  // Search function
  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filtered = locations.filter((e) =>
      e.level.toLowerCase().includes(searchText) ||
      e.block.toLowerCase().includes(searchText) ||
      e.room_no.toLowerCase().includes(searchText) ||
      e.room_name.toLowerCase().includes(searchText) ||
      e.locQRID.toLowerCase().includes(searchText)
    );
    setFilteredLocations(filtered);
  };

  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content pt-1">
            <div className="tab-content">
              <div className="container-fluid">
                <section className="content-header">
                  <h4>Location List</h4>
                </section>
                <div className="text-uppercase fs-6 fw-bold p-2">
                  <span className="text-secondary">Zone:</span> {school.zone} <span className="text-secondary"> - School:</span> {school.school_name}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-card mb-3 card">
                      <div className="card-body">
                        <div className="box-header with-border">
                          <div className="box_add">
                            <button>
                              <Link to={`/display/add_location/${id}`}>Add Location</Link>
                            </button>
                          </div>
                          <div className="input-search">
                            <input
                              type="search"
                              placeholder="Search ..."
                              className="font-weight-light"
                              onChange={handleSearchChange}
                            />
                          </div>
                        </div>
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <table className="meter_table">
                              <thead>
                                <tr>
                                  <th>SI No</th>
                                  <th>LocQRId</th>
                                  <th>Block</th>
                                  <th>Level</th>
                                  <th>Room No/Room Name</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredLocations.map((e,index) => (
                                  <tr key={e.id}>
                                    <td>{index+1}</td>
                                    <td>{e.locQRID}</td>
                                    <td>{e.block}</td>
                                    <td>{e.level}</td>
                                    <td>{e.room_no}/{e.room_name}</td>
                                    <td>
                                      <Link
                                        onClick={() => {
                                          const isConfirmed = window.confirm("Are you sure you want to Edit this Location");
                                          if (isConfirmed) {
                                            // Redirect to the edit location page
                                            window.location.href = `/display/edit_location/${e.id}`;
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
                                        onClick={() => {
                                          const isConfirmed = window.confirm("Are you sure you want to delete this location");
                                          if (isConfirmed) {
                                            handleDelete(e.id);
                                          }
                                        }}
                                      >
                                        <MdDelete />
                                      </button>

                                      <Link className="btn btn-primary" to={`/display/qrcode/${e.locQRID}`}> 
                                      <MdQrCodeScanner />
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

export default Location;
