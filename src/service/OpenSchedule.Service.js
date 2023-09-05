import { InstanceFormBody /*, InstanceFormData*/ } from '../helper/Axios';

// ดึงข้อมูลแบบแบ่งหน้า
export async function getOpenSchedule(pageSize, currentPage, search, treatment, startDate, endDate) {
  try {
    const response = await InstanceFormBody.get(`openSchedule/getOpenSchedule?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}&treatment=${treatment}&startDate=${startDate}&endDate=${endDate}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลแบบแบ่งหน้า
export async function getOpenSchedulePublic(pageSize, currentPage, search, treatment, startDate, endDate) {
  try {
    const response = await InstanceFormBody.get(`openSchedule/getOpenSchedulePublic?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}&treatment=${treatment}&startDate=${startDate}&endDate=${endDate}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ดึงข้อมูลตาม id
export async function getDetailOpenSchedule(id) {
  try {
    const response = await InstanceFormBody.get(`openSchedule/getDetailOpenSchedule/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// เพิ่มข้อมูลการเปิดจองคิว
export async function createOpenSchedule(data) {
  try {
    const response = await InstanceFormBody.post(`openSchedule/createOpenSchedule`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// แก้ไขข้อมูลการเปิดจองคิว
export async function updateOpenSchedule(id, data) {
  try {
    const response = await InstanceFormBody.put(`openSchedule/updateOpenSchedule/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// อัพเดทสถานะการใช้งาน
export async function updateStatusOpenSchedule(id, data) {
  try {
    const response = await InstanceFormBody.put(`openSchedule/updateStatusOpenSchedule/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

// ลบข้อมูล
export async function deleteOpenSchedule(id) {
  try {
    const response = await InstanceFormBody.delete(`openSchedule/deleteOpenSchedule/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}
