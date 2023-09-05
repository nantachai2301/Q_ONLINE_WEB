import React, { Fragment, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import ShowData from './ShowData';
import axios from "axios";
import Swal from 'sweetalert2';
import { TextSelect } from '../../../../components/TextSelect';


function MainDepartmentType() {
  const [departments, setDepartments] = useState([]);
  const [searchDepartments, setSearchDepartments] = useState("");
  const [pagin, setPagin] = useState({
    totalRow: 1,
    pageSize: 10,
    currentPage: 1,
    totalPage: 1,
  });

  useEffect(() => {

  }, []);

  // ฟังก์ชันดึงข้อมูลแบบแบ่งหน้า
  async function fetchDepartments(pageSize, currentPage, search) {
    try {
      const response = await axios.get("http://localhost:5000/apis/departments", {
          params: {
          pageSize,
          currentPage,
          search,
        },
      });
      setDepartments(response.data);
      setPagin(response.pagin);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (values) => {
    setSearchDepartments(values.search);
  };

  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">ข้อมูลแผนกและการตรวจรักษา</h2>
        </div>

        <Formik
          enableReinitialize={true}
          initialValues={{
            search: searchDepartments,
          }}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              {/* <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                  <label>ค้นหา</label>
                  <input
                    type="text"
                    className="form-input"
                    value={values.search}
                    onChange={(e) => setFieldValue("search", e.target.value)}
                  />
                </div>

                <div className="col-12 col-lg-4 pt-4">
                  <button type="submit" className="btn btn-success mx-1">
                    <i className="fa-solid fa-magnifying-glass mx-1"></i>
                    ค้นหา
                  </button>

                  <button
                    type="reset"
                    className="btn btn-secondary mx-1"
                    onChange={(e) => setFieldValue("search", e.target.value)}
                  >
                    <i className="fa-solid fa-rotate-left mx-1"></i>
                    ล้างค่า
                  </button>
                </div>
              </div> */}
              <div className="w-full mt-5">
                <ShowData data={departments} pagin={pagin} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Fragment>
  );
}

export default MainDepartmentType;
