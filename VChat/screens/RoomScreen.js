import { Button,Modal, Toast } from "@ant-design/react-native";
import AsyncStorage from "@react-native-community/async-storage";
import React,{useState} from "react";
import { View,ImageBackground } from "react-native"
import backgroundImg from "../asserts/background-vertical.png";
import { addAttendance } from "../services/historyService";
import { verifyRoomid } from "../services/chatService";
export const RoomScreen = (props)=>{


    const [userid,setUserid] = useState(0);
    AsyncStorage.getItem("userID").then(data=>setUserid(data));
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
            <Button type="primary" onPress={
                ()=>{
                    Modal.prompt("进入房间","请输入房间号",async(roomid)=>{
                        if (roomid === null || roomid == '') {
                            Toast.fail("请输入房间号",1);
                            return;
                        }
                        const msg = await verifyRoomid(roomid);
                        if (!msg.success) {
                            Toast.fail("房间号不存在，请重新输入!",1);
                            return;
                        }
                        addAttendance(roomid, 1, userid, 0, -1);
                            
                        props.navigation.navigate("chatroom",{ roomid,host: false});
                    })
                }
                }>加入房间</Button>
        </ImageBackground>
    )
}