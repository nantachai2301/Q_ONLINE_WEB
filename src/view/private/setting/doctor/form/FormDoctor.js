import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

const Schema = Yup.object().shape({
  doctor_first_name: Yup.string().required("Please enter the first name"),
  doctor_last_name: Yup.string().required("Please enter the last name"),
 
});
function FormDoctor() {
  const location = useLocation();
  const [doctor, setDoctors] = useState({
    doctors_id: "",
    prefix_name: "",
    doctor_first_name: "",
    doctor_last_name: "",
    doctor_image: null,
    doctor_status: "",
    department_id: "",
    department_name: "",
  
  });
  const { doctors_id } = useParams();

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/apis/doctors/" + doctors_id
        );

        setDoctors(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllDoctors();
  }, [doctors_id]);

  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctors((prev) => ({ ...prev, [name]: value }));
  };
 

  const handleClick = async () => {
    try {
      const isValid = await Schema.isValid(doctor);
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
        title: "Confirm Update",
        text: "Are you sure you want to update this doctor?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
      });
  
      if (result.isConfirmed) {
        const response = await axios.put(
          `http://localhost:5000/apis/doctors/${doctors_id}`,
          doctor
        );
  
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "บันทึกข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/admin/doctor");
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
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
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row d-flex justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12 col-sm-8 col-lg-7 col-xl-5 px-1 mt-2">
                    <label>เลือกรูปภาพหมอ</label>
                    <label className="red">*</label>
                    <img className="img-hpt" src={doctor.doctor_image} />
                      <br />
                      {/* <DropzoneImage
                        image={doctor.doctor_image}
                        onChange={(image) =>
                          setFieldValue("doctor_image", image)
                        }
                      /> */}
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
                        className={`form-control ${
                          touched.doctor_first_name &&
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
                    <div className="col-12 px-1 mt-2">
                      <label>นามสกุล</label>
                      <label className="red">*</label>
                      <input
                        name="doctor_last_name"
                        type="text"
                        value={doctor.doctor_last_name}
                        className={`form-control ${
                          touched.doctor_last_name &&
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
                    <div className="col-12 px-1 mt-2">
                      <label>สถานะการใช้งาน</label>
                      <label className="red">*</label>
                      <select
                        name="doctor_status"
                        class="form-select"
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

export default FormDoctor;
