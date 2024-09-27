// src/components/Api/DataTable.js

import React, { useState, useEffect } from 'react';
import { authenticateUser, fetchData } from '../../service/api';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const token = await authenticateUser();
        const fetchedData = await fetchData(token);
        setData(fetchedData); // Ensure this is an array
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
      {data.length > 0 ? (
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
              <th style={thStyle}>Remarks</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>CheckIn</th>
              <th style={thStyle}>CheckOut</th>
              <th style={thStyle}>FaultCount</th>
              <th style={thStyle}>EMDLocTxID</th>
              <th style={thStyle}>EApplicableSS</th>
              <th style={thStyle}>MApplicableSS</th>
              <th style={thStyle}>DApplicableSS</th>
              <th style={thStyle}>EFlag</th>
              <th style={thStyle}>MFlag</th>
              <th style={thStyle}>DFlag</th>
              <th style={thStyle}>faultfiles</th>
              <th style={thStyle}>Lift_Vendor_Name</th>
              <th style={thStyle}>CLType</th>
              <th style={thStyle}>Engineer_Name</th>
              <th style={thStyle}>QrCodeUri</th>
              <th style={thStyle}>VerifiedBy_Remarks</th>
              <th style={thStyle}>TotalLocCount</th>
              <th style={thStyle}>TotalCompletedCount</th>
              <th style={thStyle}>TotalPendingCount</th>
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
                <td style={thTdStyle}>{item.Remarks}</td>
                <td style={thTdStyle}>{item.Status}</td>
                <td style={thTdStyle}>{item.CheckIn}</td>
                <td style={thTdStyle}>{item.CheckOut}</td>
                <td style={thTdStyle}>{item.FaultCount}</td>
                <td style={thTdStyle}>{item.EMDLocTxID}</td>
                <td style={thTdStyle}>{item.EApplicableSS}</td>
                <td style={thTdStyle}>{item.MApplicableSS}</td>
                <td style={thTdStyle}>{item.DApplicableSS}</td>
                <td style={thTdStyle}>{item.EFlag}</td>
                <td style={thTdStyle}>{item.MFlag}</td>
                <td style={thTdStyle}>{item.DFlag}</td>
                <td style={thTdStyle}>{item.faultfiles}</td>
                <td style={thTdStyle}>{item.Lift_Vendor_Name}</td>
                <td style={thTdStyle}>{item.CLType}</td>
                <td style={thTdStyle}>{item.Engineer_Name}</td>
                <td style={thTdStyle}>{item.QrCodeUri}</td>
                <td style={thTdStyle}>{item.VerifiedBy_Remarks}</td>
                <td style={thTdStyle}>{item.TotalLocCount}</td>
                <td style={thTdStyle}>{item.TotalCompletedCount}</td>
                <td style={thTdStyle}>{item.TotalPendingCount}</td>
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
