import React, { useState, useEffect } from "react";

import "../../../style/desktopcallqueue.css";
import { format, isSameDay } from "date-fns";
import { parse } from "date-fns";
import { getQueue } from "../../../service/Queue.Service";
import { getDepartment } from "../../../service/DepartmentType.Service";
import doctor from "../../../image/doctor.png"
import doctor2 from "../../../image/doctor2.png"
import bg1 from "../../../image/bg1.png"
import { th } from 'date-fns/locale';

function DesktopQueue({ departmentData, selectedDate }) {
  const [bookedQueues, setBookedQueues] = useState(0);
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [noQueueMessage, setNoQueueMessage] = useState('');

  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        if (departmentData && selectedDate) {
          const formattedDate = format(new Date(selectedDate), 'yyyy-MM-dd');

          const response = await getQueue({
            queue_date: formattedDate,
            department_id: departmentData.department_id,
          });

          const queues = response.data;
          console.log('API Response:', response.data);

          const filteredQueues = queues.filter(
            (queue) =>
              format(
                parse(queue.queue_date, 'dd-MM-yyyy', new Date()),
                'yyyy-MM-dd'
              ) === formattedDate &&
              queue.department_id === departmentData.department_id
          );
          console.log('filteredQueues:', filteredQueues);

          const bookedQueuesCount = filteredQueues.length;

          setBookedQueues(bookedQueuesCount);
          setFilteredQueues(filteredQueues);

          if (bookedQueuesCount === 0) {
            setNoQueueMessage('วันนี้ยังไม่มีคิว');
          } else {
            setNoQueueMessage('');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchQueueInfo();
    const intervalId = setInterval(() => {
      fetchQueueInfo();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [selectedDate, departmentData]);


  return (
    <div className="w-full">
      <div className="container23">
        
        <div className="col-8"> 
          {bookedQueues > 0 && (
            <div className="call-queue" >
              <h2 className="q1">กำลังเรียกคิว</h2>
              <table className="table">
                <thead className="th1"> 
                  <tr style={{ background: "#3a72aa", color: "white" }}>
                    <th>คิวที่</th>
                    <th>รหัสผู้ป่วย</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueues
                    .filter((queue) => queue.queue_status_name === 'กำลังเข้ารับการรักษา')
                    .map((queue, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center', fontSize: '50px', fontWeight: 'bold',width: "100px", height: "80px" ,}}>{queue.queue_id}</td>
                        <td style={{ textAlign: 'center', fontSize: '50px', fontWeight: 'bold',width: "100px", height: "80px" }}>{queue.users_id}</td>

                      </tr>
                    ))}
                  {filteredQueues.every((queue) => queue.queue_status_name !== 'กำลังเข้ารับการรักษา') && (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center' }}>ไม่มีการเรียกคิว</td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          )}    
          {bookedQueues === 0 && (
            <div className="no-queue-message" >
              <p className="p1">{noQueueMessage}</p>
              <img src={doctor2} alt="Cute Box" className="doctor4"/>
            </div>
          )}  
        </div>
        <div className="imd col-md-3">
          <div className="callqueue-card2">
            <div className="doctor-row">
              <img
                src={doctor}
                alt="Doctor"
                className="doctor-image"
              
              />

              <div className="callinfo-container">
               
                <div className="callqueue-card15">
                <h3 className="departmentname">
                  {departmentData.department_name}
                </h3>
                  <div className="callqueue-card1">
                    <header className="callcustom-header">
                      <h6 className="pt">ผู้ป่วยทั้งหมด</h6>
                    </header>
                    <div className="callcustom-header1" style={{ color: 'black' }}>
                      <p>{bookedQueues}</p>
                    </div>
                  </div>
                </div>
                <div className="text-call" >
                  <h6 className="text7">
                    รอรับบริการ : {filteredQueues.filter(queue => queue.queue_status_name === 'ยืนยัน').length}
                  </h6>

                  <h6 className="text8">
                    ให้บริการแล้ว: {filteredQueues.filter(queue => queue.queue_status_name === 'เข้ารับการรักษาเรียบร้อยแล้ว').length}
                  </h6>

                </div>
              </div>
              
            </div>
          </div>
        </div>
        <div className="col-8">
          {bookedQueues > 0 && (
            <div className="wait-queue">
              <h4>รอรับบริการเรียกคิว</h4>
              <table className="table" >
                <thead className="th1">
                  <tr style={{ background: "#78A3D4", color: "white" }}>
                    <th style={{ textAlign: 'center' ,width:"20px"}}>คิวที่</th>
                    <th style={{ textAlign: 'center' ,width:"20px"}}> รหัสผู้ป่วย</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueues
                    .filter((queue) => queue.queue_status_name === 'ยืนยัน')
                    .map((queue, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: 'center' }}>{queue.queue_id}</td>
                        <td style={{ textAlign: 'center' }}>{queue.users_id}</td>
                      </tr>
                    ))}
                  {filteredQueues.every((queue) => queue.queue_status_name !== 'ยืนยัน') && (
                    <tr>
                      <td colSpan="2" style={{ textAlign: 'center' }}>ยังไม่มีคิว</td>
                    </tr>
                  )}
                </tbody>


              </table>
            </div>
          )}

        

        </div>
      </div>
    </div>
  );
}

function QueuePage() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQueueTable, setShowQueueTable] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const options = {
    timeZone: 'Asia/Bangkok',
    hour12: false,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  };

  const formattedTime = currentTime.toLocaleTimeString('th-TH', options);
  const formattedDate = format(currentTime, 'd MMMM yyyy', { locale: th });
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartment(

        );
        setDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentClick = (departmentName) => {
    setSelectedDepartment(departmentName);
    setShowQueueTable(true);
  };


  const handleDateChange = (date) => {
    const selectedDate = new Date(date); // แปลงค่าวันที่ที่ถูกเลือกเป็นวัตถุ Date
    const currentDate = new Date(); // วันที่ปัจจุบัน
    if (selectedDate >= currentDate) {
      setSelectedDate(format(selectedDate, "yyyy-MM-dd"));
    } else {
      // วันที่ถูกเลือกเป็นวันที่ย้อนหลัง ไม่ต้องทำอะไร
      console.log("ไม่สามารถเลือกวันที่ย้อนหลังได้");
    }
  };
  const sectionStyle = {
    backgroundImage: `url(${bg1})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    zIndex: '999',  // ตั้งค่า zIndex เพื่อให้รูปอยู่ด้านหลังสุด
    
    
  };
  
  return (
    <div className="queue-page"  style={sectionStyle}>
      <div className="row justify-content-start mb-2" style={{ padding: '1px' }}>
      
        <span className="t1" >
        <i class="fa-solid fa-hand-point-down fa-flip-horizontal" ></i>* กรุณาเลือกแผนกที่ต้องการดูคิว
        </span>
        <div className="department-list1" style={{ marginTop: "10px" }}>
          {departments.map((department) => (
            <button
              key={department.department_id}
              className={`department-button1 ${selectedDepartment === department.department_name
                ? "selected"
                : ""
                }`}
              onClick={() => handleDepartmentClick(department.department_name)}
            >
              {department.department_name}
            </button>
          ))}
        </div>

        <div className="texte1 d-flex justify-content-start" >
          <span className="text1" >
            เวลา: {formattedTime}
          </span>
        </div>
        
      </div>
      <div className="row justify-content-start mb-2" style={{ padding: '1px'}}>
      <div className="texte2 d-flex justify-content-start" >
          <span className="text1">
            วันที่: {formattedDate}
          </span>
          
        </div>
      </div>
     
      <div className="queue-details mt-3">
        {selectedDepartment && selectedDate && showQueueTable && (
          <DesktopQueue
            departmentData={departments.find(
              (department) => department.department_name === selectedDepartment
            )}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
}

export default QueuePage;
