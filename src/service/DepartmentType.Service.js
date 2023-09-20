import axios from "axios";

const API_URL = "https://tan-hippopotamus-hem.cyclic.app/apis/";

const getDepartment = async () => {
  return await axios.get(API_URL + "departments",);
};

const getDepartmentById = async (department_id) => {
  return await axios.get(API_URL + "departments/" + department_id);
};

const updateDepartmentById = async (
  department_id,
  department_name,
  department_image,
  open_time,
  close_time,
  max_queue_number,
  floor,
  building,
  department_phone,
) => {
  return await axios.put(API_URL + "departments/" +  department_id, {
    department_name,
    department_image,
    open_time,
    close_time,
    max_queue_number,
    floor,
    building,
    department_phone,
  });
};
const deleteDepartmentById = async (department_id) => {
  return await axios.delete(API_URL + "departments/" + department_id);
};
const createDepartment = async (  department_id,
  department_name,
  department_image,
  open_time,
  close_time,
  max_queue_number,
  floor,
  building,
  department_phone,
  ) => {
    return await axios.post(API_URL + "departments", {
      department_id,
  department_name,
  department_image,
  open_time,
  close_time,
  max_queue_number,
  floor,
  building,
  department_phone,
      
    });
  };

  const getDepartmentbydepart = async (department_id) => {
    return await axios.get(API_URL + "departments/" + department_id);
  };
export {
  getDepartment,
  getDepartmentById,
  deleteDepartmentById,
  updateDepartmentById,
  createDepartment,
  getDepartmentbydepart
};

const DepartmentService = {
  getDepartment,
  getDepartmentById,
  deleteDepartmentById,
  updateDepartmentById,
  createDepartment,
  getDepartmentbydepart
};

export default DepartmentService;
