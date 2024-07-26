// src/services/api.js

export async function authenticateUser() {
    const response = await fetch('https://uat.smartbuildinginspection.com/api/v1/mobilelogin/binloginnew?username=mkvadmin&password=abcd1234&deviceid=745612&version=3.0.1', {
      method: 'GET',
    });
  
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
  
    const data = await response.json();
    return data.token; // Assume the token is in the `token` field of the response
  }
  
  export async function fetchData(token) {
    // const response = await fetch('https://uat.smartbuildinginspection.com/api/v1/mobilelogin/EMDSubmitChecklist?UserID=31&PrjMasID=43754&SchoolID=8&LocID=5181&Lat=1.3755284&Longi=103.9348891', {
    const response = await fetch('https://148.66.132.155:6443/api/v1/mobilelogin/RetrieveChecklist?PrjMasID=1&SchoolID=29&UserID=26', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
  
    const data = await response.json();
    return data;
  }
  