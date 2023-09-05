import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../../../../style/information.css";

function MainHospital() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [address, setAddress] = useState([]);
  const [hospital_logo, setHospital_Logo] = useState("");
  const [hospital_name, setHospital_Name] = useState("");
  const [hospital_phone_number, setHospital_Phone_Number] = useState("");
  const [hospital_No, setHospital_No] = useState("");
  const [hospital_Moo, setHospital_Moo] = useState("");
  const [hospital_latitude, setHospital_Latitude] = useState("");
  const [hospital_logitude, setHospital_Logtitude] = useState("");
  const [hospital_subdistrict, setHospital_Subdistrict] = useState("");
  const [hospital_district, setHospital_District] = useState("");
  const [hospital_province, setHospital_Province] = useState("");
  const [hospital_zipcode, setHospital_Zipcode] = useState("");
  const [road, setRoad] = useState("");
  const { HId } = useParams();

  useEffect(() => {
    axios
    .get("https://combative-buckle-moth.cyclic.app/apis/hospitals/"+ 1)
    .then((res) => {
      console.log(res.data);
      setId(res.data.id);
      setHospital_Logo(res.data.hospital_logo);
      setHospital_Name(res.data.hospital_name);
      setHospital_Phone_Number(res.data.hospital_phone_number);
      setHospital_No(res.data.hospital_No);
      setHospital_Moo(res.data.hospital_Moo);
      setHospital_Latitude(res.data.hospital_latitude);
      setHospital_Logtitude(res.data.hospital_logitude);
      setHospital_Subdistrict(res.data.hospital_subdistrict);
      setHospital_District(res.data.hospital_district);
      setHospital_Province(res.data.hospital_province);
      setHospital_Zipcode(res.data.hospital_zipcode);
      setRoad(res.data.road);
      setAddress(res.data.address);
      
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

  return (
    <div className="w-full">
      <div className="d-flex justify-content-center">
        <h2 className="title-content">ข้อมูลทั่วไปของโรงพยาบาล</h2>
        
      </div>
      <div className="container11">
          <div className="card-hospital">
            <b>
            <b><img className="img-ht" src={hospital_logo} />
            </b>
            </b>

            <div className="hospital-detail">
              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <h3 className="hospital-name">
                      <b>{hospital_name}</b>
                    </h3>
                  </div>
                </div>
                <h5>ข้อมูลติดต่อ</h5>
                <hr></hr>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>เลขที่ : {hospital_No} </h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>ถนน : {road}</h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>ตำบล : {hospital_subdistrict}</h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>อำเภอ : {hospital_district}</h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>จังหวัด: {hospital_province}</h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>รหัสไปรษณีย์: {hospital_zipcode}</h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>เบอร์โทร : {hospital_phone_number}</h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>ละติจูด : {hospital_latitude}</h6>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <h6>ลองติจูด: {hospital_logitude}</h6>
                  </div>
                </div>
              </div>
         
        </div>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <Link to="/admin/hospital/form" className="btn btn-warning mx-1">
            แก้ไข
          </Link>
          <Link to="/" className="btn btn-primary mx-1">
            หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
export default MainHospital;
