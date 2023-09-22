import React, { useRef, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { useReactToPrint } from "react-to-print";
import MainPdf from "../../../view/authorities/history/pdf/MainPdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import Swal from "sweetalert2";
import "../../../style/desktop.css";
import { format } from "date-fns";
import {
  getQueue,
  updateStatusQueue,
  updateQueueById,
  deleteQueueById,
} from "../../../service/Queue.Service";
function CallQueue({}) {
  const [data, setData] = useState(null);
  const [dataQ, setDataQ] = useState([]);
  console.log(dataQ);
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchDate, setSearchDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  ); // เริ่มต้นด้วยวันที่ปัจจุบัน

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getdataQ = async () => {
    const response = await getQueue();
    const filteredData = response.data.filter(
      (item) =>
        item.queue_status_name === "ปกติ" || item.queue_status_name === "ยืนยัน"
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
        const dateA = new Date(a.queue_id);
        const dateB = new Date(b.queue_id);
        return dateA - dateB;
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

  const [calledQueueData, setCalledQueueData] = useState([]);
  const [pendingQueueData, setPendingQueueData] = useState([]);
  const [dataToSend, setDataToSend] = useState(null);
  const handleCallQueue = (queue) => {
    // สร้างรายการคิวที่ถูกเรียกในตัวแปรใหม่
    const newCalledQueueData = [...calledQueueData, queue];
    // ลบคิวที่ถูกเรียกออกจากรายการคิวที่รอในตัวแปรใหม่
    const newPendingQueueData = pendingQueueData.filter(
      (item) => item.queue_id !== queue.queue_id
    );

    // อัพเดตสถานะของข้อมูลใน state
    setCalledQueueData(newCalledQueueData);
    setPendingQueueData(newPendingQueueData);

    setDataToSend(queue);

    // ส่งไปยังหน้า CallQueue โดยไม่เปลี่ยนหน้า
    navigate("/CallQueue");
  };

  return (
    <div className="w-full">
      <div className="waiting-queue-table">
            <h2>กำลังเรียกคิว</h2>
            <table class="tables">
              <thead class="theads">
                    <tr>
              <th scope="col" style={{ width: "2%" , textAlign: 'center'  }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: "20%" , textAlign: 'center'  }}>
                คิวที่
              </th>

            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => {
                return (
                  <tr>
                     <td style={{ textAlign: 'center' }}>{(page - 1) * 10 + index + 1}</td>

                    <td style={{ textAlign: 'center' }}>
                    {item.queue_id}
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
     
     
    </div>
  );
}

export default CallQueue;
