import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Iaq = () => {
    const [schoolName, setSchoolName] = useState('');
    const [block, setBlock] = useState('');
    const [level, setLevel] = useState('');
    const [RoomNo, setRoomNo] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [device_id, setDeviceId] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:3000/iaq/getSensorData', {
                params: {
                    schoolName,
                    block,
                    level,
                    RoomNo,
                    month,
                    year,
                    device_id
                }
            });
            setData(response.data);
        } catch (error) {
            setError('Error fetching data');
            console.error(error);
        }
        setLoading(false);
    };

    const generateYears = () => {
        const startYear = 2019;
        const endYear = new Date().getFullYear();
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }
        return years;
    };

    const generateMonths = () => {
        return [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    };

    useEffect(() => {
        // Fetch School Data
        axios.get("http://localhost:3000/auth/school")
            .then((response) => {
                if (response.data.Status) {
                    setSchools(response.data.Result);
                } else {
                    setError(response.data.Error);
                }
            })
            .catch((error) => {
                console.error("Error fetching schools:", error);
                setError("Error fetching schools");
            });
    }, []);

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    return (
        <div style={{ padding: '10px', border: '1px solid black', width: '97%', margin: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <form
        onSubmit={(e) => {
            e.preventDefault();
            fetchData();
        }}
    >
        {/* First row: School Name */}
        <div style={{ marginBottom: '10px', padding: '10px' }}>
            <label htmlFor="inputschool" className="form-label  search-label">
                School Name :
            </label>
            <select
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={{ width: '100%', padding: '5px' }}
            >
                <option value="" disabled>Select School</option>
                {schools.map((school) => (
                    <option key={school.id} value={school.school_name}>
                        {school.school_name}
                    </option>
                ))}
            </select>
        </div>

        {/* Second row: Block, Level, Room No */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
                <label className='search-label'>Block: </label>
                <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>

            <div style={{ flex: '1', marginRight: '10px' }}>
                <label className='search-label'>Level: </label>
                <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>

            <div style={{ flex: '1' }}>
                <label  className='search-label'>Room No: </label>
                <input
                    type="text"
                    value={RoomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>
        </div>

        {/* Third row: Month, Year, Device ID */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ flex: '1', marginRight: '10px' }}>
                <label  className='search-label'>Month: </label>
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                >
                    <option value="">Select Month</option>
                    {generateMonths().map((month, index) => (
                        <option key={index} value={index + 1}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ flex: '1', marginRight: '10px' }}>
                <label className='search-label'>Year: </label>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                >
                    <option value="">Select Year</option>
                    {generateYears().map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ flex: '1' }}>
                <label  className='search-label'>Device ID: </label>
                <input
                    type="text"
                    value={device_id}
                    onChange={(e) => setDeviceId(e.target.value)}
                    style={{ width: '100%', padding: '5px' }}
                />
            </div>
        </div>

        <div style={{ textAlign: 'right' }}>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {loading ? 'Fetching...' : 'Search'}
            </button>
        </div>
    </form>
    

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginTop: '40px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#495057',color:'white' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>School Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Block</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Level</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Room No/Room Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Device ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>PM2.5</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>PM10</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>CO2 ppm</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Temperature</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Humidity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="13" style={{ textAlign: 'center' }}>Loading...</td>
                            </tr>
                        ) : currentData.length === 0 ? (
                            <tr>
                                <td colSpan="13" style={{ textAlign: 'center' }}>No Data Available</td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr key={item.device_id + item.time} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'}}>
                                    
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.schoolName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.block}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.level}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.RoomNo}/{item.RoomName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.device_id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {new Date(item.time).toLocaleDateString('en-GB')}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.pm25}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.pm10}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.co2_ppm}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.temperature}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.humidity}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label>Rows per page: </label>
                        <select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            style={{ marginLeft: '10px', padding: '5px' }}
                        >
                            {[15, 20, 30].map((rows) => (
                                <option key={rows} value={rows}>
                                    {rows}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ marginRight: '10px', padding: '5px 10px' }}
                        >
                            Previous
                        </button>

                        {[...Array(totalPages).keys()].map((index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    padding: '5px 10px',
                                    marginRight: '5px',
                                    backgroundColor: currentPage === index + 1 ? '#007bff' : '#fff',
                                    color: currentPage === index + 1 ? '#fff' : '#000',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{ marginLeft: '10px', padding: '5px 10px' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Iaq;
