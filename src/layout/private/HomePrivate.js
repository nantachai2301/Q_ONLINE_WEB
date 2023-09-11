import React, { useEffect, useState } from "react";
import {
  faPerson,
  faCalendarDays,
  faUser,
  faChalkboardUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "../../style/admin.css";
import Chart from "chart.js/auto";
import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";
import { getDoctor } from "../../service/Doctor.Service";
import { getPatient } from "../../service/Patient.Service";
import { getDepartment } from "../../service/DepartmentType.Service";
import 'chartjs-plugin-datalabels'; 
function HomePrivate() {
  const [counts, setCounts] = useState({});
  const [patients, setPatients] = useState({});
  const [department, setDepartment] = useState([]);
  const [department_id, setDepartment_id] = useState([]);
  const [data, setData] = useState([]);
  const [id, setId] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [doctor_id, setdoctor_id] = useState([]);
  const [department_name, setDepartment_name] = useState([]);
  const [table, setTable] = useState([]);
  const [idCount, setIdCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [counTsp, setCountsP] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [doctorsByDepartment, setDoctorsByDepartment] = useState({});
  const [usersAndDoctorsChartData, setUsersAndDoctorsChartData] =
    useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await getDoctor();
        //         let workingDoctorsCount = 0;
        //         let onLeaveDoctorsCount = 0;
        // // นับจำนวนแพทย์ที่ใช้งานและพักงานตามสถานะ
        // doctors.forEach((doctor) => {
        //   if (doctor.doctor_status === 'ใช้งาน') {
        //     workingDoctorsCount++;
        //   } else if (doctor.doctor_status === 'พักงาน') {
        //     onLeaveDoctorsCount++;
        //   }
        // });
        // console.log('จำนวนแพทย์ที่ใช้งาน:', workingDoctorsCount);
        //     console.log('จำนวนแพทย์ที่พักงาน:', onLeaveDoctorsCount);

        const res2 = await getDepartment();

        console.log(res1);
        console.log(res2);
        setDoctors(res1.data);
        setId(res1.data);
        setCounts(res1.data);
        setData(res1.data);
        setdoctor_id(res1.data);
        setDepartment_id(res1.data);
        setTable(res1.data);
        setDepartments(res2.data);
        setDepartment_name(res2.data);
        setDepartment(res2.data);

        const resDoctors = await getDoctor();
        const doctorsData = resDoctors.data;

        const doctorsCountByDepartment = doctorsData.reduce((acc, doctor) => {
          const department_id = doctor.department_id;
          acc[department_id] = (acc[department_id] || 0) + 1;
          return acc;
        }, {});

        setDoctorsByDepartment(doctorsCountByDepartment);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const count = counts.length;

  const countD = department.length;
  useEffect(() => {
    getPatient()
      .then((res) => {
        console.log(res);
        const patientsData = res.data;

        const countUsersWithRole1 = patientsData.filter(
          (user) => user.role_id === 1
        ).length;
        setIdCount(countUsersWithRole1);

        const countUsersWithRole2 = patientsData.filter(
          (user) => user.role_id === 2
        ).length;
        setCountsP(countUsersWithRole2);

        const countUsersWithRole0 = patientsData.filter(
          (user) => user.role_id === 0
        ).length;
        setUserCount(countUsersWithRole0);
        setPatients(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const usersAndDoctorsData = {
      labels: departments.map((department) => department.department_name),
      datasets: [
        {
          label: "จำนวนแพทย์ทั้งหมด",
          data: departments.map(
            (department) => doctorsByDepartment[department.department_id] || 0
          ),
          backgroundColor: "#98EDC3",
        },
        {
          label: "จำนวนแพทย์ที่ใช้งาน",
          data: departments.map((department) =>
            doctors
              .filter(
                (doctor) =>
                  doctor.department_id === department.department_id &&
                  doctor.doctor_status === "ใช้งาน"
              )
              .length.toFixed(0)
          ),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "จำนวนแพทย์ที่พักงาน",
          data: departments.map((department) =>
            doctors
              .filter(
                (doctor) =>
                  doctor.department_id === department.department_id &&
                  doctor.doctor_status === "พักงาน"
              )
              .length.toFixed(0)
          ),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    setUsersAndDoctorsChartData(usersAndDoctorsData);
  }, [departments, doctorsByDepartment]);

  const barChartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 10,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "แผนภูมิแท่งแสดงจำนวนแพทย์แต่ละแผนก",
      },
    },
  };

  return (
    <div className="w-fulls">
      <h2 className="title-content">ผู้ดูแลระบบ</h2>
      <div className="container22">
        <div className="boxs">
          <div className="icon-box">
            <h3 className="d">
              <i class="fa-solid fa-user-doctor"></i>
            </h3>
            <center>
              <h2 className="C">{count}</h2>
              <p className="C">จำนวนแพทย์</p>
            </center>
          </div>
        </div>
        <div className="boxs">
          <div className="icon-box">
            <h3 className="d">
              <i class="fa-solid fa-hospital"></i>
            </h3>
            <center>
              <h2 className="C">{countD}</h2>
              <p className="C">จำนวนแผนก</p>
            </center>
          </div>
        </div>

        <div className="boxs">
          <div className="icon-box">
            <h3 className="d">
              <i class="fa-solid fa-user-injured"></i>
            </h3>
            <center>
              <h2 className="C">{idCount}</h2>
              <p className="C">จำนวนผู้ใช้มีบัญชีในระบบ</p>
            </center>
          </div>
        </div>
        <div className="boxs">
          <div className="icon-box">
            <h3 className="d">
              <i class="fa-solid fa-person-walking"></i>
            </h3>
            <center>
              <h2 className="C">{userCount}</h2>
              <p className="C">จำนวนผู้ใช้ไม่มีบัญชีในระบบ</p>
            </center>
          </div>
        </div>
        <div className="boxs">
          <div className="icon-box">
            <h3 className="d">
              <i class="fa-solid fa-user-nurse"></i>
            </h3>
            <center>
              <h2 className="C">{counTsp}</h2>
              <p className="C">จำนวนเจ้าหน้าที่</p>
            </center>
          </div>
        </div>

        <div className=" col-md-3">
          <h6>จำนวนแพทย์ในแต่ละแผนก</h6>
          <div className="t1d">
            <table class="tables">
              <thead class="theads">
                <tr>
                  <th>#</th>
                  <th>แผนก</th>
                  <th>จำนวนแพทย์</th>
                  <th>ใช้งาน</th>
                  <th>พักงาน</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department, index) => (
                  <tr key={department.department_id}>
                    <td>{index + 1}</td>
                    <td>{department.department_name}</td>
                    <td>
                      {doctorsByDepartment[department.department_id] || 0}
                    </td>
                    <td>
                      {
                        doctors.filter(
                          (doctor) =>
                            doctor.department_id === department.department_id &&
                            doctor.doctor_status === "ใช้งาน"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        doctors.filter(
                          (doctor) =>
                            doctor.department_id === department.department_id &&
                            doctor.doctor_status === "พักงาน"
                        ).length
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-8">
          <h6>แผนภูมิแท่งแสดงจำนวนแพทย์แต่ละแผนก</h6>
          <div className="bar-chart">
            {usersAndDoctorsChartData && (
              <Bar
                data={usersAndDoctorsChartData}
                options={barChartOptions}
                id="yourBarChartId"
                width={500}
                height={400}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePrivate;
