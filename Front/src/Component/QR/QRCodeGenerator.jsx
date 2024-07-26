// src/components/DataTable.js

import React, { useState, useEffect } from 'react';
import { authenticateUser, fetchData } from '../../service/api';

const DataTable = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const token = await authenticateUser();
        const data = await fetchData(token);
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
    fontSize: '1em',
    fontFamily: 'sans-serif',
    minWidth: '400px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)',
  };

  const thTdStyle = {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  };

  const trStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
  });

  return (
    <div>
      {data ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>LocID</th>
              <th style={thStyle}>LocQRID</th>
              <th style={thStyle}>SchoolID</th>
              <th style={thStyle}>Block</th>
              <th style={thStyle}>FLevel</th>
              <th style={thStyle}>RoomNo</th>
              <th style={thStyle}>RoomName</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.LocID} style={trStyle(index)}>
                <td style={thTdStyle}>{item.LocID}</td>
                <td style={thTdStyle}>{item.LocQRID}</td>
                <td style={thTdStyle}>{item.SchoolID}</td>
                <td style={thTdStyle}>{item.Block}</td>
                <td style={thTdStyle}>{item.FLevel}</td>
                <td style={thTdStyle}>{item.RoomNo}</td>
                <td style={thTdStyle}>{item.RoomName}</td>
                {/* Add more data fields as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default DataTable;
