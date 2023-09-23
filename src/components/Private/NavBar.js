import React, { useState, useEffect ,Fragment} from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from './Menu';
import { checkActive } from '../../helper/Check';
import { connect } from 'react-redux';
import {
  
  Typography,
 
} from "@mui/material";
import { AUTHEN, USERINFO, AUTHORITIES } from '../../actions/Authen';
import Swal from 'sweetalert2';
function NavBar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true, false);
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  const checkLogin = () => {
    // เช่นในกรณีที่คุณมีตัวแปรใน localStorage หากมีค่าแสดงว่าผู้ใช้ล็อกอินแล้ว
    // ให้นำตัวแปรนี้มาใช้ตรวจสอบเพื่อกำหนดค่า isLoggedIn ให้เป็น true
    const storedUserData = localStorage.getItem("userData");
    const isLoggedIn = storedUserData ? true : false;
    setIsLoggedIn(isLoggedIn);
  };
  useEffect(() => {
    checkLogin();
  }, []);
  const handleLogout = () => {
    Swal.fire({
      title: 'คุณต้องการออกจากระบบใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'กำลังออกจากระบบ...',
          showConfirmButton: false,
          allowOutsideClick: false,
          icon: 'info',
        });
  
        // ลบข้อมูลที่เก็บใน localStorage
        localStorage.clear();
        props.USERINFO();
  
        setTimeout(() => {
          // แสดง Pop-up แจ้งเมื่อออกจากระบบสำเร็จ
          Swal.fire({
            title: 'ออกจากระบบสำเร็จ',
            icon: 'success',
            timer: 1000,
          }).then(() => {
            // ทำการนำผู้ใช้ไปยังหน้าเข้าสู่ระบบหลังจากออกจากระบบ
            // ในที่นี้คือการ refresh หน้า
            window.location.reload();
            window.location.href = "/";
          });
        }); 
      }
    });
  };
   

  return (
    <header id="private">
      <Navbar collapseOnSelect expand="lg" className="navbar px-4">
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Typography
                variant="body1"
                component="div"
                style={{   fontWeight: 'bold'}}
                color="#000"
              >
                ยินดีต้อนรับคุณ : {userData?.data.fullname}
              </Typography>
         
          <Nav className="me-auto px-3">
          
          </Nav>
          <Nav className="pl-3">
          <Link to="#" className="nav-link text-black" onClick={handleLogout}>
              ออกจากระบบ
            </Link>
          </Nav>
        </Navbar.Collapse>
        
      </Navbar>
    </header>
  );
}


const mapStateToProps = (state) => ({
  auth: state.Authentication,
});

const mapDispatchToProps = (dispatch) => {
  return {
    AUTHEN: (users_id, id_card, first_name, last_name, role_id) =>
      dispatch(AUTHEN(users_id, id_card, first_name, last_name, role_id)),
    USERINFO: () => dispatch(USERINFO()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
