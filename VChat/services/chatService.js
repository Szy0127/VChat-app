import {postRequest_formData,postRequest_formData_async} from "../utils/ajax";
import {apiUrl} from "../configs/urlConfig";

export const sendMessage = async (user_id,receiver_id,room_id,message) => {
    return await postRequest_formData_async(apiUrl + "/sendMessage", {user_id,receiver_id,room_id,message});

}

export const getMessage = (room_id, receiver_id, callback) => {
    postRequest_formData(apiUrl + "/getMessage", {room_id: room_id, receiver_id: receiver_id}, callback);
}
