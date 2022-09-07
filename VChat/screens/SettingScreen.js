import React from "react";
import { View,Text,ImageBackground } from "react-native";
import backgroundImg from "../asserts/background-vertical.png";
export const SettingScreen =()=>{
    return (
        <ImageBackground source={backgroundImg} style={{        flex:1,
            width:'100%',
            height:'100%',
            position:'absolute'}}>
            <Text>setting</Text>
        </ImageBackground>
    )
}