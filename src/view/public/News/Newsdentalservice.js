import React from "react";
import "../../../../src/style/NewsDental.css";
import Dentalnews from "../../../components/DetelNews/Dentalnews";

const Newsdentalservice = () => {
  return (
    <div className="w-full">
      <div className="w-full mb-4" style={{ textAlign: "center" }}>
        <h4 className="title-content">
          ขั้นตอนการรับบริการทันตกรรม รพ.สมเด็จพระสังฆราชองค์ที่ 17
        </h4>
      </div>
        <div className="ListContainer">
          <div className="listResult">
            <Dentalnews />
          </div>
        </div>
      </div>
  );
};

export default Newsdentalservice;