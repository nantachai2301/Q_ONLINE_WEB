import React, { Fragment, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';

import ShowData from './Showdata'



function  MainAuthorities() {
  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb"></nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">ข้อมูลรายชื่อเจ้าหน้าที่</h2>
        </div>
        <Formik>
          <Form>
            <div className="w-full mt-5">
              <ShowData/>
            </div>
          </Form>
        </Formik>
      </div>
    </Fragment>
  );
}

export default MainAuthorities;
