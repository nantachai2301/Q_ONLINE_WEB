import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormik, Formik, Form, ErrorMessage } from "formik";
import Schema from "./Validation";
import axios from "axios";
import Select from "react-select";
import { getPatientById ,updatePatientById} from "../../../service/Patient.Service";

function EditProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [originalBirthday, setOriginalBirthday] = useState(""); // ตัวแปรเก็บค่าวันเกิดเดิม
  const [error, setError] = useState(false);
  const [age, setAge] = useState(null);
  const [users, setUsers] = useState({
    users_id: "",
    id_card: "",
    password: "", // เปลี่ยนชื่อฟิลด์นี้เป็น password
    prefix_name: "",
    first_name: "",
    first_name: "",
    last_name: "",
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
    role_id: "",
    department_id: "",
  });
  const { users_id } = useParams();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await getPatientById(users_id);

        setUsers(res.data);

        const password = res.data.password;

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
        title: "คุณแน่ใจที่จะอัพเดทข้อมูลผู้ใช้ ?",
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
          weight,
          height,
          phoneNumber,
          congenital_disease,
          drugallergy,
          contact_first_name,
          contact_last_name,
          contact_relation_id,
          contact_phoneNumber,
          address,
          subdistrict,
          district,
          province,
          postcode,
          subdistrictsId,
          img,
          role_id,
        } = users;
        const response = await updatePatientById(
          users_id,
          id_card,
          password,
          prefix_name,
          first_name,
          last_name,
          gender,
          birthday,
          weight,
          height,
          phoneNumber,
          congenital_disease,
          drugallergy,
          contact_first_name,
          contact_last_name,
          contact_relation_id,
          contact_phoneNumber,
          address,
          subdistrict,
          district,
          province,
          postcode,
          subdistrictsId,
          img,
          role_id,
          {}
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "อัพเดตข้อมูลผู้ใช้สำเร็จ",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/admin/user");
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลผู้ใช้",
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
        text: "เกิดข้อผิดพลาดในการอัพเดตข้อมูลผู้ใช้",
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
                <Link to="/admin/user" className="nav-breadcrumb">
                  ข้อมูลรายชื่อผู้ใช้
                </Link>
              </li>
              <li
                className="breadcrumb-item text-black fw-semibold"
                aria-current="page"
              >
                {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อผู้ใช้
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "เพิ่ม" : "แก้ไข"}ข้อมูลรายชื่อผู้ใช้
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
              <div className="container mt-6 ">
                <div className="mb-5">
                  <div className="card border-1 shadow p-2">
                    <h6 className="font ">ข้อมูลทั่วไป</h6>
                    <br></br>
                    <div className="rounded border p-4">
                      <div className="row gx-3 gy-2 align-items-center">
                        <div className="col-4">
                          <label>เลขบัตรประชาชน</label>
                          <label className="red">*</label>
                          <br></br>
                          <input
                            type="text"
                            name="id_card"
                            value={users.id_card}
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

                        <div className="col-auto">
                          <label>
                            คำนำหน้าชื่อ <label className="red">* &nbsp;</label>
                            :{" "}
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
                        <div className="col-auto">
                          <label>ชื่อ</label>
                          <label className="red">*</label>
                          <input
                            type="name"
                            name="first_name"
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
                        <div className="col-auto">
                          <label>นามสกุล</label>
                          <label className="red">*</label>
                          <input
                            type="text"
                            name="last_name"
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

                        <div className="col-auto">
                          <label>
                            เพศ <label className="red">* &nbsp;</label>:{" "}
                          </label>{" "}
                          <select
                            name="gender"
                            className={`form-select ${
                              touched.gender && errors.gender && "is-invalid"
                            }`}
                            onChange={handleChange}
                          >
                            <option selected>{users.gender}</option>
                            <option value="ชาย">ชาย</option>
                            <option value="หญิง">หญิง</option>
                          </select>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="col-sm-3">
                          <label>วันเดือนปีเกิด</label>
                          <label className="red">*</label>

                          <input
                            name="birthday"
                            type="date"
                            value={
                              users.birthday ? formatDate(users.birthday) : ""
                            }
                            className={`form-control ${
                              touched.birthday &&
                              errors.birthday &&
                              "is-invalid"
                            }`}
                            onChange={handleDateChange}
                          />
                        </div>
                        <div className="col-2 px-1 mt-2">
                          <label>อายุ</label>
                          <input
                            type="text"
                            name="age"
                            value={age !== null ? age : ""}
                            disabled
                          style={{ backgroundColor: 'lightgray' }} 
                            className="form-control"
                          />
                        </div>
                        <div className="col-sm-2">
                          <label>น้ำหนัก</label>
                          <label className="red">*</label>
                          <input
                            type="weight"
                            name="weight"
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

                        <div className="col-2">
                          <label>ส่วนสูง</label>
                          <label className="red">*</label>
                          <input
                            type="height"
                            name="height"
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

                        <div className="col-3">
                          <label>เบอร์โทร</label>
                          <label className="red">*</label>
                          <input
                            type="phone"
                            name="phoneNumber"
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
                            type="text"
                            name="congenital_disease"
                            value={users.congenital_disease}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-6">
                          <label>ประวัติแพ้ยา</label>

                          <input
                            type="text"
                            name="drugallergy"
                            value={users.drugallergy}
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                     
                      <br></br>
                      <h6>บุคคลที่ติดต่อได้</h6>
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-4">
                            <label>ชื่อ</label>
                            <label className="red">*</label>
                            <input
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
                          <div className="col-4 px-1 mt-2">
                            <label>นามสกุล</label>
                            <label className="red">*</label>
                            <input
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
                          <div className="col-4 px-1 mt-2">
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
                              <option selected>
                                {users.contact_relation_id}
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
                          <div className="col-4 px-1 mt-2">
                            <label>เบอร์โทร</label>
                            <label className="red">*</label>
                            <input
                              type="phoneNumber"
                              className="form-control"
                              name="contact_phoneNumber"
                              value={users.contact_phoneNumber}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <br></br>
                      ข้อมูลที่อยู่
                      <div className="rounded border p-4">
                        <div className="row gx-3 gy-2 align-items-center">
                          <div className="col-3">
                            <label>รายละเอียดที่อยู่</label>
                            <label className="red">*</label>
                            <input
                              type="address"
                              className="form-control"
                              name="address"
                              value={users.address}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-2 ">
                            <label>
                              จังหวัด<label className="red">* &nbsp;</label>:{" "}
                            </label>{" "}
                            <select
                              name="province"
                              className="form-select"
                              onChange={handleChange}
                            >
                              <option selected>{users.province}</option>

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
                              <option value="สมุทรปราการ">สมุทรปราการ </option>
                              <option value="สมุทรสงคราม">สมุทรสงคราม </option>
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
                              <option value="หนองบัวลำภู">หนองบัวลำภู </option>
                              <option value="อำนาจเจริญ">อำนาจเจริญ </option>
                              <option value="อุดรธานี">อุดรธานี </option>
                              <option value="อุตรดิตถ์">อุตรดิตถ์ </option>
                              <option value="อุทัยธานี">อุทัยธานี </option>
                              <option value="อุบลราชธานี">อุบลราชธานี</option>
                              <option value="อ่างทอง">อ่างทอง </option>

                              <div className="invalid-feedback">
                                กรุณาเลือกจังหวัด
                              </div>
                            </select>
                          </div>
                          <div className="col-2">
                            <label>อำเภอ</label>
                            <label className="red">*</label>
                            <input
                              type="district"
                              className="form-control"
                              name="district"
                              value={users.district}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-2">
                            <label>ตำบล</label>
                            <label className="red">*</label>
                            <input
                              name="subdistrict"
                              className="form-control"
                              value={users.subdistrict}
                              placeholder="รายละเอียดที่อยู่"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-3">
                            <label>รหัสไปรษณีย์</label>
                            <label className="red">*</label>
                            <input
                              name="postcode"
                              className="form-control"
                              value={users.postcode}
                              onChange={handleChange}
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
                          บันทึก
                        </button>

                        <button
                          className="btn btn-danger mx-1"
                          onClick={() => navigate("/admin/user")}
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

export default EditProfile;
