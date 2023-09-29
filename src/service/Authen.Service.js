import axios from "axios";

const API_URL = "https://teal-mushy-dalmatian.cyclic.cloud/apis/";
const Sendlogin = async (
  id_card,
  password,
) => {
  return await axios.post(API_URL +"login", {
    id_card,
    password,
  });
};
const forgotpassword = async (
  id_card,
 
) => {
  return await axios.post(API_URL +"forgotpassword", {
    id_card,
  
  });
};

export { Sendlogin,forgotpassword};

const Authen = {Sendlogin,forgotpassword
 
};

export default Authen;
