import { Button } from "@ant-design/react-native";
import React from "react";
import { View,ImageBackground } from "react-native"
import backgroundImg from "../asserts/background-vertical.png";

export const RoomScreen = (props)=>{


    return (
        <ImageBackground source={backgroundImg} style={{        flex:1,
            width:'100%',
            height:'100%',
            position:'absolute',
            flexDirection:"column",
            alignItems:"center",
            justifyContent:"space-around"
            }}>

            <Button type="primary" onPress={()=>props.navigation.navigate("chatroom",{roomid:null,host:true})}>创建房间</Button>
            <Button type="primary" onPress={()=>props.navigation.navigate("chatroom")}>加入房间</Button>
        </ImageBackground>
    )
}