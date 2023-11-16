
import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormik, Formik, Form, ErrorMessage } from "formik";
import Schema from "./Validation";
import axios from "axios";
import {
  getPatientById,
  updatePatientById,
} from "../../../../../service/Patient.Service";
import {
  getAuthorities,
  updateAuthorities,
} from "../../../../../service/Authorities.Service";
function EditAuthorities() {
  const navigate = useNavigate();
  const location = useLocation();
  const { users_id } = useParams();
  const [age, setAge] = useState(0);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await getPatientById(users_id);

        setUsers(res.data);

        if (res.data.birthday) {
          const birthDateObj = new Date(res.data.birthday);
          const today = new Date();
          const diffInMilliseconds = Math.abs(today - birthDateObj);
          const ageDate = new Date(diffInMilliseconds);
          const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
          setAge(calculatedAge);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUsers();
  }, [users_id]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = dateObj.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setUsers((prevUsers) => ({
      ...prevUsers,
      birthday: selectedDate,
    }));

    if (selectedDate) {
      const birthDateObj = new Date(selectedDate);
      const today = new Date();
      const diffInMilliseconds = Math.abs(today - birthDateObj);
      const ageDate = new Date(diffInMilliseconds);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      setAge(calculatedAge);
    } else {
      // ถ้าวันที่เกิดไม่ได้ถูกเลือก ให้เคลียร์ค่าอายุใน state
      setAge(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const selectedDate = e.target.value;
    console.log("Input Value:", value); // ตรวจสอบค่าใน console

    setUsers((prevUsers) => ({
      ...prevUsers,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      const isValid = await Schema.isValid(users);
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
        title: "คุณแน่ใจที่จะอัพเดทข้อมูลเจ้าหน้าที่ ?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        const {
          users_id,
          id_card,
          password,
          prefix_name,
          first_name,
          last_name,
          gender,
          birthday,
          phoneNumber,
          role_id,
        } = users;
        const response = await updateAuthorities(
          users_id,
          id_card,
          password,
          prefix_name,
          first_name,
          last_name,
          gender,
          birthday,
          phoneNumber,
          role_id,
          {}
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "อัพเดตข้อมูลสำเจ้าหน้าที่สำเร็จ",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/admin/authorities");
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลเจ้าหน้า",
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
        text: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลเจ้าหน้า",
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
                {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อเจ้าหน้าที่
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อเจ้าหน้าที่
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
                    <h6 className="font ">แก้ไขข้อมูลเจ้าหน้าที่</h6>
                    <br></br>
                    <div className="rounded border p-4">
                      <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-4">
                          <label>เลขบัตรประชาชน</label>
                          <label className="red">*</label>
                          <br></br>
                          <input
                           id="Author_id_card"
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
                             id="Author_prefix_name"
                            name="prefix_name"
                            className={`form-select ${
                              touched.prefix_name &&
                              errors.prefix_name &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                            <option selected>{users.prefix_name}</option>
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
                            id="Author_first_name"
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
                            id="Author_last_name"
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
                            id="Author_gender"
                            name="gender"
                            value={users.gender}
                            className={`form-select ${
                              touched.gender && errors.gender && "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                            <option selected>เลือกเพศ</option>
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
                            id="Author_birthday"
                          
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
                            id="Author_age"
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
                           id="Author_phone"
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
                               id="Author_password"
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
                           id="Author_submit"
                          type="submit"
                          className="btn btn-success mx-1"
                          onClick={handleClick}
                        >
                          บันทึก
                        </button>

                        <button
                            id="Author_Backs"
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
export default EditAuthorities;
