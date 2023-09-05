import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../style/queuepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { format, isSameDay } from "date-fns";
import { parse } from "date-fns";

function DepartmentQueue({ departmentData, selectedDate }) {
  const [bookedQueues, setBookedQueues] = useState(0);
  const [availableQueues, setAvailableQueues] = useState(0);

  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        if (departmentData && selectedDate) { // ตรวจสอบ departmentData และ selectedDate
          const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
  
          const response = await axios.get(
            `http://localhost:5000/apis/queue/?queue_date=${formattedDate}&department_id=${departmentData.department_id}`
          );
  
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
      <div className="department-image">
        <img
          src={departmentData.department_image}
          alt={departmentData.department_name}
          className="department-icon"
          style={{ width: "200px", height: "200px" }}
        />
      </div>
      <h3 className="department-name">{departmentData.department_name}</h3>
      <div className="queue-row">
        <div className="queue-card">
          <div className="icon-container">
            <FontAwesomeIcon icon={faUsers} className="queue-icon" />
          </div>
          <div className="queue-info">
            <p>จำนวนคิวทั้งหมด : {departmentData.max_queue_number}</p>
          </div>
        </div>
        <div className="queue-card">
          <div className="icon-container">
            <FontAwesomeIcon icon={faUsers} className="queue-icon" />
          </div>
          <div className="queue-info">
            <p>จำนวนคิวที่จองแล้ว : {bookedQueues}</p>
          </div>
        </div>
        <div className="queue-card">
          <div className="icon-container">
            <FontAwesomeIcon icon={faClock} className="queue-icon" />
          </div>
          <div className="queue-info">
            <p>จำนวนคิวที่ว่างรับ: {availableQueues}</p>
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
        const response = await axios.get(
          "http://localhost:5000/apis/departments"
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
    setSelectedDepartment("");
    setSelectedDate(date);
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
