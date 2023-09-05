import React, { Fragment, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { TextSelect } from '../../../components/TextSelect';
// import { getTreatmentTypeAll } from '../../../service/TreatmentType.Service';
import { getBookAppointment } from '../../../service/BookAppoinment.Service';
import ShowData from './Showdata';
import StatusBook from '../../../data/statusBook.json';
/**หน้าดูข้อมูลการจองคิวทั้งหมดของเจ้าหน้าที่ */
function MainHistoryAuthor() {
  const [dataDepartment, setDataDepartment] = useState([]);
  const [data, setData] = useState([]);
  const [pagin, setPagin] = useState({
    totalRow: 1,
    pageSize: 10,
    currentPage: 1,
    totalPage: 1,
  });

  useEffect(() => {
    fetchData(10, 1, localStorage.getItem('id'), '', '', '', '', '', '', '');
    
    //fetchData(10, 1, '', '', '', '', '', '', '', '');
    // getTreatmentAll();
  }, []);
  

  //ฟังก์ชันดึงข้อมูลประเภทการรักษาทั้งหมด
  // async function getTreatmentAll() {
  //   let res = await getTreatmentTypeAll();
  //   if (res) {
  //     if (res.statusCode === 200 && res.taskStatus) {
  //       res.data.unshift({ id: '', name: 'ทั้งหมด' });
  //       setDataTreatment(res.data);
  //     }
  //   }
  // }

  // ฟังก์ชันดึงข้อมูลแบบแบ่งหน้า
  async function fetchData(pageSize, currentPage, userId, search, treatment, status, startDate, endDate, openStartDate, openEndDate) {
    let res = await getBookAppointment(pageSize, currentPage, userId, search, treatment, status, startDate, endDate, openStartDate, openEndDate);
    if (res) {
      if (res.statusCode === 200 && res.taskStatus) {
        setData(res.data);
        setPagin(res.pagin);
      }
    }
  }

  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">ข้อมูลการจองคิวทั้งหมด</h2>
        </div>
        <Formik
          enableReinitialize={true}
          // validationSchema={Schema}
          initialValues={{
            userId: localStorage.getItem('id'),
            search: '',
            treatment: '',
            status: '',
            startDate: '',
            endDate: '',
            openStartDate: '',
            openEndDate: '',
          }}
          onSubmit={(value) => {
            console.log('submit :', value);
            fetchData(pagin.pageSize, 1, value.userId, value.search, value.treatment, value.status, value.startDate, value.endDate, value.openStartDate, value.openEndDate);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6 mt-1">
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
                <div className="col-12 col-md-6 col-lg-3 mt-1">
                  <label>แผนก</label>
                  <TextSelect
                    id="treatment"
                    name="treatment"
                    options={dataDepartment}
                    value={dataDepartment.filter((a) => a.id === values.Department)}
                    onChange={(item) => {
                      setFieldValue('department', item.id);
                    }}
                    getOptionLabel={(z) => z.name}
                    getOptionValue={(x) => x.id}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3 mt-1">
                  <label>สถานะ</label>
                  <TextSelect
                    id="status"
                    name="status"
                    options={StatusBook}
                    value={StatusBook.filter((a) => a.value === values.status)}
                    onChange={(item) => {
                      setFieldValue('status', item.value);
                    }}
                    getOptionLabel={(z) => z.label}
                    getOptionValue={(x) => x.value}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3 mt-1">
                  <label>วันที่จองคิว</label>
                  <input
                    value={values.startDate}
                    type="date"
                    className="form-input"
                    onChange={(e) => {
                      setFieldValue('startDate', e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3 mt-1">
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
                <div className="col-12 col-md-6 col-lg-3 mt-1">
                  <label>วันที่เข้ารับการรักษา</label>
                  <input
                    value={values.openStartDate}
                    type="date"
                    className="form-input"
                    onChange={(e) => {
                      setFieldValue('openStartDate', e.target.value);
                    }}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3 mt-1">
                  <label>ถึงวันที่</label>
                  <input
                    value={values.openStartDate}
                    type="date"
                    className="form-input"
                    onChange={(e) => {
                      setFieldValue('openStartDate', e.target.value);
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
                    fetchData(10, 1, localStorage.getItem('id'), '', '', '', '', '', '', '');
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
                  changePage={(page) => {
                    fetchData(pagin.pageSize, page, values.userId, values.search, values.treatment, values.status, values.startDate, values.endDate, values.openStartDate, values.openEndDate);
                  }}
                  changePageSize={(pagesize) => {
                    fetchData(pagesize, 1, values.userId, values.search, values.treatment, values.status, values.startDate, values.endDate, values.openStartDate, values.openEndDate);
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

export default MainHistoryAuthor;