import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { DropzoneImage } from "../../../../../components/DropzoneImage";

import { baseURL } from "../../../../../helper/Axios";
import Swal from "sweetalert2";
const Schema = Yup.object().shape({
  prefix_name: Yup.string().required("Please enter the frefix name"),
  doctor_first_name: Yup.string().required("Please enter the first name"),
  doctor_last_name: Yup.string().required("Please enter the last name"),
  department_name: Yup.string().required("Please enter the   department_name"),
});
function FormCreateDoctor() {
  const location = useLocation();
  const [doctor, setDoctors] = useState({
    doctors_id:  null,
    prefix_name: "",
    doctor_first_name: "",
    doctor_last_name: "",
    doctor_image: null,
    doctor_status: "",
    department_id: "",
    department_name: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setDoctors((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจที่จะเพิ่มรายชื่อแพทย์",
        text: "Are you sure you want to create this doctor?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        // ทำการอัปเดตแพทย์
        await axios.post(
          "http://localhost:5000/apis/doctors/",
          doctor
        );
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลสำเร็จ",
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
        text: "เกิดข้อผิดพลาดในการอัปเดตแพทย์",
        showConfirmButton: true,
      });
    }
  };
  return (
    <Fragment>
      <div className="w-full">
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
                {location.state ? "แก้ไข" : "เพิ่ม"}ข้อมูลรายชื่อแพทย์
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "เพิ่ม"}ข้อมูลรายชื่อแพทย์
          </h2>
        </div>
        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          onSubmit={handleClick}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row d-flex justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12 col-sm-8 col-lg-7 col-xl-5 px-1 mt-2">
                      <label>เลือกรูปภาพหมอ</label>
                      <label className="red">*</label>
                      <br />
                      <img className="img-hpt" src={doctor.doctor_image} />
                      <br />

                      <input
                        type="text"
                        name="doctor_image"
                        className="form-control"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 px-1 mt-2">
                      <label>คำนำหน้า</label>
                      <label className="red">*</label>
                      <select
                        name="prefix_name"
                        className={`form-select ${
                          touched.prefix_name && errors.prefix_name
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option selected>{doctor.prefix_name}</option>
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
                    <div className="col-12 px-1 mt-2">
                      <label>ชื่อ</label>
                      <label className="red">*</label>
                      <input
                        name="doctor_first_name"
                        type="text"
                        value={doctor.doctor_first_name}
                        className={`form-select ${
                          touched.doctor_first_name && errors.doctor_first_name
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="doctor_first_name"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="col-12 px-1 mt-2">
                      <label>นามสกุล</label>
                      <label className="red">*</label>
                      <input
                        name="doctor_last_name"
                        type="text"
                        value={doctor.doctor_last_name}
                        className={`form-select ${
                          touched.doctor_last_name && errors.doctor_last_name
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleChange}
                      />
                      <ErrorMessage
                        name="doctor_last_name"
                        component="div"
                        className="error-message invalid-feedback"
                      />
                    </div>

                    <div className="col-12 px-1 mt-2">
                      <label>สถานะการใช้งาน</label>
                      <label className="red">*</label>
                      <select
                        name="doctor_status"
                        className={`form-select ${
                          touched.doctor_status && errors.doctor_status
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option selected>{doctor.doctor_status}</option>
                        <option value="พักงาน">พักงาน</option>
                        <option value="รับบริการ">รับบริการ</option>
                      </select>
                      <ErrorMessage
                        name="doctor_status"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="col-12 px-1 mt-2">
                      <label>แผนก</label>
                      <label className="red">*</label>
                      <select
                        name="department_id"
                        className={`form-select ${
                          touched.department_id && errors.department_id
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                        onChange={handleChange}
                      >
                        <option selected>{doctor.department_name}</option>
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
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        type="submit"
                        className="btn btn-success mx-1"
                        onClick={handleClick}
                      >
                        บันทึก
                      </button>
                      <button type="reset" className="btn btn-secondary mx-1">
                        ล้างค่า
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
}

export default FormCreateDoctor;
