import {postRequest_formData,postRequest_formData_async} from "../utils/ajax";
import {apiUrl} from "../configs/urlConfig";

export const sendMessage = async (message) => {
    return await postRequest_formData_async(apiUrl + "/sendMessage", message);

}

export const getMessage = (room_id, receiver_id, callback) => {
    postRequest_formData(apiUrl + "/getMessage", {room_id: room_id, receiver_id: receiver_id}, callback);
}
