import axios from "axios";

const API_URL = "https://elated-lime-salmon.cyclic.app/apis/";

const getQueue = async () => {
  return await axios.get(API_URL + "queue");
};
const updateQueues = async ( users_id,
  queue_id,
  queue_date,
  create_at,
  symptom,
  queue_status_id,
  department_id,
 
  department_name,
  queue_status_name,
  prefix_name,
  first_name,
  last_name,
  formatted_birthday
) => {
  return await axios.put(API_URL + "queue/" + users_id + queue_date, {
    queue_id,
    queue_date,
    create_at,
    symptom,
    queue_status_id,
    department_id,
    users_id,
    department_name,
    queue_status_name,
    prefix_name,
    first_name,
    last_name,
    formatted_birthday,
  });
};
const deleteQueueById = async (users_id, queue_date) => {
  return await axios.delete(API_URL + "queue/" + users_id + "/" + queue_date);
};
const updateQueueById = async (
  users_id,
  queue_id,
  queue_date,
  create_at,
  symptom,
  queue_status_id,
  department_id,
  questionaire_id,
  department_name,
  queue_status_name,
  first_name,
  last_name,
  formatted_birthday
) => {
  return await axios.put(API_URL + "queue/" + users_id, {
    queue_id,
    queue_date,
    create_at,
    symptom,
    queue_status_id,
    department_id,
    questionaire_id,
    department_name,
    queue_status_name,
    first_name,
    last_name,
    formatted_birthday,
  });
};
const createQueue = async (
  users_id,
  first_name,
  last_name,
  department_id,
  queue_date,
  symptom,
  queue_status_id
) => {
  return await axios.post(API_URL + "queue", {
    users_id,
    first_name,
    last_name,
    department_id,
    queue_date,
    symptom,
    queue_status_id, // ตรวจสอบว่าค่า queue_status_id ถูกส่งไปยัง API ในฟังก์ชันนี้
  });
};


export { getQueue,  updateQueues, deleteQueueById, updateQueueById,createQueue };

const DoctorService = {
  getQueue,
  updateQueues,
  deleteQueueById,
  updateQueueById,
  createQueue
};

export default DoctorService;