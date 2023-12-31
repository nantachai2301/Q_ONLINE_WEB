import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Container, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DateTh from "../../../components/DateTh";
import { getDepartment } from "../../../service/DepartmentType.Service";
import { getPatient } from "../../../service/Patient.Service";
import { createQueue } from "../../../service/Queue.Service";
const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  top: 50px;
  gap: 5rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;
const MainBook = (props) => {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [departments, setDepartments] = useState([]);
  const [queue, setQueue] = useState({
    queue_id: "",
    create_at: "",
    users_id: "",

    queue_date: "",
    symptom: "",
    queue_status_id: 1,
    department_id: "",
  });

  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอินเมื่อโหลดหน้า Profile
    const storedUserData = localStorage.getItem("userData");
    const storedIsLoggedIn = storedUserData ? true : false;
    setIsLoggedIn(storedIsLoggedIn);

    if (storedIsLoggedIn) {
      // ถ้าล็อกอินแล้ว ดึงข้อมูลผู้ใช้จาก localStorage
      const userDataFromLocalStorage = JSON.parse(storedUserData);
      setUserData(userDataFromLocalStorage);
      getPatient(userDataFromLocalStorage.data.id_card)
        .then((response) => {
          console.log("Response data:", response.data);

          const matchedUser = response.data.find(
            (user) => user.id_card === userDataFromLocalStorage.data.id_card
          );

          if (matchedUser) {
            const { users_id, prefix_name, first_name, last_name, id_card } =
              matchedUser;
            // อัปเดตข้อมูลใน state queue
            setQueue((prevQueue) => ({
              ...prevQueue,
              users_id: users_id,
            }));

            // อัปเดตข้อมูลใน state userData
            setUserData({
              ...userData,
              users_id: users_id,
              prefix_name,
              first_name,
              last_name,
              id_card,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartment();

        console.log(response.data); // Check the response data

        setDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
  }, []);
  const handleChange = (e) => {
    console.log("Input changed:", e.target.name, e.target.value);
    // const value = e.target.name === "department_id" ? Number(e.target.value) : e.target.value;
    setQueue((prevQueue) => ({
      ...prevQueue,
      [e.target.name]: e.target.value, // ใช้ computed property names เพื่ออัปเดตค่าของ property ใน state queue ที่ต้องการ
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const {
      users_id,
      first_name,
      last_name,
      department_id,
      queue_date,
      symptom,
    } = queue;
    const queue_status_id = 1; // กำหนดค่า queue_status_id เป็น 1 (หรือค่าที่ต้องการ) ตรงนี้
    try {
      // ตรวจสอบความถูกต้องของข้อมูลที่ผู้ใช้กรอกเข้ามา
      if (!queue.symptom || !queue.department_id || !queue.queue_date) {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          showConfirmButton: true,
        });
        return;
      }

      console.log(queue); // ใช้ console.log เพื่อตรวจสอบค่า queue ใน state
      const dataToSend = {
        ...queue,
        users_id,
        first_name,
        last_name,
        department_id,
        queue_date,
        symptom,
       
      };

      if (!users_id || isNaN(users_id)) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "User ID ไม่ถูกต้อง",
          showConfirmButton: true,
        });
        return;
      }
      // เพิ่มเงื่อนไขในการตรวจสอบว่าวันที่ที่เลือกไม่ใช่วันที่ย้อนหลัง
      const currentDate = new Date();
      const selectedDate = new Date(queue.queue_date);

      if (selectedDate < currentDate) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถจองคิวในวันที่ย้อนหลังได้",
          showConfirmButton: true,
        });
        return;
      }

      // แสดงตัวแจ้งเตือนสำหรับยืนยันการจองคิว
      const result = await Swal.fire({
        title: "ยืนยัน",
        text: "คุณแน่ใจหรือไม่ ว่าต้องการจองคิว ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        try {
          // ทำการจองคิวโดยส่งข้อมูลที่อยู่ในตัวแปร queue ไปยัง API สำหรับการจองคิว
          await createQueue(
            dataToSend.users_id,
            dataToSend.first_name,
            dataToSend.last_name,
            dataToSend.department_id,
            dataToSend.queue_date,
            dataToSend.symptom,
            dataToSend.queue_status_id
          );
          console.log(queue);

          // แสดงตัวแจ้งเตือนการจองคิวสำเร็จ
          Swal.fire({
            icon: "success",
            title: "จองคิวสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/history");

          // ทำการซ่อนป๊อปอัปการจองคิว
          props.setShow(false);

          // นำค่าที่ต้องการแสดงใน console.log
          console.log("จองคิวสำเร็จ!");
        } catch (error) {
          console.log(error);
          // แสดงตัวแจ้งเตือนเมื่อการจองคิวไม่สำเร็จ
          Swal.fire({
            icon: "error",
            title: "การจองคิวไม่สำเร็จ",
            text: "เกิดข้อผิดพลาดในการจองคิว กรุณาลองใหม่อีกครั้ง",
            showConfirmButton: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
      // แสดงตัวแจ้งเตือนเมื่อเกิดข้อผิดพลาด
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ใช้",
        showConfirmButton: true,
      });
    }
  };

  const handlecloseLogin = () => {
    navigate("/");
  };

  return (
    <>
      {isLoggedIn && userData && (
        <Modal  style={{ marginTop:"50px" }}show={props.show} onHide={() => props.setShow(false)} centered>
          <Modal.Header onClick={handlecloseLogin} closeButton>
            <Modal.Title
              style={{ width: "100%", textAlign: "center", fontSize: "25px" }}
            >
              จองคิว
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik onSubmit={handleBooking}>
              <Form>
                {isLoggedIn && userData && (
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12 px-1 mt-1">
                        <label
                          className="label-content"
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                        >
                          เลขบัตรประชาชน :{" "}
                        </label>
                        <label
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                        >
                          {" "}
                          {userData.id_card}
                        </label>
                      </div>
                      <div className="col-12 px-1 mt-3">
                        <label
                          className="label-content"
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                        >
                          ชื่อ :{" "}
                        </label>
                        <label
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                        >
                          {" "}
                          {userData.prefix_name} {userData.first_name}{" "}
                          {userData.last_name}
                        </label>
                      </div>

                      <Form.Group className="col-12 px-1 mt-3">
                        <Form.Label
                          className="label-content"
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                        >
                          อาการเบื้องต้น
                        </Form.Label>
                        <label className="red">*</label>
                        <Form.Control
                        id="QueueUsersymptom"
                          name="symptom" // ต้องตรงกับชื่อใน state queue
                          type="text"
                          placeholder="กรุณาระบุอาการเบื้องต้น"
                          value={queue.symptom}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <div className="col-6 px-1 mt-3">
                        <label
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                        >
                          แผนก
                        </label>
                        <label className="red">*</label>

                        <select
                         id="QueueUserdepartment_id"
                          class="form-select"
                          name="department_id"
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                          value={queue.department_id} // นำค่า department_id มาจากตัวแปร queue
                          onChange={handleChange} // เรียกใช้ฟังก์ชัน handleChange เมื่อผู้ใช้เลือกแผนก
                          aria-label="Default select example"
                        >
                          <option value="" disabled>
                               เลือกแผนก
                              </option>
                              {departments.map((prov) => (
                                <option key={prov.department_id} value={prov.department_id}>
                                  {prov.department_name}
                                </option>
                              ))}
                        </select>
                       
                      </div>
                      <div className="col-6 px-1 mt-3">
                        <label
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                        >
                          วันที่เข้ารับการรักษา
                        </label>
                        <label className="red">*</label>
                        <input
                          id="QueueUserqueue_date"
                          name="queue_date"
                          type="date"
                          style={{
                            textTransform: "uppercase",
                            fontSize: "18px",
                          }}
                          className="form-input"
                          value={queue.queue_date} // นำค่า queue_date มาจากตัวแปร queue
                          onChange={handleChange} // เรียกใช้ฟังก์ชัน handleChange เมื่อผู้ใช้กรอกข้อมูล
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Form>
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <button
              id="BookingQ"
              type="button"
              className="btn btn-primary"
              onClick={handleBooking}
            >
              จองคิว
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default MainBook;
