import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import de from "date-fns/esm/locale/de";
import {
  getDepartment,
  deleteDepartmentById,
} from "../../../../service/DepartmentType.Service";
import "../../../../style/showdepartments.css";

function ShowData() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchDepartment, setSearchDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    getDepartment()
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Departments: ", error);
      });
  }, []);

  useEffect(() => {
    const filteredDepartments = departments.filter((department) => {
      const nameFilter = department.department_name
        .toLowerCase()
        .includes(searchDepartment.toLowerCase());

      const departmentFilter =
        !selectedDepartment ||
        department.department_name === selectedDepartment.value;

      return nameFilter && departmentFilter;
    });

    const pagedatacount = Math.ceil(filteredDepartments.length / pageSize);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);
      setPageData(filteredDepartments.slice(skip, skip + LIMIT));
    }
  }, [departments, page, pageSize, searchDepartment, selectedDepartment]);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchDepartment(query);
  };

  const handleCancelClick = () => {
    setSearchDepartment("");
    setSelectedDepartment(null);
    setPage(1);
    setPageData(departments.slice(0, pageSize));
  };

  const getDepartmentOptions = () => {
    const department = Array.from(
      new Set(departments.map((departments) => departments.department_name))
    );
    return departments.map((department) => ({
      value: department,
      label: department,
    }));
  };

  const handleSearchSelectChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };

  const loadEdit = (id) => {
    navigate("/admin/edit-department/form/" + id);
  };

  const handleDeleteDepartment = (department_id) => {
    Swal.fire({
      title: "ต้องการลบข้อมูลแแผนกนี้หรือไม่ ?",
      text: "เมื่อรายการแผนกนี้ถูกลบ คุณจะไม่สามาถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDepartmentById(department_id)
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "ลบข้อมูลแผนกสำเร็จ",
              showConfirmButton: false,
              timer: 1700,
            });
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "เกิดข้อผิดพลาดขณะลบข้อมูลแผนก.",
              icon: "error",
              timer: "1500",
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
          <label>ค้นหาแผนก</label>
          <Select
            id="DeselectedDepartment"
            value={selectedDepartment}
            options={getDepartmentOptions()}
            onChange={handleSearchSelectChange}
            placeholder="ค้นหาด้วยชื่อแผนก..."
            isClearable={true}
          />
        </div>
        <div className="col-12 col-lg-8 pt-4">
          <button
            id="DehandleCancelClickt"
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
            id="DepageSize"
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
            id="department_create"
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
              <th scope="col" style={{ width: "5%" }}>
                ลำดับที่
              </th>

              <th scope="col" style={{ width: "10%" }}>
                รูปภาพแผนก
              </th>

              <th scope="col" style={{ width: "10%" }}>
                ชื่อแผนก
              </th>

              <th scope="col" style={{ width: "10%" }}>
                เวลาเปิด
              </th>

              <th scope="col" style={{ width: "10%" }}>
                เวลาปิด
              </th>

              <th scope="col" style={{ width: "5%" }}>
                อาคาร
              </th>

              <th scope="col" style={{ width: "5%" }}>
                ชั้น
              </th>

              <th scope="col" style={{ width: "10%" }}>
                เบอร์โทรแผนก
              </th>

              <th scope="col" style={{ width: "10%" }}>
                จำนวนคิวสูงสุด
              </th>

              <th scope="col justify-content-center" style={{ width: "15%" }}>
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
                    <td>
                      <img className="img-d" src={item.department_image} />
                    </td>
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
                        id="department_edit"
                        type="button"
                        className="btn btn-warning text-white mx-1 mt-1"
                        onClick={() => {
                          loadEdit(item.department_id);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        id="department_delete"
                        type="button"
                        className="btn btn-danger text-white mx-1 mt-1"
                        onClick={() => {
                          handleDeleteDepartment(item.department_id);
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          จำนวน {pageData.length} รายการ จากทั้งหมด {departments.length} รายการ
        </div>
        <div>
          <div className="Pagination"id="DePagination">
            <Pagination
              
              activePage={page}
              itemsCountPerPage={pageSize}
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
