import { InstanceFormBody /*, InstanceFormData*/ } from '../helper/Axios';


// ดึงข้อมูลแบบแบ่งหน้า
export async function getQuestionaire(pageSize, currentPage, search, treatment, status) {
    try {
      const response = await InstanceFormBody.get(`questionaire/getQuestionaire?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}&treatment=${treatment}&status=${status}`);
      return await response.data;
    } catch (error) {
      console.log('error', error);
    }
  }

// ดึงข้อมูลตาม id
export async function getDetailQuestionaire(id) {
    try {
      const response = await InstanceFormBody.get(`questionaire/getDetailQuestionaire/${id}`);
      return await response.data;
    } catch (error) {
      console.log('error', error);
    }
  }