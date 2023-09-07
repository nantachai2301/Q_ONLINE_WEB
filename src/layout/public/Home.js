import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faDesktop} from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { faRectangleList } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Carousel from "react-bootstrap/Carousel";
import Treatment from "../../image/Treatment.png";
import Info from "../../image/Info.png";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import c1 from "../../image/c1.jpg";
import c2 from "../../image/c2.jpg";
import c3 from "../../image/c3.png";
import c4 from "../../image/c4.png";
import HomeSlide from "../../image/HomeSlide.png";
import MainBook from "../../view/public/book/MainBook";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import "../../style/Home.css";

function Home() {
  
  // เพิ่ม state สำหรับตรวจสอบสถานะการล็อกอิน
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showMainBook, setShowMainBook] = useState(false);

  // ฟังก์ชันสำหรับตรวจสอบล็อกอิน
  const checkLogin = () => {
    // เช่นในกรณีที่คุณมีตัวแปรใน localStorage หากมีค่าแสดงว่าผู้ใช้ล็อกอินแล้ว
    // ให้นำตัวแปรนี้มาใช้ตรวจสอบเพื่อกำหนดค่า isLoggedIn ให้เป็น true
    const storedUserData = localStorage.getItem("userData");
    const isLoggedIn = storedUserData ? true : false;
    setIsLoggedIn(isLoggedIn);
  };

  // เรียกใช้ฟังก์ชัน checkLogin เมื่อโหลดหน้า Home เพื่อตรวจสอบสถานะการล็อกอิน
  useEffect(() => {
    checkLogin();
  }, []);

    

  

  const handleDepartment = () => {
    navigate("/showdepartmentAll");
  };

  const handleListQueue = () => {
    navigate("/history/:users_id");
  };

  const handleAllQueueList = () => {
    navigate("/AllQueue");
  };
  const handleAllQueueDesktop = () => {
    navigate("/DesktopQueue");
  };
  

  const handleMainBookPopup = () => {
    // ตรวจสอบสถานะการล็อกอินก่อนเปิดโมดัล
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "คุณยังไม่ได้เข้าสู่ระบบ",
        text: "กรุณาเข้าสู่ระบบก่อนทำการจองคิว",
        showConfirmButton: true,
      });
      return;
    }
  
    setShowMainBook(true);
  };
  

 
  return (
    <Fragment>
      <div className="w-full">
        <div class="container5">
          <div
            className="card justify-content-center"
            style={{ height: "200px" }}
          >
            <div className="row justify-content-xl-center">
             
             

              <div className="col">
                <div className="Home-icon">
                <FontAwesomeIcon
                  onClick={handleDepartment}
                  icon={faBook}
                  class="fas fa-book-medical"
                  style={{ color: "#4b86d2", marginTop: "60px", width : "80px" }}
                /></div>
                <div className="Nameicon">
                <a
                  onClick={handleDepartment}
                  style={{ color: "#4b86d2", cursor: "pointer" }}
                >
                  <h4 className="title-name-home mt-3 mx-5">
                    แผนก
                  </h4>
                  
                </a>
                </div>
              </div>
              
               <div className="col">
                <div className="Home-icon">
                <FontAwesomeIcon
                  onClick={handleMainBookPopup}
                  icon={faStethoscope}
                  class="fas fa-calendarDays"
                  style={{ color: "#4b86d2", marginTop: "60px", width : "80px" }}
                /></div>
                 
                <div className="Nameicon">
                  <a
                  onClick={handleMainBookPopup}
                  style={{ color: "#4b86d2", cursor: "pointer" }}
                >
                  <h4 className="title-name-home mt-3 mx-5">
                    จองคิว
                  </h4>
                  
                </a>
                </div>
                {showMainBook && (
        <MainBook show={showMainBook} setShow={setShowMainBook} />
      )}
              </div>
              {isLoggedIn && (
        <div className="col">
        <div className="Home-icon">
        <FontAwesomeIcon
          onClick={handleAllQueueDesktop}
          icon={faDesktop}
          class="fa-solid fa-Desktop"
          style={{ color: "#4b86d2", marginTop: "60px", width : "80px" }}
        /></div>
        <div className="Nameicon">
        <a
          onClick={handleAllQueueDesktop}
          style={{ color: "#4b86d2", cursor: "pointer" }}
        >
          <h4 className="title-name-home mt-3 mx-5">
           หน้าจอเรียกคิว
          </h4>
          
        </a>
        </div>
      </div>
      )}
              {isLoggedIn && (
        <div className="col">
        <div className="Home-icon">
        <FontAwesomeIcon
          onClick={handleListQueue}
          icon={faList}
          class="fa-solid fa-list"
          style={{ color: "#4b86d2", marginTop: "60px", width : "80px" }}
        /></div>
        <div className="Nameicon">
        <a
          onClick={handleListQueue}
          style={{ color: "#4b86d2", cursor: "pointer" }}
        >
          <h4 className="title-name-home mt-3 mx-5">
           รายการจองคิว
          </h4>
          
        </a>
        </div>
      </div>
      )}

      {isLoggedIn && (
        <div className="col">
        <div className="Home-icon">
        <FontAwesomeIcon
          onClick={handleAllQueueList}
          icon={faRectangleList}
          class="fa-solid fa-rectangle-list"
          style={{ color: "#4b86d2", marginTop: "60px", width : "80px" }}
        /></div>
        <div className="Nameicon">
        <a
          onClick={handleAllQueueList}
          style={{ color: "#4b86d2", cursor: "pointer" }}
        >
          <h4 className="title-name-home mt-3 mx-5">
          รายการคิวผู้ป่วยทั้งหมด
          </h4>
          
        </a>
        </div>
      </div>
      )}
           
              
            </div>
          </div>
        </div>
      </div>
     
      <div class="container5 p-5 my-5 border">
        <div className="d-flex justify-content-center ">
          <Carousel variant="dark">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={HomeSlide}
                alt="First slide"
              />
            </Carousel.Item>
          </Carousel>
        </div>
        <div className="title-message">
          <h3>ข่าวสารประชาสัมพันธ์</h3>
        </div>
        <hr></hr>
        <div className="row">
          <Card style={{ width: "20rem" }}>
            <Card.Img
              variant="top"
              src={c1}
              style={{ width: "95%", height: "70%" }}
            />
            <div className="Title-card">
              ขั้นตอนการรับบริการทันตกรรม รพ.สมเด็จพระสังฆราชองค์ที่ 17
            </div>
            <div className="button-card">
              <Button variant="primary">
                <Link to="/Newsdentalservice">
                  <div className="text-link1">ข้อมูลเพิ่มเติม</div>
                </Link>
              </Button>
            </div>
          </Card>
          <Card style={{ width: "20rem" }}>
            <Card.Img
              variant="top"
              src={c2}
              style={{ width: "95%", height: "70%" }}
            />
            <div className="Title-card">
              ฉีดวัคซีนไข้หวัดใหญ่” ฟรี สปสช.ชวนประชาชน 7
              กลุ่มเสี่ยงสิทธิบัตรทอง
            </div>
            <div className="button-card">
              <Button variant="primary">
              <Link to="/Newsfluvaccine">
                  <div className="text-link1">ข้อมูลเพิ่มเติม</div>
                </Link>
              </Button>
            </div>
          </Card>
          <Card style={{ width: "20rem" }}>
            <Card.Img
              variant="top"
              src={c3}
              style={{ width: "95%", height: "70%" }}
            />
            <div className="Title-card">
              ฉีดวัคซีนโควิด-19 Moderna Bivalent ตั้งแต่วันอังคารที่ 16 พฤษภาคม
              2566
            </div>
            <div className="button-card">
              <Button variant="primary">
              <Link to="/NewsModernaBivalent">
                  <div className="text-link1">ข้อมูลเพิ่มเติม</div>
                </Link>
              </Button>
            </div>
          </Card>
          <Card style={{ width: "20rem" }}>
            <Card.Img
              variant="top"
              src={c4}
              style={{ width: "95%", height: "70%" }}
            />
            <div className="Title-card">
             เด็กไทยวันนี้ สูงดีสมส่วน ด้วย 4 ข้อแนะนำ
            </div>
            <div className="button-card">
              <Button variant="primary">
              <Link to="/Newsfood">
                  <div className="text-link1">ข้อมูลเพิ่มเติม</div>
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;