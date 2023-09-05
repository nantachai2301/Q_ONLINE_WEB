import { InstanceFormBody, InstanceFormData } from '../helper/Axios';

// ดึงข้อมูลแบบแบ่งหน้า
export async function getAuthorities(pageSize, currentPage, search, treatment, status) {
  try {
    const response = await InstanceFormBody.get(`authorities/getAuthorities?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}&status=${status}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลตาม id
export async function getDetailAuthorities(id) {
  try {
    const response = await InstanceFormBody.get(`authorities/getDetailAuthorities/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลตาม id แผนก
export async function getAuthoritiesBy(id) {
  try {
    const response = await InstanceFormBody.get(`authorities/getAuthoritiesBy/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// เพิ่มข้อมูลเจ้าหน้าที่
export async function createAuthorities(data) {
  try {
    const response = await InstanceFormData.post(`authorities/createAuthorities`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// แก้ไขข้อมูลเจ้าหน้าที่
export async function updateAuthorities(id, data) {
  try {
    const response = await InstanceFormData.put(`authorities/updateAuthorities/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// อัพเดทสถานะการใช้งาน
export async function updateStatusAuthorities(id, data) {
  try {
    const response = await InstanceFormBody.put(`authorities/updateStatusAuthorities/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ลบข้อมูล
export async function deleteAuthorities(id) {
  try {
    const response = await InstanceFormBody.delete(`authorities/deleteAuthorities/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}
