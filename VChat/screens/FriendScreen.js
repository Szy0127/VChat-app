import FriendList from "../components/friendList"
import React from "react"
import { View } from "react-native"
export const FriendScreen = (props)=>{
    return (
        <View>
            <FriendList navigation={props.navigation}/>
        </View>
    )
}