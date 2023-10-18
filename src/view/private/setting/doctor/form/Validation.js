import * as Yup from 'yup';

const Schema = Yup.object().shape({
  prefix_name: Yup.string().required('กรุณากรอกคำนำหน้าชื่อ'),
  doctor_first_name: Yup.string().required('กรุณากรอกชื่อ'),
  doctor_last_name: Yup.string().required('กรุณากรอกนามสกุล'),
  doctor_phone: Yup.string().required('กรุณากรอกเบอร์โทร'),
  doctor_status: Yup.string().required('กรุณาเลือกสถานะการใช้งาน'),
  department_id: Yup.string().required('กรุณาเลือกแผนก'),
});


export default Schema;
