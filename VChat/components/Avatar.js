import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getAvatar } from "../services/userService";
import React,{ useEffect,useState } from "react";
import { Image } from "react-native";
export const Avatar = (props)=>{

    const [url, setUrl] = useState('');
    const {userID,size} = props;

    useEffect(() => {
        if(userID > 0){
            getAvatar(userID, (data) => {
                setUrl(data.msg);
                console.log(data.msg);
            })
        }

    }, [userID]);



    return (
        
            url !== '' ? 
            <Image
            style={{
                width: size,
                height: size,
                borderRadius:size/2
              }}
            source={{
            uri: url,
            }}
            />:
            <FontAwesome name="user-circle-o" size={size} />
        
    )
}