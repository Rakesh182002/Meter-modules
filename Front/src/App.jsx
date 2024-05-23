import './App.css'
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
import Fault_Report from './Component/Fault Report/Report'
import Add_Request from './Component/Fault Report/Add_Report'
import Edit_Report from './Component/Fault Report/Edit_Report'

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

        <Route path='/display/attendance' element={<Attendance/>}></Route>
        <Route path='/display/add_attendance' element={<Add_Attendance/>}></Route>
        <Route path='/display/edit_attendance/:id' element={<Edit_Attendance/>}></Route>

        <Route path='/display/report' element={<Fault_Report/>}></Route>
        <Route path='/display/add_request' element={<Add_Request/>}></Route>
        <Route path='/display/edit_request/:id' element={<Edit_Report/>}></Route>
        
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
