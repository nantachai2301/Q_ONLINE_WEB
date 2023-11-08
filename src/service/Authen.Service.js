import axios from "axios";

const API_URL = "https://muddy-khakis-boa.cyclic.app/apis/";
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
const Resetpassword = async (
  id_card,
  new_password
 
) => {
  return await axios.post(API_URL +"resetpassword", {
    id_card,
    new_password
  
  });
};

export { Sendlogin,forgotpassword,Resetpassword };

const Authen = {Sendlogin,forgotpassword,Resetpassword 
 
};

export default Authen;
