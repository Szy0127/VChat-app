import {postRequest_v2} from "../utils/ajax";
import {apiUrl} from "../configs/urlConfig";

export const sendMessage = (message, callback) => {
    console.log(message)
    postRequest_v2(apiUrl + "/sendMessage", message, callback);
}

export const getMessage = (room_id, callback) => {
    postRequest_v2(apiUrl + "/getMessage", {room_id: room_id}, callback);
}
