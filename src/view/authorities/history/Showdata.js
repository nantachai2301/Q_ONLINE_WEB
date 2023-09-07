import React, { useRef, useState, useEffect } from "react";
import Pagination from "react-js-pagination";
// import { useReactToPrint } from 'react-to-print';
import MainPdf from "../history/pdf/MainPdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";

function ShowData({ data, pagin, changePage, changePageSize, updateStatusBook, deleteData }) {
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
  

  const handleCancelClick = () => {
  setSearchUsers("");
    
    setPageData(dataQ.slice(0, pageSize));
  };

const removeEmp =(queue_id)=>{
  if(window.confirm("คุณต้องการลบคิวนี้หรือไม่?")){
    axios.delete("http://localhost:5000/apis/queue/"+ queue_id)
    .then((res)=>{
      alert("Remove successfully.")
      window.location.reload()
    })
  }
}
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
              <th scope="col" style={{ width: '20%' }}>
              ชื่อ-สกุล
              </th>
              <th scope="col" style={{ width: '20%' }}>
              อาการเบื้องต้น
              </th>
              <th scope="col" style={{ width: '5%' }}>
              แผนก
              </th>
              <th scope="col" style={{ width: '15%' }}>
              วันที่จอง
              </th>
              <th scope="col" style={{ width: '10%' }}>
              วันที่เข้าการรับรักษา
              </th>             
              <th scope="col" style={{ width: '5%' }}>
              สถานะคิว
              </th>
            </tr>
          </thead>
          <tbody>
          {pageData.length > 0 ? (
              pageData.map((item, index) => {
                return (
                  <tr key={item.queue_id}>
                    <td>{item.first_name} {item.last_name}</td>
                    <td>{item.symptom}</td>
                      <td>{item.department_name}</td>
                      <td>{item.create_at}</td>
                      <td>{item.queue_date}</td>                     
                      <td>{item.queue_status_name}</td>
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