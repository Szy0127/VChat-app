import React, { useState,useContext,useEffect } from "react";
import { View,Text,ImageBackground } from "react-native";
import { Button } from "@ant-design/react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { AuthContext } from "../context";
import { logout } from "../services/userService";
import SafeAreaView from "react-native-safe-area-view";
import { Avatar } from "../components/Avatar";
import backgroundImg from "../asserts/background-vertical.png";
export const ProfileScreen =(props)=>{

    const {signOut} = useContext(AuthContext);
    const [username,setUsername] = useState("");
    const [userID,setUserID] = useState(0);
    AsyncStorage.getItem("username").then(data=>setUsername(data));
    AsyncStorage.getItem("userID").then(data=>setUserID(data));


    console.log(userID);
    return (
        <ImageBackground source={backgroundImg} style={{        flex:1,
            width:'100%',
            height:'100%',
            position:'absolute'}}>
        <SafeAreaView style={{flex:1,flexDirection:'column',marginHorizontal:20}}>
        <View style={{alignItems:"center",flexDirection: 'row',flex:2}}>
            <Avatar userID={userID} size={50}/>

            <Text style={{flex:3,fontSize:40}}>{username}</Text>
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