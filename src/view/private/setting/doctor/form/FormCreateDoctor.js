import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Doctor from "../../../../../image/doctor.jpg";
import axios from "axios";
import Schema from "./Validation";
import Swal from "sweetalert2";
import { createDoctor } from "../../../../../service/Doctor.Service";
function FormCreateDoctor() {
  const location = useLocation();
  const [doctor, setDoctors] = useState({
    doctors_id: null,
    prefix_name: "",
    doctor_first_name: "",
    doctor_last_name: "",
    doctor_image: "",
    doctor_status: "",
    department_id: "",
    department_name: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setDoctors((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

            setDoctors((prevDoctor) => ({
              ...prevDoctor,
              doctor_image: resizedImageURL, // กำหนด URL รูปภาพใหม่ใน state
            }));
          }, 'image/jpeg', 0.8);
        };
      };
      reader.readAsDataURL(file);
    }
  };


  console.log('doctor_image:', doctor.doctor_image); // ตรวจสอบค่าของ doctor_image

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่ ว่าต้องการสร้างข้อมูลรายชื่อแพทย์ ?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        await createDoctor(
          doctor.doctors_id,
          doctor.prefix_name,
          doctor.doctor_first_name,
          doctor.doctor_last_name,
          doctor.doctor_image,
          doctor.doctor_status,
          doctor.department_id,
          doctor.department_name
        );
        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลแพทย์สำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/admin/doctor");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลแพทย์",
        showConfirmButton: true,
      });
    }
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/admin/doctor" className="nav-breadcrumb">
                  ข้อมูลรายชื่อแพทย์
                </Link>
              </li>
              <li
                className="breadcrumb-item text-black fw-semibold"
                aria-current="page"
              >
                {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อแพทย์
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อแพทย์
          </h2>
        </div>
        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          initialValues={doctor}
          onSubmit={handleClick}
        >
          {({ errors, touched }) => (
            <form encType='multipart/form-data'>
              <div className="row d-flex justify-content-center">
                <div className="UpdateDoc col-12 col-md-4 col-lg-8 border-1 shadow p-3">
                  <div className="col-12 text-center align-items-center">
                    <label>เลือกรูปภาพหมอ</label> <br />
                    <br />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      {doctor.doctor_image ? (
                        <img
                          className="img-hpts mx-auto"
                          src={doctor.doctor_image}
                          alt="Doctor"
                        />
                      ) : (
                          <img
                            className="img-hpts mx-auto"
                            src={Doctor}
                            alt="Default Doctor"
                          />
                        )}
                      <br />
                      <br />
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div class="col-10 col-md-6 ">
                      <input
                        id="doctor_createdoctor_image"
                        type="file"
                        name="doctor_image"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageChange}
                      />


                    </div>
                  </div>
                  <form class="row g-3 d-flex justify-content-center ">
                    <div className="col-10 col-md-6">
                      <label>คำนำหน้า</label>
                      <label className="red">*</label>
                      <select
                        id="doctor_createprefix_name"
                        name="prefix_name"
                        className={`form-select ${touched.prefix_name && errors.prefix_name
                            ? "is-invalid"
                            : ""
                          }`}
                        onChange={handleChange}
                      >
                        <option selected>เลือกคำนำหน้าชื่อ</option>
                        <option value="ศาสตราจารย์นายแพทย์">
                          ศาสตราจารย์นายแพทย์
                        </option>
                        <option value="แพทย์หญิง">แพทย์หญิง</option>
                        <option value="นายแพทย์">นายแพทย์</option>
                        <option value="ทันตแพทย์">ทันตแพทย์</option>
                        <option value="ทันตแพทย์หญิง">ทันตแพทย์หญิง</option>
                        <option value="ผู้ช่วยศาสตราจารย์">
                          ผู้ช่วยศาสตราจารย์
                        </option>
                      </select>
                      <ErrorMessage
                        name="prefix_name"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div class="col-10 col-md-6">
                      <label>ชื่อ</label>
                      <label className="red">*</label>
                      <input
                        id="doctor_doctor_first_name"
                        name="doctor_first_name"
                        placeholder="กรอกชื่อ"
                        type="text"
                        value={doctor.doctor_first_name}
                        className={`form-control ${touched.doctor_first_name &&
                          errors.doctor_first_name &&
                          "is-invalid"
                          }`}
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="doctor_first_name"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div class="col-10 col-md-6">
                      <label>นามสกุล</label>
                      <label className="red">*</label>
                      <input
                        id="doctor_doctor_last_name"
                        name="doctor_last_name"
                        placeholder="นามสกุล"
                        type="text"
                        value={doctor.doctor_last_name}
                        className={`form-control ${touched.doctor_last_name &&
                          errors.doctor_last_name &&
                          "is-invalid"
                          }`}
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="doctor_last_name"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div class="col-10 col-md-6">
                      <label>สถานะการใช้งาน</label>
                      <label className="red">*</label>
                      <select
                        id="doctor_doctor_doctor_status"
                        name="doctor_status"
                        class="form-select"
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option selected>เลือกสถานะการใช้งาน</option>
                        <option value="พักงาน">พักงาน</option>
                        <option value="ใช้งาน">ใช้งาน</option>
                      </select>
                      <ErrorMessage
                        name="doctor_status"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div class="col-10 col-md-6">
                      <label>แผนก</label>
                      <label className="red">*</label>
                      <select
                        id="doctor_doctor_doctor_department_id"
                        name="department_id"
                        className={`form-select ${touched.department_id && errors.department_id
                            ? "is-invalid"
                            : ""
                          }`}
                        aria-label="Default select example"
                        value={doctor.department_id} // Set the value to doctor.department_id
                        onChange={handleChange}
                      >
                        <option selected>เลือกแผนก</option>
                        <option value="1">ทันตกรรม</option>
                        <option value="2">กุมารเวชกรรม</option>
                        <option value="3">ทั่วไป</option>
                        <option value="4">สูติ-นรีเวช</option>
                        <option value="6">ศัลยกรรม</option>
                        <option value="7">หัวใจ</option>
                        <option value="8">ผิวหนัง</option>
                      </select>
                      <ErrorMessage
                        name="department_id"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div class="col-10 col-md-6"></div>
                  </form>
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      id="Doctor_Createsubmit"
                      type="submit"
                      className="btn btn-success mx-1"
                      onClick={handleClick}
                    >
                      บันทึก
                    </button>
                    <button className="btn btn-danger mx-1">
                      <Link
                        id="Doctor_CreateBack"
                        to="/admin/doctor/"
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
      </div>
    </Fragment>
  );
}

export default FormCreateDoctor;