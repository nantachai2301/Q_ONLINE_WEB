import axios from "axios";

const API_URL = "https://muddy-khakis-boa.cyclic.app/apis/";

const getDepartment = async () => {
  return await axios.get(API_URL + "departments",);
};

const getDepartmentById = async (department_id) => {
  return await axios.get(API_URL + "departments/" + department_id);
};

const  updateDepartmentById = async (department_id, formData) => {
  return await axios.put(API_URL + "departments/" + department_id, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // ต้องตั้งค่า Content-Type เป็น "multipart/form-data" เมื่อใช้ FormData
    },
  });
};

const deleteDepartmentById = async (department_id) => {
  return await axios.delete(API_URL + "departments/" + department_id);
};

const createDepartment = async (formData) => {
  return await axios.post(API_URL + "departments", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // ต้องตั้งค่า Content-Type เป็น "multipart/form-data" เมื่อใช้ FormData
    },
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
