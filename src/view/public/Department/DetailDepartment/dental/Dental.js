import React, { useRef, useState, useEffect, Fragment } from "react";
import { Link, useNavigate, useParams,useLocation } from "react-router-dom";
import axios from "axios";
import "../../../../../style/dental.css";
import { NavItem, Row, Card } from "react-bootstrap";
import { getDepartmentbydepart } from "../../../../../service/DepartmentType.Service";
import { getDoctordepart } from "../../../../../service/Doctor.Service";
function Dental() {
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState({
    department_id: "",
    department_name: "",
    department_image: "",
    open_time: "",
    close_time: "",
    max_queue_number: "",
    floor: "",
    building: "",
    department_phone: "",
  });
useEffect(() => {
 getDoctordepart(DId)
     .then((response) => {
       setDoctors(response.data);
       console.log("setDoctors:",response.data)
     })
    
     .catch((error) => {
       console.error("Error fetching doctors: ", error);
     });
 }, []);
  const { DId } = useParams();
  useEffect(() => {
    getDepartmentbydepart(DId)
        .then((response) => {
          setDepartments(response.data);
          console.log(" setDepartments:",response.data)
        })
       
        .catch((error) => {
          console.error("Error fetching doctors: ", error);
        });
    }, []);
    


  return (
    
    <div className="w-full">
      <div className=" departmentname">
        <h1 className="title-content">แผนก{departments.department_name}</h1>
      </div>
      <div className="w-full p-6 mb-4" style={{ textAlign: "center" }}>
        <h4 className="centerdoctor">แพทย์ประจำแผนก</h4>
      </div>
      <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link  id="BackshowdepartmentAll" to="/showdepartmentAll" className="nav-breadcrumb">
               แผนกในโรงพยาบาล
                </Link>
              </li>
              <li
                className="breadcrumb-item text-black fw-semibold"
                aria-current="page"
              >
        แพทย์ในแผนก
              </li>
            </ol>
          </nav>
        </div>
      <div className="container45">
        <div className="row" >
        <div className="departs" style={{ justifyContent: "flex-start" }}>
          {doctors.map((doctor) =>
            doctor.doctor_status === "ใช้งาน" ? (
              <div className="card dental-card" key={doctor.id} style={{ width: "320px", height: "300px"  , alignItems: 'center',}}>
                <div className="card_d ">
                <div className="circular-image-container">
                  <img
                    src={doctor.doctor_image}
                    alt="Doctor"
                    className="circular-image" 
                  />
                  </div>
                </div>
             
                <div className="sta-card">
                  <Card.Title className="card-title">
                    <h6 className="text-89">
                      {doctor.prefix_name} {doctor.doctor_first_name}{" "}
                      {doctor.doctor_last_name}
                    </h6>
                  </Card.Title>
                </div>

              </div>

            ) : null
          )}
          </div>
        </div>
        <div className="depart-detail">
          <div className="card">
          <div className="depart-detail-title">สถานที่ตั้ง </div>
          <div className="depart-buildind">อาคาร:&nbsp;<d id="building"> {departments.building} ชั้น:&nbsp; {departments.floor}</d></div>
          <div className="depart-opentime">เวลาเปิดทำการ  <d id="open_time">{departments.open_time} : {departments.close_time} </d>น.</div>
          <div className="depart-max">จำนวนคิวที่รับ :&nbsp; <d id="max_queue_number">{departments.max_queue_number} คิว</d></div>
          <div className="depart-phone">ติดต่อแผนก :&nbsp;  <d id="department_phone ">{departments.department_phone }</d></div>
        </div>
        </div>
       
      </div>
    </div>
  );
}
export default Dental;