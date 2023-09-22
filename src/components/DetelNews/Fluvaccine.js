import React from "react";
import c2 from "../../image/c2.jpg";
import Card from "react-bootstrap/Card";

const Fluvaccine = () => {
  const iframeStyle = {
    border: "none",
    overflow: "hidden",
  };

  return (
    <div className="NewsItem">
      <div className="card">
      <div className="card-image">
      <Card.Img
              variant="top"
              src={c2}
              style={{ width: "95%", height: "90%" }}
            />
      </div></div>
      <div className="siDesc">
        <h1 className="NewsTitle">
          ฉีดวัคซีนไข้หวัดใหญ่” ฟรี สปสช.ชวนประชาชน 7 กลุ่มเสี่ยงสิทธิบัตร
        </h1>
        <hr></hr>
        <span className="Title">1 พ.ค. เริ่มแล้ว “ฉีดวัคซีนไข้หวัดใหญ่”</span>
        <span className="dental-news">
          กรมควบคุมโรคและ สปสช.
          ชวนคนไทยสิทธิบัตรทอง 7 กลุ่มเสี่ยง เข้ารับบริการถึง 31 ส.ค.2566
          หรือจนกว่าวัคซีนจะหมด ไม่เสียค่าใช้จ่าย ช่วยสร้างภูมิคุ้มกันโรค
          ป้องกันภาวะแทรกซ้อนรุนแรงจากเชื้อไข้หวัดใหญ่
          และสามารถฉีดพร้อมกับวัคซีนป้องกันโควิดได้ ย้ำปีนี้วัคซีนฯ มีจำกัด
          มาก่อนมีสิทธิรับบริการก่อน ระบุเฉพาะพื้นที่ กทม.
          เปิดจองฉีดวัคซีนล่วงหน้าผ่าน “แอปเป๋าตัง” หรือ โทร.จองคิวผ่านสายด่วน
          สปสช. 1330 กด 8 ได้
        </span>

        <br></br>
        <span className="notice-news">ดูข้อมูลเพิ่มเติมได้ที่นี่</span>
        <div className="List-Item">
          <a
            href="https://www.nhso.go.th/news/3989?fbclid=IwAR2TvrEQdSaIo7G34LwO0BmbLpIkPiUYoSlAxzHFOzm3xkkONex8f8eTPNk"
            target="_blank"
          >
            <h6>https://www.nhso.go.th</h6>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Fluvaccine;