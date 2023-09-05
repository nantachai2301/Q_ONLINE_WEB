import { InstanceFormBody, InstanceFormData } from '../helper/Axios';

// ดึงข้อมูลแบบแบ่งหน้า
export async function getDoctor(pageSize, currentPage, search, treatment, status) {
  try {
    const response = await InstanceFormBody.get(`doctor/getDoctor?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}&treatment=${treatment}&status=${status}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลตาม id
export async function getDetailDoctor(id) {
  try {
    const response = await InstanceFormBody.get(`doctor/getDetailDoctor/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลตาม id แผนก
export async function getDoctorBy(id) {
  try {
    const response = await InstanceFormBody.get(`doctor/getDoctorBy/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// เพิ่มข้อมูลแพทย์
export async function createDoctor(data) {
  try {
    const response = await InstanceFormData.post(`doctor/createDoctor`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// แก้ไขข้อมูลแพทย์
export async function updateDoctor(id, data) {
  try {
    const response = await InstanceFormData.put(`doctor/updateDoctor/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// อัพเดทสถานะการใช้งาน
export async function updateStatusDoctor(id, data) {
  try {
    const response = await InstanceFormBody.put(`doctor/updateStatusDoctor/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ลบข้อมูล
export async function deleteDoctor(id) {
  try {
    const response = await InstanceFormBody.delete(`doctor/deleteDoctor/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}
