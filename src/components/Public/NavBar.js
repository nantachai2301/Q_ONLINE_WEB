import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
 

} from "@mui/material";
import HttpsIcon from '@mui/icons-material/Https';
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Swal from "sweetalert2";
import Logo from "../../image/logo.png";
import { useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../../components/Login/LoginModal";
import ResetpasswordModal from "../Login/ResetpasswordModal";
const CustomAppBar = styled(AppBar)`
  background-color: #133c55;
  backdrop-filter: blur(100px);
  transition: background-color 0.5s ease;
  position: fixed;
  top: 0;
  width: 100%;
  hight: auto;
  z-index: 7999;
`;

const LogoImg = styled("img")`
  width: 7vw;
  @media (max-width: 600px) {
    width:9vw;
  }
  cursor: pointer;
  z-index: 10000; /* กำหนดค่า z-index ให้มากกว่าค่า z-index ของ Popup Login */
`;

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHamOpen, setIsHamOpen] = useState(false);
  const storedUserData = localStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  const isDesktop = useMediaQuery("(min-width:1024px");
  const isMobile = useMediaQuery("(max-width:600px"); // Add this line to check for mobile screen size
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  // เพิ่ม state สำหรับตรวจสอบสถานะการล็อกอิน
  const [isLoggedIn, setIsLoggedIn] = useState(true, false);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  // ฟังก์ชันสำหรับตรวจสอบล็อกอิน
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
 
  const handleResetPassword = () => {
    setIsDrawerOpen(false);
    setShowResetPasswordModal(true);
  };
  const handleLogout = () => {
    setIsDrawerOpen(false); // ปิดเมนูแฮมเบอร์เกอร์ก่อน
    setShowLogoutButton(false); // ปิดปุ่มออกจากระบบ
    Swal.fire({
      title: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังออกจากระบบ...",
          showConfirmButton: false,
          allowOutsideClick: false,
          icon: "info",
        });

        // หน่วงเวลา 3 วินาที (3000 มิลลิวินาที) ก่อนที่จะทำการออกจากระบบ
        setTimeout(() => {
          // ลบข้อมูลที่เก็บใน localStorage
          localStorage.removeItem("userData");

          // เปลี่ยนสถานะการเข้าสู่ระบบให้เป็น false
          setIsLoggedIn(false);

          // แสดง Pop-up แจ้งเมื่อออกจากระบบสำเร็จ
          Swal.fire({
            title: "ออกจากระบบสำเร็จ",
            icon: "success",
            timer: 1000,
          }).then(() => {
            // ทำการนำผู้ใช้ไปยังหน้าเข้าสู่ระบบหลังจากออกจากระบบ
            // ในที่นี้คือการ refresh หน้า
            window.location.reload();
            window.location.href = "/";
          });
        }); // หน่วงเวลา 3 วินาที
      }
    });
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const handleHamToggle = () => {
    setIsHamOpen(!isHamOpen);
  };
  const handleNavigateToIndex = () => {
    navigate("/");
    setIsDrawerOpen(false);
  };

  const handleRegister = () => {
    
    window.location.href = "/register"; // นำทางไปยังหน้า Profile
   setIsHamOpen(false);
  };
  const handleNavigateToProfile = () => {
    window.location.href = "/Profile"; // นำทางไปยังหน้า Profile
    setIsDrawerOpen(false); // ปิดเมนูแฮมเบอร์เกอร์
  };

  const handleLoginPopup = () => {
    setIsHamOpen(false)
    setShowLogin(true);
  };
  const navbarHeight = showLogin ? "500px" : "80px";

  const renderMenuItems = () => {
    return (
      <List sx={{ paddingTop: "115px" }}>
        <ListItem id="HomeHam"aria-label="หน้าหลัก" button onClick={handleNavigateToIndex}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="หน้าแรก" />
        </ListItem>
        <ListItem id="ProfileHam"aria-label="โปรไฟล์" button onClick={handleNavigateToProfile}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="โปรไฟล์" />
        </ListItem>
    <ListItem id="Reset"aria-label="เปลี่ยนรหัสผ่าน" button onClick={handleResetPassword}>
          <ListItemIcon>
            <HttpsIcon/>
          </ListItemIcon>
          <ListItemText primary="เปลี่ยนรหัสผ่าน" />
        
            
        </ListItem>
        
      
        
        {isLoggedIn && (
          <ListItem id="LogoutHam"aria-label="ออกจากระบบแฮ่ม" button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={`ออกจากระบบ (${userData?.data.fullname})`} />
          </ListItem>
        )}
      </List>
    );
  };
  const HamMenuItems = () => {
    return (
      <List sx={{ paddingTop: "75px" ,fontSize :"10px",color:"#000"}}>
        <ListItem    id="registerNavbar"  aria-label="สมัครสมาชิก"   button  onClick={handleRegister}>
         
          <AppRegistrationIcon style={{marginRight:"2vw"}}/>
          
          <ListItemText id="registerNavbar" primary="สมัครสมาชิก" />
        </ListItem>
        <ListItem  id="loginNavbar" aria-label="เข้าสู่ระบบ"   button onClick={handleLoginPopup}>
        
          <AccountCircleIcon style={{marginRight:"2vw"}}/>
          
           <ListItemText  id="loginNavbar" primary="เข้าสู่ระบบ" style={{marginRight:"3vw"}}/>
        </ListItem>
        </List>
    );
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <>
      <header id="public">
        <CustomAppBar style={{ navbarHeight }}>
          <Toolbar>
            <div style={{ display: "flex", alignItems: "center" }}>
              <LogoImg
              id="HospitalLogo.17"
                src={Logo}
                alt="โลโก้"
                onClick={handleLogoClick}
                style={{ marginRight: "1vw" }}
              />
              <Link to="/" className="logo-title" id="Hospital.17"style={{ fontSize: "2.1vw" }}>
                โรงพยาบาลสมเด็จพระสังฆราช องค์ที่ ๑๗
              </Link>
            </div>
            {isDesktop && userData && (
              <Typography
                variant="body1"
                component="div"
                sx={{ marginLeft: "440px" }}
              >
                ยินดีต้อนรับคุณ : {userData?.data.fullname}
              </Typography>
            )}
            {!userData && isDesktop && (
              <>
                <IconButton
                id="registerNavbar"
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="สมัครสมาชิก"
                  onClick={handleRegister}
                  sx={{ marginLeft: "auto"}}
                >
                  <AppRegistrationIcon />
                  <ListItemText className="registerNavbar" id="registerNavbar" style={{ fontSize:"0vw"}}>สมัครสมาชิก</ListItemText>
                </IconButton>
                <IconButton
                  id="loginNavbar"
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="เข้าสู่ระบบ"
                  onClick={handleLoginPopup}
                >
                  <AccountCircleIcon />
                  <ListItemText  id="loginNavbar" primary="เข้าสู่ระบบ" />
                </IconButton>

                
              </>
            )}
            {showLogin && (
                  <LoginModal show={showLogin} setShow={setShowLogin} />
                )}
            {userData && (
              <>
                {isDesktop && (
                  <IconButton
                  id="logoutNavbar"
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="ออกจากระบบ"
                    onClick={handleLogout}
                    sx={{ marginLeft: "auto" }}
                    // ทำการเพิ่มเงื่อนไขในการแสดงปุ่มตรงนี้
                    style={{ display: isDrawerOpen ? "none" : "block" }}
                  >
                    <ExitToAppIcon />
                  </IconButton>
                )}
                <IconButton
                  id="hamNavbar"
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="แฮ่มเบอเกอร์"
                  onClick={handleDrawerToggle}
                  sx={{ marginLeft: "auto" }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            )}
            {!userData && isMobile && (
  <IconButton
    id="hamNavbar"
    size="large"
    edge="start"
    color="inherit"
    aria-label="แฮ่มเบอเกอร์"
    onClick={handleHamToggle}
    sx={{ marginLeft: "32vw" }}
  >
    <MenuIcon />
  </IconButton>
)}

          </Toolbar>
        </CustomAppBar>
        {userData &&  (
          <Drawer
           id="isDrawerOpen"
            anchor="right"
            open={isDrawerOpen}
            onClose={handleDrawerToggle}
            
          >
            {renderMenuItems()}
          </Drawer>
        )}
          <ResetpasswordModal show={showResetPasswordModal} setShow={setShowResetPasswordModal} />
          {!userData && isMobile && (
          <Drawer
           id="isDrawerOpen"
            anchor="right"
            open={isHamOpen}
            onClose={handleHamToggle}
          >
            {HamMenuItems()}
          </Drawer>
        )}
      </header>
    </>
  );
};

export default Navbar;