import React from 'react';
import "../../style/navbarqueue.css";

const NavBarQueue = () => {
  return (
    <div className="navbar">
      <marquee behavior="scroll" direction="left" scrollamount="15">
        คิวรอรับการรักษา ดูคิวได้ที่นี่  กรุณามารอก่อน 20 นาที เพื่อความสะดวก
      </marquee>
    </div>
  );
};

export default NavBarQueue;