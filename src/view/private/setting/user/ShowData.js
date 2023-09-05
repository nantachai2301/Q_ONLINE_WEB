import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Table from "react-bootstrap/Table";
function ShowData() {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRoleId, setSelectedRoleId] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  const getUser = async () => {
    const response = await axios.get(
      "http://localhost:5000/apis/patients"
    );
    setUser(response.data);
  };

  useEffect(() => {
    getUser();
  }, []);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  useEffect(() => {
    const filteredData = user.filter((item) => {
      const isMatchingRoleId = selectedRoleId === "" || item.role_id.toString() === selectedRoleId;
      const isMatchingSearchQuery =
        item.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phoneNumber.includes(searchQuery) ||
        item.id_card.includes(searchQuery);
  
      return (item.role_id === 0 || item.role_id === 1) && isMatchingRoleId && isMatchingSearchQuery;
    });
  
    const pagedatacount = Math.ceil(filteredData.length / pageSize);
    setPageCount(pagedatacount);
  
    const LIMIT = pageSize;
    const skip = LIMIT * (page - 1);
    const dataToDisplay = filteredData.slice(skip, skip + LIMIT);
  
    setPageData(dataToDisplay);
  }, [user, page, pageSize, selectedRoleId, searchQuery]);
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };
  
  const handleCancelClick = () => {
    setSearchQuery("");
    setSelectedRoleId("")
    setPage(1);
    setPageData(user);
  };
  const loadEdit = (id) => {
    navigate("/admin/user/form/" + id);
  };

  const removeEmp = (users_id) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Do you want to delete this doctor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "http://localhost:5000/apis/patients/" + users_id
          )
          .then((res) => {
            Swal.fire({
              title: "Deleted",
              text: "The users has been deleted.",
              icon: "success",
              timer: "1500",
            });
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "An error occurred while deleting the users.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div className="w-full">
    <div className="row justify-content-start mb-2">
      <div className="col-2 col-md-3 col-lg-4">
          <i className="fa-solid fa-magnifying-glass mx-1"></i>
          <label>ค้นหา</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-3 col-lg-3 pt-4">
          {/* ส่วนของการเลือกค่า role_id */}
          <select
            className="form-select"
            value={selectedRoleId}
            
            onChange={(e) => setSelectedRoleId(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            <option value="0">ผู้ใช้ไม่มีบัญชีในระบบ </option>
            <option value="1">ผู้ใช้ที่มีบัญชีในระบบ</option>
          </select>
        </div>
        <div className="col-3 col-lg-3 pt-4">
          <button
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
            type="button"
            className="btn btn-success"
            onClick={() => {
              navigate("/admin/user/create/form");
            }}
          >
            <i className="fa-solid fa-plus mx-1"></i>
            เพิ่ม
          </button>
        </div>
      </div>
      <div className="overflow-auto">
        <Table className="table">
          <thead>
            <tr className="table-primary">
              <th scope="col" style={{ width: "1%" }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: "3%" }}>
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
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => {
                if (item.role_id === 1 || item.role_id === 0) {
                const userBirthdate = new Date(item.birthday); // ตั้งค่าวันเกิดของผู้ใช้งานในรูปแบบ Date

                const today = new Date();
                const birthdateYear = userBirthdate.getFullYear();
                const birthdateMonth = userBirthdate.getMonth();
                const birthdateDay = userBirthdate.getDate();
       
                
                const age = today.getFullYear() - birthdateYear - (today.getMonth() < birthdateMonth || (today.getMonth() === birthdateMonth && today.getDate() < birthdateDay) ? 1 : 0);
                return (
                  <tr key={item.users_id}>
                    <td>{index + 1}</td>
                    <td>{item.id_card}</td>
                    <td>{item.prefix_name}{" "}{item.first_name}{" "}{item.last_name}</td>
                    <td>{item.gender}</td>
                    <td>{age} ปี</td> 
                    <td>{item.phoneNumber}</td>
                   

                    <td>
                      <button
                        type="button"
                        className="btn btn-warning text-white mx-1 mt-1"
                        onClick={() => {
                          loadEdit(item.users_id);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger text-white mx-1 mt-1"
                        onClick={() => {
                          removeEmp(item.users_id);
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
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
      <div className="d-flex justify-content-between">
        <div>จำนวน {pageData.length} รายการ</div>
        <div>
          <Pagination
            activePage={page}
            itemsCountPerPage={pageSize} 
            totalItemsCount={pageData.length}
            pageRangeDisplayed={5}
            onChange={setPage}
            
          />
        </div>
      </div>
    </div>
  );
}

export default ShowData;
