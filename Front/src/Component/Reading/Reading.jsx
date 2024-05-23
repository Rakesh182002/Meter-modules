import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate ,useParams} from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiPencilSquare } from "react-icons/hi2";
import { FaTachometerAlt } from "react-icons/fa";

const Reading = () => {
    const [mreading, setReading] = useState([]);
    const navigate = useNavigate();
    const [meter, setMeter] = useState({})
 
  useEffect(() => {

      //Get Reading Table
    axios.get(`http://localhost:3000/auth/readings/${id}`)
          .then((result) => {
            if (result.data.Status) {
              setReading(result.data.Result);
              setFilterReading(result.data.Result);
            } else {
              alert(result.data.Error);
            }
          })
          .catch((err) => {
            console.error("Error fetching meter data:", err);
            alert("Error fetching meter data. Please try again.");
    });

    // Get Meter Table
    axios.get(`http://localhost:3000/auth/meter/${id}`)
    .then(result => {
        const firstResult = result.data.Result[0];
        if (firstResult) {
          const {zone,school} = firstResult;
          setMeter({
            ...meter,
            school,
            zone, 
          });
        }
    }).catch(err => console.log(err));

}, []);
 
  
  // Delete operation
  
  const handleDelete = (reading_id) => {
    axios.delete(`http://localhost:3000/auth/delete_reading/${reading_id}`)
    .then(result => {
        if(result.data.Status) {
            setReading(mreading.filter(item => item.reading_id !== reading_id));
            setFilterReading(filterreading.filter(item => item.reading_id !== reading_id));
        } else {
            alert(result.data.Error);
        }
    }).catch(err => {
        console.error("Error deleting reading:", err);
        alert("Error deleting reading. Please try again.");
  });
}

// Search function
const [filterreading, setFilterReading] = useState([]);

  const handleSearchchange = (em) =>{
    const searchText = em.target.value.toLowerCase();
    const filterreading = mreading.filter((e)=>
      e.update_on.toLowerCase().includes(searchText) ||
      e.update_by.toLowerCase().includes(searchText));
    setFilterReading(filterreading);
  }

//!Using Link Tag ==> navigate to add reading 
 const {id} = useParams()


  return (
    <div id="page-wrapper">
      <div className="app-inner-layout app-inner-layout-page">
        <div className="app-inner-layout__wrapper">
          <div className="app-inner-layout__content pt-1">
            <div className="tab-content">
              <div className="container-fluid">
                <section className="content-header">
                  <h4>Reading List</h4>
                </section>
                <div className="text-uppercase fs-6 fw-bold p-2">
                <span className="text-secondary"> Zone :</span> {meter.zone} <span className="text-secondary"> - School : </span> {meter.school}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="main-card mb-3 card">
                      <div className="card-body">
                        <div className="box-header with-border">
                          <div className="box_add">  
                            <button ><Link to={`/display/add_reading/${id}`}> Add Reading</Link></button>
                          </div>
                          <div className="input-search">
                            <input type="search" placeholder="Search Date" className="font-weight-light" onChange={handleSearchchange}/>
                          </div>
                        </div>
                        <div className="box-body">
                          <div className="dataTables_wrapper">
                            <table className="meter_table" >
                              <thead>
                                <tr>
                                  <th>Meter Name</th>
                                  <th>Reading</th>
                                  <th>Unit of Measurement</th>
                                  <th>Update_at</th>
                                  <th>Update_by</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filterreading.map((e) => (
                                  <tr key={e.id}>
                                    <td>
                                      {e.meter_name}
                                    </td> 
                                    <td>{e.meter_reading}</td>
                                    <td>{e.meter_unit}</td>
                                    {/* <td><img src={`http://localhost:3000/Images/`+e.images} alt="image"
                                    
                                    />
                                    </td>                                     */}
                                    <td>{new Date(e.update_on).toLocaleDateString('en-GB')}</td>
                                    <td>{e.update_by}</td>
                                    <td>
                                      <Link
                                       onClick={() => {
                                        const isConfirmed = window.confirm("Are you sure you want to Edit?");
                                        if (isConfirmed) {
                                          // Redirect to the edit request page after deletion
                                          window.location.href = `/display/edit_Reading/${e.reading_id}`;
                                        }
                                      }}
                                        // to={`/display/edit_Reading/${e.reading_id}`}
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
                                            handleDelete(e.reading_id);
                                          }
                                        }}
                                        // onClick={() => handleDelete(e.reading_id)}
                                      >
                                        <MdDelete />
                                      </button>                                      
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

export default Reading;
