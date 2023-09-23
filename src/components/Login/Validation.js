import * as Yup from "yup";

const Schema = Yup.object().shape({
  id_card: Yup.string()
  .min(13, "กรุณากรอกให้ครบ 13 หลัก")
  .required("กรุณากรอก เลขบัตรประชาชน"),
  password: Yup.string()
  .min(6, "กรุณากรอกให้ครบ 6 หลัก")
  .required("กรุณากรอก รหัสผ่าน"),

});

export default Schema;
