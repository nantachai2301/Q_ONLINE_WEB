import React from "react";
import Card from "react-bootstrap/Card";
import c4 from "../../image/c4.png";

const Food= () => {
  return (
    <div className="NewsItem">
      <div className="card">
        <div className="card-image">
        <Card.Img
              variant="top"
              src={c4}
              style={{ width: "100%", height: "100%" }}
            />
        </div>
      </div>
      <div className="siDesc">
        <h1 className="NewsTitle">
          เด็กไทยวันนี้ สูงดีสมส่วน ด้วย 4 ข้อแนะนำ
        </h1>
        <hr></hr>
        <span className="dental-news">
          ✅กินอาหารครบทุกมื้อ
        </span>
        <span className="dental-news">
          ✅ออกกำลังกาย
        </span>
        <span className="dental-news">
          ✅แปรงฟัน 2-2-2
        </span>
        <span className="dental-news">
          ✅นอนหลับ
        </span>

        <br></br>
     
        <br></br>
        <span className="notice-news">กรมอนามัยส่งเสริมให้คนไทยสุขภาพดี</span>
        <div className="List-Item">
          <a
            href="https://www.facebook.com/anamaidoh"
            target="_blank"
          >
            <h6>https://www.facebook.com/anamaidoh</h6>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Food;