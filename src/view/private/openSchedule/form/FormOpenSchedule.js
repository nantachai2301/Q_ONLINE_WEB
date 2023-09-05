import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import { TextSelect } from '../../../../components/TextSelect';
import { getDepartmentTypeAll } from '../../../../service/DepartmentType.Service';
import { getDoctorBy } from '../../../../service/Doctor.Service';
import { createOpenSchedule, getDetailOpenSchedule, updateOpenSchedule } from '../../../../service/OpenSchedule.Service';
import Schema from './Validation';
import Swal from 'sweetalert2';

function FormOpenScheduld() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataDepartment, setDataDepartment] = useState([]);
  const [dataDoctor, setDataDoctor] = useState([]);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    getDepartmentAll();
    if (location.state && !detail) {
      getDetail(location.state);
    }
    if (detail) {
      getDoctor(detail.department_type_id ? detail.department_type_id : 0);
    }
  }, [detail, location.state]);

  async function getDetail(id) {
    let res = await getDetailOpenSchedule(id);
    if (res) {
      if (res.statusCode === 200 && res.taskStatus) {
        setDetail(res.data);
      }
    }
  }

  async function getDepartmentAll() {
    let res = await getDepartmentTypeAll();
    if (res) {
      if (res.statusCode === 200 && res.taskStatus) {
        setDataDepartment(res.data);
      }
    }
  }

  async function getDoctor(id) {
    let res = await getDoctorBy(id);
    if (res) {
      if (res.statusCode === 200 && res.taskStatus) {
        setDataDoctor(res.data);
      }
    }
  }

  async function save(data) {
    let res = location.state ? await updateOpenSchedule(location.state, data) : await createOpenSchedule(data);
    if (res) {
      if (res.statusCode === 200 && res.taskStatus) {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/admin/open-schedule');
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
                <Link to="/admin/open-schedule" className="nav-breadcrumb">
                  ข้อมูลการเปิดจองคิว
                </Link>
              </li>
              <li className="breadcrumb-item text-black fw-semibold" aria-current="page">
                {location.state ? 'แก้ไข' : 'เพิ่ม'}ข้อมูลการเปิดจองคิว
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">{location.state ? 'แก้ไข' : 'เพิ่ม'}ข้อมูลการเปิดจองคิว</h2>
        </div>
        <Formik
          enableReinitialize={true}
          validationSchema={Schema}
          initialValues={{
            department: detail ? detail.department_type_id : '',
            doctor: detail ? detail.doctor_id : '',
            openDate: detail ? (detail.open_date ? detail.open_date.split('T')[0] : '') : '',
            amount: detail ? (detail.amount ? parseInt(detail.amount) : '') : '',
          }}
          onSubmit={(value) => {
            console.log('submit :', value);
            save(value);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row d-flex justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                  <div className="row">
                    <div className="col-12 px-1 mt-2">
                      <label>ประเภทการรักษา</label>
                      <TextSelect
                        id="department"
                        name="department"
                        options={dataDepartment}
                        value={dataDepartment.filter((a) => a.id === values.department)}
                        onChange={(item) => {
                          getDoctor(item.id);
                          setFieldValue('doctor', '');
                          setFieldValue('department', item.id);
                        }}
                        getOptionLabel={(z) => z.name}
                        getOptionValue={(x) => x.id}
                      />
                    </div>
                    <div className="col-12 px-1 mt-2">
                      <label>ชื่อแพทย์</label>
                      <TextSelect
                        id="doctor"
                        name="doctor"
                        options={dataDoctor}
                        value={dataDoctor.filter((a) => a.id === values.doctor)}
                        onChange={(item) => {
                          setFieldValue('doctor', item.id);
                        }}
                        getOptionLabel={(z) => z.fullname}
                        getOptionValue={(x) => x.id}
                      />
                    </div>
                    <div className="col-12 px-1 mt-2">
                      <label>วันที่เปิดจองคิว</label>
                      <input
                        name="openDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={values.openDate}
                        className={`form-input ${touched.openDate ? (errors.openDate ? 'invalid' : 'valid') : ''}`}
                        onChange={(e) => {
                          setFieldValue('openDate', e.target.value);
                        }}
                      />
                      <ErrorMessage component="div" name="openDate" className="text-invalid" />
                    </div>
                    <div className="col-12 px-1 mt-2">
                      <label>จำนวน</label>
                      <input
                        name="amount"
                        type="number"
                        value={values.amount}
                        className={`form-input ${touched.amount ? (errors.amount ? 'invalid' : 'valid') : ''}`}
                        onChange={(e) => {
                          setFieldValue('amount', e.target.value);
                        }}
                      />
                      <ErrorMessage component="div" name="amount" className="text-invalid" />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <button type="submit" className="btn btn-success mx-1">
                      บันทึก
                    </button>
                    <button
                      type="reset"
                      className="btn btn-secondary mx-1"
                      onClick={() => {
                        getDoctor(0);
                      }}
                    >
                      ล้างค่า
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

export default FormOpenScheduld;
