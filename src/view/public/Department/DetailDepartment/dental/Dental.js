import React, { useRef, useState, useEffect, Fragment } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import "../../../../../style/dental.css";

import { NavItem, Row, Card } from "react-bootstrap";

function Dental() {
  const [doctors, setDoctors] = useState([]);
  const [id_card, setId_Card] = useState([]);
  const [prefix_name, setPrefix_Name] = useState([]);
  const [doctor_first_name, setDoctor_Frist_Name] = useState([]);
  const [doctor_last_name, setDoctor_Last_Name] = useState([]);
  const [doctor_image, setDoctor_Image] = useState([]);
  const [doctor_status, setDoctor_Status] = useState([]);
  const [doctor_phonenumber, setDoctor_Phonenumber] = useState([]);
  const [department_phone, setDepartment_Phone] = useState([]);
  const [department_name, setDepartment_Name] = useState([]);
  const [open_time, setOpen_Time] = useState([]);
  const [close_time, setClose_Time] = useState([]);
  const [floor, setFloor] = useState([]);
  const [building, SetBuilding] = useState([]);
  const [max_queue_number, SetMax_Queue_Number] = useState([]);
  const { DId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get(
          "http://localhost:5000/apis/doctors/depart/" +
          DId
        );

        const departmentData = res1.data[0];  // Get the department details from the first element of the array
        console.log(res1);

        setDoctors(res1.data);
        setPrefix_Name(res1.data.prefix_name);
        setDoctor_Frist_Name(res1.data.doctor_first_name);
        setDoctor_Last_Name(res1.data.doctor_last_name);
        setDoctor_Image(res1.data.doctor_image);
        setDoctor_Status(res1.data.doctor_status);
        setDoctor_Phonenumber(res1.data.doctor_phonenumber);


        setDepartment_Name(departmentData.department_name);
        setDepartment_Phone(departmentData.department_phone)
        setOpen_Time(departmentData.open_time);
        setClose_Time(departmentData.close_time);
        SetMax_Queue_Number(departmentData.max_queue_number);
        setFloor(departmentData.floor);
        SetBuilding(departmentData.building);
      } catch (error) {
        console.log(error);
      }
    }

      ;

    fetchData();
  }, [DId]);

  return (
    <div className="w-full">
      <div className=" departmentname">
        <h1 className="title-content">แผนก {department_name}</h1>
      </div>
      <div className="w-full mb-4" style={{ textAlign: "center" }}>
        <h4 className="centerdoctor">แพทย์ประจำแผนก</h4>
      </div>

      <div className="container45">
        <div className="row" >
          {doctors.map((doctor) =>
            doctor.doctor_status === "ใช้งาน" ? (
              <div className="card" key={doctor.id} style={{ width: "18rem", height: "300px"  , alignItems: 'center',}}>
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
                    <h5>
                      {doctor.prefix_name} {doctor.doctor_first_name}{" "}
                      {doctor.doctor_last_name}
                    </h5>
                  </Card.Title>
                </div>

              </div>

            ) : null
          )}
        </div>
        <div className="depart-detail">
          <div className="card">
          <div className="depart-detail-title">สถานที่ตั้ง </div>
          <div className="depart-buildind">อาคาร:&nbsp; {building} ชั้น:&nbsp; {floor}</div>
          <div className="depart-opentime">เวลาเปิดทำการ  {open_time} : {close_time} น.</div>
          <div className="depart-max">จำนวนคิวที่รับ :&nbsp; {max_queue_number} คิว</div>
          <div className="depart-phone">ติดต่อแผนก :&nbsp; {department_phone }</div>
        </div>
        </div>
      </div>
    </div>
  );
}
export default Dental;