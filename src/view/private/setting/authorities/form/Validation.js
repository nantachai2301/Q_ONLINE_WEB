import * as Yup from "yup";

const Schema = Yup.object().shape({
  prefix_name: Yup.string().required("กรุณาเลือก คำนำหน้า"),
  first_name: Yup.string().required("กรุณากรอก ชื่อ"),
  last_name: Yup.string().required("กรุณากรอก นามสกุล"),
  id_card: Yup.string()
    .min(13, "กรุณากรอกให้ครบ 13 หลัก")
    .required("กรุณากรอก เลขบัตรประชาชน"),

  birthday: Yup.string().required("กรุณากรอก วันเดือนปีเกิด"),

  gender: Yup.string().required("กรุณาเลือก เพศ"),

  password: Yup.string()
    .min(6, "กรุณากรอกให้ครบ 6 หลัก")
    .required("กรุณากรอก รหัสผ่าน"),
});

export default Schema;
