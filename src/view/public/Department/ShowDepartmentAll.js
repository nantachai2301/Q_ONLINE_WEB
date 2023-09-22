import React, { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../../src/style/departmentAll.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getDepartment } from "../../../service/DepartmentType.Service";
function ShowDepartmentAll({}) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartment();

        console.log(response.data); // Check the response data

        setDepartments(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="container5">
      <h4 className="title-content">แผนกในโรงพยาบาล</h4>
      <div className="row ">
        <div className="departs" style={{ justifyContent: "center" }}>
          {departments.length > 0 ? (
            departments.map((department) => (
              <div
                className="card depart-card"
                key={department.id}
                style={{ width: "20rem", height: "320px" }}
              >
                <div style={{ overflow: "hidden", height: "80%" }}>
                  <Link to={`/detaildental/${department.department_id}`}>
                    <Card.Img
                      variant="top"
                      src={department.department_image}
                      style={{ width: "200px", height: "170px" }}
                    />
                  </Link>
                </div>
                <Link
                  id="detaildental"
                  to={`/detaildental/${department.department_id}`}
                  className="link-no-underline"
                >
                  <h4 className="title-name-depart mt-4 mx-6">
                    {department.department_name}
                  </h4>
                </Link>
                <div className="button-card1">
                  <Link
                    to={`/detaildental/${department.department_id}`}
                    className="btn btn-primary mx-1"
                  >
                    <div className="text-link1" id="detaildentalLink">
                      <h6>ข้อมูลแผนก</h6>
                    </div>
                    
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div>Loading ...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowDepartmentAll;
