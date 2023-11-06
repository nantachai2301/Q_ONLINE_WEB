import React, { useRef, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import { format } from "date-fns";
import { getQueue } from "../../../service/Queue.Service";

function ShowData({}) {
  const [dataQ, setDataQ] = useState([]);
  console.log(dataQ);
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchDate, setSearchDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getdataQ = async () => {
    const response = await getQueue();
    const filteredData = response.data.filter((item) => item.queue_status_id === 4);
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
    const currentDate = new Date();
    const formattedCurrentDate = format(currentDate, "dd-MM-yyyy");
  
    const filteredData = filterDataBySearchAndDate(
      dataQ,
      searchDate,
      formattedCurrentDate
    );
  
    const pagedatacount = Math.ceil(filteredData.length / pageSize);
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
  
        return nameFilter && departmentFilter && filterDataBySearchAndDate;
      });
  
      const sortedData = dataToDisplay
        .slice()
        .sort((a, b) => a.queue_id - b.queue_id);
  
      const pageStartIndex = skip >= sortedData.length ? 0 : skip;
      const pageEndIndex = Math.min(
        pageStartIndex + LIMIT,
        sortedData.length
      );
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
    setSearchDate(format(new Date(), "yyyy-MM-dd"));
    setPage(1);
    setSelectedDepartment("");
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

  return (
    <div className="w-full">
      <div className="row justify-content-start mb-2">
        <div className="col-5 col-md-2 col-lg-3">
          <label>ค้นหา</label>
          <input
            id="H_MainSearch"
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
            id="H_MainSearch_date"
            name="queue_date"
            type="date"
            className="form-control"
            value={searchDate}
            onChange={handleDateSearch}
          />
        </div>
        <div className="col-5 col-md-2 col-lg-3">
         
          <label>ค้นหาแผนก</label>
          <Select
          id="H_Search_Department"
          name="department_name"
          value={selectedDepartment}
          options={getDepartmentOptions()}
          onChange={handleSearchSelectChange}
          placeholder="เลือกแผนก..."
          isClearable={true}
        />
        </div>
        <div className="col-3 col-lg-3 pt-4">
          <button
            id="H_MainSearch_button"
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
            id="HpageSize"
            class="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            
          </select>
        </div>
       
      </div>

      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr className="table-success">
              <th scope="col" style={{ width: "2%", textAlign: "center" }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: "3%", textAlign: "center" }}>
                คิวที่
              </th>
              <th scope="col" style={{ width: "15%", textAlign: "center" }}>
                ชื่อ-สกุล
              </th>
              
              <th scope="col" style={{ width: "8%", textAlign: "center" }}>
                แผนก
              </th>
              <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                วันที่จอง
              </th>
              <th scope="col" style={{ width: "15%", textAlign: "center" }}>
                เวลาที่จอง
              </th>
              <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                สถานะคิว
              </th>
              
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData

                .slice()
                .sort((a, b) => a.queue_id - b.queue_id)
                .map((item, index) => {
                  return (
                    <tr key={item.users_id}>
                      <td>{(page - 1) * 10 + index + 1}</td>
                      <td style={{ textAlign: "center" }}>{item.queue_id}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.prefix_name} {item.first_name} {item.last_name}
                      </td>
                     
                      <td style={{ textAlign: "center" }}>
                        {item.department_name}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.queue_date}</td>
                      <td style={{ textAlign: "center" }}>{item.create_at}</td>
                      <td style={{ textAlign: "center" }}><span className={`text-${"warning" }`}> {item.queue_status_name}  </span></td>

                      
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

export default ShowData;
