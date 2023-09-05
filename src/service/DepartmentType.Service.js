import { InstanceFormBody /*, InstanceFormData*/ } from '../helper/Axios';

// ดึงข้อมูลแบบแบ่งหน้า
export async function getDepartmentType(pageSize, currentPage, search, status) {
  try {
    const response = await InstanceFormBody.get(`department/getDepartment?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}&status=${status}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลตาม id
export async function getDetailDepartmentType(id) {
  try {
    const response = await InstanceFormBody.get(`treatment/getDetailDepartment${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลแผนกทั้งหมด
export async function getDepartmentTypeAll() {
  try {
    const response = await InstanceFormBody.get('department/getDepartmentAll');
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// เพิ่มข้อมูล
export async function createDepartmentType(data) {
  try {
    const response = await InstanceFormBody.post(`department/createDepartment`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// แก้ไขข้อมูล
export async function updateDepartmentType(id, data) {
  try {
    const response = await InstanceFormBody.put(`department/updateDepartment/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// อัพเดทสถานะข้อมูล
export async function updateStatusDepartmentType(id, data) {
  try {
    const response = await InstanceFormBody.put(`department/updateStatusDepartment/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ลบข้อมูล
export async function deleteDepartmentType(id) {
  try {
    const response = await InstanceFormBody.delete(`department/deleteDepartment/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}
