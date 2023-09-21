import axios from "axios";

const API_URL = "https://encouraging-peplum-newt.cyclic.cloud/apis/";

const getDoctor = async ( ) => {
  return await axios.get(API_URL + "doctors",);
};
const getDoctorDepartment = async (id ) => {
  return await axios.get(API_URL + "doctors/"+ id,);
};
const getDoctorById = async (doctor_id) => {
  return await axios.get(API_URL + "doctors/" + doctor_id);
};

const deleteDoctorById = async (doctor_id) => {
  return await axios.delete(API_URL + "doctors/" + doctor_id);
};
const updateStatusDoctor = async (
  doctor_id,
  prefix_name,
  doctor_first_name,
  doctor_last_name,
  doctor_image,
  doctor_status,
  department_id,
  department_name
) => {
  return await axios.put(API_URL + "doctors/" + doctor_id, {
    prefix_name,
    doctor_first_name,
    doctor_last_name,
    doctor_image,
    doctor_status,
    department_id,
    department_name,
  });
};
const createDoctor = async ( doctor_id,prefix_name, doctor_first_name, doctor_last_name, doctor_image,doctor_status,department_id, department_name
  ) => {
    return await axios.post(API_URL + "doctors", {
      doctor_id,
      prefix_name,
      doctor_first_name,
      doctor_last_name,
      doctor_image,
      doctor_status,
      department_id,
      department_name,
      
    });
  };

  const updateDoctorById = async (
    doctor_id,
    prefix_name,
    doctor_first_name,
    doctor_last_name,
    doctor_image,
    doctor_status,
    department_id,
    department_name
  ) => {
    return await axios.put(API_URL + "doctors/" + doctor_id, {
      prefix_name,
      doctor_first_name,
      doctor_last_name,
      doctor_image, 
      doctor_status,
      department_id,
      department_name,
    });
 
  
};
const getDoctordepart = async (department_id) => {
  return await axios.get(API_URL + "/doctors/depart/" + department_id);
};
export { getDoctor,getDoctorDepartment, getDoctorById, deleteDoctorById, updateStatusDoctor , createDoctor,updateDoctorById,getDoctordepart}; // Export getDoctor as a named export

const DoctorService = {
  getDoctor,
  getDoctorById,
  deleteDoctorById, 
  updateStatusDoctor
  ,createDoctor,
  updateDoctorById,
  getDoctorDepartment,
  getDoctordepart
};

export default DoctorService;
