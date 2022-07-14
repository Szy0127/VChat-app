
import { apiUrl } from "../urlconfig";
import { Alert } from "react-native";
import { postRequest,postRequest_v2 } from "./utils";
import { Toast } from "@ant-design/react-native";
import { loading } from "../util/utils";
// const postRequest = (url,opts,callback)=>{
//     fetch(url,opts)
//         .then((response) =>{
//             console.log(response)
//             return response.json();})
//         .then((responseData) => {
//             console.log(responseData)
//             callback(responseData);
//         })
//         .catch((error)=>{
//             console.error(error);
//             Alert.alert(error);
//         });
// };

const checkSession = (callback) =>{
    postRequest(apiUrl+"/checkSession",{},callback);
}
const logout = ()=>{
    postRequest(apiUrl+"/logout",{},()=>{});
}
const login = (username,password,callback)=>{
    postRequest_v2(apiUrl+"/login",{username:username,password:password},callback);
}

let email_reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
const register = (username,password,password_confirm,email,callback)=>{
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

const getFriends = (callback)=>{
    // const opts = {
    //     method:'POST',
    //     credentials: 'include',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body:JSON.stringify({}),
    // };
    postRequest(apiUrl+"/getFriends",{},callback);
}

const getSocketIDByUserID = (userID,callback)=>{
    postRequest_v2(apiUrl+"/getSocketByUser",{userID:userID},callback);
}

const updateSocketID = (socketID)=>{
    postRequest_v2(apiUrl+"/updateSocket",{socketID:socketID},()=>{});
}

export {checkSession,login,getFriends,getSocketIDByUserID,updateSocketID,logout,register};