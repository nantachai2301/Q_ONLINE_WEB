import React, { useRef, useState, } from 'react';
import { TextSelect } from '../../../components/TextSelect';
import PageSize from '../../../data/pageSize.json';
import Pagination from 'react-js-pagination';
import DateTh from '../../../components/DateTh';
import StatusBook from '../../../data/statusBook.json';
// import { useReactToPrint } from 'react-to-print';
import MainPdf from './pdf/MainPdf';

function ShowDataCheckQueue({ data, pagin, changePage, changePageSize }) {
  const [dataQ, setDataQ] = useState(null);
  const componentRef = useRef();
  // // const pageStyle = `
  // // @page {
  // //   size: 4in 4in
  // // }`;

  // useEffect(() => {
  //   if (dataQ) {
  //   //   print();
  //   }
  // }, [dataQ]);

//   const print = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: "Q_Online",
//     pageStyle: pageStyle,
//   });

  return (
    <div className="w-full">
      <div className="d-flex justify-content-between mb-2">
        <div className="w-pagesize">
          <TextSelect
            id="pagesize"
            name="pagesize"
            options={PageSize}
            value={PageSize.filter((a) => a.id === pagin.pageSize)}
            onChange={(item) => {
              changePageSize(item.id);
            }}
            getOptionLabel={(z) => z.label}
            getOptionValue={(x) => x.id}
          />
        </div>
      </div>
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr className="table-success">
              <th scope="col" style={{ width: '5%' }}>
                ลำดับ
              </th>
              <th scope="col" style={{ width: '10%' }}>
                รหัสคิว
              </th>
              <th scope="col" style={{ width: '10%' }}>
                ประเภทการรักษา
              </th>
              <th scope="col" style={{ width: '5%' }}>
                ห้อง
              </th>
              <th scope="col" style={{ width: '5%' }}>
              คิวที่
              </th>
              <th scope="col" style={{ width: '10%' }}>
                สถานะ
              </th>
              
              
              
             
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="text-center text-danger">-- ไม่พบข้อมูล --</div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{(pagin.currentPage - 1) * pagin.pageSize + (index + 1)}</td>
                  <td>{item.code}</td>
                  <td>{item.fullname_doctor}</td>
                  <td>{item.treatment_type_name}</td>
                  <td>
                    <DateTh date={item.created_date} />
                  </td>
                  <td>
                    <DateTh date={item.open_date} />
                  </td>
                  <td>{item.number}</td>
                  <td>
                    <StatusBook status={item.status} />
                  </td>
                  <td>
                    <button type="button" className='btn btn-info' onClick={() => {
                      //print();
                      setDataQ(item);
                    }}
                    >

                      <i className="fa-solid fa-print text-white"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <div>จำนวน {pagin.totalRow} รายการ</div>
        <div>
          <Pagination
            activePage={pagin.currentPage}
            itemsCountPerPage={pagin.pageSize}
            totalItemsCount={pagin.totalRow}
            pageRangeDisplayed={pagin.totalPage}
            onChange={(page) => {
              changePage(page);
            }}
          />
        </div>
      </div>
      <div className='d-flex justify-content-center'>
        <div className='hidden'>
          <div ref={componentRef}>
            <MainPdf dataQ={dataQ} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDataCheckQueue;