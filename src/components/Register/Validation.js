import * as Yup from "yup";

const Schema = Yup.object().shape({
  prefix_name: Yup.string().required("กรุณาเลือก คำนำหน้า"),
  first_name: Yup.string().required("กรุณากรอก ชื่อ"),
  last_name: Yup.string().required("กรุณากรอก นามสกุล"),
  id_card: Yup.string().min(13, "กรุณากรอกให้ครบ 13 หลัก").required("กรุณากรอก เลขบัตรประชาชน"),
  // idCard: Yup.string()
  // .test("is-citizenID", "กรุณาตรวจสอบเลขบัตรประชาชนอีกครั้ง", function checkCitizen(value) {
  //   if (value === undefined) {
  //     return false;
  //   }
  //   if (value.length !== 13) {
  //     return false;
  //   }
  //   let sum = 0;
  //   for (let i = 0; i < 12; i++) {
  //     sum += parseInt(value.charAt(i)) * (13 - i);
  //   }
  //   let mod = sum % 11;
  //   let check = (11 - mod) % 10;
  //   if (check === parseInt(value.charAt(12))) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // })
  // .required("กรุณากรอก เลขบัตรประชาชน"),

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


});

export default Schema;
