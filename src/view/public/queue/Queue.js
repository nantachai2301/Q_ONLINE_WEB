import React from "react";
import { useNavigate } from 'react-router-dom';

function Queue  ()  {
    const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="d-flex justify-content-center">
        <h2 className="title-content">แสดงคิวผู้ป่วย</h2>
      </div>
      <div className="row d-flex justify-content-center">
        <div
          className="card align-items-center"  style={{ width: "750px", height:"500px"}}

        >
          
            <div className="card align-items-center" style={{border: "1px solid gray", width: "750px", height:"500px",background:"#ffff" }} >
                
                <h3>โรงพยาบาลสมเด็จพระสังฆราช องค์ที่ ๑๗</h3>
                <h4>ยินดีต้อนรับ</h4>
                <h1>T 20 </h1>
                <h4>แผนก ทันตกรรม</h4>
                <h4>ชื่อ นภาพร ชาววังฆ้อง อายุ 21</h4> 
                <h4>อาการเบื้องต้น ปวดฟัน</h4> 
                <h4>19 มีนาคม 2566</h4> 
                <div className="d-flex justify-content-center mt-3">
                    <button type="submit" className="btn btn-primary mx-1" onClick={() => {
              navigate('/book-an-appointment');
            }}>
                      แก้ไขอาการเบื้องต้น
                    </button>
                    <button type="reset" className="btn btn-secondary mx-1">
                      ยกเลิกคิว
                    </button>
                    
                  </div>
            </div>
        
        </div>
      </div>
    </div>
  );
};

export default Queue;
