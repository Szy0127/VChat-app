import React, { useState,useContext,useEffect, useRef } from "react";
import { View,Text,ImageBackground, FlatList } from "react-native";
import { Button,Drawer} from "@ant-design/react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { AuthContext } from "../context";
import { logout } from "../services/userService";
import SafeAreaView from "react-native-safe-area-view";
import { Avatar } from "../components/Avatar";
import backgroundImg from "../asserts/background-vertical.png";
import { MessageArea } from "../components/MessageArea";
export const ProfileScreen =(props)=>{

    const {signOut} = useContext(AuthContext);
    const [username,setUsername] = useState("");
    const [userID,setUserID] = useState(0);

    const drawerRef = useRef(null);
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

                <Text style={{flex:3,fontSize:40,marginLeft:20}}>{username}</Text>
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
            <Drawer
                sidebar={
                    <MessageArea close={drawerRef.current ? drawerRef.current.closeDrawer:()=>[]}/>

                }
                 position="right"
                open={false}
                drawerRef={el => (drawerRef.current=el)}
                // onOpenChange={this.onOpenChange}
                drawerBackgroundColor="#ccc"
            >
                <View style={{ flex: 1, marginTop: 114, padding: 8 }}>
                <Button type="primary" onPress={() => drawerRef.current && drawerRef.current.openDrawer()}>
                    文字聊天
                </Button>
                </View>
            </Drawer>
            </SafeAreaView>
        </ImageBackground>
    )
}