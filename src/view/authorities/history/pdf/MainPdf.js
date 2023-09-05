import React from 'react';
import DateTh from '../../../../components/DateTh';

function MainPdf({ dataQ }) {
  console.log('dataQ', dataQ);
  return (
    <div className="border content-pdf p-4">
      <div className="d-flex justify-content-end">
        <div>รหัสคิว : {dataQ ? dataQ.code : '-'}</div>
      </div>
      <div className="text-center">
        <p className="font-number-q">{dataQ ? dataQ.number : '-'}</p>
      </div>
      <div>
        <b>เลขบัตรประชาชน :</b> {dataQ ? dataQ.id_card : '-'}
      </div>
      <div>
        <b>ชื่อ-นามสกุล :</b> {dataQ ? dataQ.fullname : '-'}
      </div>
      <div>
        <b>ประเภทการรักษา :</b> {dataQ ? dataQ.treatment_type_name : '-'}
      </div>
      <div>
        <b className='me-1'>วันที่เข้ารับการรักษา :</b>
        {dataQ ? <DateTh date={dataQ.open_date} /> : '-'}
      </div>
    </div>
  );
}

export default MainPdf;