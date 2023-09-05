import { InstanceFormBody /*, InstanceFormData*/ } from '../helper/Axios';

// ดึงข้อมูลแบบแบ่งหน้า
export async function getUsers(pageSize, currentPage, search, status) {
  try {
    const response = await InstanceFormBody.get(`user/getUsers?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}&status=${status}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลตาม id
export async function getDetailUser(id) {
  try {
    const response = await InstanceFormBody.get(`user/getDetailUser/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// // เพิ่มข้อมูล
// export async function createPatient(data) {
//   try {
//     const response = await InstanceFormBody.post(`user/createPatient`, data);
//     return await response.data;
//   } catch (error) {
//     console.log('error', error);
//   }
// }

// แก้ไขข้อมูล
export async function updateUser(id, data) {
  try {
    const response = await InstanceFormBody.put(`user/updateUser/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// อัพเดทสถานะข้อมูล
export async function updateStatusUser(id, data) {
  try {
    const response = await InstanceFormBody.put(`user/updateStatusUser/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ลบข้อมูล
export async function deleteUser(id) {
  try {
    const response = await InstanceFormBody.delete(`user/deleteUser/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}
