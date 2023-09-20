import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../style/desktop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { format, isSameDay } from "date-fns";
import { parse } from "date-fns";
import { getQueue } from "../../../service/Queue.Service";
import { getDepartment } from "../../../service/DepartmentType.Service";
import doctor from "../../../image/doctor.png";
import WaitingQueueTable from "./WaitingQueueTable";
import CallQueue from "./CallQueue";
function DesktopQueue({ departmentData, selectedDate }) {
  const [bookedQueues, setBookedQueues] = useState(0);
  const [availableQueues, setAvailableQueues] = useState(0);

  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        if (departmentData && selectedDate) { // ตรวจสอบ departmentData และ selectedDate
          const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
  
          const response = await getQueue({
            queue_date: formattedDate,
            department_id: departmentData.department_id,
          });
  
          const queues = response.data;
          console.log("API Response:", response.data);
          const filteredQueues = queues.filter(queue =>
            format(parse(queue.queue_date, "dd-MM-yyyy", new Date()), "yyyy-MM-dd") === formattedDate &&
            queue.department_id === departmentData.department_id
          );
          console.log("filteredQueues:", filteredQueues);
     
          const bookedQueuesCount = filteredQueues.length;
          const availableQueuesCount =
            departmentData.max_queue_number - bookedQueuesCount;
  
          setBookedQueues(bookedQueuesCount);
          setAvailableQueues(availableQueuesCount);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchQueueInfo();
  }, [selectedDate, departmentData]);
  return (
    <div className="w-full">
      <div className="container23">
        <div className="col-md-3">
          <CallQueue/>
        </div>
        <div className="col-md-3">
          <WaitingQueueTable />
        </div>
        <div className="col-md-3">
          <div className="department-card2">
            <div className="doctor-row" style={{ marginLeft: "auto" }}>
              <img
                src={doctor} // แทนที่ด้วยลิงค์รูปภาพหมอ
                alt="Doctor"
                className="doctor-image" // เพิ่มคลาส right-aligned-image
                style={{ width: "150px", height: "200px", marginLeft: "auto" }} // ปรับขนาดรูปภาพตามที่ต้องการ
              />

              <div className="queue-card1">
                <header className="custom-header1">
                  <h6>ผู้ป่วยทั้งหมด</h6>
                </header>
                <div className="queue-info" style={{ color: "white" }}>
                  <p>{bookedQueues}</p>
                </div>
              </div>
            </div>
            <h6 className="text" style={{ marginLeft: "auto" }}>
              รอรับบริการ : {bookedQueues}
            </h6>
            <h6 className="text" style={{ marginLeft: "auto" }}>
              ให้บริการแล้ว: {bookedQueues}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}

function QueuePage() {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
    
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
  
    const handleCancel = () => {
      setSelectedDepartment("");
      setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    };
  
    return (
      <div className="queue-page">
        <h4 className="title-content">คิวแต่ละแผนก</h4>
        <div className="department-list">
          {departments.map((department) => (
            <button
              key={department.department_id}
              className={`department-button ${
                selectedDepartment === department.department_name
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleDepartmentClick(department.department_name)}
            >
              {department.department_name}
            </button>
          ))}
        </div>
  
        <div className="row justify-content-start mb-2">
          <div className="col-5 col-md-2 col-lg-15">
            <i className="fa-solid fa-calendar mx-1"></i>
            <label>วันที่</label>
            <input
              type="date"
              className="form-control"
              readOnly
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
          
        </div>
        <div className="queue-details mt-3">
          {selectedDepartment && selectedDate && (
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
