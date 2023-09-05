import * as Yup from 'yup';

const Schema = Yup.object().shape({
  treatment: Yup.string().required('กรุณาเลือก ประเภทการรักษา'),
  doctor: Yup.string().required('กรุณาเลือก ชื่อแพทย์'),
  openDate: Yup.string().required('กรุณาเลือก วันที่เปิดจองคิว'),
  amount: Yup.number().min(1, 'จำนวนต้องมากกว่า 0').required('กรุณากรอก จำนวนที่เปิดจองคิว'),
});

export default Schema;
