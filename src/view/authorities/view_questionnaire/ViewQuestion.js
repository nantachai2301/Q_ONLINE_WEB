import React, { Fragment, useState, useEffect } from "react";
import {
  faPerson,
  faCalendarDays,
  faUser,
  faBottleDroplet,
  faBookOpenReader,
  faRadiationAlt,
  faListCheck,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import "../../../style/viewquestion.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ViewQuestion() {
  const [counts, setCounts] = useState({});
  const [data, setData] = useState([]);
  const [id, setId] = useState({});
  const [questionaire, setQuestionaire] = useState([]);
  const [questionaire_id, setQuestionaire_id] = useState([]);
  const [questionaire_name, setQuestionaire_name] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [table, setTable] = useState([]);
  const [idCount, setIdCount] = useState(0);
  const [idCountsT, setIdCountT] = useState(0);
  const [idCountsThree, setIdCountThree] = useState(0);
  const [idCountsfour, setIdCountFour] = useState(0);
  const [idCountsfive, setIdCountFive] = useState(0);
  const [idCountdd, setIdCountdd] = useState(0);
  const [idq, setQ] = useState(0);
  const [date, setDate] = useState(new Date());
  const [viewQ, setViewQ] = useState(null); // เรียกใช้ข้อมูลจาก หน้า db มาโชว์

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get(
          `https://shy-jade-clownfish.cyclic.app/apis/questionaire`
        );

        console.log(res1);

        setId(res1.data);
        setCounts(res1.data);
        setData(res1.data);
        setTable(res1.data);
        setQuestionaire_id(res1.data);
        setQuestionaire_name(res1.data);
        setSuggestion(res1.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Count occurrences of each ID
    const count = data.reduce((acc, item) => {
      acc[item.questionaire_id] = (acc[item.questionaire_id] || 0) + 1;
      return acc;
    }, {});

    // Set the count of the specific ID you want to show
    setIdCount(count[1] || 0);
    setIdCountT(count[2] || 0);
    setIdCountThree(count[3] || 0);
    setIdCountFour(count[4] || 0);
    setIdCountFive(count[5] || 0);

  }, [data]);

  const count = counts.length;

  const countQ = questionaire.length;

  useEffect(() => {
    axios
      // เรียกใช้ API เพื่อดึงข้อมูลจากฐานข้อมูล
      .get("https://shy-jade-clownfish.cyclic.app/apis/questionaire")
      .then((res) => {
        console.log(res);
        setQuestionaire(res.data);
        setViewQ(res.data);
        setQ(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onChange = (date) => {
    setDate(date);
  };

  const countS = suggestion.length;

  return (
    
    <div className="conn">
      <h2 className="title-content">ประวัติการประเมิน</h2>
      <div className="cons1">
        <div className="content">
          <div className="cards1">
            <div className="card">
              <div class="box">
                <div class="icon">
                  <FontAwesomeIcon icon={faUser} class="fa-user  fa-2x" />
                </div>
                <div className="count">{count}</div>

                <h5 className="T1">จำนวนคนประเมิน</h5>
              </div>
            </div>
            <div className="card">
              <div class="box">
                <div class="icon">
                  <FontAwesomeIcon icon={faListCheck} class="fa-list-check fa-2x" />
                </div>
                <div className="counts">{countQ}</div>
                <h5 className="T2">ข้อความที่เลือกในการประเมิน</h5>
              </div>
            </div>


            {/* <div className="card">
              <div class="box">
                <div class="icon">
                  <FontAwesomeIcon icon={faMessage} class="fa-message  fa-2x" />
                </div>
                <div className="countS">{countS}</div>
                <h5 className="T1">ข้อความเพิ่มเติม</h5>
              </div>
            </div> */}

          </div>
          <div className="Connd">
            <div className="overflow">
              <table className="table table-bordered">
                <thead>
                  <tr className="Taa1">
                    <th scope="col" style={{ width: "5%" }}>
                      #
                    </th>
                    <th scope="col" style={{ width: "35%" }}>
                      ประโยคที่เลือกในการประเมิน
                    </th>
                    <th scope="col" style={{ width: "25%" }}>
                      จำนวนคนประเมิน
                    </th>
                    {/* <th scope="col" style={{ width: "65%" }}>
                      ประโยคที่เลือกเพิ่มเติม
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>ระบบควรปรับปรุงอย่างยิ่ง</td>
                    <td>{idCount}</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>ระบบควรปรับปรุง</td>
                    <td>{idCountsT}</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>ระบบใช้งานได้สะดวกพอใช้</td>
                    <td>{idCountsThree}</td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>ระบบใช้งานได้สะดวกดี</td>
                    <td> {idCountsfour}</td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>ระบบใช้งานได้สะดวกดีมาก</td>
                    <td> {idCountsfive}</td>
                  </tr>

                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      {/* <div>
        <Calendar showWeekNumbers onChange={onChange} value={date} />
        {console.log(date)}

      </div> */}
    </div>
  )
}

export default ViewQuestion;
