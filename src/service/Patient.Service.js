import axios from "axios";

const API_URL = "https://elated-lime-salmon.cyclic.app/apis/";

const getPatient= async () => {
  return await axios.get(API_URL + "patients" );
};
const getPatientById = async (users_id) => {
  return await axios.get(API_URL + "patients/" + users_id);
};
const updatePatientById = async (
  users_id,
  id_card,
  password,
  prefix_name,
  first_name,
  last_name,
  gender,
  birthday,
  weight,
  height,
  phoneNumber,
  congenital_disease,
  drugallergy,
  contact_first_name,
  contact_last_name,
  contact_relation_id,
  contact_phoneNumber,
  address,
  subdistrict,
  district,
  province,
  postcode,
  subdistrictsId,
  img,
  role_id
) => {
  return await axios.put(API_URL + "patients/" + users_id, {
    id_card,
    password,
    prefix_name,
    first_name,
    last_name,
    gender,
    birthday,
    weight,
    height,
    phoneNumber,
    congenital_disease,
    drugallergy,
    contact_first_name,
    contact_last_name,
    contact_relation_id,
    contact_phoneNumber,
    address,
    subdistrict,
    district,
    province,
    postcode,
    subdistrictsId,
    img,
    role_id,
  });
};
const deletePatientById = async (users_id) => {
  return await axios.delete(API_URL + "patients/" + users_id);
};
const createPatient = async (
  users_id,
  id_card,
  password,
  prefix_name,
  first_name,
  last_name,
  gender,
  birthday,
  weight,
  height,
  phoneNumber,
  congenital_disease,
  drugallergy,
  contact_first_name,
  contact_last_name,
  contact_relation_id,
  contact_phoneNumber,
  address,
  subdistrict,
  district,
  province,
  postcode,
  subdistrictsId,
  img,
  role_id
) => {
  return await axios.post(API_URL + "patient", {
    users_id,
    id_card,
    password,
    prefix_name,
    first_name,
    last_name,
    gender,
    birthday,
    weight,
    height,
    phoneNumber,
    congenital_disease,
    drugallergy,
    contact_first_name,
    contact_last_name,
    contact_relation_id,
    contact_phoneNumber,
    address,
    subdistrict,
    district,
    province,
    postcode,
    subdistrictsId,
    img,
    role_id
  });
};
export { getPatient, getPatientById,updatePatientById,deletePatientById ,createPatient};

const PatientService = {
  getPatient,
  getPatientById,
  deletePatientById,
  updatePatientById,
  createPatient
};

export default PatientService;
