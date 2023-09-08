import React, { Fragment, useState, useEffect } from "react";
import ShowData from "./Showdata";
import { Form ,Formik} from 'formik';

function ManageBook  ()  {
  return (
    <Fragment>
      <div className="w-full">
        <div className="d-flex justify-content-end">
          <nav aria-label="breadcrumb"></nav>
        </div>
        <div className="w-full mb-5">
          <h2 className="title-content">จัดการการจองคิว</h2>
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



export default ManageBook;
