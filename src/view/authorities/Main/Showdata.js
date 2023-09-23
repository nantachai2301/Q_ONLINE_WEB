import React, { useRef, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { useReactToPrint } from "react-to-print";
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
  deleteQueueById,
} from "../../../service/Queue.Service";
function ShowData({}) {
  const [data, setData] = useState(null);
  const [dataQ, setDataQ] = useState([]);
  console.log(dataQ);
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchDate, setSearchDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  ); // เริ่มต้นด้วยวันที่ปัจจุบัน

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getdataQ = async () => {
    const response = await getQueue();
    const filteredData = response.data.filter(
      (item) =>
      item.queue_status_id === 1 || item.queue_status_id === 2 || item.queue_status_id === 3
    );
    setDataQ(filteredData);
  };

  useEffect(() => {
    getdataQ();
  }, []);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  const filterDataBySearchAndDate = (
    dataQ,
    searchDate,
    formattedCurrentDate
  ) => {
    return dataQ.filter((item) => {
      if (searchDate !== "") {
        const formattedSearchDate = formatDateToAPI(searchDate);

        if (formattedSearchDate >= formattedCurrentDate) {
          return item.queue_date === formattedSearchDate;
        }
      }

      return item.queue_date === formattedCurrentDate;
    });
  };

  useEffect(() => {
    const currentDate = new Date(); // วันที่ปัจจุบัน
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");

    const filteredData = filterDataBySearchAndDate(
      dataQ,
      searchDate,
      formattedCurrentDate
    );

    const pagedatacount = Math.ceil(dataQ.length / pageSize);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);
      const dataToDisplay = filteredData.filter((dataItem) => {
        const firstName = dataItem.first_name || "";
        const lastName = dataItem.last_name || "";
        const departmentName = dataItem.department_name || "";
        const symptom = dataItem.symptom || "";

        const nameFilter =
          firstName.toLowerCase().includes(searchUsers.toLowerCase()) ||
          lastName.toLowerCase().includes(searchUsers.toLowerCase()) ||
          departmentName.toLowerCase().includes(searchUsers.toLowerCase()) ||
          symptom.toLowerCase().includes(searchUsers.toLowerCase());

        const departmentFilter =
          !selectedDepartment || departmentName === selectedDepartment.value;

        return nameFilter && departmentFilter;
      });

      const sortedData = dataToDisplay.sort((a, b) => {
        const dateA = new Date(`01-01-1970 ${a.create_at.split(" ")[1]}`);
               const dateB = new Date(`01-01-1970 ${b.create_at.split(" ")[1]}`);
        return dateB - dateA;
      });
      const pageStartIndex = skip >= sortedData.length ? 0 : skip;
      const pageEndIndex = Math.min(pageStartIndex + LIMIT, sortedData.length);
      const slicedData = sortedData.slice(pageStartIndex, pageEndIndex);

      const newData = slicedData.map((item) => ({
        ...item,
        queue_id: item.queue_id,
      }));

      setPageData(newData);
    }
  }, [dataQ, page, pageSize, searchUsers, selectedDepartment, searchDate]);

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
    setSearchUsers("");
    setSearchDate(format(new Date(), "yyyy-MM-dd")); // กำหนดค่าวันที่เป็นวันที่ปัจจุบัน
    setPage(1);

    // อัพเดตข้อมูลใหม่ในหน้าแสดงผลโดยให้ pageData เก็บข้อมูลที่ถูกกรองด้วยค่าค้นหาและวันที่ใหม่
    const currentDate = new Date(); // วันที่ปัจจุบัน
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
  };

  const formatDateToAPI = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleCancelClick = (users_id, queue_date) => {
    Swal.fire({
      title: "คุณต้องการลบรายการนี้ใช่หรือไม่?",
      text: "หากยืนยันที่จะลบรายการนี้ เมื่อถูกลบจะไม่สามารถกู้คืนได้",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
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
     const newStatus =
  currentStatus === "ยืนยัน"
    ? "กำลังเข้ารับการรักษา"
    : currentStatus === "กำลังเข้ารับการรักษา"
    ? "รับการรักษาแล้ว"
    : "ยืนยัน";

const newQueueStatusId = currentStatus === "ยืนยัน" ? 3 : currentStatus === "กำลังเข้ารับการรักษา" ? 4 : 2;
    Swal.fire({
      title: `คุณต้องการอัพเดทสถานะใช่หรือไม่ ? `,
      text: `อัพเดทสถานะให้เป็น ! ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "อัพเดต",
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
      new Set(pageData.map((dataItem) => dataItem.department_name))
    );

    return departmentsWithData.map((department) => ({
      value: department,
      label: department,
    }));
  };
  const handleSearchSelectChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };
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
  });



  return (
    <div className="w-full">
      <div className="row justify-content-start mb-2">
        <div className="col-5 col-md-2 col-lg-3">
          <label>ค้นหา</label>
          <input
            id="Manager_MainSearch" 
            name="firstName"
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
            id="Manager_MainSearch_date" 
            name="queue_date"
            type="date"
            className="form-control"
            value={searchDate}
            onChange={handleDateSearch}
          />
        </div>
        <div className="col-3 col-lg-3 pt-4">
          <button
            id="Manager_MainSearch_button"
            name="cancel" 
            type="button"
            className="btn btn-secondary ml-2"
            onClick={handleCancel}
          >
            <i className="fa-solid fa-rotate-left mx-1"></i>
            ล้างค่า
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between  mb-2">
      <div className="w-pagesize">
          <select
            id="QpageSize"
            class="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={100}>100</option>
            <option value={50}>50</option>
            <option value={30}>30</option>
            <option value={20}>20</option>
          </select>
        </div>
        <Select
          id="Manager_Search_Department" 
          name="department_name"
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
              <th scope="col" style={{ width: "2%",textAlign: 'center'  }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: "5%" ,textAlign: 'center' }}>
                คิวที่
              </th>
              <th scope="col" style={{ width: "20%" ,textAlign: 'center' }}>
                ชื่อ-สกุล
              </th>
              <th scope="col" style={{ width: "10%",textAlign: 'center'  }}>
                อาการเบื้องต้น
              </th>
              <th scope="col" style={{ width: "8%",textAlign: 'center'  }}>
                แผนก
              </th>
              <th scope="col" style={{ width: "10%",textAlign: 'center'  }}>
                วันที่จอง
              </th>
              <th scope="col" style={{ width: "15%",textAlign: 'center'  }}>
                เวลาที่จอง
              </th>
              <th scope="col" style={{ width: "10%",textAlign: 'center'  }}>
                สถานะคิว
              </th>
              <th scope="col" style={{ width: "5%",textAlign: 'center'  }}>
            บัตรคิว
              </th>
              <th scope="col" style={{ width: "5%",textAlign: 'center'  }}>
                ลบ
              </th>
              <th scope="col" style={{ width: "20%",textAlign: 'center'  }}>
                 จัดการสถานะคิว
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
             pageData
             .slice()
             .sort((a, b) => {
               // แยกวันที่และเวลาจากสตริง "dd-MM-yyyy HH:mm:ss"
               const dateA = new Date(`01-01-1970 ${a.create_at.split(" ")[1]}`);
               const dateB = new Date(`01-01-1970 ${b.create_at.split(" ")[1]}`);
               
               return dateA - dateB;
             }).map((item, index) => {
                return (
                  <tr key={item.users_id}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td style={{ textAlign: 'center' }}>{item.queue_id}</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.prefix_name} {item.first_name} {item.last_name}
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.symptom}</td>
                    <td style={{ textAlign: 'center' }}>{item.department_name}</td>
                    <td style={{ textAlign: 'center' }}>{item.queue_date}</td>
                    <td style={{ textAlign: 'center' }}>{item.create_at}</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.queue_status_id === 3 ? (
                        <span className="text-primary">กำลังเข้ารับการรักษา</span>
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

                    
                    <td style={{ textAlign: 'center' }}>
                      <button
                        id="Manager_button_status" 
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setData(item);
                        }}
                      >
                        <i className="fa-solid fa-print text-white"></i>
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
  {item.queue_status_id === 2 || item.queue_status_id === 3 ? (
    <button
      id="buttoCancels"
      type="button"
      className="btn btn-danger"
      disabled
    >
      <i className="fa-solid fa-trash-can"></i>
    </button>
  ) : (
    <button
      id="buttoCancels"
      type="button"
      className="btn btn-danger"
      onClick={() => {
        handleCancelClick(item.users_id, item.queue_date);
      }}
    >
      <i className="fa-solid fa-trash-can"></i>
    </button>
  )}
</td>



                    <td style={{ textAlign: 'center' }}>
                      <button
                        id="buttonStatus"
                        type="button"
                        className={`btn ${
                          item.queue_status_name === "ยืนยัน"
                            ? "btn-success"
                            : item.queue_status_name === "กำลังเข้ารับการรักษา"
                            ? "btn-primary"
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
                         {item.queue_status_name === "กำลังเข้ารับการรักษา" && (
                          <i class="fa-solid fa-user-check"></i>
                        )}
                      
                      </button>
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
