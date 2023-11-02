import React, { useState, Fragment } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import Hospitals from "../../../../../image/hospitals.jpg";
import Schema from "./Validation";
import Swal from "sweetalert2";
import { createDepartment, getDepartment } from "../../../../../service/DepartmentType.Service";

function FormDepartment() {
  const [department_name, setDepartment_name] = useState("");
  const [department_image, setDepartment_image] = useState("");
  const [open_time, setOpen_time] = useState("");
  const [close_time, setClose_time] = useState("");
  const [max_queue_number, setMax_queue_number] = useState("");
  const [floor, setFloor] = useState("");
  const [building, setBuilding] = useState("");
  const [department_phone, setDepartment_phone] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const loadImage = (e) => {
    const department_image = e.target.files[0];
    setFile(department_image);
    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result); // ตั้งค่าตัวแปรลิงก์รูปภาพเมื่ออัปโหลดเสร็จ
    };

    if (department_image) {
      reader.readAsDataURL(department_image);
    }
  };

  const checkDepartmentExists = async (departmentName) => {
    try {
      // ส่งคำขอ GET เพื่อตรวจสอบว่าชื่อแผนกซ้ำหรือไม่
      const response = await getDepartment(); // ส่งคำขอ GET ทั้งหมดเพื่อดึงข้อมูลแผนกทั้งหมดจาก API
      const departments = response.data;

      // ตรวจสอบว่ามีชื่อแผนกที่ซ้ำกับที่ผู้ใช้ป้อนหรือไม่
      const departmentExists = departments.some(
        (department) => department.department_name === departmentName
      );

      return departmentExists;
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบชื่อแผนก: ", error);
      return false;
    }
  };

  const saveUsers = async (e) => {
    e.preventDefault();
    if (
      !department_name ||
      !open_time ||
      !close_time ||
      !max_queue_number ||
      !floor ||
      !building ||
      !department_phone
    ) {
      // ถ้าฟอร์มไม่ถูกต้อง แสดง SweetAlert
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง !",
        showConfirmButton: true,
      });
      return;
    }

    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่ ว่าต้องการสร้างข้อมูลรายชื่อแผนก ?",
      text: "",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      const departmentExists = await checkDepartmentExists(department_name);

      if (departmentExists) {
        Swal.fire({
          icon: "warning",
          title: "ชื่อแผนกซ้ำ !",
          text: "ชื่อแผนกที่คุณใส่นั้นมีอยู่ในระบบแล้ว",
        });
        return;
      }
      // ทำการสร้างข้อมูลแผนกใหม่หากชื่อแผนกไม่ซ้ำ
      try {
        // ทำการอัปเดตข้อมูลแผนก
        const formData = new FormData();
        formData.append("department_name", department_name);
        formData.append("department_image", file);
        formData.append("open_time", open_time);
        formData.append("close_time", close_time);
        formData.append("max_queue_number", max_queue_number);
        formData.append("floor", floor);
        formData.append("building", building);
        formData.append("department_phone", department_phone);

        await createDepartment(formData, {
          headers: {
            "Content-type": "multipart/form-data",
          },
        });

        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลแผนกสำเร็จ !",
          text: "ข้อมูลแผนกถูกเพิ่มลงในระบบแล้ว",
          icon: "success",
          showConfirmButton: false, // ซ่อนปุ่ม "ตกลง"
          timer: 2500, // แสดงข้อความเป็นเวลา 2.5 วินาที
        });
        navigate("/admin/department-type");
      } catch (error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลแผนกและการตรวจรักษา",
          icon: "error",
        });
      }
    }
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

        <Formik enableReinitialize={true} validationSchema={Schema}>
          {({ values, errors, touched }) => (
            <Form onSubmit={saveUsers}>
              <div className="row d-flex justify-content-center">
                <div className="UpdateDepart col-12 col-md-4 col-lg-8 border-1 shadow p-3">
                  <div className="col-12 text-center align-items-center">
                    <label>เลือกรูปภาพแผนก</label> <br />
                    <br />
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      {preview ? (
                        <img
                          className="img-hpts mx-auto"
                          src={preview}
                          alt="Department"
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
                        id="department_create_image"
                        type="file"
                        name="department_image"
                        accept="image/*"
                        className="form-control"
                        onChange={loadImage}
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
                        value={department_name}
                        className={`form-control ${
                          touched.department_name && errors.department_name
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={(e) => setDepartment_name(e.target.value)}
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
                        value={open_time}
                        className={`form-control ${
                          touched.open_time && errors.open_time && "is-invalid"
                        }`}
                        onChange={(e) => setOpen_time(e.target.value)}
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
                        value={close_time}
                        className={`form-control ${
                          touched.close_time &&
                          errors.close_time &&
                          "is-invalid"
                        }`}
                        onChange={(e) => setClose_time(e.target.value)}
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
                        value={building}
                        className={`form-control ${
                          touched.building && errors.building && "is-invalid"
                        }`}
                        onChange={(e) => setBuilding(e.target.value)}
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
                        value={floor}
                        className={`form-control ${
                          touched.floor && errors.floor && "is-invalid"
                        }`}
                        onChange={(e) => setFloor(e.target.value)}
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
                        value={department_phone}
                        className={`form-control ${
                          touched.department_phone &&
                          errors.department_phone &&
                          "is-invalid"
                        }`}
                        onChange={(e) => setDepartment_phone(e.target.value)}
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
                        value={max_queue_number}
                        className={`form-control ${
                          touched.max_queue_number &&
                          errors.max_queue_number &&
                          "is-invalid"
                        }`}
                        onChange={(e) => setMax_queue_number(e.target.value)}
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
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
}

export default FormDepartment;
