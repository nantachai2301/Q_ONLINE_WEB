import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import province from "../../data/province.json";
import { Formik, Form, ErrorMessage } from "formik";
import Schema from "./Validation";
import Swal from "sweetalert2";
import { useMediaQuery } from "@mui/material";
import { createPatient } from "../../service/Patient.Service";

function Register() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width:1024px");
  const isMobile = useMediaQuery("(max-width:600px"); 
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
    weight: "",
    height: "",
    phoneNumber: "",
    congenital_disease: "",
    drugallergy: "",
    contact_first_name: "",
    contact_last_name: "",
    contact_relation_id: "",
    contact_phoneNumber: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postcode: "",
    img: "",
    role_id: 1,
    department_id: null,
    birthday: "",
  });

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

        // ตรวจสอบว่าวันเกิดที่ใส่เข้ามามีค่ามากกว่าหรือเท่ากับวันเริ่มต้นของปี 2566
        if (birthDateObj >= new Date("2016-01-01")) {
          Swal.fire({
            title: "",
            text: "กรุณากรอก วัน/เดือน/ปี ที่ไม่เริ่มต้นก่อน 1 มกราคม 2016",
            icon: "warning",
          });
          // Clear ค่าวันเกิดให้เป็นค่าว่าง
          setUsers((prevUsers) => ({
            ...prevUsers,
            [name]: "",
          }));
          setAge(null); // เคลียร์ค่าอายุให้เป็น null
          return;
        }
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
      !users.weight ||
      !users.height ||
      !users.contact_first_name ||
      !users.contact_last_name ||
      !users.contact_relation_id ||
      !users.contact_phoneNumber ||
      !users.address ||
      !users.subdistrict ||
      !users.district ||
      !users.province ||
      !users.postcode ||
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
        // เพิ่มเงื่อนไขการตรวจสอบวันเกิดก่อนส่งไปยัง createPatient
        // if (dataToSend.birthday > new Date('2023-01-01')) {
        //   Swal.fire({
        //     title: "คำเตือน !",
        //     text: "คุณไม่สามารถใส่วันเกิดก่อน 1 มกราคม 2023 ได้",
        //     icon: "warning",
        //   });
        //   return;
        // }

        try {
          await createPatient(
            dataToSend.users_id,
            dataToSend.id_card,
            dataToSend.password,
            dataToSend.prefix_name,
            dataToSend.first_name,
            dataToSend.last_name,
            dataToSend.gender,
            dataToSend.birthday,
            dataToSend.weight,
            dataToSend.height,
            dataToSend.phoneNumber,
            dataToSend.congenital_disease,
            dataToSend.drugallergy,
            dataToSend.contact_first_name,
            dataToSend.contact_last_name,
            dataToSend.contact_relation_id,
            dataToSend.contact_phoneNumber,
            dataToSend.address,
            dataToSend.subdistrict,
            dataToSend.district,
            dataToSend.province,
            dataToSend.postcode,
            dataToSend.img,
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
          <nav aria-label="breadcrumb"></nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">สมัครสมาชิก</h2>
        </div>
        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          initialValues={users}
          onSubmit={handleClick}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="container57 mt-2 ">
                <div className="mb-4">
                {isDesktop &&(
                  <div className="card1 card  border-0 shadow p-4">
                    <h6 className="font ">ข้อมูลทั่วไป</h6>
                    <br></br>
                    <div className="rounded border p-4">
                      <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-10 col-md-3">
                          <label>เลขบัตรประชาชน</label>
                          <label className="red">*</label>
                          <br></br>
                          <input
                            type="text"
                            id="user_id_card"
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

                        <div className="col-10 col-md-3">
                          <label>
                            คำนำหน้าชื่อ <label className="red">* &nbsp;</label>
                            :{" "}
                          </label>{" "}
                          <select
                            id="user_prefix_name"
                            name="prefix_name"
                            className={`form-select ${
                              touched.prefix_name &&
                              errors.prefix_name &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                            <option value="" selected>
                              เลือกคำนำหน้าชื่อ
                            </option>
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
                        <div className="col-10 col-md-3">
                          <label>ชื่อ</label>
                          <label className="red">*</label>
                          <input
                            id="user_first_name"
                            type="text"
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
                        <div className="col-10 col-md-3">
                          <label>นามสกุล</label>
                          <label className="red">*</label>
                          <input
                            id="user_last_name"
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
                        <div className="col-10 col-md-3">
                          <label>
                            เพศ <label className="red">* &nbsp;</label>:{" "}
                          </label>{" "}
                          <select
                            id="user_gender"
                            name="gender"
                            className={`form-select ${
                              touched.gender && errors.gender && "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                            <option value="" selected>
                              เลือกเพศ
                            </option>
                            <option value="ชาย">ชาย</option>
                            <option value="หญิง">หญิง</option>
                          </select>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-10 col-md-3">
                          <label>วันเดือนปีเกิด</label>
                          <label className="red">*</label>

                          <input
                            id="user_birthday"
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
                        <div className="col-10 col-md-3">
                          <input
                            id="user_age"
                            type="text"
                            name="age"
                            value={age !== null ? age : ""}
                            readOnly
                            disabled
                            style={{ backgroundColor: "lightgray" }}
                            className="form-control"
                          />
                        </div>
                        <div className="col-10 col-md-3">
                          <label>น้ำหนัก</label>
                          <label className="red">*</label>
                          <input
                            id="user_weight"
                            type="text"
                            name="weight"
                            placeholder="น้ำหนัก"
                            value={users.weight}
                            className={`form-control ${
                              touched.weight && errors.weight && "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="weight"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-10 col-md-3">
                          <label>ส่วนสูง</label>
                          <label className="red">*</label>
                          <input
                            id="user_height"
                            type="text"
                            name="height"
                            placeholder="ส่วนสูง"
                            value={users.height}
                            className={`form-control ${
                              touched.height && errors.height && "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="height"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-10 col-md-3">
                          <label>เบอร์โทร</label>
                          <label className="red">*</label>
                          <input
                            id="user_phoneNumbe"
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
                        <div className="col-10 col-md-3">
                          <label>โรคประจำตัว</label>

                          <input
                            id="user_congenital_disease"
                            type="text"
                            placeholder="โรคประจำตัว"
                            name="congenital_disease"
                            value={users.congenital_disease}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-10 col-md-3">
                          <label>ประวัติแพ้ยา</label>

                          <input
                            id="user_drugallergy"
                            type="text"
                            placeholder="ประวัติแพ้ยา"
                            name="drugallergy"
                            value={users.drugallergy}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <br></br>
                      <h6>รหัสผ่าน</h6>
                      <div className="rounded border p-4">
                        <div className="col-8 ">
                          <div className="row">
                            <div className="col-10 col-md-3">
                              <label>รหัสผ่าน</label>
                              <label className="red">*</label>
                              <input
                                id="user_password"
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
                      <h6>บุคคลที่ติดต่อได้</h6>
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-10 col-md-3">
                            <label>ชื่อ</label>
                            <label className="red">*</label>
                            <input
                              placeholder="ชื่อ"
                              id="user_contact_first_name"
                              type="text"
                              name="contact_first_name"
                              value={users.contact_first_name}
                              className={`form-control ${
                                touched.contact_first_name &&
                                errors.contact_first_name &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="contact_first_name"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-10 col-md-3">
                            <label>นามสกุล</label>
                            <label className="red">*</label>
                            <input
                              id="user_contact_last_name"
                              placeholder="นามสกุล"
                              type="text"
                              name="contact_last_name"
                              value={users.contact_last_name}
                              className={`form-control ${
                                touched.contact_last_name &&
                                errors.contact_last_name &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="contact_last_name"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-10 col-md-3">
                            <label>
                              ความสัมพันธ์
                              <label className="red">* &nbsp;</label>:{" "}
                            </label>{" "}
                            <select
                              id="user_contact_relation_id"
                              type="text"
                              name="contact_relation_id"
                              className={`form-select ${
                                touched.contact_relation_id &&
                                errors.contact_relation_id &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            >
                              <option value="" selected>
                                {" "}
                                เลือกความสัมพันธ์
                              </option>
                              <option value="บิดา">บิดา</option>
                              <option value="มารดา">มารดา</option>
                              <option value="สามี">สามี</option>
                              <option value="ภรรยา">ภรรยา</option>
                              <option value="พี่-น้อง">พี่-น้อง</option>
                              <option value="ญาติ">ญาติ</option>
                            </select>
                            <ErrorMessage
                              name="contact_relation_id"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-10 col-md-3">
                            <label>เบอร์โทร</label>
                            <label className="red">*</label>
                            <input
                              id="user_contact_phoneNumber"
                              type="phone"
                              name="contact_phoneNumber"
                              placeholder="เบอร์โทร"
                              value={users.contact_phoneNumber}
                              className={`form-control ${
                                touched.contact_phoneNumber &&
                                errors.contact_phoneNumber &&
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
                      </div>
                      <br></br>
                      ข้อมูลที่อยู่
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-10 col-md-3">
                            <label>รายละเอียดที่อยู่</label>
                            <label className="red">*</label>
                            <input
                              id="user_address"
                              type="text"
                              name="address"
                              placeholder="บ้านเลขที่"
                              value={users.address}
                              className={`form-control ${
                                touched.address &&
                                errors.address &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="error-message"
                            />
                          </div>

                          <div className="col-10 col-md-3">
                            <label>
                              จังหวัด<label className="red">* &nbsp;</label>:{" "}
                            </label>{" "}
                            <select
                              id="province"
                              name="province"
                              value={users.province}
                              className={`form-control ${
                                touched.province &&
                                errors.province &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            >
                              <option value="" disabled>
                                เลือกจังหวัด
                              </option>
                              {province.map((prov) => (
                                <option key={prov.id} value={prov.Provinces}>
                                  {prov.Provinces}
                                </option>
                              ))}
                            </select>
                            <ErrorMessage
                              name="province"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-10 col-md-3">
                            <label>อำเภอ</label>
                            <label className="red">*</label>
                            <input
                              id="user_district"
                              placeholder="อำเภอ"
                              type="text"
                              name="district"
                              value={users.district}
                              className={`form-control ${
                                touched.district &&
                                errors.district &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="district"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-10 col-md-3">
                            <label>ตำบล</label>
                            <label className="red">*</label>
                            <input
                              id="user_subdistrict"
                              type="text"
                              name="subdistrict"
                              placeholder="ตำบล"
                              value={users.subdistrict}
                              className={`form-control ${
                                touched.subdistrict &&
                                errors.subdistrict &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="subdistrict"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-10 col-md-3">
                            <label>รหัสไปรษณีย์</label>
                            <label className="red">*</label>
                            <input
                              id="user_postcode"
                              placeholder="รหัสไปรษณีย์"
                              name="postcode"
                              value={users.postcode}
                              className={`form-control ${
                                touched.postcode &&
                                errors.postcode &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="postcode"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mt-3">
                        <button
                          id="buttonRegisterUser"
                          type="submit"
                          className="btn btn-success mx-1"
                          onClick={handleClick}
                        >
                          บันทึก
                        </button>
                        <button
                          id="buttonCancelUser"
                          className="btn btn-danger mx-1"
                          onClick={() => navigate("/")}
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  </div>
                   )}
                    {isMobile &&(
                  <div className="card1 card  border-0 shadow p-4">
                    <h6 className="font ">ข้อมูลทั่วไป</h6>
                    <br></br>
                    <div className="rounded border p-4">
                      <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-sm-6">
                          <label>เลขบัตรประชาชน</label>
                          <label className="red">*</label>
                          <br></br>
                          <input
                            type="text"
                            id="user_id_card"
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

                        <div className="col-sm-6">
                          <label>
                            คำนำหน้าชื่อ <label className="red">* &nbsp;</label>
                            :{" "}
                          </label>{" "}
                          <select
                            id="user_prefix_name"
                            name="prefix_name"
                            className={`form-select ${
                              touched.prefix_name &&
                              errors.prefix_name &&
                              "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                            <option value="" selected>
                              เลือกคำนำหน้าชื่อ
                            </option>
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
                        <div className="col-sm-6">
                          <label>ชื่อ</label>
                          <label className="red">*</label>
                          <input
                            id="user_first_name"
                            type="text"
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
                        <div className="col-sm-6">
                          <label>นามสกุล</label>
                          <label className="red">*</label>
                          <input
                            id="user_last_name"
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
                        <div className="col-sm-6">
                          <label>
                            เพศ <label className="red">* &nbsp;</label>:{" "}
                          </label>{" "}
                          <select
                            id="user_gender"
                            name="gender"
                            className={`form-select ${
                              touched.gender && errors.gender && "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                            <option value="" selected>
                              เลือกเพศ
                            </option>
                            <option value="ชาย">ชาย</option>
                            <option value="หญิง">หญิง</option>
                          </select>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-sm-6">
                          <label>วันเดือนปีเกิด</label>
                          <label className="red">*</label>

                          <input
                            id="user_birthday"
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
                        <div className="col-sm-6">
                          <input
                            id="user_age"
                            type="text"
                            name="age"
                            value={age !== null ? age : ""}
                            readOnly
                            disabled
                            style={{ backgroundColor: "lightgray" }}
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label>น้ำหนัก</label>
                          <label className="red">*</label>
                          <input
                            id="user_weight"
                            type="text"
                            name="weight"
                            placeholder="น้ำหนัก"
                            value={users.weight}
                            className={`form-control ${
                              touched.weight && errors.weight && "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="weight"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label>ส่วนสูง</label>
                          <label className="red">*</label>
                          <input
                            id="user_height"
                            type="text"
                            name="height"
                            placeholder="ส่วนสูง"
                            value={users.height}
                            className={`form-control ${
                              touched.height && errors.height && "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="height"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="col-sm-6">
                          <label>เบอร์โทร</label>
                          <label className="red">*</label>
                          <input
                            id="user_phoneNumbe"
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
                        <div className="col-sm-6">
                          <label>โรคประจำตัว</label>

                          <input
                            id="user_congenital_disease"
                            type="text"
                            placeholder="โรคประจำตัว"
                            name="congenital_disease"
                            value={users.congenital_disease}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label>ประวัติแพ้ยา</label>

                          <input
                            id="user_drugallergy"
                            type="text"
                            placeholder="ประวัติแพ้ยา"
                            name="drugallergy"
                            value={users.drugallergy}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <br></br>
                      <h6>รหัสผ่าน</h6>
                      <div className="rounded border p-4">
                        <div className="col-8 ">
                          <div className="row">
                            <div className="col-sm-6">
                              <label>รหัสผ่าน</label>
                              <label className="red">*</label>
                              <input
                                id="user_password"
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
                      <h6>บุคคลที่ติดต่อได้</h6>
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-sm-6">
                            <label>ชื่อ</label>
                            <label className="red">*</label>
                            <input
                              placeholder="ชื่อ"
                              id="user_contact_first_name"
                              type="text"
                              name="contact_first_name"
                              value={users.contact_first_name}
                              className={`form-control ${
                                touched.contact_first_name &&
                                errors.contact_first_name &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="contact_first_name"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-sm-6">
                            <label>นามสกุล</label>
                            <label className="red">*</label>
                            <input
                              id="user_contact_last_name"
                              placeholder="นามสกุล"
                              type="text"
                              name="contact_last_name"
                              value={users.contact_last_name}
                              className={`form-control ${
                                touched.contact_last_name &&
                                errors.contact_last_name &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="contact_last_name"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-sm-6">
                            <label>
                              ความสัมพันธ์
                              <label className="red">* &nbsp;</label>:{" "}
                            </label>{" "}
                            <select
                              id="user_contact_relation_id"
                              type="text"
                              name="contact_relation_id"
                              className={`form-select ${
                                touched.contact_relation_id &&
                                errors.contact_relation_id &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            >
                              <option value="" selected>
                                {" "}
                                เลือกความสัมพันธ์
                              </option>
                              <option value="บิดา">บิดา</option>
                              <option value="มารดา">มารดา</option>
                              <option value="สามี">สามี</option>
                              <option value="ภรรยา">ภรรยา</option>
                              <option value="พี่-น้อง">พี่-น้อง</option>
                              <option value="ญาติ">ญาติ</option>
                            </select>
                            <ErrorMessage
                              name="contact_relation_id"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-sm-6">
                            <label>เบอร์โทร</label>
                            <label className="red">*</label>
                            <input
                              id="user_contact_phoneNumber"
                              type="phone"
                              name="contact_phoneNumber"
                              placeholder="เบอร์โทร"
                              value={users.contact_phoneNumber}
                              className={`form-control ${
                                touched.contact_phoneNumber &&
                                errors.contact_phoneNumber &&
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
                      </div>
                      <br></br>
                      ข้อมูลที่อยู่
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-sm-6">
                            <label>รายละเอียดที่อยู่</label>
                            <label className="red">*</label>
                            <input
                              id="user_address"
                              type="text"
                              name="address"
                              placeholder="บ้านเลขที่"
                              value={users.address}
                              className={`form-control ${
                                touched.address &&
                                errors.address &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="error-message"
                            />
                          </div>

                          <div className="col-sm-6">
                            <label>
                              จังหวัด<label className="red">* &nbsp;</label>:{" "}
                            </label>{" "}
                            <select
                              id="province"
                              name="province"
                              value={users.province}
                              className={`form-control ${
                                touched.province &&
                                errors.province &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            >
                              <option value="" disabled>
                                เลือกจังหวัด
                              </option>
                              {province.map((prov) => (
                                <option key={prov.id} value={prov.Provinces}>
                                  {prov.Provinces}
                                </option>
                              ))}
                            </select>
                            <ErrorMessage
                              name="province"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-sm-6">
                            <label>อำเภอ</label>
                            <label className="red">*</label>
                            <input
                              id="user_district"
                              placeholder="อำเภอ"
                              type="text"
                              name="district"
                              value={users.district}
                              className={`form-control ${
                                touched.district &&
                                errors.district &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="district"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-sm-6">
                            <label>ตำบล</label>
                            <label className="red">*</label>
                            <input
                              id="user_subdistrict"
                              type="text"
                              name="subdistrict"
                              placeholder="ตำบล"
                              value={users.subdistrict}
                              className={`form-control ${
                                touched.subdistrict &&
                                errors.subdistrict &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="subdistrict"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="col-sm-6">
                            <label>รหัสไปรษณีย์</label>
                            <label className="red">*</label>
                            <input
                              id="user_postcode"
                              placeholder="รหัสไปรษณีย์"
                              name="postcode"
                              value={users.postcode}
                              className={`form-control ${
                                touched.postcode &&
                                errors.postcode &&
                                "is-invalid"
                              }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="postcode"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mt-3">
                        <button
                          id="buttonRegisterUser"
                          type="submit"
                          className="btn btn-success mx-1"
                          onClick={handleClick}
                        >
                          บันทึก
                        </button>
                        <button
                          id="buttonCancelUser"
                          className="btn btn-danger mx-1"
                          onClick={() => navigate("/")}
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  </div>
                   )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
}
export default Register;
