import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import Schema from "./Validation";
import * as Yup from 'yup';

import {
  getDepartmentById,
  updateDepartmentById,
} from "../../../../../service/DepartmentType.Service";

function EditDepartment() {
  const location = useLocation();
  const [department, setDepartment] = useState({
    department_id: "",
    department_name: "",
    department_image: "",
    open_time: "",
    close_time: "",
    max_queue_number: "",
    floor: "",
    building: "",
    department_phone: "",
  });
  const { department_id } = useParams();

  useEffect(() => {
    getDepartmentById(department_id)
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments: ", error);
      });
  }, []);

  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async () => {
    try {
      const isValid = await Schema.isValid(department);
      if (!isValid) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ถูกต้อง",
          text: "กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน",
          showConfirmButton: true,
        });
        return;
      }

      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่ ว่าต้องการจะอัพเดทข้อมูลรายชื่อแผนก ?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) { 
        const response = await updateDepartmentById(
          department.department_id,
          department.department_name,
          department.department_image,
          department.open_time,
          department.close_time,
          department.max_queue_number,
          department.floor,
          department.building,
          department.department_phone,
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "อัพเดตข้อมูลแผนกสำเร็จ",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/admin/department-type");
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลแผนก",
            text: "กรุณาลองอีกครั้ง",
            showConfirmButton: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลแผนก",
        showConfirmButton: true,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const maxWidth = 200;
          const maxHeight = 200;
          const newWidth = img.width > maxWidth ? maxWidth : img.width;
          const newHeight = (newWidth / img.width) * img.height;

          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          canvas.toBlob(async (blob) => {
            const resizedImageURL = window.URL.createObjectURL(blob);
            console.log('Resized Image URL:', resizedImageURL);

            setDepartment((prevDepartment) => ({
              ...prevDepartment,
              department_image: resizedImageURL, // กำหนด URL รูปภาพใหม่ใน state
            }));
          }, 'image/jpeg', 0.8);
        };
      };
      reader.readAsDataURL(file);
    }
  };
  console.log('department_image:', department.department_image); // ตรวจสอบค่าของ department_image



  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/admin/department-type" className="nav-breadcrumb">
                  ข้อมูลแผนกและการตรวจรักษา
              </Link>

              </li>
              <li
                className="breadcrumb-item text-black fw-semibold"
                aria-current="page"
              >
                {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อแผนกและการตรวจรักษา
            </li>

            </ol>

          </nav>

        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อแผนกและการตรวจรักษา
        </h2>
        </div>

        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          initialValues={department}
          onSubmit={handleClick}
        >
          {({ errors, touched }) => (
            <div className="row d-flex justify-content-center">
              <div className='UpdateDepart col-12 col-md-4 col-lg-8 border-1 shadow p-3' >
                <div className="col-12 text-center align-items-center">
                  <label>เลือกรูปภาพหมอ</label> <br />
                  <br />
                  <div className=" d-flex flex-column justify-content-center align-items-center">
                    <img
                      className="img-hpts mx-auto"
                      src={department.department_image}
                      alt="รูปภาพแผนก"
                    />

                    <br />
                    <br />
                  </div>
                </div>

                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div class="col-10 col-md-6 ">
                    <input
                      id="Depart_department_image"
                      type="file"
                      name="department_image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageChange}
                    />


                  </div>
                </div>
                <br />
                <br />
                <form class="row g-3 d-flex justify-content-center ">
                  <div className="col-10 col-md-6 ">
                    <label>ชื่อแผนก</label>
                    <label className="red">*</label>
                    <input
                      id="Depart_department_id"
                      name="department_id"
                      type="text"
                      value={department.department_name}
                      className={`form-control ${touched.department_id &&
                        errors.department_id
                        ? "is-invalid"
                        : ""
                        }`}
                      onChange={handleChange}
                    />
                     
                    <ErrorMessage
                      name="department_id"
                      component="div"
                      className="error-message"
                    />

                  </div>

                  <div className="col-10 col-md-6 ">
                    <label>เวลาเปิด</label>
                    <label className="red">*</label>
                    <input
                      id="Depart_open_time"
                      name="open_time"
                      type="time"
                      placeholder="กรอกเวลาเปิด"
                      value={department.open_time}
                      className={`form-control ${touched.open_time &&
                        errors.open_time &&
                        "is-invalid"
                        }`}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="open_time"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="col-10 col-md-6 ">
                    <label>เวลาปิด</label>
                    <label className="red">*</label>
                    <input
                      id="Depart_close_time"
                      name="close_time"
                      type="time"
                      placeholder="เวลาปิด"
                      value={department.close_time}
                      className={`form-select ${touched.close_time &&
                        errors.close_time &&
                        "is-invalid"
                        }`}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="close_time"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="col-10 col-md-6 ">
                    <label>อาคาร</label>
                    <label className="red">*</label>
                    <input
                      id="Depart_building"
                      name="building"
                      type="text"
                      placeholder="กรอกอาคาร"
                      value={department.building}
                      className={`form-control ${touched.building &&
                        errors.building &&
                        "is-invalid"
                        }`}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="building"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="col-10 col-md-6 ">
                    <label>ชั้น</label>
                    <label className="red">*</label>
                    <input
                      id="Depart_floor"
                      name="floor"
                      type="text"
                      placeholder="ชั้น"
                      value={department.floor}
                      className={`form-control ${touched.floor &&
                        errors.floor &&
                        "is-invalid"
                        }`}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="floor"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="col-10 col-md-6 ">
                    <label>เบอร์โทรแผนก</label>
                    <label className="red">*</label>
                    <input
                      id="Depart_department_phone"
                      name="department_phone"
                      type="text"
                      placeholder="เบอร์โทรแผนก"
                      value={department.department_phone}
                      className={`form-control ${touched.department_phone &&
                        errors.department_phone &&
                        "is-invalid"
                        }`}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="department_phone"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="col-10 col-md-6 ">
                    <label>จำนวนคิวสูงสุด</label>
                    <label className="red">*</label>
                    <input
                      id="Depart_max_queue_number"
                      name="max_queue_number"
                      type="text"
                      placeholder="จำนวนคิวสูงสุด"
                      value={department.max_queue_number}
                      className={`form-control ${touched.max_queue_number &&
                        errors.max_queue_number &&
                        "is-invalid"
                        }`}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="max_queue_number"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div class="col-10 col-md-6 "></div>
                </form>

                <div className="d-flex justify-content-center mt-3">
                  <button
                    id="Depart_Creatsebmit"
                    type="submit"
                    className="btn btn-success mx-1"
                    onClick={handleClick}
                  >
                    บันทึก
                  </button>
                  <button className="btn btn-danger mx-1">
                    <Link
                      id="Depart_Canclesebmit"
                      to="/admin/department-type"
                      style={{ textDecoration: "none", color: "#fff" }}
                    >
                      ยกเลิก
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </Fragment>
  )
}

export default EditDepartment