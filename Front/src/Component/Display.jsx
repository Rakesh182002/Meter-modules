import React from 'react'
import { Link,Outlet,useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Main.css'



const Display = () => {

  const navigate = useNavigate()
  axios.defaults.withCredentials = true
  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
    .then(result => {
      if(result.data.Status) { 
        localStorage.removeItem("valid")
        navigate('/')
      }
    })
  }

  return (
    <div className="app-container  app-sidebar-full">
      
        <div className="app-main">
          
            <div className="app-sidebar-wrapper">
              
                <div className="app-sidebar sidebar-shadow bg-danger sidebar-text-light">
                  
                    <div className="app-header__logo">
                            <a href="#" data-toggle="tooltip" data-placement="bottom" title="MKV" className="logo-src">
                                <img src="/public\Images\logo.png" alt='MKV' />
                            </a>
                    </div>
                       
                    <div className="scrollbar-sidebar scrollbar-container ">
                      
                        <div className="app-sidebar__inner">
                          <ul className="vertical-nav-menu metismenu">
                            <li className="app-sidebar__heading">Menu</li>

                            <li className='txt-sidebar'>                              
                              <Link to="/display">Meter</Link>
                            </li>

                            <li>
                              <Link to="/display/attendance"> Attendance </Link>
                            </li>

                            <li>
                              <Link to="/display/report"> Fault Report </Link>
                            </li>
                           
                          </ul>
                       
                        </div>
                        
                    </div>
                    
                </div>
                
            </div>
            {/* Right Side */}
              <div className="app-main__outer">
                <div className="app-main__inner">
                <div className="app-header">
                  
                    <div className="page-title-heading">
                        MKV ENGINEERING AND TRADING SERVICES PTE LTD   
                    </div>
                    <div className="app-header-right">
                    {/* <div className="header-btn-lg pr-0">
                      <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                          <div className="widget-content-left"> */}
                            <div className="btn-group">
                            <button className ="w-100px " onClick={handleLogout}>              
                              <Link>Logout</Link>
                                </button>
                              </div>
                            </div>
                          {/* </div>
                        </div>
                      </div>
                    </div>  */}
                </div>
               
                <Outlet/>
            </div>
        </div>
    </div>
    </div>
    
  )
}

export default Display