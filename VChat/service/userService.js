
import { apiUrl } from "../urlconfig";
import { Alert } from "react-native";
const postRequest = (url,opts,callback)=>{
    fetch(url,opts)
        .then((response) =>{return response.json();})
        .then((responseData) => {
            callback(responseData);
        })
        .catch((error)=>{
            console.error(error);
            Alert.alert(error);
        });
};

const checkSession = (callback) =>{
    const opts = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({}),
    };
    postRequest(apiUrl+"/checkSession",opts,callback);
}

const login = (username,password,callback)=>{
    const opts = {
        method:'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "username":username,
            "password":password,
        }),
    };
    postRequest(apiUrl+"/login",opts,callback);
}

export {checkSession,login};