import React from 'react';

function StatusBook({ status }) {
  function checkStatus(status) {
    switch (status) {
      case 1:
        return <span className="text-dark">รอเข้ารับการรักษา</span>;
      case 2:
        return <span className="text-info">รายงานตัวแล้ว</span>;
      case 3:
        return <span className="text-success">เข้ารับการรักษาแล้ว</span>;
      default:
        return <span className="text-danger">ยกเลิกคิว</span>;
    }
  }

  return <div className="w-full">{checkStatus(status)}</div>;
}

export default StatusBook;
