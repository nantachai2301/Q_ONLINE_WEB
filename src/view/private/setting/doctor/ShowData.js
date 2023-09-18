import React, { useState, useEffect } from "react";
import Select from "react-select";
import Pagination from "react-js-pagination";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import Swal from "sweetalert2";
import Table from "react-bootstrap/Table";
import {
  getDoctor,
  updateStatusDoctor,
  deleteDoctorById,
} from "../../../../service/Doctor.Service";
import "../../../../style/showdoctor.css";

function ShowData() {
  let navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchDoctor, setSearchDoctor] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectStatus, setSelectStatus] = useState(null);
  const [lockedDoctors, setLockedDoctors] = useState([]);

  useEffect(() => {
    getDoctor()
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors: ", error);
      });
  }, []);
  useEffect(() => {
    const filteredDoctors = doctors.filter((doctor) => {
      const nameFilter =
        doctor.doctor_first_name
          .toLowerCase()
          .includes(searchDoctor.toLowerCase()) ||
        doctor.doctor_last_name
          .toLowerCase()
          .includes(searchDoctor.toLowerCase());

      const departmentFilter =
        !selectedDepartment ||
        doctor.department_name === selectedDepartment.value;
      const statusFilter =
        !selectStatus || doctor.doctor_status === selectStatus.value;

      return nameFilter && departmentFilter && statusFilter;
    });

    const pagedatacount = Math.ceil(filteredDoctors.length / pageSize);
    setPageCount(pagedatacount);

    if (page) {
      const LIMIT = pageSize;
      const skip = LIMIT * (page - 1);
      setPageData(filteredDoctors.slice(skip, skip + LIMIT));
    }
  }, [doctors, page, pageSize, searchDoctor, selectedDepartment, selectStatus]);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchDoctor(query);
  };

  const handleCancelClick = () => {
    setSearchDoctor("");
    setSelectedDepartment(null);
    setSelectStatus(null);
    setPage(1);
    setPageData(doctors.slice(0, pageSize));
  };

  const getDepartmentOptions = () => {
    const departments = Array.from(
      new Set(doctors.map((doctor) => doctor.department_name))
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
      new Set(doctors.map((doctor) => doctor.doctor_status))
    );
    return statuses.map((status) => ({
      value: status,
      label: status,
    }));
  };
  const loadEdit = (id) => {
    navigate("/admin/doctor/form/" + id);
  };
  const handleDeleteDoctor = (doctorId) => {
  
    Swal.fire({
      title:  `ลบรายการแพทย์นี้หรือไม่ ? `,
      text: "เมื่อรายการแพทย์ถูกลบ คุณจะไม่สามาถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDoctorById(doctorId)
          .then((response) => {
            Swal.fire({
              icon: 'success',
              title: 'ลบข้อมูลแพทย์สำเร็จ',
              showConfirmButton: false,
              timer: 1700,
            });
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "เกิดข้อผิดพลาดขณะลบข้อมูลแพทย์.",
              icon: "error",
              timer: 1500,
            });
          });
      }
    });
  };
  const changeStatus = (
    doctors_id,
    currentStatus,
    prefix_name,
    doctor_first_name,
    doctor_last_name,
    doctor_image,
    doctor_status,
    department_id,
    department_name
  ) => {
    const newStatus = currentStatus === "ใช้งาน" ? "พักงาน" : "ใช้งาน";

    Swal.fire({
      title: `คุณต้องการอัพเดทสถานะรายการนี้ใช่หรือไม่  ?`,
      text: `อัพเดทสถานะเป็น ${newStatus}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        // เรียกใช้งานฟังก์ชันเพื่ออัพเดทสถานะ
        updateStatusDoctor(
          doctors_id,
          prefix_name,
          doctor_first_name,
          doctor_last_name,
          doctor_image,
          newStatus,
          department_id,
          department_name
        )
          .then((response) => {
            Swal.fire({
              title: "อัพเดทสถานะสำเร็จ",
              text: `สถานะได้เปลี่ยนเป็น ${newStatus}`,
              icon: "success",
              timer: 1700,
            });
            // รีเฟรชหน้าเพื่อแสดงสถานะใหม่
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: "เกิดข้อผิดพลาดในขณะที่เปลี่ยนสถานะ",
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
            id="SearchDoc"
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchDoctor}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-12 col-md-3 col-lg-3">
          <label>ค้นหาแผนก</label>
          <Select
           id="SearchDepartDoc"
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
          id="SearchselectStatus"
            value={selectStatus}
            options={getStatusOptions()}
            onChange={handleStatusSelectChange}
            placeholder="ค้นหาด้วยสถานะ..	"
            isClearable={true}
          />
        </div>
        <div className="col-12 col-lg-3 pt-4">
          <button
            id="SearchhandleCancelClicks"
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
            id="DpageSize"
            class="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          <button
            id="doctor_create"
            type="button"
            className="btn btn-success"
            onClick={() => {
              navigate("/admin/doctor/create/form/");
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
              <th scope="col" style={{ width: "5%" }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: "5%" }}>
                รูปภาพ
              </th>
              <th scope="col" style={{ width: "15%" }}>
                ชื่อ-นามสกุล
              </th>
              <th scope="col" style={{ width: "10%" }}>
                แผนก
              </th>
              <th scope="col" style={{ width: "10%" }}>
                สถานะการใช้งาน
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
                  <tr key={item.doctor_id}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td>
                      <img className="img-d" src={item.doctor_image} />
                    </td>
                    <td>
                      {item.prefix_name} {item.doctor_first_name}{" "}
                      {item.doctor_last_name}
                    </td>

                    <td>{item.department_name}</td>

                    <td>
                      <span
                        className={
                          item.doctor_status === "ใช้งาน"
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {item.doctor_status}
                      </span>
                    </td>

                    <td>
                      <button
                      id="doctor_edit"
                        type="button"
                        className="btn btn-warning text-white mx-1 mt-1"
                        onClick={() => {
                          loadEdit(item.doctor_id);
                        }}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                       id="doctor_status"
                        type="button"
                        className={`btn mx-1 mt-1 ${
                          item.doctor_status === "ใช้งาน"
                            ? "btn-success"
                            : "btn-danger"
                        }`}
                        onClick={() =>
                          changeStatus(
                            item.doctor_id,
                            item.doctor_status,
                            item.prefix_name,
                            item.doctor_first_name,
                            item.doctor_last_name,
                            item.doctor_image,
                            item.doctor_status,
                            item.department_id,
                            item.department_name
                          )
                        }
                      >
                        {item.doctor_status === "ใช้งาน" ? (
                          <i className="fa-solid fa-lock-open btn-success"></i>
                        ) : (
                          <i className="fa-solid fa-lock btn-danger"></i>
                        )}{" "}
                      </button>

                      <button
                         id="doctor_Delete"
                        type="button"
                        className="btn btn-danger text-white mx-1 mt-1"
                        onClick={() => {
                          handleDeleteDoctor(item.doctor_id);
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
        </Table>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          จำนวน {pageData.length} รายการ จากทั้งหมด {doctors.length} รายการ
        </div>
        <div>
          <div className="Pagination">
            <Pagination
             id="DPagination"
              activePage={page}
              itemsCountPerPage={pageSize}
              totalItemsCount={doctors.length}
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
