import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import "../../../style/queuepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { format, isSameDay } from "date-fns";
import { parse } from "date-fns";
import { getQueue} from "../../../service/Queue.Service";
import { getDepartment} from "../../../service/DepartmentType.Service";
function DepartmentQueue({ departmentData, selectedDate }) {
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
    <div className="department-card555">
  <div className="content-container">
    <div className="department-image">
      <img
        src={departmentData.department_image}
        alt={departmentData.department_name}
        className="department-icon"
        
      />
    </div>
    <div className="info-container">
      <h3 className="department-name" >{departmentData.department_name}</h3>
      <div className="queue-card">
        <div className="icon-container">
          <FontAwesomeIcon icon={faUsers} className="queue-icon" />
        </div>
        <div className="queue-info">
          <p >จำนวนคิวทั้งหมด: {departmentData.max_queue_number}</p>
        </div>
        <div className="icon-container">
          <FontAwesomeIcon icon={faUsers} className="queue-icon" />
        </div>
        <div className="queue-info">
          <p>จำนวนคิวที่จองแล้ว: {bookedQueues}</p>
        </div>
        <div className="icon-container">
          <FontAwesomeIcon icon={faClock} className="queue-icon" />
        </div>
        <div className="queue-info">
          <p>จำนวนคิวที่ว่างรับ: {availableQueues}</p>
        </div>
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
  const isDesktop = useMediaQuery("(min-width:1024px");
  const isMobile = useMediaQuery("(max-width:600px"); // Add this line to check for mobile screen size
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

      {isDesktop &&  (<div className="row justify-content-start mb-2">
        <div className="col-5 col-md-2 col-lg-3">
          <i className="fa-solid fa-calendar mx-1"></i>
          <label>ค้นหาตามวันที่</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>
        <div className="col-3 col-lg-1 pt-4">
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={handleCancel}
          >
            <i className="fa-solid fa-rotate-left mx-1"></i>
            ล้างค่า
          </button>
        </div>
        
      </div>
       )}
       {isMobile &&  (
        <div className="d-flex justify-content-between mb-2">
        <div className="col-7">
       <i className="dates fa-solid fa-calendar mx-1"></i>
       <label className="dates">ค้นหาตามวันที่</label>
       <input
         type="date"
         className="form-control"
         value={selectedDate}
         onChange={(e) => handleDateChange(e.target.value)}
       />
     </div>
     <div className="col-6 p-4">
     <button
       type="button"
       className="btn btn-secondary"
       onClick={handleCancel}
     >
       <i className="facon fa-solid fa-rotate-left"> ล้างค่า</i>
      
     </button>
   </div></div>
       
       )}
      <div className="queue-details mt-3">
        {selectedDepartment && selectedDate && (
          <DepartmentQueue
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
