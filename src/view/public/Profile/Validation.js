import * as Yup from "yup";

const Schema = Yup.object().shape({
  prefix_name: Yup.string().required("กรุณาเลือก คำนำหน้า"),
  first_name: Yup.string().required("กรุณากรอก ชื่อ"),
  last_name: Yup.string().required("กรุณากรอก นามสกุล"),
  id_card: Yup.string().min(13, "กรุณากรอกให้ครบ 13 หลัก").required("กรุณากรอก เลขบัตรประชาชน"),
 

  phoneNumber: Yup.string()
  .required("กรุณากรอก เบอร์โทรผู้ติดต่อ")
  .matches(/^[0-9]{10}$/, "Invalid phone number"),
  birthday: Yup.string().required("กรุณากรอก วันเดือนปีเกิด"),
  phoneNumber: Yup.string().min(10, "กรุณากรอกให้ครบ 10 หลัก").required("กรุณากรอก เบอร์โทรศัพท์"),
  gender: Yup.string().required("กรุณาเลือก เพศ"),
  address: Yup.string().required("กรุณากรอก ที่อยู่"),
  weight: Yup.string().required("กรุณากรอก น้ำหนัก"),
  height: Yup.string().required("กรุณากรอก ส่วนสูง"),
  subdistrict: Yup.string().required("กรุณากรอก ตำบล "),
  district: Yup.string().required("กรุณากรอก  อำเภอ"),
  province: Yup.string().required("กรุณากรอก   จังหวัด"),
  postcode: Yup.string().required("กรุณากรอก   รหัสไปรษณีย์"),
  contact_relation_id: Yup.string().required("กรุณากรอก คำนำหน้าผู้ติดต่อ"),
  contact_first_name: Yup.string().required("กรุณากรอก ชื่อผู้ติดต่อ"),
  contact_last_name: Yup.string().required("กรุณากรอก นามสกุลผู้ติดต่อ"),

  contact_phoneNumber: Yup.string()
  .required("กรุณากรอก เบอร์โทรผู้ติดต่อ")
  .matches(/^[0-9]{10}$/, "Invalid phone number"),
  password: Yup.string().min(6, "กรุณากรอกให้ครบ 6 หลัก").required("กรุณากรอก รหัสผ่าน"),

});

export default Schema;
