import {apiUrl} from "../configs/urlConfig";
import {postRequest, postRequest_v2, postRequest_v3} from '../utils/ajax';


export const sendVerification = (form, callback) => {
    postRequest_v2(apiUrl + "/sendVerification", form, callback);
}

export const modifyPassword = (form, callback) => {
    postRequest_v2(apiUrl + "/modifyPassword", form, callback);
}

export const checkSession =  (callback) => {
    postRequest(apiUrl + "/checkSession", {}, callback);
}

export const logout = () => {
    postRequest(apiUrl + "/logout", {}, () => {}, () => {});
}

export const login = (username,password,callback)=>{
    postRequest_v2(apiUrl+"/login",{username:username,password:password},callback);
}

// export const register = (form, callback) => {
//     postRequest_v2(apiUrl + "/register", form, callback);
// }

export const getFriends = (callback) => {
    postRequest(apiUrl + "/getFriends", {}, callback, () => {});
}

export const getSocketIDByUserID = (userID, callback) => {
    postRequest_v2(apiUrl + "/getSocketByUser", {userID:userID}, callback);
}

export const addFriend = (friendName, callback) => {
    postRequest_v2(apiUrl + "/addFriend",{friendName:friendName}, callback);
}

export const updateSocketID = (socketID) => {
    postRequest_v2(apiUrl + "/updateSocket", {socketID:socketID}, ()=>{});
}

let email_reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
export const register = (username,password,password_confirm,email,callback)=>{
    if(username==''){
        Toast.fail("请输入用户名",1);
        return;
    }
    if(password==''){
        Toast.fail("请输入密码",1);
        return;
    }
    if(password.length < 6){
        Toast.fail("密码长度至少6位",1);
        return;
    }
    // console.log(password,password_confirm,password==password_confirm);
    //一定要加括号
    if(!(password==password_confirm)){
        Toast.fail("两次密码不一致",1);
        return;
    }
    if(!email_reg.test(email)){
        Toast.fail("邮箱格式错误",1);
        return;
    }
    loading();
    postRequest_v2(apiUrl+"/register",{username:username,password:password,email:email},callback);
}