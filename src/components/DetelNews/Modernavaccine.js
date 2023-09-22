import React from 'react'
import Card from "react-bootstrap/Card";
import c3 from "../../image/c3.png";

const Modernavaccine = () => {
  return (
    <div className="NewsItem">
      <div className="card">
      <div className="card-image">
            <Card.Img
              variant="top"
              src={c3}
              style={{ width: "95%", height: "100%" }}
            />
        </div>
      </div>
      <div className="siDesc">
        <h1 className="NewsTitle">
        ขอเชิญประชาชนทั่วไป เข้ารับบริการ ฉีดวัคซีนโควิด-19 Moderna Bivalent
        </h1>
        <hr></hr>
        <span className="Title">วัคซีนโควิด-19 Moderna Bivalent</span>
        <span className="dental-news">
          ตั้งแต่วันอังคารที่ 16 พฤษภาคม 2566 เป็นต้นไป เวลา 09:00 - 12:00 น. ณ บริเวณลานหน้าหอผู้ป่วยอายุรกรรมหญิง ชั้น 2 อาคาร 3 โรงพยาบาลสมเด็จพระสังฆราช องค์ที่ 17
        </span>

        <br></br>
      </div>
    </div>
  )
}

export default Modernavaccine;