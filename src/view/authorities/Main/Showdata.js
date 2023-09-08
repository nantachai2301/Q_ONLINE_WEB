
import React, { useRef, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
// import { useReactToPrint } from 'react-to-print';
import MainPdf from "../history/pdf/MainPdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
  getQueue,
  updateStatusQueue,
  updateQueueById,
  deleteQueueById
  } from "../../../service/Queue.Service";
function ShowData({
  
}) {
  const [dataQ, setDataQ] = useState([]);
  console.log(dataQ);
  const [empData, setEmpData] = useState([]);
  const componentRef = useRef();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default page size is 5
  const [searchUsers, setSearchUsers] = useState("");
  const [searchDate, setSearchDate] = useState(format(new Date(), "yyyy-MM-dd")); // เริ่มต้นด้วยวันที่ปัจจุบัน

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const getdataQ = async () => {
    const response = await getQueue();
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

  const filterDataBySearchAndDate = (dataQ, searchDate, formattedCurrentDate) => {
    return dataQ.filter((item) => {
      if (searchDate !== "") {
        const formattedSearchDate = formatDateToAPI(searchDate);
        return item.queue_date === formattedSearchDate;
      }
      return item.queue_date === formattedCurrentDate;
    });
  };

  useEffect(() => {
    const currentDate = new Date(); // วันที่ปัจจุบัน
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
  
    const filteredData = filterDataBySearchAndDate(dataQ, searchDate, formattedCurrentDate);
 
    

    const pagedatacount = Math.ceil(dataQ.length / pageSize);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);
      const dataToDisplay = filteredData.filter((dataItem) => {
        const firstName = dataItem.first_name || ""; // เมื่อค่าเป็น null หรือ undefined จะกำหนดให้เป็นค่าว่าง
        const lastName = dataItem.last_name || ""; // เมื่อค่าเป็น null หรือ undefined จะกำหนดให้เป็นค่าว่าง
        const departmentName = dataItem.department_name || ""; // เมื่อค่าเป็น null หรือ undefined จะกำหนดให้เป็นค่าว่าง
        const symptom = dataItem.symptom || ""; // เมื่อค่าเป็น null หรือ undefined จะกำหนดให้เป็นค่าว่าง
      
        const nameFilter =
          firstName.toLowerCase().includes(searchUsers.toLowerCase()) ||
          lastName.toLowerCase().includes(searchUsers.toLowerCase()) ||
          departmentName.toLowerCase().includes(searchUsers.toLowerCase()) ||
          symptom.toLowerCase().includes(searchUsers.toLowerCase());
      
        const departmentFilter =
          !selectedDepartment || departmentName === selectedDepartment.value;
      
        return nameFilter && departmentFilter;
      });
      
      const sortedData = dataToDisplay.sort((a, b) => a.queue_id - b.queue_id); // เรียงลำดับตามเลขหมายคิว (queue_id)

      const pageStartIndex = skip >= sortedData.length ? 0 : skip;
      const pageEndIndex = Math.min(pageStartIndex + LIMIT, sortedData.length); // ให้คำนวณ pageEndIndex ใหม่เพื่อให้ไม่เกินจำนวนข้อมูลทั้งหมด
      const slicedData = sortedData.slice(pageStartIndex, pageEndIndex);

      // ปรับเลขหมายคิวให้ต่อเนื่องกัน โดยนำหมายเลขหมายคิวในหน้าแรกมาเพิ่มทีละ 1 ในหน้าถัดไป
      const firstQueueNumber =
        pageStartIndex > 0 ? sortedData[pageStartIndex - 1].queue_id + 1 : 1; // เริ่มต้นที่หมายเลขหมายคิวของหน้าแรก (หากหน้าแรกเริ่มต้นที่หมายเลขหมายคิวที่ไม่ใช่ 1)
      const newData = slicedData.map((item, index) => ({
        ...item,
        queue_id: firstQueueNumber + index,
      }));

      setPageData(newData);
    }
  }, [dataQ, page, pageSize, searchUsers ,selectedDepartment, searchDate]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchUsers(query);
    setSearchDate("");
    setPage(1);
    getdataQ();
  };

  const handleDateSearch = (event) => {
    const query = event.target.value;
    setSearchDate(query);
    setSearchUsers("");
    setPage(1);
    getdataQ();
  };
const handleCancel = () => {
  setSearchUsers(""); // เคลียร์ค่าค้นหาชื่อผู้ใช้
  setSearchDate(format(new Date(), "yyyy-MM-dd")); // เคลียร์ค่าวันที่

  setPage(1); // กลับไปที่หน้าแรก
  const filteredData = dataQ; // กรองข้อมูลใหม่ด้วยการค้นหาและวันที่
  setPageData(filteredData); // อัพเดตข้อมูลใหม่ในหน้าแสดงผล
};
  const formatDateToAPI = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };


  const handleCancelClick = (users_id, queue_date) => {
    Swal.fire({
      title: "คุณแน่ใจที่จะลบการจองคิวนี้?",
      text: "การจองคิวนี้จะถูกลบและไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบคิว",
      cancelButtonText: "ไม่, ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formattedDate = formatDateToAPI(queue_date);
          await deleteQueueById(users_id, formattedDate);
  
          Swal.fire({
            title: "ลบคิวสำเร็จ",
            text: "การจองคิวถูกลบแล้ว",
            icon: "success",
          });
  
          getdataQ(); // รีเฟรชข้อมูลใหม่หลังจากลบคิว
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการลบคิว:", error);
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "เกิดข้อผิดพลาดในการลบคิว",
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
    queue_status_name,
    prefix_name,
    first_name,
    last_name,
    formatted_birthday
  ) => {
    const formattedQueueDate = (() => {
      const [day, month, year] = queue_date.split("-");
      return `${year}-${month}-${day}`;
    })();
  
    console.log(formattedQueueDate);
    const newStatus = currentStatus === "ยืนยัน" ? "รับการรักษาแล้ว" : "ยืนยัน";
  
    const newQueueStatusId = currentStatus === "ยืนยัน" ? 3 : 2; // ค่า newQueueStatusId ควรเป็น 3
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
        const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss"); // แปลงเวลาปัจจุบันเป็นข้อความ
  
        // เรียกใช้ฟังก์ชัน updateQueueById แทน axios.put
        updateQueueById(
          users_id,
          queue_id,
          formattedQueueDate,
          formattedDate,
          symptom,
          newQueueStatusId,
          department_id,
          questionaire_id,
          dataQ.department_name,
          dataQ.newStatus,
          prefix_name,
          first_name,
          last_name,
          formatted_birthday
        )
          .then((res) => {
            Swal.fire({
              title: "อัพเดทสถานะสำเร็จ",
              text: `สถานะได้เปลี่ยนเป็น ${newStatus}.`,
              icon: "success",
              timer: 1500,
            });
            // รีเฟรชหน้าเพื่อแสดงสถานะใหม่
            getdataQ();
  
            // อัพเดทการค้นหาและสถานะที่ถูกเลือก เพื่อให้หน้าพอรียังคงแสดงข้อมูลตามที่เลือกไว้
            const searchData = searchUsers; // เก็บค่าการค้นหา
            const selectedDep = selectedDepartment; // เก็บค่าแผนกที่เลือก
            setSearchUsers(""); // เคลียร์ค้นหา
            setSelectedDepartment(null); // เคลียร์แผนกที่เลือก
            setSearchUsers(searchData); // กำหนดค่าค้นหากลับให้กับ state
            setSelectedDepartment(selectedDep); // กำหนดค่าแผนกที่เลือกกลับให้กับ state
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
  

  const getDepartmentOptions = () => {
    const departmentsWithData = Array.from(
      new Set(
        pageData.map((dataItem) => dataItem.department_name)
      )
    );
    
    return departmentsWithData.map((department) => ({
      value: department,
      label: department,
    }));
  };
  const handleSearchSelectChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };
  return (
    <div className="w-full">
      <div className="row justify-content-start mb-2">
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
      <div className="col-5 col-md-2 col-lg-3">
  <i className="fa-solid fa-calendar mx-1"></i>
  <label>ค้นหาตามวันที่</label>
  <input
    type="date"
    className="form-control"
    value={searchDate}
    onChange={handleDateSearch}
  />
</div>
<div className="col-3 col-lg-3 pt-4">
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={handleCancel}
          >
            <i className="fa-solid fa-rotate-left mx-1"></i>
            ล้างค่า
          </button>
        </div>
      </div>
      
   
        <div className="d-flex justify-content-end mb-2">
    
        <Select
    value={selectedDepartment}
    options={getDepartmentOptions()}
    onChange={handleSearchSelectChange}
    placeholder="เลือกแผนก..."
    isClearable={true}
  />
    

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
                        <span
                          className={`text-${
                            item.queue_status_id === 2 ? "success" : "warning"
                          }`}
                        >
                          {item.queue_status_name}
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`btn ${
                          item.queue_status_name === "ยืนยัน"
                            ? "btn-success"
                            : item.queue_status_name === "รับการรักษาแล้ว"
                            ? "btn-danger"
                            : "btn-warning"
                        }`}
                        onClick={() => {
                          changeStatus(
                            item.queue_id,
                            item.queue_status_name, // นี่คือค่า currentStatus
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
                    // Update pageData with the new queue status
     
      // Reload data and keep the same search and department filter
      getdataQ();
    }}
  
>
  {item.queue_status_name === "ปกติ" && (
    <i class="fa-solid fa-user-check"></i>
  )}
  {item.queue_status_name === "ยืนยัน" && (
    <i class="fa-solid fa-user-check"></i>
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
        <div>จำนวน {pageData.length} รายการ</div>
        <div>
          <div className="Pagination">
            <Pagination
              activePage={page}
              itemsCountPerPage={10}
              totalItemsCount={pageData.length}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      {/* <div className='d-flex justify-content-center'>
        <div className='hidden'>
          <div ref={componentRef}>
            <MainPdf dataQ={dataQ} />
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default ShowData;
