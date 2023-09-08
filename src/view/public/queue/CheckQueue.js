// import React, { Fragment, useState, useEffect,Link } from 'react';
// import { Formik, Form } from 'formik';
// import { TextSelect } from '../../../components/TextSelect';
// // import { getTreatmentTypeAll } from '../../../service/TreatmentType.Service';
// import { getBookAppointment } from '../../../service/BookAppoinment.Service';
// import ShowDataCheckQueue from './ShowDataCheckQueue';
// import StatusBook from '../../../data/statusBook.json';

// function CheckQueue() {
//   const [dataDepartment, setDataDepartment] = useState([]);
//   const [data, setData] = useState([]);
//   const [pagin, setPagin] = useState({
//     totalRow: 1,
//     pageSize: 10,
//     currentPage: 1,
//     totalPage: 1,
//   });

//   useEffect(() => {
//     fetchData(10, 1, localStorage.getItem('id'), '', '', '', '', '', '', '');
    
//     //fetchData(10, 1, '', '', '', '', '', '', '', '');
//     // getTreatmentAll();
//   }, []);
  

//   //ฟังก์ชันดึงข้อมูลประเภทการรักษาทั้งหมด
//   // async function getTreatmentAll() {
//   //   let res = await getTreatmentTypeAll();
//   //   if (res) {
//   //     if (res.statusCode === 200 && res.taskStatus) {
//   //       res.data.unshift({ id: '', name: 'ทั้งหมด' });
//   //       setDataTreatment(res.data);
//   //     }
//   //   }
//   // }

//   // ฟังก์ชันดึงข้อมูลแบบแบ่งหน้า
//   async function fetchData(pageSize, currentPage, userId, search, treatment, status, startDate, endDate, openStartDate, openEndDate) {
//     let res = await getBookAppointment(pageSize, currentPage, userId, search, treatment, status, startDate, endDate, openStartDate, openEndDate);
//     if (res) {
//       if (res.statusCode === 200 && res.taskStatus) {
//         setData(res.data);
//         setPagin(res.pagin);
//       }
//     }
//   }

//   return (
//     <Fragment>
//       <div className="w-full">
//         <div className="d-flex justify-content-end">
//           <nav aria-label="breadcrumb">
//           <ol className="breadcrumb">
              
//               <li className="breadcrumb-item text-black fw-semibold" aria-current="page"><a href='/Q_user'>ตรวจสอบคิวของตนเอง</a>
              
//               </li>
//             </ol>
//           </nav>
//         </div>
//         <div className="w-full mb-5">
//           <h2 className="title-content">ตรวจสอบคิว</h2>
//         </div>
//         <Formik
//           enableReinitialize={true}
//           // validationSchema={Schema}
//           initialValues={{
//             userId: localStorage.getItem('id'),
//             search: '',
//             department_id: '',
//             status: '',
//             startDate: '',
//             endDate: '',
//             openStartDate: '',
//             openEndDate: '',
//           }}
//           onSubmit={(value) => {
//             console.log('submit :', value);
//             fetchData(pagin.pageSize, 1, value.userId, value.search, value.department_id, value.status, value.startDate, value.endDate, value.openStartDate, value.openEndDate);
//           }}
//         >
//           {({ values, errors, touched, setFieldValue }) => (
//             <Form>
//               <div className="row">
                
//                 <div className="col-6 px-1 mt-2">
//                           <label>แผนก</label>
                          

//                           <select
//                             class="form-select"
//                             aria-label="Default select example"
//                           >
//                            <option selected
//                            value={values.department_id}>เลือกแผนก</option>
//                             <option value="ทั่วไป">ทั่วไป</option>
//                             <option value="หัวใจ">หัวใจ</option>
//                             <option value="ทันตกรรม">ทันตกรรม</option>
//                             <option value="กุมารเวชกรรม">กุมารเวชกรรม</option>
//                             <option value="สูติ-นรีเวชกรรม">สูติ-นรีเวชกรรม</option>
                            
//                           </select>
//                           </div>
//                 {/* <div className="col-12 col-md-6 col-lg-3 mt-1">
//                   <label>แผนก</label>
//                   <TextSelect
//                     id="treatment"
//                     name="treatment"
//                     options={dataDepartment}
//                     value={dataDepartment.filter((a) => a.id === values.Department)}
//                     onChange={(item) => {
//                       setFieldValue('department', item.id);
//                     }}
//                     getOptionLabel={(z) => z.name}
//                     getOptionValue={(x) => x.id}
//                   />
//                 </div> */}
                
                
//               </div>
//               {/* <div className="d-flex justify-content-center mt-4">
//                 <button type="submit" className="btn btn-success mx-1">
//                   <i className="fa-solid fa-magnifying-glass mx-1"></i>
//                   ค้นหา
//                 </button>
//                 <button
//                   type="reset"
//                   className="btn btn-secondary mx-1"
//                   onClick={() => {
//                     fetchData(10, 1, localStorage.getItem('id'), '', '', '', '', '', '', '');
//                   }}
//                 >
//                   <i className="fa-solid fa-rotate-left mx-1"></i>
//                   ล้างค่า
//                 </button>
//               </div> */}
//               <div className="w-full mt-5">
//                 <ShowDataCheckQueue
//                   data={data}
//                   pagin={pagin}
//                   changePage={(page) => {
//                     fetchData(pagin.pageSize, page, values.userId, values.search, values.treatment, values.status, values.startDate, values.endDate, values.openStartDate, values.openEndDate);
//                   }}
//                   changePageSize={(pagesize) => {
//                     fetchData(pagesize, 1, values.userId, values.search, values.treatment, values.status, values.startDate, values.endDate, values.openStartDate, values.openEndDate);
//                   }}
//                 />
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </Fragment>
//   );
// }

// export default CheckQueue;