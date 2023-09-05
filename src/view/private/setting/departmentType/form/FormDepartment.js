import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import Swal from 'sweetalert2';
import "../../../../../style/showdepartments.css";
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


function FormDepartment() {
  const location = useLocation();
  const [departments, setDepartments] = useState({
    department_id: null,
    department_name: "",
    department_image: "",
    open_time: "08:00",
    close_time: "",
    department_phone: "",
    max_queue_number: "",
    floor: "",
    building: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setDepartments((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const result = await Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update this departments?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        // ทำการอัปเดตข้อมูลแผนก
        await axios.post("http://localhost:5000/apis/departments/", departments);
        Swal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/admin/department-type");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลแผนกและการตรวจรักษา',
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

        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          onSubmit={handleClick}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row">
                <div className='card1' >
                  <div className="de">
                    <div className="row1">
                      <div className="de1">
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

                      <div className="de2">
                        <label>ชื่อแผนก</label>
                        <label className="red">*</label>
                        <input
                          name="department_name"
                          type="text"
                          placeholder="ชื่อแผนก"
                          value={departments.department_name}
                          className={`form-select ${touched.department_name && errors.department_name
                            ? "is-invalid"
                            : ""
                            }`}
                          aria-label="Default select example"
                          onChange={handleChange}
                        />

                        <ErrorMessage
                          name="department_name"
                          component="div"
                          className="error-message"
                        />

                      </div>

                      <div className="de3">
                        <label>เวลาเปิด</label>
                        <label className="red">*</label>
                        <input
                          name="open_time"
                          type="time"
                          placeholder="เวลาเปิด"
                          value={departments.open_time}
                          className={`form-select ${touched.open_time && errors.open_time
                            ? "is-invalid"
                            : ""
                            }`}
                            onChange={handleChange}
                          // pattern="^(?:[01]\d|2[0-3]):[0-5]\d$"
                          // title="กรุณากรอกเวลาในรูปแบบ HH:mm (เช่น 08:30)"
                        />
                        <ErrorMessage
                          name="open_time"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="de4">
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
                          // pattern="^(?:[01]\d|2[0-3]):[0-5]\d$"
                          // title="กรุณากรอกเวลาในรูปแบบ HH:mm (เช่น 17:00)"
                        />
                        <ErrorMessage
                          name="close_time"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="de5">
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

                      <div className="de6">
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
                          className={`form-select ${touched.department_phone && errors.department_phone
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

                      <div className="de8">
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
    </Fragment>
  )
}

export default FormDepartment