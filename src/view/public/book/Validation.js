import * as Yup from "yup";

const Schema = Yup.object().shape({
 
    symptom: Yup.string().required("กรุณากรอก อาการเบื้องต้น"),
    department_id: Yup.string().required("กรุณาเลือกแผนก"),
  
  
});

export default Schema;
