import React, { Fragment, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { TextSelect } from '../../../components/TextSelect';
import {  getDepartmentTypeAll } from '../../../service/DepartmentType.Service';
import { getOpenSchedule, updateStatusOpenSchedule, deleteOpenSchedule } from '../../../service/OpenSchedule.Service';
import ShowData from './ShowData';
import Swal from 'sweetalert2';

function OpenSchedule() {
  const [dataTreatment, setDataTreatment] = useState([]);
  const [data, setData] = useState([]);
  const [pagin, setPagin] = useState({
    totalRow: 1,
    pageSize: 10,
    currentPage: 1,
    totalPage: 1,
  });

  useEffect(() => {
    fetchData(10, 1, '', '', '', '');
    getDepartmentTypeAll();
  }, []);

  // ฟังก์ชันดึงข้อมูลประเภทการรักษาทั้งหมด
  async function getDepartmentTypeAll() {
    let res = await getDepartmentTypeAll();
    if (res) {
      if (res.statusCode === 200 && res.taskStatus) {
        res.data.unshift({ id: '', name: 'ทั้งหมด' });
        setDataTreatment(res.data);
      }
    }
  }

  // ฟังก์ชันดึงข้อมูลแบบแบ่งหน้า
  async function fetchData(pageSize, currentPage, search, treatment, startDate, endDate) {
    let res = await getOpenSchedule(pageSize, currentPage, search, treatment, startDate, endDate);
    if (res) {
      if (res.statusCode === 200 && res.taskStatus) {
        setData(res.data);
        setPagin(res.pagin);
      }
    }
  }

  // ฟังก์ชันอัพเดทสถานะการใช้งาน
  function updateStatus(id, data) {
    Swal.fire({
      title: 'คุณต้องการอัพเดทสถานะรายการนี้ใช่หรือไม่ !',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await updateStatusOpenSchedule(id, data);
        if (res) {
          if (res.statusCode === 200 && res.taskStatus) {
            Swal.fire({
              icon: 'success',
              title: 'อัพเดทข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            fetchData(10, 1, '', '', '', '');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'อัพเดทข้อมูลไม่สำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      }
    });
  }

  // ฟังก์ชันลบ
  function deleteData(id) {
    Swal.fire({
      title: 'คุณต้องการลบรายการนี้ใช่หรือไม่ !',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await deleteOpenSchedule(id);
        if (res) {
          if (res.statusCode === 200 && res.taskStatus) {
            Swal.fire({
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            fetchData(10, 1, '', '', '', '');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'ลบข้อมูลไม่สำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      }
    });
  }

  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item text-black fw-semibold" aria-current="page">
                ข้อมูลการเปิดจองคิว
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">ตารางเปิดจองคิว</h2>
        </div>
        <Formik
          enableReinitialize={true}
          // validationSchema={Schema}
          initialValues={{
            search: '',
            treatment: '',
            startDate: '',
            endDate: '',
          }}
          onSubmit={(value) => {
            console.log('submit :', value);
            fetchData(pagin.pageSize, 1, value.search, value.treatment, value.startDate, value.endDate);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-3">
                  <label>ค้นหา</label>
                  <input
                    value={values.search}
                    type="text"
                    className="form-input"
                    onChange={(e) => {
                      setFieldValue('search', e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label>ประเภทการรักษา</label>
                  <TextSelect
                    id="treatment"
                    name="treatment"
                    options={dataTreatment}
                    value={dataTreatment.filter((a) => a.id === values.treatment)}
                    onChange={(item) => {
                      setFieldValue('treatment', item.id);
                    }}
                    getOptionLabel={(z) => z.name}
                    getOptionValue={(x) => x.id}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label>วันที่เปิดจองคิว</label>
                  <input
                    value={values.startDate}
                    type="date"
                    className="form-input"
                    onChange={(e) => {
                      setFieldValue('startDate', e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label>ถึงวันที่</label>
                  <input
                    value={values.endDate}
                    type="date"
                    className="form-input"
                    onChange={(e) => {
                      setFieldValue('endDate', e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button type="submit" className="btn btn-success mx-1">
                  <i className="fa-solid fa-magnifying-glass mx-1"></i>
                  ค้นหา
                </button>
                <button
                  type="reset"
                  className="btn btn-secondary mx-1"
                  onClick={() => {
                    fetchData(10, 1, '', '', '', '');
                  }}
                >
                  <i className="fa-solid fa-rotate-left mx-1"></i>
                  ล้างค่า
                </button>
              </div>
              <div className="w-full mt-5">
                <ShowData
                  data={data}
                  pagin={pagin}
                  updateStatus={updateStatus}
                  deleteData={deleteData}
                  changePage={(page) => {
                    fetchData(pagin.pageSize, page, values.search, values.treatment, values.startDate, values.endDate);
                  }}
                  changePageSize={(pagesize) => {
                    fetchData(pagesize, 1, values.search, values.treatment, values.startDate, values.endDate);
                  }}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
}

export default OpenSchedule;
