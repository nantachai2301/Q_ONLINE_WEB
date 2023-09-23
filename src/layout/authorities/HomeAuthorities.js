import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import pro1 from "../../image/pro1.png";
import sl1 from "../../image/sl1.png";
import sl2 from "../../image/sl2.png";
import {
  faPerson,
  faCalendarDays,
  faUser,
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Chart from "chart.js/auto";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "../../style/homeauthorities.css";
import { getQueue } from "../../service/Queue.Service";
import { getDepartment } from "../../service/DepartmentType.Service";
import moment from "moment/moment";
import { FilterRounded } from "@mui/icons-material";
/**หน้าจองคิวของเจ้าหน้าที่จองให้ผู้ป่วย */
function HomeAuthorities() {
  const [counts, setCounts] = useState({});
  const [patients, setPatients] = useState({});
  const [department, setDepartment] = useState([]);
  const [department_id, setDepartment_id] = useState([]);
  const [data, setData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [id, setId] = useState({});
  const [queue, setQueue] = useState([]);
  const [queue_id, setQueue_id] = useState([]);
  const [department_name, setDepartment_name] = useState([]);
  const [table, setTable] = useState([]);
  const [idCount, setIdCount] = useState(0);
  const [CountQ, setCountQ] = useState(0);
  const [count, setCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [counTspp, setCountsPP] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [patientsByDepartment, setPatientsByDepartment] = useState({});
  const [queueByDepartment, setQueueByDepartment] = useState({});
  const [usersAndDepartmentChartData, setUsersAndDepartmentChartData] =
    useState(null);
  const [queue_status_id, setQueue_status_id] = useState({});
  const [viewType, setViewType] = useState("daily"); // Initially set to 'daily'
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [weeklyAppointments, setWeeklyAppointments] = useState([]);
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await getQueue();

        const res2 = await getDepartment();

        console.log(res1?.data?.filter(el=>el.queue_status_id===5));
        console.log(res2);
        setFilteredData(res1.data)
        setCountQ(res1.data?.length)
        setQueue(res1.data);
        setId(res1.data);
        setCounts(res1.data);
        setData(res1.data);
        setQueue_id(res1.data);
        setDepartment_id(res1.data);
        setTable(res1.data);
        setDepartments(res2.data);
        setDepartment_name(res2.data);
        setDepartment(res2.data);
         setQueue_status_id(res1.data);

        const resQueue = await getQueue();
        SummaryQueueByDepartment(resQueue.data)
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  function SummaryQueueByDepartment(queueData) {
    const queueCountByDepartment = queueData.reduce((acc, queue) => {
      const department_id = queue.department_id;
      acc[department_id] = (acc[department_id] || 0) + 1;
      return acc;
    }, {});

    setQueueByDepartment(queueCountByDepartment);
  }

  const countD = department.length;

  useEffect(() => {
    getQueue()
      .then((res) => {
        const queueData = res.data;
        console.log(queueData?.filter(el=>el.queue_status_id===4));
        const countUsersWithRole1 = queueData.filter(
          (user) => user.queue_status_id === 1
        ).length;
        setCountsPP(countUsersWithRole1);

        const countUsersWithRole2 = queueData.filter(
          (user) => user.queue_status_id === 2
        ).length;
        setUserCount(countUsersWithRole2);

        const countUsersWithRole4 = queueData.filter(
          (user) => user.queue_status_id === 4
        ).length;
        setCount(countUsersWithRole4);
        setQueue(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const chartData = {
    labels: [
      "จำนวนผู้ใช้ที่ยืนยันสถานะ",
      "จำนวนผู้ใช้ที่รับการรักษาแล้ว",
      "จำนวนผู้ใช้ที่ยังไม่ยืนยันสถานะ",
    ],
    datasets: [
      {
        label: "จำนวน",
        data: [userCount, counTspp, count],
        backgroundColor: ["#5bfc83", "#b1fcc4", "#05a82e"],
      },
    ],
  };

  useEffect(() => {
    // สร้างข้อมูลสำหรับแผนภูมิแท่ง
    const usersAndDepartmentData = {
      labels: departments.map((department) => department.department_name),
      datasets: [
        {
          label: "จำนวนผู้ป่วยที่จองคิว",
          data: departments.map(
            (department) => queueByDepartment[department.department_id] || 0
          ),
          backgroundColor: "#5bfc83",
          // backgroundColor:"#b1fcc4",
          borderColor: "#05a82e",
          borderWidth: 1,
        },
      ],
    };
    setUsersAndDepartmentChartData(usersAndDepartmentData);
  }, [departments, queueByDepartment]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true, // ค่าเริ่มต้นคือ true
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const handleToggleView = async (selectedViewType) => {
    setViewType(selectedViewType);

    switch (selectedViewType) {
      case "daily":
        filterDataForDailyView();
        break;

      case "weekly":
        filterDataForWeeklyView();
        break;

      case "monthly":
        filterDataForMonthlyView();
        break;

      default:
        break;
    }
  };

  const filterDataForDailyView = () => {
    const today = moment()

    const filteredData = data.filter((appointment) => {
      const appointmentDate = moment(appointment.queue_date,"DD-MM-YYYY");
      
      return (
        appointmentDate.date() === today.date() &&
        appointmentDate.month() === today.month() &&
        appointmentDate.year() === today.year()
      );
    });
    updateDashboardData(filteredData);
    setDailyAppointments(filteredData);
  };

  const filterDataForWeeklyView = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const filteredData = data.filter((appointment) => {
      const appointmentDate = moment(appointment.queue_date,"DD-MM-YYYY");
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    });
    updateDashboardData(filteredData);
    setWeeklyAppointments(filteredData);
  };

  const filterDataForMonthlyView = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const filteredData = data.filter((appointment) => {
      const appointmentDate = moment(appointment.queue_date,"DD-MM-YYYY");
      return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
    });
    updateDashboardData(filteredData);
    setMonthlyAppointments(filteredData);
  };

  const updateDashboardData = (filteredData) => {
    const countQ = filteredData.length;
    const confirmedCount = filteredData.filter(
      (item) => item.queue_status_id === 2
    ).length;
    const awaitingConfirmationCount = filteredData.filter(
      (item) => item.queue_status_id === 3
    ).length;
    const treatedCount = filteredData.filter(
      (item) => item.queue_status_id === 4
    ).length;
    console.log(countQ);
    setFilteredData(filteredData)
    SummaryQueueByDepartment(filteredData)
    setCountQ(countQ)
    setCountsPP(confirmedCount);
    setUserCount(awaitingConfirmationCount);
    setCount(treatedCount);

    // Update the appointments based on the filtered data
    setFilteredAppointments(filteredData);
  };

  return (
    <div className="w-full">
      <h2 className="title-content">เจ้าหน้าที่</h2>
      <div className="button-container d-flex justify-content-end" >
        <button
        style={{
          
          marginRight: "5px",
        }}
          className={`button ${viewType === "daily" ? "active" : ""}`}
          onClick={() => handleToggleView("daily")}
        >
          แสดงรายวัน
        </button>
        <button
          style={{
          
            marginRight: "5px",
          }}
          className={`button ${viewType === "weekly" ? "active" : ""}`}
          onClick={() => handleToggleView("weekly")}
        >
          แสดงรายสัปดาห์
        </button>
        <button
          style={{
          
            marginRight: "5px",
          }}
          className={`button ${viewType === "monthly" ? "active" : ""}`}
          onClick={() => handleToggleView("monthly")}
        >
          แสดงรายเดือน
        </button>
      </div>
      
       <div className="container22">
        <div className="box">
          <div className="icon-box1">
            <h3 className="D">
              <i class="fa-solid fa-hospital"></i>
            </h3>
            <center>
              <h2 className="g">{countD}</h2>
              <p className="g">จำนวนแผนก</p>
            </center>
          </div>
        </div>

        <div className="box">
          <div className="icon-box1">
            <h3 className="D">
              <i class="fa-solid fa-users"></i>
            </h3>
            <center>
              <h2 className="g">{CountQ}</h2>
              <p className="g">จำนวนผู้ป่วยที่จองคิว</p>
            </center>
          </div>
        </div>

        <div className="box">
          <div className="icon-box1">
            <h3 className="D">
              <i class="fa-solid fa-user-plus"></i>
            </h3>
            <center>
              <h2 className="g">{userCount}</h2>
              <p className="g">ยืนยันสถานะแล้ว</p>
            </center>
          </div>
        </div>

        <div className="box">
          <div className="icon-box1">
            <h3 className="D">
              <i class="fa-solid fa-user-clock"></i>
            </h3>
            <center>
              <h2 className="g">{counTspp}</h2>
              <p className="g">รอยืนยันสถานะ</p>
            </center>
          </div>
        </div>

        <div className="box">
          <div className="icon-box1">
            <h3 className="D">
              <i class="fa-solid fa-user-check"></i>
            </h3>
            <center>
              <h2 className="g">{count}</h2>
              <p className="g">รับการรักษาแล้ว</p>
            </center>
          </div>
        </div>

        <div className="col-md-3 p-3">
          <div className="ta11d">
            <table className="Tables">
              <thead className="thead">
                <tr>
                  <th>#</th>
                  <th>แผนก</th>
                  <th>จำนวนผู้ป่วย</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((department, index) => (
                  <tr key={department.department_id}>
                    <td>{index + 1}</td>
                    <td>{department.department_name}</td>
                    <td>{queueByDepartment[department.department_id] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-5 p-3">
          <div className="bar-chart">
            {usersAndDepartmentChartData && (
              <Bar
                data={usersAndDepartmentChartData}
                options={barChartOptions}
              />
            )}
          </div>
        </div>

        <div className="col-md-2 p-3">
          <div className="chart-container1">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        <br></br>
        <div className="container-left">
          <div className="card">
            <h3>คำอธิบาย</h3>
            <ul>
              <li>
                box : ข้างบนนั้นใช้แสดงจำนวน แผนกทั้งหมด คิวที่ผูป่วยจองทั้งหมด
                จำนวนผู้ป่วยที่ยืนยันสถานะและก็ที่ยังไม่ยืนยันสถานะ
                และจำนวนที่ได้รับการรักษาไปแล้ว.
              </li>
              <li>
                Table :
                ใช้แสดงแผนกและจำนวนผู้ป่วยที่จองคิวเพื่อเข้ารักษาในแผนกนั้นๆ
                แบบเป็นตาราง.
              </li>
              <li>
                ในส่วนของกราฟแท่ง (Bar Chart):
                เพื่อใช้แสดงจำนวนของผู้ป่วยที่จองคิว
                เมื่อแตะตรงแท่งกราฟนั้นๆก็จะแสดงจำนวนผู้ป่วยที่จองคิวไว้กับแผนกนั้นๆ.
              </li>
              <li>
                (Doughnut Chart) : แสดงเปอร์เซ้นความมากน้อยของ
                ผู้ป่วยที่ยืนยันสถานะแล้ว
                กับที่ยังไม่ยืนยันและจำนวนที่ข้ารับการรักษา
                โดยจะเห็นจำนวนที่แน่ชัดเมื่อเลือกที่แถบสีนั้นๆ.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAuthorities;
