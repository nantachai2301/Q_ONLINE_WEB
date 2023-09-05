import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอินเมื่อโหลดหน้า Profile
    const storedUserData = localStorage.getItem("userData");
    const storedIsLoggedIn = storedUserData ? true : false;
    setIsLoggedIn(storedIsLoggedIn);

    if (storedIsLoggedIn) {
      // ถ้าล็อกอินแล้ว ดึงข้อมูลผู้ใช้จาก localStorage
      const userDataFromLocalStorage = JSON.parse(storedUserData);
      setUserData(userDataFromLocalStorage);

      // ส่งค่า id_card ไปที่ API เพื่อรับข้อมูลผู้ใช้ที่ตรงกับ id_card
      axios
        .get(
          `http://localhost:5000/apis/patients?id_card=${userDataFromLocalStorage.data.id_card}`
        )
        .then((response) => {
          // หากสำเร็จ กำหนดข้อมูลผู้ใช้ใหม่
          const users = response.data;
          const matchedUser = users.find(
            (user) => user.id_card === userDataFromLocalStorage.data.id_card
          );
          if (matchedUser) {
            setUserData(matchedUser);
            console.log(matchedUser);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  console.log(userData);

  const loadEdit = (id) => {
    navigate("/edit-profile/" + id);
  };

  return (
    <div className="w-full">
      <div className="d-flex justify-content-center">
        <h2 className="title-contentProfile">โปรไฟล์</h2>
      </div>

      {/* แสดงข้อมูลผู้ใช้ที่ได้รับมา */}
      {isLoggedIn && userData && (
        <div
          className="containerProfile"
          style={{
            width: "650px",
            height: "750px",
            background: "#f9f9f9",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <div className="col-12">
            <div className="row">
              <h6
                className="title-content1"
                style={{ textAlign: "center", width: "100%" }}
              >
                ข้อมูลทั่วไป
              </h6>
              <div className="col-12 px-1 mt-2">
                <label className="label-content">เลขบัตรประชาชน :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.id_card}
                </label>
              </div>
              <div className="col-12 px-1 mt-2">
                <label className="label-content">ชื่อเต็ม : </label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.prefix_name} {userData.first_name}{" "}
                  {userData.last_name}
                </label>
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">เพศ :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.gender}
                </label>
                
              </div>
              <div className="col-4 px-1 mt-2">
                <label className="label-content">วันเดือนปีเกิด :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.birthday}
                </label>
                
              </div>
              <div className="col-4 px-1 mt-2">
                <label className="label-content">ส่วนสูง :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.height}
                </label>
                
              </div>
              <div className="col-4 px-1 mt-2">
                <label className="label-content">น้ำหนัก :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.weight}
                </label>
                
              </div>
              <div className="col-12 px-1 mt-2">
                <label className="label-content">เบอร์โทร :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.phoneNumber}
                </label>
               
              </div>

              <div className="col-12 px-1 mb-1 mt-3">
                <h6
                  className="title-content1"
                  style={{ textAlign: "center", width: "100%" }}
                >
                  ข้อมูลสุขภาพ
                </h6>
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">โรคประจำตัว :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.congenital_disease}
                </label>
                
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">ประวัติการแพ้ยา :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.drugallergy}
                </label>
                
                
              </div>
              <div className="col-12 px-1 mb-1 mt-3">
                <h6
                  className="title-content1"
                  style={{ textAlign: "center", width: "100%" }}
                >
                  บุคคลที่ติดต่อได้
                </h6>
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">ชื่อเต็ม :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                  {" "}
                  {userData.contact_first_name} {userData.contact_last_name}
                </label>
               
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">เบอร์โทรผู้ติดต่อ :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                 
                  {userData.contact_phoneNumber}
                </label>
             
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">ความสัมพันธ์ :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                 
                {userData.contact_relation_id}
               </label>
               
              </div>
              <div className="col-12 px-1 mb-1 mt-3">
                <h6
                  className="title-content1"
                  style={{ textAlign: "center", width: "100%" }}
                >
                  ข้อมูลที่อยู่
                </h6>
              </div>
              <div className="col-12 px-1 mt-2">
                <label className="label-content">ที่อยู่ :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                 
                {userData.address}
               </label>
                
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">ตำบล :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                 
                {userData.subdistrict}
               </label>
                
                
                
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">อำเภอ :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                 
                {userData.district}
               </label>
                
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">จังหวัด :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                 
                {userData.province}
                </label>
                 
                
              </div>
              <div className="col-6 px-1 mt-2">
                <label className="label-content">รหัสไปรษณีย์ :</label>
                <label style={{ textTransform: "uppercase", fontSize: "16px" }}>
                 
                {userData.postcode}
                 </label>
              
              </div>

             
            </div>
          </div> 
          <div className="d-flex justify-content-center mt-2">
                {/* ใช้ onClick เพื่อเรียกใช้งานฟังก์ชัน handleEditProfile เมื่อกดปุ่ม */}
                <button
                  type="button"
                  className="btn btn-warning mx-1"
                  onClick={() => {
                    loadEdit(userData.users_id);
                  }}
                >
                  แก้ไขโปรไฟล์
                </button>
              </div>
        </div>
      )}
      {!isLoggedIn && <div>Please login to view profile.</div>}
      {/* หากยังไม่ได้ล็อกอิน แสดงข้อความ "Please login to view profile." */}
    </div>
  );
};

export default Profile;
