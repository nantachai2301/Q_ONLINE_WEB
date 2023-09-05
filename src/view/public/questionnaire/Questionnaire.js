import axios from "axios";
import React, { useState } from "react";
import "../../../style/questionnaire.css";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

/**หน้าประเมินจองคิวของผู้ป่วย */
function Questionnaire() {
  const [questionaire_name, setQuestionaire_name] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [queue_status_id, setQueue_status_id] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://json-six-lac.vercel.app/questionaire", {
        questionaire_name,
        suggestion,
        // queue_status_id
      })
      .then((res) => {
        alert("save Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full mb-5">
      <h2 className="title-content">แบบประเมินความพึงพอใจ</h2>
      <form className="containerq" onSubmit={handleSubmit}>
        <div className="questionnaire">
          *กรุณาให้คะเเนนตามระดับความพึงพอใจในการใช้ระบบจองคิว
        </div>
        <div className="questionnaires">
          <p>คุณเลือก : {questionaire_name}</p>
          <div class="rating">
            <input
              type="radio"
              hidden
              name="rate"
              id="rating-opt5"
              value="ระบบใช้งานได้สะดวกดีมาก"
              data-idx="0"
              onChange={(e) => setQuestionaire_name(e.target.value)}
              required/>
            <label className="star" for="rating-opt5">
              <span></span>
            </label>

            <input
              type="radio"
              hidden
              name="rate"
              id="rating-opt4"
              value="ระบบใช้งานได้สะดวกดี"
              data-idx="1"
              onChange={(e) => setQuestionaire_name(e.target.value)}
              required/>
            <label className="star"  for="rating-opt4">
              <span></span>
            </label>

            <input
              type="radio"
              hidden
              name="rate"
              id="rating-opt3"
              value="ระบบใช้งานได้สะดวกพอใช้"
              data-idx="2"
              onChange={(e) => setQuestionaire_name(e.target.value)}
              required/>
            <label className="star"  for="rating-opt3">
              <span></span>
            </label>

            <input
              type="radio"
              hidden
              name="rate"
              id="rating-opt2"
              value="ระบบควรปรับปรุง"
              data-idx="3"
              onChange={(e) => setQuestionaire_name(e.target.value)}
              required/>
            <label className="star"  for="rating-opt2">
              <span></span>
            </label>

            <input
              type="radio"
              hidden
              name="rate"
              id="rating-opt1"
              value="ระบบควรปรับปรุงอย่างยิ่ง"
              data-idx="4"
              onChange={(e) => setQuestionaire_name(e.target.value)}
            required/>
            <label className="star"  for="rating-opt1">
              <span></span>
            </label>
          </div>
        </div>
        <div className="textarea2">
          <h6>ข้อเสนอเเนะเพิ่มเติม</h6>
          <textarea
            value={suggestion}
            onChange={(e) => {
              setSuggestion(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="Items">
          <button
            type="submit"
            className="btn btn-success"
            onClick={() => {
              Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ ขอบคุณที่ทำแบบประเมิน",
                showConfirmButton: false,
                timer: 1500,
                
              });
              
            }}
          >
            ยืนยัน
          </button>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          {"  "}
        </div>
      </form>
    </div>
  );
}
export default Questionnaire;
