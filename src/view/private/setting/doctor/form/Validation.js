import * as Yup from 'yup';

const Schema = Yup.object().shape({
  doctor_first_name: Yup.string().required("กรุณากรอกชื่อ"),
  doctor_last_name: Yup.string().required("กรุณากรอกนามสกุล"),
  prefix_name: Yup.string().required("กรุณากรอกคำนำหน้าชื่อ"),
  doctor_status: Yup.string().required("กรุณากรอกสถานะ"),
  department_id: Yup.string().required("กรุณากรอกแผนก"),
  // doctor_image: Yup.string().matches(
  //   /^\/img\/[^/]+\.(jpg|png)$/, // ตรวจสอบ URL รูปภาพว่ามีรูปแบบถูกต้องหรือไม่
  //   "รูปภาพต้องอยู่ในรูปแบบ /img/ชื่อไฟล์.jpg"
  // ),

});

export default Schema;
