import React from 'react';

const FaultReportForm = () => {
  return (
    <div>
      <h1>Fault Report Form</h1>
      <form>
        {/* Your form fields here */}
        <label>
          Fault Description:
          <input type="text" name="faultDescription" />
        </label>
        <br />
        <label>
          Fault Location:
          <input type="text" name="faultLocation" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FaultReportForm;