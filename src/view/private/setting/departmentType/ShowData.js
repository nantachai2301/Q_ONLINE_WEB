
import React, { useRef, useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";

function ShowData({ pagin, changePage, changePageSize }) {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchDepartment, setSearchDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const getDepartments = async () => {
    const response = await axios.get("http://localhost:5000/apis/departments");
    setDepartments(response.data);
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  useEffect(() => {
    const pagedatacount = Math.ceil(departments.length / 10);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);
      const dataToDisplay = searchDepartment
        ? departments.filter(
          (departments) =>
            departments.department_name
              .toLowerCase()
              .includes(searchDepartment.toLowerCase())

        )

        : departments.slice(skip, skip + LIMIT);

      setPageData(dataToDisplay);
    }
  }, [departments, page, pageSize, searchDepartment]);
  useEffect(() => {
    if (selectedDepartment) {
      const selectedDepartmentData = departments.filter(
        (departments) => departments.department_name === selectedDepartment.value
      );
      if (selectedDepartmentData.length > 0) {
        setPage(1);
        setPageData(selectedDepartmentData);
      }
    } else {
      setPageData(departments.slice(0, pageSize));
    }
  }, [selectedDepartment, departments, pageSize]);

  const getDepartmentOptions = () => {
    const department = Array.from(new Set(departments.map((department) => department.department_name)));
    return department.map((department) => ({
      value: department,
      label: department,
    }));
  };

  const handleSearchSelectChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };

  const handleCancelClick = () => {
    setSelectedDepartment(null);
    setPage(1);
    setPageData(departments);
  };

  const loadEdit = (id) => {
    navigate("/admin/edit-department/form/" + id);
  };

  const removeEmp = (department_id) => {
    Swal.fire({
      title: "ยืนยัน การลบ",
      text: "คุนต้องการลบ แผนก?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("http://localhost:5000/apis/departments/" + department_id)
          .then((res) => {
            Swal.fire({
              title: "ลบ",
              text: "แผนกถูกลบ.",
              icon: "สำเร็จ",
              timer: "1500"
            });
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "เกิดข้อผิดพลาดขณะลบแผนก.",
              icon: "error",
              timer: "1500"
            });
          });
      }
    });
  };


  return (
    <div className="w-full">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <i className="fa-solid fa-magnifying-glass mx-1"></i>
          <label>ค้นหา</label>
          <Select
            value={selectedDepartment}
            options={getDepartmentOptions()}
            onChange={handleSearchSelectChange}
            placeholder="ค้นหาด้วยชื่อแผนก..."
            isClearable={true}
          />
        </div>
        <div className="col-12 col-lg-8 pt-4">
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
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              navigate("/admin/department/form/");
            }}
          >
            <i className="fa-solid fa-plus mx-1"></i>
            เพิ่ม
          </button>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr className="table-primary">
              <th scope="col" style={{ width: '5%' }}>
                ลำดับที่
              </th>

              <th scope="col" style={{ width: '10%' }}>
                รูปภาพแผนก
              </th>

              <th scope="col" style={{ width: '10%' }}>
                ชื่อแผนก
              </th>

              <th scope="col" style={{ width: '10%' }}>
                เวลาเปิด
              </th>

              <th scope="col" style={{ width: '10%' }}>
                เวลาปิด
              </th>

              <th scope="col" style={{ width: '5%' }}>
                อาคาร
              </th>

              <th scope="col" style={{ width: '5%' }}>
                ชั้น
              </th>

              <th scope="col" style={{ width: '10%' }}>
                เบอร์โทรแผนก
              </th>

              <th scope="col" style={{ width: '10%' }}>
                จำนวนคิวสูงสุด
              </th>


              <th scope="col justify-content-center" style={{ width: '15%' }}>
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => {
                return (
                  <tr key={item.department_id}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    {/* <td> */}
                    <td><img className="img-d" src={item.department_image} /></td>
                    {/* </td> */}
                    <td>{item.department_name}</td>

                    <td>{item.open_time}</td>
                    <td>{item.close_time}</td>
                    <td>{item.building}</td>
                    <td>{item.floor}</td>
                    <td>{item.department_phone}</td>
                    <td>{item.max_queue_number}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-warning text-white mx-1 mt-1"
                        onClick={() => {
                          loadEdit(item.department_id);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger text-white mx-1 mt-1"
                        onClick={() => {
                          removeEmp(item.department_id);
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
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
      <div className="d-flex justify-content-between">
        <div>จำนวน {departments.length} รายการ</div>
        <div>
          <div className="Pagination">
            <Pagination

              activePage={page}
              itemsCountPerPage={10}
              totalItemsCount={departments.length}
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