import axios from "axios";

const API_URL = "http://localhost:5000/apis/";

const getQueue = async ( ) => {
  return await axios.get(API_URL + "queue",);
};
const updateStatusQueue = async (
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
        formatted_birthday
    });
  };
  const deleteQueueById = async (users_id, queue_date) => {
    return await axios.delete(API_URL + "queue/" + users_id + "/" + queue_date);
  };
  const updateQueueById = async (
    queue_id,
    currentStatus,
    queue_date,
    create_at,
    symptom,
    queue_status_id,
    department_id,
    questionaire_id,
    users_id,
    department_name,

    first_name,
    last_name,
    formatted_birthday
  ) => {
    return await axios.put(API_URL + "queue/" + users_id, {
        queue_id,
    currentStatus,
    queue_date,
    create_at,
    symptom,
    queue_status_id,
    department_id,
    questionaire_id,
    users_id,
    department_name,

    first_name,
    last_name,
    formatted_birthday
    });
  };

export { getQueue,updateStatusQueue,deleteQueueById,updateQueueById }; // Export getDoctor as a named export

const DoctorService = {
    getQueue,
    updateStatusQueue,
    deleteQueueById,
    updateQueueById 
  
};

export default DoctorService;
