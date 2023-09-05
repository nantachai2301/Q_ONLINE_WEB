import React from "react";
import { Carousel } from "react-bootstrap";
import pro1 from "../../image/pro1.png";
import sl1 from "../../image/sl1.png";
import sl2 from "../../image/sl2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/homeauthorities.css";

/**หน้าจองคิวของเจ้าหน้าที่จองให้ผู้ป่วย */
function HomeAuthorities() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());


  return (
    <div className="w-full mb-5">
      <h2 className="title-content">เจ้าหน้าที่</h2>
      <br></br>
      <div className="center">
        <div className="conns">
          <div className="Item-home">
            <Carousel variant="dark">
              <Carousel.Item>
                <img className="d-block w-100" src={pro1} alt="Second slide" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={sl1} alt="First slide" />
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={sl2} alt="Second slide" />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAuthorities;