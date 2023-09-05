import React, { useState } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // เพิ่มสไตล์เริ่มต้นของ react-date-range
import 'react-date-range/dist/theme/default.css'; // เพิ่มสไตล์เริ่มต้นของ react-date-range

import '../../style/calendar.css';

const Calendars = () => {
  const [calendar, setCalendar] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  const book = (startDate, endDate, bookingId) => {
    const updatedCalendar = { ...calendar };
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      if (date.toISOString() in updatedCalendar) {
        throw new Error(`Booking already exists for date: ${date.toISOString()}`);
      }
      updatedCalendar[date.toISOString()] = bookingId;
    }
    setCalendar(updatedCalendar);
  };

  const cancel = (startDate, endDate) => {
    const updatedCalendar = { ...calendar };
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      if (date.toISOString() in updatedCalendar) {
        delete updatedCalendar[date.toISOString()];
      }
    }
    setCalendar(updatedCalendar);
  };

  const checkAvailability = (startDate, endDate) => {
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      if (date.toISOString() in calendar) {
        console.log(`Date ${date.toISOString()} is not available.`);
        return false;
      }
    }
    console.log('Dates are available.');
    return true;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // ทำอะไรก็ตามที่คุณต้องการเมื่อมีการเปลี่ยนแปลงวันที่ที่เลือก
  };

  return (
    <div>
      <div className='title'>
         ปฏิทินการจอง
      </div>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        // ปรับแต่งการแสดงผลของปฏิทินตามความต้องการของคุณ
        className="booking-calendar" // เพิ่มคลาส CSS เพื่อปรับแต่งปฏิทิน
      />
      {/* เพิ่มโค้ด JSX สำหรับแสดงรายละเอียดการจองและปุ่มต่าง ๆ */}
      
    </div>
  );
};

export default Calendars;