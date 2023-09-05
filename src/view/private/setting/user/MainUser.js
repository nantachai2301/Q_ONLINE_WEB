import React, { Fragment, useState, useEffect } from "react";

import { Formik, Form } from "formik";

import ShowData from "./ShowData";

function MainUser() {
  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li
                className="breadcrumb-item text-black fw-semibold"
                aria-current="page"
              >
                ข้อมูลรายชื่อผู้ใช้
              </li>
            </ol>
          </nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">ข้อมูลรายชื่อผู้ใช้</h2>
        </div>
        <Formik>
          <Form>
            <div className="w-full mt-5">
              <ShowData />
            </div>
          </Form>
        </Formik>
      </div>
    </Fragment>
  );
}

export default MainUser;
