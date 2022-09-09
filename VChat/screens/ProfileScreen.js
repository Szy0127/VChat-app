import React, { useState,useContext,useEffect,  } from "react";
import { View,Text,ImageBackground,  } from "react-native";
import { Button,Drawer, Modal} from "@ant-design/react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { AuthContext } from "../context";
import { logout } from "../services/userService";
import SafeAreaView from "react-native-safe-area-view";
import { Avatar } from "../components/Avatar";
import backgroundImg from "../asserts/background-vertical.png";
import { modifyUserEmail } from "../services/userService";
export const ProfileScreen =(props)=>{

    const {signOut} = useContext(AuthContext);
    const [username,setUsername] = useState("");
    const [userID,setUserID] = useState(0);
    const [email,setEmail] = useState('');

    AsyncStorage.getItem("username").then(data=>setUsername(data));
    AsyncStorage.getItem("userID").then(data=>setUserID(data));
    AsyncStorage.getItem("email").then(data=>setEmail(data));

    // console.log(userID);
    return (
        <ImageBackground source={backgroundImg} style={{        flex:1,
            width:'100%',
            height:'100%',
            position:'absolute'}}>
        <SafeAreaView style={{flex:1,flexDirection:'column',marginHorizontal:20}}>
            <View style={{alignItems:"center",flexDirection: 'row',flex:2}}>
                <Avatar userID={userID} size={50}/>

                <Text style={{flex:3,fontSize:45,marginLeft:20,fontWeight:"bold"}}>{username}</Text>
            </View>
            <View style={{alignItems:"center",flexDirection: 'row',flex:2}}>

                <Text style={{flex:3,fontSize:20,marginLeft:10,backgroundColor:"#ffffff",height:70,textAlign:"center",textAlignVertical:"center"}}>{email}</Text>
                <Button type="primary" 
                    style={{flex:1,fontSize:40,marginLeft:20}}
                onPress={
                    () => {
                        Modal.prompt("修改邮箱","输入新邮箱",async(e)=>{
                            let res = await modifyUserEmail(userID, e);
                            if(res){
                                setEmail(e);
                                AsyncStorage.setItem("email",e);
                            }
                        });
                        
                    }
                }>修改</Button>
            </View>
            <View style={{flex:1}}>
                <Button type="primary" onPress={
                    () => {
                        AsyncStorage.removeItem("@VChat:token");
                        signOut();
                        logout();
                    }
                }>退出登录</Button>
            </View>
            </SafeAreaView>
        </ImageBackground>
    )
}