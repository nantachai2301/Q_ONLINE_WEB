import React from "react";

const Food= () => {
  return (
    <div className="NewsItem">
      <div className="card">
        <div className="card-image">
          <img
            src="https://scontent.fkdt1-1.fna.fbcdn.net/v/t39.30808-6/325409813_1652796948513072_1263480730284601747_n.png?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeEBcBvWXn0I2umRHI2_hpv26D3BFa2MSmfoPcEVrYxKZ5dx3zEHqULh9b8JZw7gzwqhror1v5izOEB3g9cokVUU&_nc_ohc=2LvMLmGu-eUAX80YLB8&_nc_ht=scontent.fkdt1-1.fna&oh=00_AfBg5bqXZ0-5ntefgvG1ceIQgwj8CYbEs6ow5IOlkRu9wA&oe=64E7FE2A"
            className="newsImg"
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