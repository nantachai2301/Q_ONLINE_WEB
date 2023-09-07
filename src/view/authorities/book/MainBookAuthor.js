import React, { Fragment, useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import Schema from "./Validation";
import Swal from "sweetalert2";
import ShowData from "./Showdata";
/**หน้าจองคิวของเจ้าหน้าที่จองให้ผู้ป่วย */
function MainBookAuthor() {
  const location = useLocation();
  const [age, setAge] = useState(0);
  const [users, setUsers] = useState({
    users_id: null,
    id_card: "",
    password: "", // เปลี่ยนชื่อฟิลด์นี้เป็น password
    prefix_name: "",
    first_name: "",
    last_name: "",
    age:"",
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
    subdistritsId: "",
    img: "",
    role_id: 0,
    // department_id: null,
    birthday: "",
  });

  const [queue, setQueue] = useState({
    queue_date: "",
    create_at: "",
    users_id: "",
    symptom: "",
    department_id: "",
    department_name: "",
    queue_status_id: "",
    questionaire_id: "",
    queue_id: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input Value:", value); // ตรวจสอบค่าใน console
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
  const handleClick = async () => {
    const usersWithAge = { ...users, age: age };
    try {
      const result = await Swal.fire({
        title: "ยืนยัน",
        text: "คุณแน่ใจหรือไม่ ว่าต้องการสร้างผู้ใช้ ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });
      if (users.birthday) {
        const birthDateObj = new Date(users.birthday); // แปลงวันที่ปีเกิดใน state ของคุณให้กลายเป็นออบเจ็กต์ของ Date
        const today = new Date(); // วันที่ปัจจุบัน
        const diffInMilliseconds = Math.abs(today - birthDateObj);
        const ageDate = new Date(diffInMilliseconds);
        const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        setAge(calculatedAge); // อัปเดต state ของอายุด้วยค่าที่คำนวณได้
      }
      const dataToSend = { ...users, age: age, users_id: users.users_id };

      if (result.isConfirmed) {
        try {
          await axios.post("http://localhost:5000/apis/patients/", dataToSend);
           
          

          Swal.fire({
            icon: "success",
            title: "บันทึกข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });

          navigate("/auth/Bookingwalkin");
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "เกิดข้อผิดพลาดในการจองคิว",
            showConfirmButton: true,
          });
        }
      }



    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ใช้",
        showConfirmButton: true,
      });
    }
  };
  const ageToShow = age !== null ? age : '';

  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/author/book-an-appointment/" className="nav-breadcrumb">
                  จองคิวผู้ป่วย Walkin
                </Link>
              </li>
              <li
                className="breadcrumb-item text-black fw-semibold"
                aria-current="page"
              >
                {location.state ? "แก้ไข" : "ลงทะเบียน"}การจองคิว
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "ลงทะเบียน"}การจองคิว
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
              <div className="container mt-2">
                <div className="mb-4">
                  <div className="card border-0 shadow p-4">
                    <h6 className="font ">ข้อมูลทั่วไป</h6><br></br>
                    <div className="rounded border p-4">
                      <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-3">

                          <label>เลขบัตรประชาชน</label>
                          <label className="red">*</label>
                          <br></br>
                          <input
                            type="text"
                            name="id_card"
                            value={users.id_card}
                            placeholder="เลขบัตรประชาชน 13 หลัก"
                            className={`form-control ${
                              touched.id_card &&
                              errors.id_card &&
                              "is-invalid"
                              }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="id_card"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-3">
                          <label>
                            คำนำหน้าชื่อ{" "}
                            <label className="red">* &nbsp;</label>:{" "}
                          </label>{" "}
                          <select
                            name="prefix_name"
                            className={`form-select ${
                              touched.prefix_name &&
                              errors.prefix_name &&
                              "is-invalid"
                              }`}
                            onChange={handleChange}
                          >
                            <option selected>เลือกคำนำหน้าชื่อ</option>
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

                        <div className="col-3">
                          <label>
                            เพศ <label className="red">* &nbsp;</label>:{" "}
                          </label>{" "}
                          <select
                            name="gender"
                            className={`form-select ${
                              touched.gender &&
                              errors.gender &&
                              "is-invalid"
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
                       

                            <div className="col-3">
                              <label>วันเดือนปีเกิด</label>
                              <label className="red">*</label>

                              <input
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
                            <div className="col-2">
                        <label>อายุ</label>
                        <input
                          type="text"
                          name="age"
                          value={age !== null ? age : ''} // ใช้ค่า state ของอายุที่คำนวณได้ ถ้ามีค่า (ไม่ใช่ null) ให้แสดงค่าอายุ ถ้าไม่ใช่ให้แสดงเป็นช่องว่าง
                          readOnly
                          className="form-control"
                        />
                      </div>

                        {/* <div className="col-2 px-1 mt-2">
                          <label>อายุ</label>
                          <input
                            type="text"
                            name="age"
                            value={age !== null ? age : ''} // ใช้ค่า state ของอายุที่คำนวณได้ ถ้ามีค่า (ไม่ใช่ null) ให้แสดงค่าอายุ ถ้าไม่ใช่ให้แสดงเป็นช่องว่าง
                            readOnly
                            className="form-control"
                          />
                        </div> */}

                        <div className="col-3">
                          <label>น้ำหนัก</label>
                          <label className="red">*</label>
                          <input
                            type="weight"
                            name="weight"
                            placeholder="น้ำหนัก"
                            value={users.weight}
                            className={`form-control ${
                              touched.weight &&
                              errors.weight &&
                              "is-invalid"
                              }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="weight"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-3">
                          <label>ส่วนสูง</label>
                          <label className="red">*</label>
                          <input
                            type="height"
                            name="height"
                            placeholder="ส่วนสูง"
                            value={users.height}
                            className={`form-control ${
                              touched.height &&
                              errors.height &&
                              "is-invalid"
                              }`}
                            onChange={handleChange}
                          />
                          <ErrorMessage
                            name="height"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-3">
                          <label>เบอร์โทร</label>
                          <label className="red">*</label>
                          <input
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

                        <div className="col-3">
                          <label>โรคประจำตัว</label>
                          <label className="red">*</label>
                          <input
                            type="text"
                            placeholder="โรคประจำตัว"
                            name="congenital_disease"
                            value={users.congenital_disease}
                            className={`form-control ${
                            touched.congenital_disease &&
                            errors.congenital_disease &&
                            "is-invalid"
                          }`}
                            onChange={handleChange}
                          />
                             <ErrorMessage
                            name="congenital_disease"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-3">
                          <label>ประวัติแพ้ยา</label>
                          <label className="red">*</label>
                          <input
                            type="text"
                            placeholder="ประวัติแพ้ยา"
                            name="drugallergy"
                            value={users.drugallergy}
                            className={`form-control ${
                              touched.drugallergy &&
                              errors.drugallergy &&
                              "is-invalid"
                            }`}
                              onChange={handleChange}
                            />
                               <ErrorMessage
                              name="drugallergy"
                              component="div"
                              className="error-message"
                            />

                        </div>



                      </div>


                      

                     

                      <br></br>

                      <h6>บุคคลที่ติดต่อได้</h6>
                       <br></br>
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-3">


                            <label>ชื่อ</label>
                            <label className="red">*</label>
                            <input
                              placeholder="ชื่อ"
                              type="contact_first_name"
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

                          <div className="col-3">
                            <label>นามสกุล</label>
                            <label className="red">*</label>
                            <input
                              placeholder="นามสกุล"
                              type="contact_last_name"
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

                          <div className="col-3">
                            <label>
                              ความสัมพันธ์
                              <label className="red">* &nbsp;</label>:{" "}
                            </label>{" "}
                            <select
                              name="contact_relation_id"
                              className={`form-select ${
                                touched.contact_relation_id &&
                                errors.contact_relation_id &&
                                "is-invalid"
                                }`}
                              onChange={handleChange}
                            >
                              <option selected>เลือกความสัมพันธ์</option>
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

                          <div className="col-3">
                            <label>เบอร์โทร</label>
                            <label className="red">*</label>
                            <input
                              type="text"
                              placeholder="เบอร์โทร"
                              name="contact_phoneNumber"
                              value={users.contact_phoneNumber}
                              className={`form-select ${
                                touched.contact_phoneNumber &&
                                errors.contact_phoneNumber &&
                                "is-invalid"
                                }`}
                              onChange={handleChange}
                            />
                            <ErrorMessage
                              name="contact_phoneNumber"
                              component="div"
                              className="error-message"
                            />

                          </div>
                        </div>
                      </div>

                      <br></br>

                      <h6>ข้อมูลที่อยู่</h6>
                      <br></br>
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-3">

                            <label>รายละเอียดที่อยู่</label>
                            <label className="red">*</label>
                            <input
                              type="address"
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

                          <div className="col-3">
                            <label>
                              จังหวัด<label className="red">* &nbsp;</label>:{" "}
                            </label>{" "}
                            <select
                              name="province"
                              className={`form-control ${
                                touched.province &&
                                errors.province &&
                                "is-invalid"
                                }`}
                              onChange={handleChange}
                            >
                              <option value="" selected>
                                --------- เลือกจังหวัด ---------
                              </option>
                              <option value="กรุงเทพมหานคร">
                                กรุงเทพมหานคร
                              </option>
                              <option value="กระบี่">กระบี่ </option>
                              <option value="กาญจนบุรี">กาญจนบุรี </option>
                              <option value="กาฬสินธุ์">กาฬสินธุ์ </option>
                              <option value="กำแพงเพชร">กำแพงเพชร </option>
                              <option value="ขอนแก่น">ขอนแก่น</option>
                              <option value="จันทบุรี">จันทบุรี</option>
                              <option value="ฉะเชิงเทรา">ฉะเชิงเทรา </option>
                              <option value="ชัยนาท">ชัยนาท </option>
                              <option value="ชัยภูมิ">ชัยภูมิ </option>
                              <option value="ชุมพร">ชุมพร </option>
                              <option value="ชลบุรี">ชลบุรี </option>
                              <option value="เชียงใหม่">เชียงใหม่ </option>
                              <option value="เชียงราย">เชียงราย </option>
                              <option value="ตรัง">ตรัง </option>
                              <option value="ตราด">ตราด </option>
                              <option value="ตาก">ตาก </option>
                              <option value="นครนายก">นครนายก </option>
                              <option value="นครปฐม">นครปฐม </option>
                              <option value="นครพนม">นครพนม </option>
                              <option value="นครราชสีมา">นครราชสีมา </option>
                              <option value="นครศรีธรรมราช">
                                นครศรีธรรมราช{" "}
                              </option>
                              <option value="นครสวรรค์">นครสวรรค์ </option>
                              <option value="นราธิวาส">นราธิวาส </option>
                              <option value="น่าน">น่าน </option>
                              <option value="นนทบุรี">นนทบุรี </option>
                              <option value="บึงกาฬ">บึงกาฬ</option>
                              <option value="บุรีรัมย์">บุรีรัมย์</option>
                              <option value="ประจวบคีรีขันธ์">
                                ประจวบคีรีขันธ์{" "}
                              </option>
                              <option value="ปทุมธานี">ปทุมธานี </option>
                              <option value="ปราจีนบุรี">ปราจีนบุรี </option>
                              <option value="ปัตตานี">ปัตตานี </option>
                              <option value="พะเยา">พะเยา </option>
                              <option value="พระนครศรีอยุธยา">
                                พระนครศรีอยุธยา{" "}
                              </option>
                              <option value="พังงา">พังงา </option>
                              <option value="พิจิตร">พิจิตร </option>
                              <option value="พิษณุโลก">พิษณุโลก </option>
                              <option value="เพชรบุรี">เพชรบุรี </option>
                              <option value="เพชรบูรณ์">เพชรบูรณ์ </option>
                              <option value="แพร่">แพร่ </option>
                              <option value="พัทลุง">พัทลุง </option>
                              <option value="ภูเก็ต">ภูเก็ต </option>
                              <option value="มหาสารคาม">มหาสารคาม </option>
                              <option value="มุกดาหาร">มุกดาหาร </option>
                              <option value="แม่ฮ่องสอน">แม่ฮ่องสอน </option>
                              <option value="ยโสธร">ยโสธร </option>
                              <option value="ยะลา">ยะลา </option>
                              <option value="ร้อยเอ็ด">ร้อยเอ็ด </option>
                              <option value="ระนอง">ระนอง </option>
                              <option value="ระยอง">ระยอง </option>
                              <option value="ราชบุรี">ราชบุรี</option>
                              <option value="ลพบุรี">ลพบุรี </option>
                              <option value="ลำปาง">ลำปาง </option>
                              <option value="ลำพูน">ลำพูน </option>
                              <option value="เลย">เลย </option>
                              <option value="ศรีสะเกษ">ศรีสะเกษ</option>
                              <option value="สกลนคร">สกลนคร</option>
                              <option value="สงขลา">สงขลา </option>
                              <option value="สมุทรสาคร">สมุทรสาคร </option>
                              <option value="สมุทรปราการ">
                                สมุทรปราการ{" "}
                              </option>
                              <option value="สมุทรสงคราม">
                                สมุทรสงคราม{" "}
                              </option>
                              <option value="สระแก้ว">สระแก้ว </option>
                              <option value="สระบุรี">สระบุรี </option>
                              <option value="สิงห์บุรี">สิงห์บุรี </option>
                              <option value="สุโขทัย">สุโขทัย </option>
                              <option value="สุพรรณบุรี">สุพรรณบุรี </option>
                              <option value="สุราษฎร์ธานี">
                                สุราษฎร์ธานี{" "}
                              </option>
                              <option value="สุรินทร์">สุรินทร์ </option>
                              <option value="สตูล">สตูล </option>
                              <option value="หนองคาย">หนองคาย </option>
                              <option value="หนองบัวลำภู">
                                หนองบัวลำภู{" "}
                              </option>
                              <option value="อำนาจเจริญ">อำนาจเจริญ </option>
                              <option value="อุดรธานี">อุดรธานี </option>
                              <option value="อุตรดิตถ์">อุตรดิตถ์ </option>
                              <option value="อุทัยธานี">อุทัยธานี </option>
                              <option value="อุบลราชธานี">อุบลราชธานี</option>
                              <option value="อ่างทอง">อ่างทอง </option>
                              <option value="อื่นๆ">อื่นๆ</option>
                              <ErrorMessage
                                name="province"
                                component="div"
                                className="error-message"
                              />
                            </select>
                          </div>
                          <div className="col-3">
                            <label>อำเภอ</label>
                            <label className="red">*</label>
                            <input
                              placeholder="อำเภอ"
                              type="district"
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

                          <div className="col-3">
                            <label>ตำบล</label>
                            <label className="red">*</label>
                            <input
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
                          <div className="col-3">
                            <label>รหัสไปรษณีย์</label>
                            <label className="red">*</label>
                            <input
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
                          type="submit"
                          className="btn btn-success mx-1"
                          onClick={handleClick}
                        >
                          จองคิว
                        </button>

                        <button
                          className="btn btn-danger mx-1"
                        // onClick={() => navigate("/admin/user")}
                        >
                          ล้างค่า
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )
          }
        </Formik >
      </div >
    </Fragment >
  );
}

export default MainBookAuthor