import React from "react";
import { Image,View,Text } from "react-native";
import logo from "../asserts/logo.png";
import { app_name } from "../configs/constantConfig";
export const Header = (props)=>{

    const size = 65;

    return <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginVertical:5}}>
        <Image source={logo} style={{width:size,height:size,borderRadius:size/2}}/>
        <Text style={{fontSize:30,color:"#0000ff",paddingRight:10}}>{app_name}</Text>
        <Text  style={{fontSize:30,color:"#0000ff"}}>{props.content}</Text>
    </View>
}