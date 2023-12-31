import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import Schema from "./Validation";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { createAuthorities } from "../../../../../service/Authorities.Service";
function FormAuthorities() {
  const navigate = useNavigate();
  const [age, setAge] = useState(0);
  const [users, setUsers] = useState({
    users_id: null,
    id_card: "",
    password: "",
    prefix_name: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    phoneNumber: "",
    role_id: 2,
    department_id: null,
    birthday: "",
  });

  const location = useLocation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthday") {
      if (value) {
        const birthDateObj = new Date(value); // แปลงวันที่ปีเกิดใน state ของคุณให้กลายเป็นออบเจ็กต์ของ Date
        const today = new Date(); // วันที่ปัจจุบัน
        const diffInMilliseconds = Math.abs(today - birthDateObj);
        const ageDate = new Date(diffInMilliseconds);
        const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        setAge(calculatedAge); // อัปเดต state ของอายุด้วยค่าที่คำนวณได้
      } else {
        setAge(null); // ถ้าวันเกิดไม่ได้ถูกกรอก ให้เคลียร์ค่าอายุให้เป็น null
      }
    }
    setUsers((prevUsers) => ({
      ...prevUsers,
      [name]: value,
    }));
  };
  const handleClick = async (e) => {
    if (
      !users.id_card ||
      !users.prefix_name ||
      !users.first_name ||
      !users.last_name ||
      !users.gender ||
      !users.birthday ||
      users.phoneNumber.length !== 10 ||
      users.id_card.length !== 13
    ) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณาตรวจสอบข้อมูลที่ไม่ครบถ้วน",
        icon: "warning",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "ยืนยัน",
        text: "คุณแน่ใจหรือไม่ ว่าต้องการสมัครสมาชิก ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      const dataToSend = { ...users, age: age };

      if (result.isConfirmed) {
        try {
          await createAuthorities (
            dataToSend.users_id,
            dataToSend.id_card,
            dataToSend.password,
            dataToSend.prefix_name,
            dataToSend.first_name,
            dataToSend.last_name,
            dataToSend.gender,
            dataToSend.birthday,
            dataToSend.phoneNumber,
            dataToSend.role_id
          );

          Swal.fire({
            icon: "success",
            title: "สมัครสมาชิกสำเร็จ",
            text: "กรุณาเข้าสู่ระบบ",
            showConfirmButton: false,
            timer: 1500,
          });

          setTimeout(() => {
            navigate("/");
          }, 1500);
        } catch (error) {
          console.error(error);
          let errorMessage = "เกิดข้อผิดพลาดในการสมัครสมาชิก";
          let icon = "error";

          if (error.response) {
            if (error.response.status === 400) {
              errorMessage = "คุณมีบัญชีผู้ใช้ที่ใช้เลขประจำตัวนี้อยู่แล้ว";
              icon = "warning";
            } else if (error.response.status === 404) {
              errorMessage = "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";
              icon = "error";
            }
          }

          Swal.fire({
            icon: icon,
            title: "เกิดข้อผิดพลาด",
            text: errorMessage,
            showConfirmButton: true,
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
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
                <Link to="/admin/authorities" className="nav-breadcrumb">
                  ข้อมูลรายชื่อเจ้าหน้าที่
                </Link>
              </li>
              <li
                className="breadcrumb-item text-black fw-semibold"
                aria-current="page"
              >
                {location.state ? "แก้ไข" : "เพิ่ม"}ข้อมูลรายชื่อเจ้าหน้าที่
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "เพิ่ม"}ข้อมูลรายชื่อเจ้าหน้าที่
          </h2>
        </div>
        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          initialValues={users}
          onSubmit={handleClick}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="container mt-2 ">
                <div className="mb-4">
                  <div className="card border-0 shadow p-4">
                    <h6 className="font ">ข้อมูลเจ้าหน้าที่</h6>
                    <br></br>
                    <div className="rounded border p-4">
                      <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-4">
                          <label>เลขบัตรประชาชน</label>
                          <label className="red">*</label>
                          <br></br>
                          <input
                           id="Authors_id_card"
                            type="text"
                            name="id_card"
                            value={users.id_card}
                            placeholder="เลขบัตรประชาชน 13 หลัก"
                            className={`form-control ${
                              touched.id_card && errors.id_card && "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="id_card"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-2">
                          <label>
                            คำนำหน้าชื่อ <label className="red">* &nbsp;</label>
                            :{" "}
                          </label>{" "}
                          <select
                           id="Authors_prefix_name"
                            name="prefix_name"
                            className={`form-select ${
                              touched.prefix_name &&
                              errors.prefix_name &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                             <option value="" selected>เลือกคำนำหน้าชื่อ</option>
                            <option value="นาย">นาย</option>
                            <option value="นางสาว">นางสาว</option>
                            <option value="นาง">นาง</option>
                          </select>
                          <ErrorMessage
                            name="prefix_name"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-3">
                          <label>ชื่อ</label>
                          <label className="red">*</label>
                          <input
                           id="Authors_first_name"
                          
                            type="name"
                            name="first_name"
                            placeholder="ชื่อ"
                            value={users.first_name}
                            className={`form-control ${
                              touched.first_name &&
                              errors.first_name &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="first_name"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-3">
                          <label>นามสกุล</label>
                          <label className="red">*</label>
                          <input
                          id="Authors_last_name"
                            type="text"
                            name="last_name"
                            placeholder="นามสกุล"
                            value={users.last_name}
                            className={`form-control ${
                              touched.last_name &&
                              errors.last_name &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="last_name"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-2">
                          <label>
                            เพศ <label className="red">* &nbsp;</label>:{" "}
                          </label>{" "}
                          <select
                            id="Authors_gender"
                            name="gender"
                            className={`form-select ${
                              touched.gender && errors.gender && "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                             <option value="" selected>เลือกเพศ</option>
                            <option value="ชาย">ชาย</option>
                            <option value="หญิง">หญิง</option>
                          </select>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-2 px-1 mt-2">
                          <label>วันเดือนปีเกิด</label>
                          <label className="red">*</label>

                          <input
                           id="Authors_birthday"
                            name="birthday"
                            type="date"
                            value={users.birthday}
                            className={`form-control ${
                              touched.birthday &&
                              errors.birthday &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          {touched.birthday && errors.birthday && (
                            <div className="error-message">
                              {errors.birthday}
                            </div>
                          )}
                        </div>
                        <div className="col-2 px-1 mt-2">
                          <label>อายุ</label>
                          <input
                            id="Authors_age"
                            type="text"
                            name="age"
                            value={age !== null ? age : ""} // ใช้ค่า state ของอายุที่คำนวณได้ ถ้ามีค่า (ไม่ใช่ null) ให้แสดงค่าอายุ ถ้าไม่ใช่ให้แสดงเป็นช่องว่าง
                            readOnly
                            disabled
                            style={{ backgroundColor: 'lightgray' }} 
                            className="form-control"
                          />
                        </div>

                        <div className="col-3">
                          <label>เบอร์โทร</label>
                          <label className="red">*</label>
                          <input
                           id="Authors_phoneNumber"
                             type="phone"
                             name="phoneNumber"
                             placeholder="เบอร์โทร"
                             value={users.phoneNumber}
                             className={`form-control ${
                              touched.phoneNumber &&
                              errors.phoneNumber &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>
                      <br></br>
                      <h6>รหัสผ่าน</h6>
                      <div className="rounded border p-4">
                        <div className="col-8 ">
                          <div className="row">
                            <div className="col-5 px-1 mt-8">
                              <label>รหัสผ่าน</label>
                              <label className="red">*</label>
                              <input
                                id="Authors_password"
                                type="password"
                                placeholder="รหัสผ่าน"
                                name="password"
                                value={users.password}
                                className={`form-control ${
                                  touched.password &&
                                  errors.password &&
                                  "is-invalid"
                                }`}
                                onChange={handleChange}
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="error-message"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <br></br>

                      <br></br>

                      <div className="d-flex justify-content-center mt-3">
                        <button
                          id="Authors_submit"
                          type="submit"
                          className="btn btn-success mx-1"
                          onClick={handleClick}
                        >
                          บันทึก
                        </button>

                        <button
                          id="Authors_Cancel"
                          className="btn btn-danger mx-1"
                          onClick={() => navigate("/admin/authorities/")}
                        >
                          ยกเลิก
                        </button>
                      </div>
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

export default FormAuthorities;
