import { InstanceFormBody /*, InstanceFormData*/ } from '../helper/Axios';

export async function authen(data) {
  try {
    const response = await InstanceFormBody.post(`apis/login`, data);
    return await response.data;
  } catch (error) {
    console.log('error', error);
  }
}
