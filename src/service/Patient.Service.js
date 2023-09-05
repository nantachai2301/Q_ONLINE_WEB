import { InstanceFormBody /*, InstanceFormData*/ } from '../helper/Axios';

export async function createPatient(data) {
  try {
    const response = await InstanceFormBody.post(`apis/patients`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

export async function getPatientByid(id) {
  try {
    const response = await InstanceFormBody.get(`apis/patients/${id}`);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}

export async function updateUser(id, data) {
  try {
    const response = await InstanceFormBody.put(`apis/patients/${id}`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}