import React, { useState,useContext } from "react";
import { View,Text } from "react-native";
import { Button } from "@ant-design/react-native";
import AsyncStorage from "@react-native-community/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../context";
import { logout } from "../services/userService";
import SafeAreaView from "react-native-safe-area-view";
export const ProfileScreen =(props)=>{

    const {signOut} = useContext(AuthContext);
    const [username,setUsername] = useState("");
    AsyncStorage.getItem("username").then(data=>setUsername(data));
    return (
        <SafeAreaView style={{flex:1,flexDirection:'column',marginHorizontal:20}}>
        <View style={{alignItems:"center",flexDirection: 'row',flex:2}}>
            <FontAwesome name="user-circle-o" size={30} style={{flex:1}} />
            <Text style={{flex:3,fontSize:40}}>{username}</Text>
            </View>
            <View style={{flex:1}}>
            <Button onPress={
                () => {
                    AsyncStorage.removeItem("@VChat:token");
                    signOut();
                    logout();
                }
            }>退出登录</Button>
        </View>
        </SafeAreaView>
    )
}