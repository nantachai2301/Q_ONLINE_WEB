import * as Yup from 'yup';

const Schema = Yup.object().shape({
  prefixId: Yup.string().required('กรุณาเลือก คำนำหน้า'),
  name: Yup.string().required('กรุณากรอก ชื่อ'),
  lastname: Yup.string().required('กรุณากรอก นามสกุล'),
  treatment: Yup.string().required('กรุณาเลือก ประเภทการรักษา'),
});

export default Schema;
