import React from "react";

const Fluvaccine = () => {
  const iframeStyle = {
    border: "none",
    overflow: "hidden",
  };

  return (
    <div className="NewsItem">
      <div className="card">
      <div className="card-image">
        <img
          src="https://scontent.fkdt1-1.fna.fbcdn.net/v/t39.30808-6/355665823_1147737346174702_3151967588245513412_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeGVnoKl7GD1c3mbWRkI3K7XrPuP76ema6Ss-4_vp6ZrpPguUoAo8YL0N9-zNTEJ-fVHhxjvbTD-8N67huuxzZXb&_nc_ohc=MeiZH3hZrncAX_G-AVa&_nc_ht=scontent.fkdt1-1.fna&oh=00_AfCaCWPVRHAQP0TMfcZXRgXRb7B6IZO8j4Mfs4CU0HZKWA&oe=64E797EC"
          className="newsImg"
          style={{ width: "100%", height: "100%" }}
        ></img>
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