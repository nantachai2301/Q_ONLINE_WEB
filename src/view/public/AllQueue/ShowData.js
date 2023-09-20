import React, { useRef, useState, useEffect } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Pagination from "react-js-pagination";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
// import { useReactToPrint } from 'react-to-print';
import Swal from "sweetalert2";

import axios from "axios";

import Spinner from "react-bootstrap/Spinner";

function ShowData() {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQueue, setSearchQueue] = useState("");  
  const [queueList, setQueueList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectStatus, setSelectStatus] = useState(null);
  
  const [queue, setQueue] = useState({});
  console.log(queue);

 

  useEffect(() => {
    const fetchAllQueues = async () => {
      try {
        const response = await axios.get(
          "https://elated-lime-salmon.cyclic.app/apis/queue/"
        );
        setQueueList(response.data);
      } catch (error) {
        console.error("Error fetching all queues:", error);
      }
    };
    fetchAllQueues();
}, []);


  useEffect(() => {
    const pagedatacount = Math.ceil(queueList.length / 10);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);
      const dataToDisplay = queueList.filter((queueLists) => {
        const nameFilter =
        queueLists.department_name
            .toLowerCase()
            .includes(searchQueue.toLowerCase()) ||
        queueLists.symptom
            .toLowerCase()
            .includes(searchQueue.toLowerCase());

        const departmentFilter =
          !selectedDepartment ||
          queueLists.department_name === selectedDepartment.value;
        const statusFilter =
          !selectStatus || queueLists.queue_status_name === selectStatus.value;

        return nameFilter && departmentFilter && statusFilter;
      });

      setPageData(dataToDisplay.slice(skip, skip + LIMIT));
    }
  }, [queueList, page, pageSize, searchQueue, selectedDepartment, selectStatus]);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQueue(query);
  };

  const handleCancelClick = () => {
    setSearchQueue("");
    setSelectedDepartment(null);
    setSelectStatus(null);
    setPage(1);
    setPageData(queueList.slice(0, pageSize));
  };

  
  const getDepartmentOptions = () => {
    const departments = Array.from(
      new Set(queueList.map((queueLists) => queueLists.department_name))
    );
    return departments.map((department) => ({
      value: department,
      label: department,
    }));
  };

  const handleSearchSelectChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };
  const handleStatusSelectChange = (selectedOption) => {
    setSelectStatus(selectedOption);
  };

  const getStatusOptions = () => {
    const statuses = Array.from(
      new Set(queueList.map((queueLists) =>queueLists.queue_status_name))
    );
    return statuses.map((status) => ({
      value: status,
      label: status,
    }));
  };

 



  return (
    <div>
        <div className="row">
        <div className="col-5 col-md-2 col-lg-3">
          <label>ค้นหา</label>
          <input
            id="searchQueue_symptom"
            type="text"
            name="symptom"
            className="form-control"
            placeholder="Search..."
            value={searchQueue}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-12 col-md-3 col-lg-3">
          <label>ค้นหาแผนก</label>
          <Select
            id="search_selectedDepartment"
            name="department_name"
            value={selectedDepartment}
            options={getDepartmentOptions()}
            onChange={handleSearchSelectChange}
            placeholder="ค้นหาด้วยชื่อแผนก..."
            isClearable={true}
          />
        </div>
        <div className="col-12 col-md-3 col-lg-2">
          <label>สถานะการใช้งาน </label>
          <Select
            id="search_selectStatus"
            name="queue_status_name"
            value={selectStatus}
            options={getStatusOptions()}
            onChange={handleStatusSelectChange}
            placeholder="ค้นหาด้วยสถานะ..	"
            isClearable={true}
          />
        </div>
        <div className="col-12 col-lg-3 pt-4">
          <button
          id="button_CancelClick"
            type="button"
            name="cancelClick"
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
            class="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        
      </div>
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr className="table-success">
              <th scope="col" style={{ width: "5%", textAlign: "center" }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: "5%", textAlign: "center" }}>
                ลำดับคิวที่
              </th>
              <th scope="col" style={{ width: "5%", textAlign: "center" }}>
               รหัสผู้ใช้
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

              <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                สถานะ
              </th>
              <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                จัดการ
              </th>
            </tr>
          </thead>

          <tbody>
  {pageData.map((queue, index) => (
    <tr key={queue.id}>
      <td style={{ textAlign: "center" }}>{(page - 1) * 10 + index + 1}</td>
      <td style={{ textAlign: "center" }}>{queue.queue_id}</td>
      <td style={{ textAlign: "center" }}>{queue.users_id}</td>
      <td style={{ textAlign: "center" }}>{queue.symptom}</td>
      <td style={{ textAlign: "center" }}>{queue.department_name}</td>
      <td style={{ textAlign: "center" }}>{queue.queue_date}</td>
      <td style={{ textAlign: "center" }}>{queue.create_at}</td>
      <td style={{ textAlign: "center" }}>{queue.queue_status_name}</td>
    </tr>
  ))}
</tbody>


          
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <div>จำนวน {queueList.length} รายการ</div>
        <div>
          <div className="Pagination">
            <Pagination
              activePage={page}
              itemsCountPerPage={10}
              totalItemsCount={queueList.length}
              pageRangeDisplayed={10}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowData;
