import React, { useEffect, useState } from "react";
import "../../style/public.css";
import hospitalData from "../../data/hospital.json"; // Renamed the imported JSON data
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FetchFooterData = () => {
  const [hospital, setHospital] = useState({});

  useEffect(() => {
    if (hospitalData.length > 0) {
      setHospital(hospitalData[0]);
    }
  }, []);

  return (
    <footer id="public">
      <div className="footers">
        <div className="justify-content-center">
          <div>
            {Object.keys(hospital).length > 0 ? (
              <div className="Title-Footer" style={{ fontSize: "1.5vw" }}>
                 <div>
                <div className="Footer-name">
                  <h4 style={{ fontSize: "2.2vw" }}id="hospital_name">{hospital.hospital_name}</h4>
                </div>
                <div className="Footer-Detail">
                   <p id="hospital_All">
                  {hospital.hospital_No} {hospital.hospital_subdistrict},
                  {hospital.hospital_district}, {hospital.hospital_province},
                  {hospital.hospital_zipcode}
                </p>
                </div>
               <div className="item">
               <div className="List-Item">
                <FontAwesomeIcon icon={faPhone} />
                <span>
                  <a> {hospital.hospital_phone_number}</a>
                </span>
              </div>
               </div>
              </div>
              </div>
             
            ) : (
              <p>Loading hospital data...</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FetchFooterData;
