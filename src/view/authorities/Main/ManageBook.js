import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form } from 'formik';
import ShowData from "./Showdata";
import StatusBook from '../../../data/statusBook.json';
import { getBookAppointment,updateStatusBook,deleteData } from '../../../service/BookAppoinment.Service';
import { TextSelect } from '../../../components/TextSelect';
import  Swal from 'sweetalert2'

function ManageBook  ()  {

  const [dataDepartment, setDataDepartment] = useState([]);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pagin, setPagin] = useState({
    totalRow: 1,
    pageSize: 10,
    currentPage: 1,
    totalPage: 1,
  });
  useEffect(() => {
    fetchData(10, 1, localStorage.getItem('id'), '', '', '', '', '', '', '');
    // axios
    //   .get("https://json-six-lac.vercel.app/queue/")
    //   .then((res) => {
    //     //console.log(res);
    //     setEmpData(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    //fetchData(10, 1, '', '', '', '', '', '', '', '');
    // getTreatmentAll();
  }, []);


  

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
        let res = await updateStatusBook(id, data);
        if (res) {
          if (res.statusCode === 200 && res.taskStatus) {
            Swal.fire({
              icon: 'success',
              title: 'อัพเดทข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            fetchData(10, 1, '', '', '');
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
        let res = await deleteData(id);
        if (res) {
          if (res.statusCode === 200 && res.taskStatus) {
            Swal.fire({
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            fetchData(10, 1, '', '', '');
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
            
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">จัดการการจองคิว</h2>
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
            // openStartDate: '',
            openEndDate: '',
          }}
          onSubmit={(values) => {
            console.log('submit:', values);
            fetchData(
              pagin.pageSize,
              1,
              values.userId,
              values.search,
              values.treatment,
              values.status,
              values.startDate,
              values.endDate,
              values.openStartDate,
              values.openEndDate
            );
          }}          
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <div className="w-full mt-5">
                <ShowData
                  data={data}
                  pagin={pagin}
                  updateStatus={updateStatusBook}
                  deleteData={deleteData}
                  changePage={(page) => {
                    fetchData(pagin.pageSize, page, values.search, values.department, values.status);
                  }}
                  changePageSize={(pagesize) => {
                    fetchData(pagesize, 1, values.search, values.department, values.status);
                  }}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>

  );
};

export default ManageBook;
