
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'

import PrivateRoute from './Component/Logout/PrivateRoute'
import Display from './Component/Display'
import Login from './Component/Login/Login'
import Meter from './Component/Meter/Meter'
import AddMeter from './Component/Meter/Addmeter'
import EditMeter from './Component/Meter/EditMeter'
import Add_Reading from './Component/Reading/Add_Reading'
import Reading from './Component/Reading/Reading'
import Edit_Reading from './Component/Reading/Edit_Reading'
import Attendance from './Component/Attendance/Attendance'
import Add_Attendance from './Component/Attendance/Add_Attendance'
import Edit_Attendance from './Component/Attendance/Edit_Attendance'
import Report from './Component/Fault Report/Report'
import Add_Request from './Component/Fault Report/Add_Report'
import Edit_Report from './Component/Fault Report/Edit_Report'
import School from './Component/School/school'
import Add_School from './Component/School/AddSchool'
import Edit_School from './Component/School/EditSchool'
import Location from './Component/Location/Location'
import Add_Location from './Component/Location/Add_Location'
import Edit_Location from './Component/Location/Edit_location'
import Fault_Report from './Component/Fault Report/Fault_Report'

import AddBooking from './Component/Booking Management/AddBooking'
import Edit_booking from './Component/Booking Management/Edit_booking'
import Iaq from './Component/IAQ/Iaq'
import QRcodegen from './Component/Location/QRcodegen'
import SPACE from './Component/Booking Management/space_management'
function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Login />}></Route>
      <Route path='/display' element={
        <PrivateRoute >
          <Display/>
        </PrivateRoute>
      }>
        <Route path='' element={<Meter/>}></Route>
        <Route path='/display/add_meter' element={<AddMeter/>}> </Route>
        <Route path='/display/meter_edit/:id' element={<EditMeter/>}></Route>

        <Route path='/display/reading/:id' element={<Reading/>}></Route>
        <Route path='/display/add_reading/:id' element={<Add_Reading/>}></Route>
        <Route path='/display/edit_reading/:id' element={<Edit_Reading/>}></Route>

        <Route path='/display/school' element={<School/>}></Route>
        <Route path='/display/add_school' element={<Add_School/>}></Route>
        <Route path='/display/edit_school/:id' element={<Edit_School/>}></Route>

        <Route path='/display/location/:id' element={<Location/>}></Route>
        <Route path='/display/add_location/:id' element={<Add_Location/>}></Route>
        <Route path='/display/edit_location/:id' element={<Edit_Location/>}></Route>
        <Route path='/display/qrcode/:locQRID' element={<QRcodegen/>}></Route>

        <Route path='/display/attendance' element={<Attendance/>}></Route>
        <Route path='/display/add_attendance' element={<Add_Attendance/>}></Route>
        <Route path='/display/edit_attendance/:id' element={<Edit_Attendance/>}></Route>

        <Route path='/display/report' element={<Report/>}></Route>
        <Route path='/display/add_request' element={<Add_Request/>}></Route>
        <Route path='/display/edit_request/:id' element={<Edit_Report/>}></Route>
        
        
        {/* <Route path='/display/booking' element={<Booking/>}></Route> */}
        <Route path='/display/add_booking' element={<AddBooking/>}></Route>
        {/* <Route path='/display/booking_history' element={<Booking_History/>}></Route> */}
        <Route path='/display/edit_booking/:id' element={<Edit_booking/>}></Route>
        {/* <Route path='/display/check-availability' element={<CheckAvailability/>}></Route> */}
        <Route path='/display/space_management' element={<SPACE/>}></Route>


        <Route path='/display/iaq' element={<Iaq/>}></Route>
      </Route>
      <Route path='/fault_report' element={<Fault_Report/>}> </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
