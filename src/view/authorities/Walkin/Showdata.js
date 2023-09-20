import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Table from "react-bootstrap/Table";
import { Modal, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { getPatient, getPatientById } from "../../../service/Patient.Service";
import { createQueue, deleteQueueById } from "../../../service/Queue.Service";
function Showdata() {
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState({
    queue_id: "",
    create_at: "",
    users_id: "",

    queue_date: "",
    symptom: "",
    queue_status_id: 1,
    department_id: "",
  }); // เก็บข้อมูลที่ผู้ใช้กรอกในแบบฟอร์ม

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = (shouldRefresh) => {
    setIsModalOpen(false);

    if (shouldRefresh) {
      getUser(); // รีเฟรชข้อมูลผู้ใช้งานหลังจากปิด Modal
    }
  };

  const handlecloseLogin = () => {
    window.location.reload();
    window.location.href = "/author/Bookingwalkin/";
  };

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBooking((prevbooking) => ({
      ...prevbooking,
      [name]: value,
    }));
  };
  const handleBooking = async (e) => {
    e.preventDefault();

    const { department_id, queue_date, symptom } = booking;
    const currentDate = new Date(); // วันที่ปัจจุบัน
    const selectedDate = new Date(queue_date); // แปลงวันที่ที่ผู้ใช้เลือกเป็นออบเจ็กต์ Date
    
    if (selectedDate < currentDate) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเลือกวันที่ย้อนหลังได้",
        text: "กรุณาเลือกวันที่ที่มากกว่าหรือเท่ากับวันที่ปัจจุบัน",
        showConfirmButton: true,
      });
      return;
    }
    try {
      // ตรวจสอบความถูกต้องของข้อมูลที่ผู้ใช้กรอกเข้ามา
      if (!booking.symptom || !booking.department_id) {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          showConfirmButton: true,
        });
        return;
      }

      // เพิ่มเงื่อนไขในการตรวจสอบว่าวันที่ที่เลือกไม่ใช่วันที่ย้อนหลัง
      const currentDate = new Date();

      // แสดงตัวแจ้งเตือนสำหรับยืนยันการจองคิว
      const result = await Swal.fire({
        title: "ยืนยัน",
        text: "คุณแน่ใจหรือไม่ ว่าต้องการจองคิว ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        try {
          const dataToSend = {
            users_id: selectedUser.users_id,
            first_name: selectedUser.first_name,
            last_name: selectedUser.last_name,
            department_id,
            queue_date,
            queue_status_id: 1,
            symptom,
          };
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

          // แสดงตัวแจ้งเตือนการจองคิวสำเร็จ
          Swal.fire({
            icon: "success",
            title: "จองคิวสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/author/Manage");

          closeModal(true);
          // ทำการซ่อนป๊อปอัปการจองคิว

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
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      // แสดงตัวแจ้งเตือนเมื่อเกิดข้อผิดพลาด
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการจองคิว",
        showConfirmButton: true,
      });
    }
    closeModal();
  };

  const getUser = async () => {
    const response = await getPatient();
    setUser(response.data);
  };
  const getUserById = async (userId) => {
    try {
      const response = await getPatientById(userId);
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  const loadUserById = (userId) => {
    getUserById(userId);
  };
  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  useEffect(() => {
    const filteredData = user.filter((item) => item.role_id === 0);
    const pagedatacount = Math.ceil(filteredData.length / pageSize);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;

      const skip = LIMIT * (page - 1);
      const dataToDisplay = searchQuery
        ? filteredData.filter(
            (item) =>
              item.first_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.last_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.phoneNumber.includes(searchQuery) ||
              item.id_card.includes(searchQuery)
          )
        : filteredData.slice(skip, skip + LIMIT);

      setPageData(dataToDisplay);
    }
  }, [user, page, pageSize, searchQuery]);
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleCancelClick = () => {
    setSearchQuery("");
    setPage(1);
    setPageData(user);
  };

  return (
    <div className="w-full">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <i className="fa-solid fa-magnifying-glass mx-1"></i>
          <label>ค้นหา</label>
          <input
            id="BookingWalkinSearch"
            name="first_name"
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-12 col-lg-8 pt-4">
          <button
            id="BookingWalkinSearchCancel"
            name="Cancel"
            type="button"
            className="btn btn-secondary ml-2"
            onClick={handleCancelClick}
          >
            <i className="fa-solid fa-rotate-left mx-1"></i>
            ล้างค่า
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between mb-2">
        <div className="w-pagesize">
          <select
            id="BookingWalkinpageSize"
            name="BookingpageSize"
            class="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div>
          <button
            id="BookingWalkinAddbook-an-appointment"
            name="Addbook"
            type="button"
            className="btn btn-success"
            onClick={() => {
              navigate("/author/book-an-appointment");
            }}
          >
            <i className="fa-solid fa-plus mx-1"></i>
            เพิ่มผู้ป่วย Walk In
          </button>
        </div>
      </div>
      <div className="overflow-auto">
        <Table className="table">
          <thead>
            <tr className="table-success">
              <th scope="col" style={{ width: "1%" }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: "10%" }}>
                เลขบัตรประชาชน
              </th>
              <th scope="col" style={{ width: "10%" }}>
                ชื่อ-นามสกุล
              </th>
              <th scope="col" style={{ width: "5%" }}>
                เพศ
              </th>
              <th scope="col" style={{ width: "5%" }}>
                อายุ
              </th>
              <th scope="col" style={{ width: "10%" }}>
                เบอร์โทร
              </th>

              <th scope="col" style={{ width: "10%" }}>
                จองคิว
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => {
                if (item.role_id === 0) {
                  const userBirthdate = new Date(item.birthday); // ตั้งค่าวันเกิดของผู้ใช้งานในรูปแบบ Date

                  const today = new Date();
                  const birthdateYear = userBirthdate.getFullYear();
                  const birthdateMonth = userBirthdate.getMonth();
                  const birthdateDay = userBirthdate.getDate();

                  const age =
                    today.getFullYear() -
                    birthdateYear -
                    (today.getMonth() < birthdateMonth ||
                    (today.getMonth() === birthdateMonth &&
                      today.getDate() < birthdateDay)
                      ? 1
                      : 0);
                  return (
                    <tr key={item.users_id}>
                      <td>{index + 1}</td>
                      <td>{item.id_card}</td>
                      <td>
                        {item.prefix_name} {item.first_name} {item.last_name}
                      </td>
                      <td>{item.gender}</td>
                      <td>{age} ปี</td>
                      <td>{item.phoneNumber}</td>

                      <td>
                        <div>
                          <Button
                            id="BookingWalkinopenModal"
                            variant="success"
                            className="text-white mx-1 mt-1"
                            onClick={() => {
                              setSelectedUser(null); // เคลียร์ข้อมูลที่ดึงมาก่อนหน้า
                              loadUserById(item.users_id); // เรียกดึงข้อมูลตาม ID
                              openModal();
                            }}
                          >
                            <i class="fa-solid fa-calendar-check"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              })
            ) : (
              <div className="d-flex justify-content-center ">
                Loading... <Spinner animation="border" variant="danger" />
              </div>
            )}
          </tbody>
        </Table>
      </div>
      <Modal
        id="BookingWalkinisModalOpen"
        className="custom-modal"
        show={isModalOpen}
        onHide={() => closeModal(false)}
        centered
      >
        <Modal.Header onClick={handlecloseLogin} closeButton>
          <Modal.Title>กรอกข้อมูลการจองคิว</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div className="col-12">
              <div className="row">
                <div className="col-12 px-1 mt-1">
                  <label
                    className="label-content"
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                  >
                    เลขบัตรประชาชน :{" "}
                  </label>
                  <label
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                  >
                    {" "}
                    {selectedUser.id_card}
                  </label>
                </div>
                <div className="col-12 px-1 mt-3">
                  <label
                    className="label-content"
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                  >
                    ชื่อ :{" "}
                  </label>
                  <label
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                  >
                    {" "}
                    {selectedUser.prefix_name} {selectedUser.first_name}{" "}
                    {selectedUser.last_name}
                  </label>
                </div>
                <Form.Group className="col-12 px-1 mt-3">
                  <Form.Label
                    className="label-content"
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                  >
                    อาการเบื้องต้น
                  </Form.Label>
                  <label className="red">*</label>
                  <Form.Control
                    id="BookingWalkinsymptom"
                    name="symptom" // ต้องตรงกับชื่อใน state queue
                    type="text"
                    placeholder="กรุณาระบุอาการเบื้องต้น"
                    value={booking.symptom}
                    onChange={handleBookingChange}
                  />
                </Form.Group>
                <div className="col-6 px-1 mt-3">
                  <label
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                  >
                    แผนก
                  </label>
                  <label className="red">*</label>

                  <select
                    id="BookingWalkindepartment_id"
                    class="form-select"
                    name="department_id"
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                    value={booking.department_id} // นำค่า department_id มาจากตัวแปร queue
                    onChange={handleBookingChange} // เรียกใช้ฟังก์ชัน handleChange เมื่อผู้ใช้เลือกแผนก
                    aria-label="Default select example"
                  >
                    <option selected>เลือกแผนก</option>
                    <option value="1">ทันตกรรม</option>
                    <option value="2">กุมารเวช</option>
                    <option value="3">ทั่วไป</option>
                    <option value="4">สูติ-นรีเวช</option>
                    <option value="6">ศัลยกรรม</option>
                    <option value="7">หัวใจ</option>
                    <option value="8">ผิวหนัง</option>
                    <option value="23">จักษุ</option>
                    <option value="26">ความงาม</option>
                  </select>
                  
                </div>
                <div className="col-6 px-1 mt-3">
                  <label
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                  >
                    วันที่เข้ารับการรักษา
                  </label>
                  <label className="red">*</label>
                  <input
                    id="BookingWalkinqueue_date"
                    name="queue_date"
                    type="date"
                    style={{ textTransform: "uppercase", fontSize: "18px" }}
                    className="form-input"
                    value={booking.queue_date} // นำค่า queue_date มาจากตัวแปร queue
                    onChange={handleBookingChange} // เรียกใช้ฟังก์ชัน handleChange เมื่อผู้ใช้กรอกข้อมูล
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            id="BookingWalkinBooking"
            name="Booking"
            type="button"
            className="btn btn-primary"
            onClick={handleBooking}
          >
            จองคิว
          </button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-between">
        <div>จำนวน {pageData.length} รายการ</div>
        <div className="Pagination"  id="BookingWalkinpageSize">
          <Pagination
           
            activePage={page}
            itemsCountPerPage={pageSize}
            totalItemsCount={user.length}
            pageRangeDisplayed={10}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Showdata;
