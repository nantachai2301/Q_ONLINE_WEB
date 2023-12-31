import React from 'react'
import Food from '../../../components/DetelNews/Food'

const Newsfood = () => {
  return (
    <div className="w-full">
      <div className="w-full mb-4" style={{ textAlign: "center" }}>
        <h4 className="title-content">
          เด็กไทยวันนี้ สูงดีสมส่วน ด้วย 4 ข้อแนะนำ
        </h4>
      </div>
        <div className="ListContainer">
          <div className="listResult">
            <Food />
          </div>
        </div>
      </div>
  )
}

export default Newsfood;