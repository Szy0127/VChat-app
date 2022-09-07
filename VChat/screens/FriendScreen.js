import FriendList from "../components/friendList"
import React from "react"
import { View,ImageBackground } from "react-native"
import backgroundImg from "../asserts/background-vertical.png";
export const FriendScreen = (props)=>{
    return (
        <ImageBackground source={backgroundImg} style={{        flex:1,
            width:'100%',
            height:'100%',
            position:'absolute'}}>

            <FriendList navigation={props.navigation}/>

        </ImageBackground>
    )
}