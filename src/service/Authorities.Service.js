import axios from "axios";

const API_URL = "https://spotless-ant-stockings.cyclic.app/apis/";

const getAuthorities = async () => {
  return await axios.get(API_URL + "authorities ",);
};
const updateAuthorities = async (
  users_id,
  id_card,
  password,
  prefix_name,
  first_name,
  last_name,
  gender,
  birthday,
  phoneNumber,
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
    phoneNumber,
    role_id,
  });
};
const createAuthorities = async (
  users_id,
  id_card,
  password,
  prefix_name,
  first_name,
  last_name,
  gender,
  birthday,
  phoneNumber,
  role_id
) => {
  return await axios.post(API_URL +"patient", {
    users_id,
    id_card,
    password,
    prefix_name,
    first_name,
    last_name,
    gender,
    birthday,
    phoneNumber,
    role_id,
  });
};
export { getAuthorities, updateAuthorities, createAuthorities };

const AuthoritiesService = {
  getAuthorities,
  updateAuthorities,
  createAuthorities,
};

export default AuthoritiesService;
