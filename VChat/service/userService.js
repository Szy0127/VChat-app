
import { apiUrl } from "../urlconfig";
import { Alert } from "react-native";
import { postRequest,postRequest_v2 } from "./utils";
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

const login = (username,password,callback)=>{
    postRequest_v2(apiUrl+"/login",{username:username,password:password},callback);
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

export {checkSession,login,getFriends};