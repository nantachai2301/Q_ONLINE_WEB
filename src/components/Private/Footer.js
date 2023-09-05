import React, { useEffect, useState } from "react";
import "../../style/private.css";
import axios from "axios";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
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

  useEffect(() => {
    axios
      .get("https://combative-buckle-moth.cyclic.app/apis/hospitals/1")
      .then((res) => {
        console.log(res.data);
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <footer id="private">
      <div className="footer">
        <div className="justify-content-center">
          <div className="row-12">
            <h5 className="hospital-name">
              <b>{hospital_name}</b>
            </h5>
            <hr></hr>
            <div className="text-title">
              <h6>
                เลขที่ : {hospital_No} {road} {hospital_subdistrict}{" "}
                {hospital_district} {hospital_province} {hospital_zipcode}
              </h6>
            </div>
            <div className="List">
              <div className="List-Item">
                <h6>
                  ละติจูด: {hospital_latitude} ลองติจูด: {hospital_logitude}
                </h6>
              </div>
            </div>

            <div className="List">
              <div className="List-Item">
                <FontAwesomeIcon icon={faPhone} />
                <span>
                  <a href={`tel:${hospital_phone_number}`}>
                    {hospital_phone_number}
                  </a>
                </span>
              </div>
            </div>
            <div className="List">
              <div className="List-Item">
                <FontAwesomeIcon icon={faHouse} />
                <span>
                  <a
                    href="https://www.facebook.com/Somdej17Hospital/?locale=th_TH"
                    target="_blank"
                    rel="noreferrer"
                  >
                    : https://www.facebook.com/groups/somdej17/
                  </a>
                </span>
              </div>
            </div>
            <div className="List">
              <div className="List-Item">
                <FontAwesomeIcon icon={faGlobe} />
                <span>
                  <a
                    href="https://somdej17.moph.go.th/?fbclid=IwAR1n_tL4fx_XUrN0w843DNvbj4jbe4wF2sW5zq6pC5V9D3CKb-DNeM9SoMU"
                    target="_blank"
                    rel="noreferrer"
                  >
                    : somdej17.moph.go.th
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
