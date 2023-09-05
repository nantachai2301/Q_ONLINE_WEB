import React from 'react'
import Modernavaccine from '../../../components/DetelNews/Modernavaccine'

const NewsModernaBivalent = () => {
  return (
    <div className="w-full">
      <div className="w-full mb-4" style={{ textAlign: "center" }}>
        <h4 className="title-content">
            ขอเชิญประชาชนทั่วไป เข้ารับบริการ ฉีดวัคซีนโควิด-19 Moderna Bivalent
        </h4>
      </div>
        <div className="ListContainer">
          <div className="listResult">
            <Modernavaccine />
          </div>
        </div>
      </div>
  )
}

export default NewsModernaBivalent;