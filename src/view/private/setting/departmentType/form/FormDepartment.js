import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import Hospitals from "../../../../../image/hospitals.jpg";
import Schema from "./Validation";
import Swal from 'sweetalert2';
import { createDepartment } from "../../../../../service/DepartmentType.Service";
import * as Yup from 'yup';


function FormDepartment() {
  const location = useLocation();
  const [departments, setDepartments] = useState({
    department_id: null,
    department_name: "",
    department_image: "",
    open_time: "08:00",
    close_time: "",
    max_queue_number: "",
    floor: "",
    building: "",
    department_phone: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setDepartments((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

            setDepartments((prevDepartments) => ({
              ...prevDepartments,
              department_image: resizedImageURL, // กำหนด URL รูปภาพใหม่ใน state
            }));
          }, 'image/jpeg', 0.8);
        };
      };
      reader.readAsDataURL(file);
    }
  };


  console.log('department_image:', departments.department_image); // ตรวจสอบค่าของ department_image

  const handleClick = async (e) => {
    e.preventDefault();

    const formValid = validateForm(); // เช็คว่าฟอร์มถูกต้องหรือไม่

    if (!formValid) {
      // ถ้าฟอร์มไม่ถูกต้อง แสดง SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง !',
        showConfirmButton: true,
      });
      return;
    }


    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่ ว่าต้องการสร้างข้อมูลรายชื่อแผนก ?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
      });

      if (result.isConfirmed) {
        // ทำการอัปเดตข้อมูลแผนก
        await createDepartment(
          departments.department_id,
          departments.department_name,
          departments.department_image,
          departments.open_time,
          departments.close_time,
          departments.max_queue_number,
          departments.floor,
          departments.building,
          departments.department_phone,
        );
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มข้อมูลแผนกสำเร็จ !',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/admin/department-type");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลแผนกและการตรวจรักษา',
        showConfirmButton: true,
      });
    }
  };

  // เขียนฟังก์ชันสำหรับตรวจสอบความถูกต้องของฟอร์ม
  // เพิ่มเงื่อนไขใน validateForm ในส่วนของเบอร์โทรแผนก
  const validateForm = () => {
    const {
      department_name,
      open_time,
      close_time,
      max_queue_number,
      floor,
      building,
      department_phone,
    } = departments;

    // ตรวจสอบว่ามีข้อมูลทุกช่องหรือไม่
    if (
      !department_name ||
      !open_time ||
      !close_time ||
      !max_queue_number ||
      !floor ||
      !building ||
      !department_phone
    ) {
      // แสดง SweetAlert แจ้งให้กรอกข้อมูลเบอร์โทรแผนกให้ครบถ้วน
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลเบอร์โทรแผนกให้ครบถ้วน',
        showConfirmButton: true,
      });
      return false;
    }
    // เพิ่มเงื่อนไขตรวจสอบความถูกต้องของข้อมูลอื่น ๆ ตามความต้องการ
    // ตรวจสอบเวลาเปิด-ปิดว่าเป็นรูปแบบเวลาที่ถูกต้องหรือไม่
    // ตรวจสอบรูปภาพแผนกว่ามีหรือไม่
    // เพิ่มเงื่อนไขตรวจสอบความถูกต้องของเบอร์โทร
    if (!/^\d{10}$/.test(department_phone)) {
      // แสดง SweetAlert แจ้งให้กรอกเบอร์โทรแผนกให้ถูกต้อง
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกเบอร์โทรแผนกให้ถูกต้อง (10 หลักและเป็นตัวเลขเท่านั้น)',
        showConfirmButton: true,
      });
      return false;
    }
    // ถ้าผ่านทุกเงื่อนไขให้ส่งค่า true
    return true;
  };

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
                {location.state ? "แก้ไข" : "เพิ่ม"}ข้อมูลแผนกและการตรวจรักษา
              </li>

            </ol>

          </nav>

        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "เพิ่ม"}ข้อมูลแผนกและการตรวจรักษา
          </h2>
        </div>

        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          initialValues={departments}
          onSubmit={handleClick}
        >
          {({ errors, touched, }) => (
            <form encType='multipart/form-data'>
              <div className="row d-flex justify-content-center">
                <div className='UpdateDepart col-12 col-md-4 col-lg-8 border-1 shadow p-3' >
                  <div className="col-12 text-center align-items-center">
                    <label>เลือกรูปภาพแผนก</label> <br />
                    <br />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      {departments.department_image ? (
                        <img
                          className="img-hpts mx-auto"
                          src={departments.department_image}
                          alt="Departments"
                        />
                      ) : (
                        <img
                          className="img-hpts mx-auto"
                          src={Hospitals}
                          alt="Default Departments"
                        />
                      )}
                      <br />
                      <br />
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div class="col-10 col-md-6 ">
                      <input
                        id="department_createdepartment_image"
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
                        name="department_name"
                        type="text"
                        placeholder="กรุณากรอกชื่อแผนก"
                        value={departments.department_name}
                        className={`form-control ${touched.department_name &&
                          errors.department_name
                          ? "is-invalid"
                          : ""
                          }`}
                        onChange={handleChange}
                      />

                      <ErrorMessage
                        name="department_name"
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
                        value={departments.open_time}
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
                        placeholder="กรอกเวลาปิด"
                        value={departments.close_time}
                        className={`form-control ${touched.close_time &&
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
                        value={departments.building}
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
                        value={departments.floor}
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
                        value={departments.department_phone}
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
                        value={departments.max_queue_number}
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
                    <div class="col-10 col-md-6"></div>
                  </form>
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      id="department_creatSubmit"
                      type="submit"
                      className="btn btn-success mx-1"
                      onClick={handleClick}
                    >
                      บันทึก
                    </button>
                    <button className="btn btn-danger mx-1">
                      <Link
                        id="department_CancleSubmit"
                        to="/admin/department-type"
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        ยกเลิก
                      </Link>
                    </button>
                  </div>



                </div>

              </div>


            </form>
          )}

        </Formik>
      </div >
    </Fragment >
  );
}

export default FormDepartment;