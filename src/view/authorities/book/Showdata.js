import React, { useRef, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
// import { useReactToPrint } from 'react-to-print';
import MainPdf from "../history/pdf/MainPdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import Swal from "sweetalert2";
import { format } from 'date-fns';

function Showdata({ data, pagin, changePage, changePageSize, updateStatusBook, deleteData }) {
  const [dataQ, setDataQ] = useState([]);
  console.log(dataQ)
  const [empData, setEmpData] = useState([]);
  const componentRef = useRef();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default page size is 5
  const [searchUsers, setSearchUsers] = useState("");


  const getdataQ = async () => {
    const response = await axios.get("http://localhost:5000/apis/queue/");
    setDataQ(response.data);

  };

  useEffect(() => {
    getdataQ();
  }, []);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  // ฟังก์ชันที่เรียกใช้เมื่อเปลี่ยนจำนวนรายการต่อหน้า
  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  useEffect(() => {
    const pagedatacount = Math.ceil(dataQ.length / pageSize);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);

      const dataToDisplay = dataQ.filter((dataItem) => {
        const nameFilter =
          dataItem.first_name.toLowerCase().includes(searchUsers.toLowerCase()) ||
          dataItem.last_name.toLowerCase().includes(searchUsers.toLowerCase()) ||
          dataItem.department_name.toLowerCase().includes(searchUsers.toLowerCase()) ||
          dataItem.symptom.toLowerCase().includes(searchUsers.toLowerCase());

        return nameFilter;
      });

      const sortedData = dataToDisplay.sort((a, b) => a.queue_id - b.queue_id); // เรียงลำดับตามเลขหมายคิว (queue_id)

      const pageStartIndex = skip >= sortedData.length ? 0 : skip;
      const pageEndIndex = Math.min(pageStartIndex + LIMIT, sortedData.length); // ให้คำนวณ pageEndIndex ใหม่เพื่อให้ไม่เกินจำนวนข้อมูลทั้งหมด
      const slicedData = sortedData.slice(pageStartIndex, pageEndIndex);

      // ปรับเลขหมายคิวให้ต่อเนื่องกัน โดยนำหมายเลขหมายคิวในหน้าแรกมาเพิ่มทีละ 1 ในหน้าถัดไป
      const firstQueueNumber = pageStartIndex > 0 ? sortedData[pageStartIndex - 1].queue_id + 1 : 1; // เริ่มต้นที่หมายเลขหมายคิวของหน้าแรก (หากหน้าแรกเริ่มต้นที่หมายเลขหมายคิวที่ไม่ใช่ 1)
      const newData = slicedData.map((item, index) => ({
        ...item,
        queue_id: firstQueueNumber + index,
      }));

      setPageData(newData);
    }
  }, [dataQ, page, pageSize, searchUsers]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchUsers(query);
    setPage(1);
    getdataQ();
  };
  const formatDateToAPI = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const updateQueueStatusToCancelled = async (users_id, queue_date) => {
    try {
      const formattedDate = formatDateToAPI(queue_date);
      await axios.put(`http://localhost:5000/apis/queue/${users_id}/${formattedDate}`, {
        queue_status_id: 3, // ให้สถานะเป็น "ยกเลิก" โดยใช้ค่า queue_status_id ที่เหมาะสม
      });
    } catch (error) {
      throw error;
    }
  };

  const handleCancelClick = (users_id, queue_date) => {
    Swal.fire({
      title: "คุณแน่ใจที่จะยกเลิกการจองคิวนี้?",
      text: "คิวนี้จะถูกยกเลิกและเปลี่ยนสถานะเป็น 'ยกเลิก'",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ยกเลิกคิว",
      cancelButtonText: "ไม่, ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // เรียกใช้ฟังก์ชันที่ลบคิวและเปลี่ยนสถานะเป็น "ยกเลิกคิว"
          await updateQueueStatusToCancelled(users_id, queue_date);

          // แสดงข้อความแจ้งเตือนเมื่อลบและเปลี่ยนสถานะสำเร็จ
          Swal.fire({
            title: "คิวถูกยกเลิกเรียบร้อยแล้ว",
            text: "คิวถูกยกเลิกและเปลี่ยนสถานะเป็น 'ยกเลิก'",
            icon: "success",
          });

          // รีเฟรชข้อมูลใหม่หลังจากเปลี่ยนสถานะคิว
          getdataQ();
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการยกเลิกคิว:", error);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "เกิดข้อผิดพลาดในการยกเลิกคิว",
            icon: "error",
          });
        }
      }
    });
  };

  const changeStatus = (
    queue_id,
    currentStatus,
    queue_date,
    create_at,
    symptom,
    queue_status_id,
    department_id,
    questionaire_id,
    users_id,
    department_name,


    first_name,
    last_name,
    formatted_birthday
  ) => {
    const formattedQueueDate = (() => {
      const [day, month, year] = queue_date.split('-');
      return `${year}-${month}-${day}`;
    })();

    console.log(formattedQueueDate);
    const newStatus = currentStatus === 'ยืนยัน' ? 'รับการรักษาแล้ว' : 'ยืนยัน';

    const newQueueStatusId = currentStatus === 'ยืนยัน' ? 3 : 2; // ค่า newQueueStatusId ควรเป็น 3
    Swal.fire({
      title: `คุณต้องการอัพเดทสถานะรายการนี้ใช่หรือไม่ ! `,
      text: `คุณต้องการอัพเดทสถานะให้เป็น ! ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "เปลี่ยน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        const formattedQueueDate = formatDateToAPI(queue_date);
        const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');// แปลงเวลาปัจจุบันเป็นข้อความ
        axios.put(`http://localhost:5000/apis/queue/${users_id}`, {
          queue_id: queue_id,
          queue_date: formattedQueueDate,
          create_at: formattedDate,
          symptom: symptom,
          queue_status_id: newQueueStatusId,  // ใช้ newQueueStatusId ที่เราได้คำนวณไว้
          department_id: department_id,
          questionaire_id: questionaire_id,
          users_id: users_id,




          formatted_birthday: formatted_birthday,
        })
          .then((res) => {
            Swal.fire({
              title: "อัพเดทสถานะสำเร็จ",
              text: `สถานะได้เปลี่ยนเป็น ${newStatus}.`,
              icon: "success",
              timer: 1500,
            });
            // รีเฟรชหน้าเพื่อแสดงสถานะใหม่
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "An error occurred while changing the status.",
              icon: "error",
            });
          });
      }
    });
  };


  return (
    <div className="w-full">
      <div className="row">
        <div className="col-5 col-md-2 col-lg-3">
          <label>ค้นหา</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchUsers}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="d-flex justify-content-between mb-2">
        <div className="w-pagesize">
          <select
            class="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >

            <option value={10}>10</option>

            <option value={20}>20</option>
          </select>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr className="table-success">
              <th scope="col" style={{ width: "5%" }}>
                คิวที่
              </th>
              <th scope="col" style={{ width: "20%" }}>
                ชื่อ-สกุล
              </th>
              <th scope="col" style={{ width: "15%" }}>
                อาการเบื้องต้น
              </th>
              <th scope="col" style={{ width: "10%" }}>
                แผนก
              </th>
              <th scope="col" style={{ width: "10%" }}>
                วันที่จอง<br></br>
                ป/ด/ว
              </th>
              <th scope="col" style={{ width: "15%" }}>
                เวลาที่จอง
              </th>
              <th scope="col" style={{ width: "10%" }}>
                สถานะคิว
              </th>

              <th scope="col" style={{ width: "5%" }}>
                จัดการสถานะคิว
              </th>

              <th scope="col" style={{ width: "5%" }}>
                ลบ
              </th>
              <th scope="col" style={{ width: "15%" }}>
                เรียกคิว
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => {
                return (
                  <tr key={item.queue_id}>
                    <td>{(page - 1) * 10 + index + 1}</td>

                    <td>
                      {item.prefix_name} {item.first_name} {item.last_name}
                    </td>
                    <td>{item.symptom}</td>
                    <td>{item.department_name}</td>
                    <td>{item.queue_date}</td>
                    <td>{item.create_at}</td>
                    <td>
                      {item.queue_status_id === 3 ? (
                        <span className="text-warning">รับการรักษาแล้ว</span>
                      ) : (
                        <span className="text-success">{item.queue_status_name}</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`btn-warning ${item.queue_status_name === "ยืนยัน"
                            ? "btn-success"
                            : item.queue_status_name === "รับการรักษาแล้ว"
                              ? "btn-warning"
                              : "btn-warning"
                          }`}
                        onClick={() => {
                          changeStatus(
                            item.queue_id,
                            item.queue_status_name,  // นี่คือค่า currentStatus
                            item.queue_date,
                            item.create_at,
                            item.symptom,
                            item.queue_status_id,
                            item.department_id,
                            item.questionaire_id,
                            item.users_id,
                            item.department_name,
                            item.formatted_birthday
                          );
                        }}
                      >
                        {item.queue_status_name === "ปกติ" && (
                          <i class="fa-solid fa-user-clock"></i>
                        )}
                        {item.queue_status_name === "ยืนยัน" && (
                          <i className="fa-solid fa-user-check"></i>
                        )}
                        {item.queue_status_name === "รับการรักษาแล้ว" && (
                          <i className="fa-solid fa-clinic-medical"></i>
                        )}


                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          handleCancelClick(item.users_id, item.queue_date);
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                    <td>
                      <a
                        className="btn btn-success"
                        style={{ float: "center" }}
                        onClick={() => {
                          // removeEmp(item.queue_id);
                        }}
                      >
                        <i class="fa-solid fa-arrow-right"></i>
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <div className="d-flex justify-content-center mt-4">
                Loading... <Spinner animation="border" variant="danger" />
              </div>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <div>จำนวน {dataQ.length} รายการ</div>
        <div>
          <div className="Pagination">
            <Pagination
              activePage={page}
              itemsCountPerPage={pageSize}
              totalItemsCount={dataQ.length}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Showdata;