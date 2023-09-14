import React from 'react';

function MainPdf({ dataQ }) {
  
    console.log("Data for PDF:", dataQ);

  return (
    <div className="border content-pdf p-4 " style={{ textAlign: 'center' }}>
      <div className="d-flex justify-content-end">
        <div>รหัสผู้ใช้ : {dataQ ? dataQ.users_id : '-'}</div>
      </div>
      <div className="text-center">
        <p className="font-number-q">{dataQ ? dataQ.queue_id : '-'}</p>
      </div>
     
      <div>
        <b>ชื่อ-นามสกุล :</b> {dataQ ? dataQ.prefix_name : '-'}{" "}{dataQ ? dataQ.first_name : '-'}{" "}{dataQ ? dataQ.last_name : '-'}
      </div>
      <div>
        <b>แผนก :</b> {dataQ ? dataQ.department_name : '-'}
      </div>
      <div>
        <b className='me-1'>วันที่เข้ารับการรักษา :</b>
        {dataQ ? dataQ.queue_date : '-'}
      </div>
    </div>
  );
}

export default MainPdf;
