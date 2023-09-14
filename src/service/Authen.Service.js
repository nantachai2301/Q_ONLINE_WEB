import axios from "axios";

const API_URL = "https://tan-hippopotamus-hem.cyclic.app/apis/";
const Sendlogin = async (
  id_card,
  password,
) => {
  return await axios.post(API_URL +"login", {
    id_card,
    password,
  });
};
export { Sendlogin};

const Authen = {Sendlogin
 
};

export default Authen;
