import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import Doctor from "../../../../../image/doctor.jpg";
import Swal from "sweetalert2";
import { getDoctorById, updateDoctorById } from "../../../../../service/Doctor.Service";
import { getDepartment } from "../../../../../service/DepartmentType.Service";
import Schema from "./Validation";
function FormDoctor() {
  const location = useLocation();
  const [prefix_name, setPrefix_name] = useState("");
  const [doctor_first_name, setDoctor_first_name] = useState("");
  const [doctor_last_name, setDoctor_last_name] = useState("");
  const [doctor_phone, setDoctor_phone] = useState("");
  const [doctor_status, setDoctor_status] = useState("");
  const [department_id, setDepartment_id] = useState("");
  const [department_name, setDepartment_name] = useState("");
  const [preview, setPreview] = useState(""); // เพิ่ม state เพื่อเก็บรูปภาพ
  const [file, setFile] = useState("");
  const [departments, setDepartments] = useState([]);
  const { doctors_id } = useParams();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await getDoctorById(doctors_id);
        const doctorData = response.data;

        setPrefix_name(doctorData.prefix_name);
        setDoctor_first_name(doctorData.doctor_first_name);
        setDoctor_last_name(doctorData.doctor_last_name);
        setDoctor_phone(doctorData.doctor_phone);
        setDoctor_status(doctorData.doctor_status);
        setDepartment_id(doctorData.department_id);
        setDepartment_name(doctorData.department_name);
        if (doctorData.doctor_url) {
          setPreview(doctorData.doctor_url);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลแพทย์: ", error);
      }
    };

    fetchDoctorData();
  }, [doctors_id]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartment();

        console.log(response.data); // Check the response data

        setDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
  }, []);
  const navigate = useNavigate();
 
  const loadImage = (e) => {
    const doctor_url = e.target.files[0];
    setFile(doctor_url);
    const reader = new FileReader();
  
    reader.onload = () => {
      setPreview(reader.result); // ตั้งค่าตัวแปรลิงก์รูปภาพเมื่ออัปโหลดเสร็จ
    };
  
    if (doctor_url) {
      reader.readAsDataURL(doctor_url);
    }
  };
  
const UpdateDoctor = async (e) => {
  e.preventDefault();
  if (!prefix_name || !doctor_first_name || !doctor_last_name || !doctor_phone || !doctor_status || !department_id) {
    Swal.fire({
      title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      icon: 'warning',
    });
    return; // ไม่ส่งข้อมูลถ้าข้อมูลไม่ครบ
  }
const result = await Swal.fire({
    title: "คุณแน่ใจหรือไม่ ว่าต้องการแก้ไขข้อมูลรายชื่อแพทย์ ?",
    text: "",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
  });

  if (result.isConfirmed) {
  const formData = new FormData();

  formData.append("doctor_url", file);
  formData.append("prefix_name", prefix_name);
  formData.append("doctor_first_name", doctor_first_name);
  formData.append("doctor_last_name", doctor_last_name);
  formData.append("doctor_phone", doctor_phone);
  formData.append("doctor_status", doctor_status);
  formData.append("department_id", department_id);

  try {
    await updateDoctorById(doctors_id, formData, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    });
    Swal.fire({
      title: "เเก้ไขข้อมูลแพทย์สำเร็จ",
      text: "เเก้ไขข้อมูลแพทย์แล้ว",
      icon: "success",
      showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
      timer: 2500, // แสดงข้อความเป็นเวลา 1.5 วินาที
    });
    navigate("/admin/doctor");
  }
   catch (error) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "เกิดข้อผิดพลาดในขณะที่เเก้ไขข้อมูลแพทย์",
      icon: "error",
    });
  }
}
}

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
                {location.state ? "้เพิ่ม" : "แก้ไข"}ข้อมูลรายชื่อแพทย์
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "้เพิ่ม" : "แก้ไข"}ข้อมูลรายชื่อแพทย์
          </h2>
        </div>
        <Formik enableReinitialize={true} 
        validationSchema={Schema}
        >
          {({ values, errors, touched }) => (
            <Form onSubmit={UpdateDoctor}>
              <div className="row d-flex justify-content-center">
                <div className="UpdateDoc col-12 col-md-4 col-lg-8 border-1 shadow p-3">
                  <div className="col-12 text-center align-items-center">
                    <label>เลือกรูปภาพหมอ</label> <br />
                    <br />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                    {preview ? (
                        <img
                          className="img-hptsด mx-auto"
                          src={preview}
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
                       id="doctor_url"
                       type="file"
                       name="doctor_url"
                        accept="image/*"
                        className="form-control"
                        onChange={loadImage}
                      />
                    </div>
                  </div>

                  <div class="row g-3 d-flex justify-content-center ">
                    <div className="col-10 col-md-6">
                      <label>คำนำหน้า</label>
                      <label className="red">*</label>
                      <select
                        id="doctor_createprefix_name"
                        name="prefix_name"
                        value={prefix_name}
                        className={`form-control ${
                          touched.prefix_name &&
                          errors.prefix_name &&
                          "is-invalid"
                        }`}
                        onChange={(e) => setPrefix_name(e.target.value)}
                        placeholder="กรุณากรอกชื่อผู้ใช้"
                      >
                        <option value="" selected>เลือกคำนำหน้าชื่อ</option>
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
                        placeholder="กรุณากรอกชื่อ"
                        type="text"
                        value={doctor_first_name}
                        className={`form-control ${
                          touched.doctor_first_name &&
                          errors.doctor_first_name &&
                          "is-invalid"
                        }`}
                        onChange={(e) => setDoctor_first_name(e.target.value)}
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
                        placeholder="กรุณากรอกนามสกุล"
                        type="text"
                        value={doctor_last_name}
                        className={`form-control ${
                          touched.doctor_last_name &&
                          errors.doctor_last_name &&
                          "is-invalid"
                        }`}
                        onChange={(e) => setDoctor_last_name(e.target.value)}
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
                        value={doctor_status}
                        class="form-select"
                        aria-label="Default select example"
                        onChange={(e) => setDoctor_status(e.target.value)}
                      >
                        <option value="" selected>เลือกสถานะการใช้งาน</option>
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
                        className={`form-select ${
                          touched.department_id && errors.department_id
                            ? "is-invalid"
                            : ""
                        }`}
                        aria-label="Default select example"
                        value={department_id}
                        onChange={(e) => setDepartment_id(e.target.value)}
                      >
                         <option value="" disabled>
                              {department_name}
                              </option>
                              {departments.map((prov) => (
                                <option key={prov.department_id} value={prov.department_id}>
                                  {prov.department_name}
                                </option>
                              ))}
                      </select>
                      <ErrorMessage
                        name="department_id"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div class="col-10 col-md-6">
                      <label>เบอร์โทร</label>
                      <label className="red">*</label>
                      <input
                        id="doctor_phone"
                        name="doctor_phone"
                        placeholder="กรุณากรอกเบอร์โทร"
                        type="text"
                        className={`form-control ${
                          touched.doctor_phone &&
                          errors.doctor_phone &&
                          "is-invalid"
                        }`}
                        value={doctor_phone}
                        onChange={(e) => setDoctor_phone(e.target.value)}
                      />
                      <ErrorMessage
                        name="doctor_phone"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        id="Submit"
                        type="submit"
                        className="btn btn-success mx-1"

                        style={{
                          textDecoration: "none",
                          
                          color: "#fff",
                        }}
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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
}

export default FormDoctor;
