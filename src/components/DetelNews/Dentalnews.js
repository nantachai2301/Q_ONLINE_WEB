import React from "react";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "react-bootstrap/Card";
import c1 from "../../image/c1.jpg";

const Dentalnews = () => {
  return (
    <div className="NewsItem">
        <div className="card">
        <div className="card-image">
        <Card.Img
              variant="top"
              src={c1}
              style={{ width: "95%", height: "105%" }}
            />
        </div></div>
        <div className="siDesc">
        <h1 className="NewsTitle">ขั้นตอนการรับบริการทันตกรรม</h1>
        <hr></hr>
        <span className="Title">1.ผู้รับบริการที่มีใบนัดหมายทันตกรรม</span>
        <span className="dental-news">ให้ยื่นใบนัด ณ ห้องทันตกรรม ชั้น 2 อาคาร อำนวยการ ก่อนถึงเวลานัดหมาย 15 นาที</span>
        <span className="Title">2.ผู้รับบริการผู้ป่วยนอกที่จะมารับบริการทันตกรรม</span>
        <span className="dental-news">ยื่นบัตรประชาชนที่ห้องบัตร เพื่อรับคิวทันตกรรมปกติ </span>
        <span className="dental-news">... หากต้องการอุดฟัน / เคลือบหลุมร่องฟัน / เคลือบฟลูออไรด์ หรือ ขูดหินปูน แจ้งความจำนงจะได้รับบัตรคิวฌแพาะเพิ่มอีก 1 ใบ</span>
        <span className="Title">3.นำบัตรคิวรอรับการเรียกซักประวัติ ณ จุดคัดกรองทันตกรรม(ชั้น2) เริ่มเวลา 7:30 น.</span>
        <span className="dental-news">แนะนำ!!!  รอเรียกคิวซักประวัติก่อน เพื่อให้ได้รับการบริการที่เหมาะสม</span>
        <span className="Title">4.รอเรียกชำระค่าบริการบัตรทอง ก่อนรับบริการทันตกรรม</span>
        <span className="Title">5.รับบริการทันตกรรม รับคำแนะนำ และ นัดหมาย</span>
        <span className="Title">6.รอรับยา ณ ห้องยา และชำระค่าบริการทันตกรรม หรือ สแกนบัตรประชาชนกรณีเบิกจ่ายได้ ณ ห้องการเงิน</span>
        <span className="notice">
         หมายเหตุ!! <span className="notice-news">
        กรณีเจ้าหน้าที่เรียกไม่พบผู้รับบริการเพื่อซักประวัติ หรือ ยังไม่ได้รับการซักประวัติ แล้วคิวรับบริการอาจไม่ได้รับบริการในวันนั้น มีข้อสงสัยกรุณา
        </span>
        </span>
        <br></br>
        <span className="notice-news">
          สอบถามเคาท์เตอร์ทันตกรรมในวันเวลาราชการ หรือติดต่อสายใน
        </span>
        <div className="List-Item">
                <FontAwesomeIcon icon={faPhone}
                 style={{ color: "#4b86d2", cursor: "pointer" }}
                />
            <span className="Tell-news">    โทร 1222</span>
        </div>
      </div>
      </div>
  );
};

export default Dentalnews;