import {apiUrl} from "../configs/urlConfig";
import {postRequest_formData, postRequest_formData_async, postRequest_json} from '../utils/ajax';
import { loading } from "../utils/utils";
import { nonce } from "../configs/constantConfig";
import sha256 from "crypto-js/sha256";
import { Toast } from "@ant-design/react-native";
const enc = (password)=>{
    return sha256(password + nonce.toString()).toString();
}
export const sendVerification = (email, callback) => {
    postRequest_formData(apiUrl + "/sendVerification", {email}, callback);
}

export const modifyPassword = (email,password,password_confirm,verification, callback) => {
    if(!password_exam(password,password_confirm)){
        return;
    }
    postRequest_formData(apiUrl + "/modifyPassword", {email,password:enc(password),verification}, callback);
}

export const checkSession =  (callback) => {
    postRequest_json(apiUrl + "/checkSession", {}, callback);
}

export const logout = () => {
    postRequest_json(apiUrl + "/logout", {}, () => {}, () => {});
}

export const login = (username,password,callback)=>{
    postRequest_formData(apiUrl+"/login",{username,password:enc(password)},callback);
}

// export const register = (form, callback) => {
//     postRequest_formData(apiUrl + "/register", form, callback);
// }

export const getFriends = (callback) => {
    postRequest_json(apiUrl + "/getFriends", {}, callback, () => {});
}

export const getSocketIDByUserID = (userID, callback) => {
    postRequest_formData(apiUrl + "/getSocketByUser", {userID}, callback);
}

export const addFriend = (friendName, callback) => {
    postRequest_formData(apiUrl + "/addFriend",{friendName}, callback);
}

export const updateSocketID = (socketID) => {
    postRequest_formData(apiUrl + "/updateSocket", {socketID}, ()=>{});
}

let email_reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
const password_exam = (password,password_confirm) =>{
    if(password==''){
        Toast.fail("请输入密码",1);
        return false;
    }
    if(password.length < 6){
        Toast.fail("密码长度至少6位",1);
        return false;
    }
    // console.log(password,password_confirm,password==password_confirm);
    //一定要加括号
    if(!(password==password_confirm)){
        Toast.fail("两次密码不一致",1);
        return false;
    }
    return true;
}
export const register = (username,password,password_confirm,email,callback)=>{
    if(username==''){
        Toast.fail("请输入用户名",1);
        return;
    }
    if(!password_exam(password,password_confirm)){
        return;
    }
    if(!email_reg.test(email)){
        Toast.fail("邮箱格式错误",1);
        return;
    }
    loading();
    postRequest_formData(apiUrl+"/register",{username,password:enc(password),email},callback);
}

export const uploadAvatar = async (image, userid, callback) => {
    await postRequest_formData_async(apiUrl + "/modifyAvatar", {image, userid});
    callback();
}

export const getAvatar = (userid, callback) => {
    postRequest_formData(apiUrl + "/getAvatar", {userid}, callback);
}

export const modifyUserEmail = async (userid, email) => {
    if(!email_reg.test(email)){
        Toast.fail("邮箱格式错误",1);
        return false;
    }
    await postRequest_formData_async(apiUrl + "/modifyEmail", {userid, email});
    return true;
}

