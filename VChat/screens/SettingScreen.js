import React from "react";
import { View,Text,ImageBackground } from "react-native";
import backgroundImg from "../asserts/background-vertical.png";
import { server_url } from "../configs/constantConfig";
export const SettingScreen =()=>{
    return (
        <ImageBackground source={backgroundImg} style={{        flex:1,
            width:'100%',
            height:'100%',
            position:'absolute',
            flexDirection:"column",
            alignItems:"center",
            // justifyContent:"space-around"
            }}>
            <Text style={{fontSize:25,marginTop:150,color:"#000000"}}>完整功能请使用电脑浏览器登录网站</Text>
            <Text style={{fontSize:25,color:"#0000ff"}}>{server_url}</Text>
        </ImageBackground>
    )
}