import React, { useRef, useState, useEffect } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import { useReactToPrint } from "react-to-print";
import MainPdf from "../../authorities/history/pdf/MainPdf";
import Swal from "sweetalert2";
import {
  getQueue,
  updateQueues,
  deleteQueueById,
} from "../../../service/Queue.Service";
import { getPatient } from "../../../service/Patient.Service";
import { getDepartment } from "../../../service/DepartmentType.Service";
import axios from "axios";
import _ from "lodash";
import Spinner from "react-bootstrap/Spinner";

function ShowData() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // เปลี่ยนค่าเป็น 20 หรือค่าที่ต้องการ
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [queueList, setQueueList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedQueueData, setSelectedQueueData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("1");
  const [departments, setDepartments] = useState([]);

  const [queue, setQueue] = useState({});
  console.log(queueList);

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
    const fetchUserQueue = async () => {
      try {
        if (userData && userData.users_id) {
          const response = await getQueue({
            params: {
              users_id: userData.users_id,
            },
          });
          setQueueList(response.data);
        }
      } catch (error) {
        console.error("Error fetching user queue:", error);
      }
    };

    fetchUserQueue();
  }, [userData]);

  // ในส่วนที่ใช้งาน useEffect สำหรับการคำนวณหน้าและข้อมูลที่แสดงใน Pagination
  useEffect(() => {
    const filteredData = queueList
      .filter((item) => {
        const isMatchingStatusId =
          selectedStatusId === "" ||
          selectedStatusId === item.queue_status_id.toString();

        const isMatchingUserId = item.users_id === userData?.users_id;
        const isMatchingDepartment =
          selectedDepartment === "" ||
          item.department_id.toString() === selectedDepartment;
        const isMatchingDate =
          selectedDate === "" ||
          formatQueueDate(item.queue_date, "DD-MM-YYYY") === selectedDate;
        console.log("selectedDate:", selectedDate);

        return (
          isMatchingStatusId &&
          isMatchingUserId &&
          isMatchingDepartment &&
          isMatchingDate
        );
      })
      .sort((a, b) => {
        const dateA = new Date(formatDateToAPI(a.queue_date));
        const dateB = new Date(formatDateToAPI(b.queue_date));
        return dateA - dateB;
      });
    if (selectedStatusId === "4") {
      setFilteredData(
        filteredData.filter((item) => item.queue_status_id === 4)
      );
    } else {
      setFilteredData(filteredData);
    }
    const orderedData = _.orderBy(filteredData, ["queue_date"], ["desc"]); // เรียงข้อมูลตาม queue_date จากมากไปน้อย
    if (page) {
      const pagedatacount = Math.ceil(orderedData.length / pageSize);
      setPageCount(pagedatacount);

      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);

      setPageData(filteredData.slice(skip, skip + LIMIT));
    }
  }, [
    queueList,
    page,
    pageSize,
    selectedStatusId,
    selectedDepartment,
    userData,
    selectedDate,
  ]);
  useEffect(() => {
    getDepartment()
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  function formatQueueDate(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  const handleCancel = () => {
    setSelectedDepartment(""); // เคลียร์ค่าค้นหาแผนก
    setSelectedDate(""); // เคลียร์ค่าค้นหาวันที่
    setPage(1); // กลับไปที่หน้าแรก
    setPageData(filteredData); // อัพเดตข้อมูลใหม่ในหน้าแสดงผล
  };

  // สร้างฟังก์ชันเพื่อกำหนดคิวที่เลือกใน Modal แก้ไข
  const handleEditClick = (queue) => {
    setSelectedQueueData(queue); // กำหนดค่ารายการคิวที่ถูกเลือกแก้ไข
    setEditModalShow(true); // เปิด Modal แก้ไข
  };

  const handleEditSubmit = async (values) => {
    try {
      if (!values.symptom) {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกอาการเบื้องต้น",
          showConfirmButton: true,
        });
        return;
      }
      const updatedData = {
        symptom: values.symptom,
        queue_date: formatDateToAPI(values.queue_date),
      };

      console.log("Values received in handleEditSubmit:", values);
      console.log("Sending request with data:", updatedData);
    
      const response = await updateQueues(
        selectedQueueData.users_id,
        formatDateToAPI(selectedQueueData.queue_date),
        updatedData.queue_date,
        updatedData.symptom
      );

      console.log("Response from server:", response.data);
 
      setQueueList((prevQueueList) =>
        prevQueueList.map((queue) =>
          queue.queue_id === selectedQueueData.queue_id &&
          queue.queue_date === selectedQueueData.queue_date
            ? {
                ...queue,
                symptom: updatedData.symptom, 
              }
            : queue
        )
      );

    
      setEditModalShow(false);

      Swal.fire({
        icon: "success",
        title: "แก้ไขคิวสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error editing queue:", error);
   
      Swal.fire({
        icon: "error",
        title: "การแก้ไขคิวไม่สำเร็จ",
        text: "เกิดข้อผิดพลาดในการแก้ไขคิว กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: true,
      });
    }
  };
  const formatDateToAPI = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };
  const removeQueue = async (users_id, queue_date) => {
    Swal.fire({
      title: "คุณแน่ใจที่จะยกเลิกการจองคิว ?",
      text: "เมื่อรายการจองคิวถูกยกเลิก คุณจะไม่สามาถกู้คืนได้",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formattedDate = formatDateToAPI(queue_date);
          const response = await deleteQueueById(users_id, formattedDate);

          if (response.data.affectedRows > 0) {
            
            const updatedQueueList = queueList.filter(
              (queue) =>
                queue.users_id !== users_id || queue.queue_date !== queue_date
            );
            setQueueList(updatedQueueList); 

            Swal.fire({
              title: "ไม่พบคิวที่ต้องการยกเลิก",
              text: "ไม่พบคิวที่ตรงกับข้อมูลที่ระบุ",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "ยกเลิกการจองคิวสำเร็จ",
              text: "คิวถูกยกเลิกแล้ว",
              icon: "success",
              timer: 1500,
            }).then(() => {
              window.location.reload(); 
            });
          }
        } catch (error) {
          console.error("Error removing queue:", error);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "เกิดข้อผิดพลาดในการยกเลิกคิว",
            icon: "error",
          });
        }
      }
    });
  };

  function formatDate(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }
  const pageStyle = `
  @page{
    size :6in 5in;
  }
  
  
  `;

  const componentsRef = useRef();
  useEffect(() => {
    if (data) {
      print();
    }
  }, [data]);
  const print = useReactToPrint({
    content: () => componentsRef.current,
    documentTitle: "Q_Online",
    pageStyle: pageStyle,
    pageStyle: `
      @page {
        size: 6in 5in;
      }
    `,
    pageStyle: "@page { size: 6in 5in; }",
    onAfterPrint: () => {
      window.location.reload();
    },
  });
  return (
    <div>
      <div className="row justify-content-start mb-2">
        <div className="col-5 col-md-2 col-lg-3">
          <i className="fa-solid fa-calendar mx-1"></i>
          <label>ค้นหาตามวันที่</label>
          <input
            id="TableBookDate"
            name="create_at"
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="col-5 col-md-2 col-lg-3 p-4">
          <select
            id="TableBookselectedDepartment"
            name="department_id"
            className="form-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">แผนกทั้งหมด</option>
            {departments.map((department) => (
              <option
                key={department.department_id}
                value={department.department_id}
              >
                {department.department_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3 col-lg-3 pt-4">
          <button
            id="TableBookhandleCancel"
            name="BookhandleCancel"
            type="button"
            className="btn btn-secondary ml-2"
            onClick={handleCancel}
          >
            <i className="fa-solid fa-rotate-left mx-1"></i>
            ล้างค่า
          </button>
        </div>
      </div>

      <div className="col-2" style={{ marginBottom: "10px" }}>
        <select
          id="TableBookselectedStatusId"
          name="queue_status_id"
          className="form-select"
          value={selectedStatusId}
          onChange={(e) => setSelectedStatusId(e.target.value)}
        >
          <option value="1">คิวที่จอง</option>
          <option value="2">คิวที่กำลังดำเนินการ</option>
          <option value="4">ประวัติการจองคิว</option>
        </select>
      </div>
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr
              className="table"
              style={{
                backgroundColor:
                  selectedStatusId === "4"
                    ? "#4682B4"
                    : selectedStatusId === "1"
                    ? "#4682B4"
                    : "#4682B4",
                color: "#fff",
              }}
            >
           
              <th scope="col" style={{ width: "5%", textAlign: "center" }}>
                รายการ
              </th>
              <th scope="col" style={{ width: "15%", textAlign: "center" }}>
                อาการเบื้องต้น
              </th>
              <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                แผนก
              </th>
              <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                วันที่เข้ารับการรักษา
              </th>
              <th scope="col" style={{ width: "15%", textAlign: "center" }}>
                วันที่จอง
              </th>

              <th scope="col" style={{ width: "15%", textAlign: "center" }}>
                สถานะ
              </th>
              <th scope="col" style={{ width: "5%", textAlign: "center" }}>
                ลำดับคิว
              </th>
              <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                <span>จัดการ</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {pageData
              .filter(
                (queue) =>
                  queue.users_id === userData?.users_id &&
                  (selectedStatusId === "" ||
                    selectedStatusId.includes(queue.queue_status_id.toString()))
              )
              .slice(0, 10) 
              .map((queue, index) => (
                <tr key={queue.id}>
                  <td style={{ textAlign: "center" }}>
                    {(page - 1) * 10 + index + 1}
                  </td>{" "}
                 
                  <td style={{ textAlign: "center" }}>{queue.symptom}</td>
                  <td style={{ textAlign: "center" }}>
                    {queue.department_name}
                  </td>
                  <td style={{ textAlign: "center" }}>{queue.queue_date}</td>
                  <td style={{ textAlign: "center" }}>{queue.create_at}</td>
                  <td style={{ textAlign: "center" }}>
                    {queue.queue_status_name}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      id="Manager_button_status"
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setData(queue);
                      }}
                    >
                      <i className="fa-solid fa-print text-white"></i>
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {(queue.queue_status_id === 1 ||
                      (queue.queue_status_id === 2 &&
                        selectedStatusId !== "2") ||
                      (queue.queue_status_id === 4 &&
                        selectedStatusId !== "4")) && (
                      <div>
                        <button
                          id="EditQueue"
                          type="button"
                          className="btn btn-warning text-white mx-1 mt-1"
                          onClick={() => handleEditClick(queue)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          id="RemoveQueue"
                          type="button"
                          className="btn btn-danger text-white mx-1 mt-1"
                          onClick={() => {
                            removeQueue(queue.users_id, queue.queue_date);
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            {filteredData.length === 0 && ( 
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>

          <Modal
            show={editModalShow}
            onHide={() => setEditModalShow(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title
                style={{ width: "100%", textAlign: "center", fontSize: "25px" }}
              >
                แก้ไขจองคิว
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                initialValues={{
                  symptom: selectedQueueData ? selectedQueueData.symptom : "",
                  department_id: selectedQueueData
                    ? selectedQueueData.department_id
                    : "",
                  queue_date: selectedQueueData
                    ? selectedQueueData.queue_date
                    : "",
                 
                }}
                onSubmit={(values) => handleEditSubmit(values)}
              >
                {({ handleSubmit, handleChange, values }) => (
                  <Form onSubmit={handleSubmit}>
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
                              id="Editsymptom"
                              name="symptom" 
                              type="text"
                              placeholder="กรุณาระบุอาการเบื้องต้น"
                              value={values.symptom} 
                              onChange={handleChange} 
                            />
                          </Form.Group>
                          <small className="red">
                            *
                            แก้ไขเฉพาะกรณีอาการเบื้องต้นที่ไม่ชัดเจนหรือพิมพ์ผิดเท่านั้น
                          </small>
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
                              class="form-select"
                              name="department_id"
                              style={{
                                textTransform: "uppercase",
                                fontSize: "18px",
                              }}
                              value={values.department_id}
                              disabled={true}
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
                              id="Date_queue_date"
                              name="queue_date"
                              type="date"
                              style={{
                                textTransform: "uppercase",
                                fontSize: "18px",
                              }}
                              className="form-input"
                              value={formatDate(values.queue_date)}
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <Modal.Footer>
                      <button
                        id="QSubmit"
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          handleEditSubmit({
                            symptom: values.symptom,
                            queue_date: values.queue_date,
                          });
                        }}
                      >
                        บันทึกการแก้ไข
                      </button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
              <small className="red">
                * หากผู้ป่วยเลือกแผนกผิดหรือจองคิววันที่เข้ารับการรักษาผิด
                จะต้องยกเลิกการจองคิวเดิมและจองคิวใหม่เท่านั้น
              </small>
            </Modal.Body>
          </Modal>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <div>จำนวน {pageData.length} รายการ</div>
        <div className="Pagination" id="TableBookPagination">
          <Pagination
            activePage={page}
            itemsCountPerPage={pageSize}
            totalItemsCount={
              queueList.filter((queue) => queue.users_id === userData?.users_id)
                .length
            }
            pageRangeDisplayed={5}
            onChange={setPage}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="hidden">
          <div ref={componentsRef}>
            <MainPdf dataQ={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowData;
