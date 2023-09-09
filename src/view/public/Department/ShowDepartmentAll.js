import React, { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../../src/style/departmentAll.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { getDepartment} from "../../../service/DepartmentType.Service";
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
    <div className="w-full">
      <div className="w-full mb-4">
        <h4 className="title-content">แผนกในโรงพยาบาล</h4>
      </div>
      <div class="container5 p-4 my-4 ">
      <div className="row">
      {departments.length > 0 ? (
            departments.map((department) => (
              <div className="card" key={department.id} style={{ width: "12rem", height : "300px" }} >
                <Card.Img
                  variant="top"
                  src={department.department_image}
                  style={{ width: "110%", height: "60%"}}
                />
                <h5 className="title-name-depart mt-4 mx-6">
                  {department.department_name}
                </h5>
               
                <div className="button-card1">
                  <Link
                    to={`/detaildental/${department.department_id}`}
                    className="btn btn-success mx-1"
                  >
                    <div className="text-link1">ข้อมูลแผนก</div>
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