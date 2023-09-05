import React from 'react'
import "../../../../src/style/NewsDental.css";
import Fluvaccine from '../../../components/DetelNews/Fluvaccine';

const Newsfluvaccine = () => {
  return (
    <div className="w-full">
      <div className="w-full mb-4" style={{ textAlign: "center" }}>
        <h4 className="title-content">
        “ฉีดวัคซีนไข้หวัดใหญ่” ฟรี สปสช.ชวนประชาชน 7 กลุ่มเสี่ยงสิทธิบัตร
        </h4>
      </div>
        <div className="ListContainer">
          <div className="listResult">
            <Fluvaccine />
          </div>
        </div>
      </div>
  )
}

export default Newsfluvaccine;