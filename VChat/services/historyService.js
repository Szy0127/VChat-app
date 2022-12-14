import {apiUrl} from "../configs/urlConfig";
import { postRequest_formData } from "../utils/ajax";

export const createRoomTwo = (room_id, caller_id, callee_id) => {
    postRequest_formData(apiUrl + "/createRoomTwo", {
        room_id: room_id,
        caller_id: caller_id,
        callee_id: callee_id
    }, () => {});
}

export const createRoomMulti = (room_id, sponsor_id) => {
    postRequest_formData(apiUrl + "/createRoomMulti", {
        room_id: room_id,
        sponsor_id: sponsor_id
    }, () => {});
    addAttendance(room_id, 1, sponsor_id, -1, -1);
}

export const addAttendance = (room_id, mode, user_id, invitor_id, accepted) => {
    console.log("addAttendance",room_id,mode,user_id,invitor_id,accepted);
    postRequest_formData(apiUrl + "/addAttendance", {
        room_id: room_id,
        mode: mode,
        user_id: user_id,
        invitor_id: invitor_id,
        accepted: accepted
    }, () => {})
}

export const getAttendance = (user_id, callback) => {
    console.log("getattendance",user_id);
    postRequest_formData(apiUrl + "/getAttendance", {user_id: user_id}, callback);
}

export const getHistoryTwo = (room_id, callback) => {
    postRequest_formData(apiUrl + "/getHistoryTwo", {room_id: room_id}, callback);
}

export const getHistoryMulti = (room_id, callback) => {
    postRequest_formData(apiUrl + "/getHistoryMulti", {room_id: room_id}, callback);
}
