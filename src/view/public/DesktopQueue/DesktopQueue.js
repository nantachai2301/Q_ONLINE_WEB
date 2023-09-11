import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../style/desktop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { format, isSameDay } from "date-fns";
import { parse } from "date-fns";
import {getQueue } from "../../../service/Queue.Service";
import {getDepartment } from "../../../service/DepartmentType.Service";
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
         <WaitingQueueTable/>
        </div>
<div className="col-md-3">
<div className="department-card2"> 
                <div className="doctor-row" style={{ marginLeft: 'auto'}}>
                   <img
                       src={doctor} // แทนที่ด้วยลิงค์รูปภาพหมอ
                       alt="Doctor"
                       className="doctor-image" // เพิ่มคลาส right-aligned-image
                       style={{ width: '150px', height: '200px',marginLeft: 'auto' }} // ปรับขนาดรูปภาพตามที่ต้องการ
                   />

                   <div className="queue-card1">
                       <header className="custom-header1">
                           <h6>ผู้ป่วยทั้งหมด</h6>
                       </header>
                       <div className="queue-info"  style={{ color: 'white' }}>
                           <p>{bookedQueues}</p>
                       </div>
                   </div>
               </div>
               <h6 className="text" style={{ marginLeft: 'auto'}}>รอรับบริการ : {bookedQueues}</h6>
               <h6 className="text" style={{ marginLeft: 'auto'}}>ให้บริการแล้ว: {bookedQueues}</h6>
           </div>
</div>
        </div>
        {/* <div className="department-card">   
        <h3 className="department-name">{departmentData.department_name}</h3>
        <div className="waiting-queue-section mt-3">
                <CallQueue/>
            </div>
        </div>
        <div className="department-card1">   
       
             <div className="waiting-queue-section mt-3">
                <WaitingQueueTable />
            </div>
        </div> */}
        {/* <div className="department-card2"> 
                <div className="doctor-row" style={{ marginLeft: 'auto'}}>
                   <img
                       src={doctor} // แทนที่ด้วยลิงค์รูปภาพหมอ
                       alt="Doctor"
                       className="doctor-image" // เพิ่มคลาส right-aligned-image
                       style={{ width: '150px', height: '200px',marginLeft: 'auto' }} // ปรับขนาดรูปภาพตามที่ต้องการ
                   />

                   <div className="queue-card1">
                       <header className="custom-header1">
                           <h6>ผู้ป่วยทั้งหมด</h6>
                       </header>
                       <div className="queue-info"  style={{ color: 'white' }}>
                           <p>{bookedQueues}</p>
                       </div>
                   </div>
               </div>
               <h6 className="text" style={{ marginLeft: 'auto'}}>รอรับบริการ : {bookedQueues}</h6>
               <h6 className="text" style={{ marginLeft: 'auto'}}>ให้บริการแล้ว: {bookedQueues}</h6>
           </div> */}

        </div>
       
    );
}
 {/* <div className="department-image">
                <img
                    src={departmentData.department_image}
                    alt={departmentData.department_name}
                    className="department-icon"
                    style={{ width: "250px", height: "250px", marginTop: "60px" }}
                />
           
            </div> */}
           
           
            {/* <div className="queue-row">

                <div className="queue-card">
                    <header className="custom-header">
                        <h1>ห้องที่1</h1>
                    </header>
                    <div className="queue-info">
                        <p>คิวที่เรียกรักษา</p>
                        <p></p>
                    </div>
                </div>



                <div className="queue-card">
                    <header className="custom-header">
                        <h1>ห้องที่2</h1>
                    </header>
                    <div className="queue-info">
                        <p>คิวที่เรียกรักษา</p>
                        <p></p>
                    </div>
                </div>
                <div className="queue-card">
                    <header className="custom-header">
                        <h1>ห้องที่3</h1>
                    </header>
                    <div className="queue-info">
                        <p>คิวที่เรียกรักษา</p>
                        <p></p>
                    </div>
                </div>
                <div className="queue-card">
                    <header className="custom-header">
                        <h1>ห้องที่4</h1>
                    </header>
                    <div className="queue-info">
                        <p>คิวที่เรียกรักษา</p>
                        <p></p>
                    </div>
                </div>
                <div className="queue-card">
                    <header className="custom-header">
                        <h1>ห้องที่5</h1>
                    </header>
                    <div className="queue-info">
                        <p>คิวที่เรียกรักษา</p>
                        <p></p>
                    </div>
                </div> */}

{/*               
            </div> */}

function QueuePage() {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [bookedQueues, setBookedQueues] = useState(0);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartment();
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



    return (
        <div className="desktop"> 
        <h4 className="title-content"style={{ margintop: '50px'}}>คิวแต่ละแผนก</h4>
          
            
            <div className="department-list">
                {departments.map((department) => (
                    <button
                        key={department.department_id}
                        className={`department-button ${selectedDepartment === department.department_name
                            ? "selected"
                            : ""
                            }`}
                        onClick={() => handleDepartmentClick(department.department_name)}
                    >
                        {department.department_name}
                    </button>
                ))}
            </div>


            <div className="queue-details mt-3">
                {selectedDepartment && (
                    <DesktopQueue
                        departmentData={departments.find(
                            (department) => department.department_name === selectedDepartment
                        )}

                    />
                )}
            </div>
        </div>
    );
}

export default QueuePage;
