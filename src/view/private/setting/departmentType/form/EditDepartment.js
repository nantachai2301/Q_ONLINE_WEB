import React, { Fragment, useEffect, useState } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  department_name: Yup.string().required('กรุณากรอก ชื่อแผนก'),
  department_image: Yup.string().required('กรุณากรอก เลือกรูปภาพ'),
  open_time: Yup.string()
  .required('กรุณากรอก เวลาเปิด'),
  // .matches(
  //   /^(?:[01]\d|2[0-3]):[0-5]\d$/,
  //   'กรุณากรอกเวลาในรูปแบบ HH:mm (เช่น 08:30)'
  // ),
close_time: Yup.string()
  .required('กรุณากรอก เวลาปิด'),
  // .matches(
  //   /^(?:[01]\d|2[0-3]):[0-5]\d$/,
  //   'กรุณากรอกเวลาในรูปแบบ HH:mm (เช่น 17:00)'
  // ),
  department_phone:Yup.string().required('กรุณากรอก เบอร์โทรแผนก'),
  max_queue_number: Yup.string().required('กรุณากรอก จำนวนคิวที่เปิดรับ'),
  floor: Yup.string().required('กรุณากรอก ชั้น'),
  building: Yup.string().required('กรุณากรอก อาคาร'),
});


function EditDepartment() {
  const location = useLocation();
  const [departments, setDepartments] = useState({
    department_id: "",
    department_name: "",
    department_image: "",
    open_time: "",
    close_time: "",
    department_phone: "",
    max_queue_number: "",
    floor: "",
    building: "",
  });
  const { department_id } = useParams();

  useEffect(() => {
    const fetchAllDepartments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/apis/departments/" + department_id
        );

        setDepartments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllDepartments();
  }, [department_id]);

  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartments((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async () => {
    try {
      const isValid = await Schema.isValid(departments);
      console.log(departments)
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
        text: "Are you sure you want to update this department?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.put(
          `http://localhost:5000/apis/departments/${department_id}`,
          departments
        );

        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "บันทึกข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/admin/department-type");
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
        text: "เกิดข้อผิดพลาดในการอัปเดตแผนก",
        showConfirmButton: true,
      });
    }
  };



  return (
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
                {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อแผนกและการตรวจรักษา
              </li>

          </ol>

        </nav>

      </div>
      <div className="w-full mb-5">
          <h2 className="title-content">
            {location.state ? "แก้ไข" : "แก้ไข"}ข้อมูลรายชื่อแผนกและการตรวจรักษา
          </h2>
        </div>

        <Formik 
         enableReinitialize={true}
          validationSchema={Schema}
          initialValues={departments}
          onSubmit={handleClick}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
               <div className="row1">
                <div className='card2'>
                  <div className="De1">
                    <div className="row2">
                      <div className="De2">
                        <label>เลือกรูปภาพแผนก</label>
                        <br />
                        <img className="img-hpt" src={departments.department_image} />
                        <br />

                        <input
                          type="text"
                          name="department_image"
                          className="form-control"
                          onChange={handleChange}
                        />

                      </div>

                      <div className="De3">
                        <label>ชื่อแผนก</label>
                        <label className="red">*</label>
                        <select
                          name="department_name"
                          type="text"
                          placeholder="ชื่อแผนก"
                          className={`form-select ${touched.department_name && errors.department_name
                              ? "is-invalid"
                              : ""
                            }`}
                          aria-label="Default select example"
                          onChange={handleChange}
                        >
                          <option selected>{departments.department_name}</option>
                          <option value="ทันตกรรม">ทันตกรรม</option>
                          <option value="กุมารเวชกรรม">กุมารเวชกรรม</option>
                          <option value="ทั่วไป">ทั่วไป</option>
                          <option value="สูติ-นรีเวช">สูติ-นรีเวช</option>
                          <option value="ศัลยกรรม">ศัลยกรรม</option>
                          <option value="หัวใจ">หัวใจ</option>
                          <option value="ผิวหนัง">ผิวหนัง</option>
                        </select>
                        <ErrorMessage
                          name="department_name"
                          component="div"
                          className="error-message"
                        />

                      </div>

                      <div className="De4">
                        <label>เวลาเปิด</label>
                        <label className="red">*</label>
                        <input
                          name="open_time"
                          type="time"
                          placeholder="เวลาเปิด"
                          value={departments.open_time}
                          className={`form-control ${touched.open_time && errors.open_time
                            ? "is-invalid"
                            : ""
                            }`}
                          onChange={handleChange}
                        />
                        <ErrorMessage
                          name="open_time"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="De5">
                        <label>เวลาปิด</label>
                        <label className="red">*</label>
                        <input
                          name="close_time"
                          type="time"
                          placeholder="เวลาปิด"
                          value={departments.close_time}
                          className={`form-select ${touched.close_time && errors.close_time
                              ? "is-invalid"
                              : ""
                            }`}
                          onChange={handleChange}
                        />
                        <ErrorMessage
                          name="close_time"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="De6">
                        <label>อาคาร</label>
                        <label className="red">*</label>
                        <input
                          name="building"
                          type="text"
                          placeholder="อาคาร"
                          value={departments.building}
                          className={`form-select ${touched.building && errors.building
                              ? "is-invalid"
                              : ""
                            }`}
                          onChange={handleChange}
                        />
                        <ErrorMessage
                          name="building"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="De7">
                        <label>ชั้น</label>
                        <label className="red">*</label>
                        <input
                          name="floor"
                          type="text"
                          placeholder="ชั้น"
                          value={departments.floor}
                          className={`form-select ${touched.floor && errors.floor
                              ? "is-invalid"
                              : ""
                            }`}
                          onChange={handleChange}
                        />
                        <ErrorMessage
                          name="floor"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="de7">
                        <label>เบอร์โทรแผนก</label>
                        <label className="red">*</label>
                        <input
                          name="department_phone"
                          type="text"
                          placeholder="เบอร์โทรแผนก"
                          value={departments.department_phone}
                          className={`form-control ${touched.department_phone && errors.department_phone
                            ? "is-invalid"
                            : ""
                            }`}
                          onChange={handleChange}
                        />
                        <ErrorMessage
                          name="department_phone"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="De8">
                        <label>จำนวนคิวสูงสุด</label>
                        <label className="red">*</label>
                        <input
                          name="max_queue_number"
                          type="text"
                          placeholder="จำนวนคิวสูงสุด"
                          value={departments.max_queue_number}
                          className={`form-select ${touched.max_queue_number && errors.max_queue_number
                              ? "is-invalid"
                              : ""
                            }`}
                          onChange={handleChange}
                        />
                        <ErrorMessage
                          name="max_queue_number"
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

              </div>
            </Form>
          )}

        </Formik>

    </div>
  )
}

export default EditDepartment