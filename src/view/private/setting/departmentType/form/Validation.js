import * as Yup from 'yup';

const Schema = Yup.object().shape({
  department_name: Yup.string().required('กรุณากรอก ชื่อแผนก'),
  department_image: Yup.string().required('กรุณากรอก เลือกรูปภาพ'),
  open_time: Yup.string()
  .required('กรุณากรอก เวลาเปิด'),
close_time: Yup.string()
  .required('กรุณากรอก เวลาปิด'),
  department_phone:Yup.string().required('กรุณากรอก เบอร์โทรแผนก'),
  max_queue_number: Yup.string().required('กรุณากรอก จำนวนคิวที่เปิดรับ'),
  floor: Yup.string().required('กรุณากรอก ชั้น'),
  building: Yup.string().required('กรุณากรอก อาคาร'),
});


export default Schema;
