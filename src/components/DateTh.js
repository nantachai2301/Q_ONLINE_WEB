// DateTh.js

import React from 'react';

function DateTh({ date = null, format = '' }) {
  var month_name = '';
  var month_sname = '';
  var month_nameEn = '';

  if (date) {
    var day = date.substring(8, 10);
    var month = date.substring(5, 7);
    var year = date.substring(0, 4);

    if (month === '01') {
      month_name = 'มกราคม';
      month_sname = 'ม.ค';
      month_nameEn = 'January';
    } else if (month === '02') {
      month_name = 'กุมภาพันธ์';
      month_sname = 'ก.พ';
      month_nameEn = 'February';
    } else if (month === '03') {
      month_name = 'มีนาคม';
      month_sname = 'มี.ค';
      month_nameEn = 'March';
    } else if (month === '04') {
      month_name = 'เมษายน';
      month_sname = 'เม.ย';
      month_nameEn = 'April';
    } else if (month === '05') {
      month_name = 'พฤษภาคม';
      month_sname = 'พ.ค';
      month_nameEn = 'May';
    } else if (month === '06') {
      month_name = 'มิถุนายน';
      month_sname = 'มิ.ย';
      month_nameEn = 'June';
    } else if (month === '07') {
      month_name = 'กรกฎาคม';
      month_sname = 'ก.ค';
      month_nameEn = 'July';
    } else if (month === '08') {
      month_name = 'สิงหาคม';
      month_sname = 'ส.ค';
      month_nameEn = 'August';
    } else if (month === '09') {
      month_name = 'กันยายน';
      month_sname = 'ก.ย';
      month_nameEn = 'September';
    } else if (month === '10') {
      month_name = 'ตุลาคม';
      month_sname = 'ต.ค';
      month_nameEn = 'October';
    } else if (month === '11') {
      month_name = 'พฤศจิกายน';
      month_sname = 'พ.ย';
      month_nameEn = 'November';
    } else if (month === '12') {
      month_name = 'ธันวาคม';
      month_sname = 'ธ.ค';
      month_nameEn = 'December';
    }
  }

  function dateType(format) {
    switch (format) {
      case 'dd MMMM yyyy':
        return `${day} ${month_name} ${parseInt(year) + 543}`;
      // คุณสามารถเพิ่มเงื่อนไขของรูปแบบอื่น ๆ ตามต้องการได้
      default:
        return `${day}/${month}/${parseInt(year) + 543}`;
    }
  }

  return <span>{date ? dateType(format) : ''}</span>;
}

export default DateTh;
