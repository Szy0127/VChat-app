import React, { useEffect, useRef, useState,useContext,useReducer } from 'react'
import { Button,Toast,Drawer } from '@ant-design/react-native'
import { Text,TextInput ,View,StyleSheet,FlatList,TouchableOpacity,Clipboard} from 'react-native'
import {

  RTCView,

} from 'react-native-webrtc';
import Peer from 'simple-peer';
import {withNavigation} from 'react-navigation';
import { nodeServerUrl } from './urlconfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getIPRegion } from '../services/ipService';
import { getFriends, getSocketIDByUserID, updateSocketID,logout,addFriend } from '../services/userService';
import { wait_for } from '../configs/constantConfig';
import { AuthContext,SocketContext } from '../context';
import AsyncStorage from '@react-native-community/async-storage';
import { configure } from '../configs/iceServerConfig';
import { addAttendance } from '../services/historyService';
import { MessageArea } from '../components/MessageArea';
import * as ws from '../services/websocket'
import * as RoomManager from '../services/RoomManager'
import { createRoomMulti } from '../services/historyService';
import { sendMessage } from '../services/chatService';
import copy from "copy-to-clipboard";
export const ChatRoom = (props)=>{
    const {socket,stream} = useContext(SocketContext);

    // console.log(stream);

    const [userid,setUserid] = useState(0);
    const [username ,setUsername] = useState('');
    AsyncStorage.getItem("userID").then(id=>setUserid(id));
    AsyncStorage.getItem("username").then(n=>setUsername(n));
    const [messageUpdate, setMessageUpdate] = useState('');
    const [roomID, setRoomID] = useState(null);
    const [roomMember, setRoomMember] = useState([]);
    const [roomSize, setRoomSize] = useState(1);
    const [friends, setFriends] = useState([]);
    const [invite, setInvite] = useState(false);

    const [messageContent,setMessageContent] = useState('');

    const [fresh,setFresh] = useState(false);

    const [streams,setStreams] = useState([]);
    const [showRTCView,setShowRTCView] = useState(true);
    const addStreamCallback = (_streams)=>{setStreams(_streams)};


    const [host,setHost] = useState('');
    const [roomid,setRoomid] = useState('');


    const drawerRef = useRef(null);

    useEffect(() => {
        // getFriends(data => {
        //   setFriends(data);
        // });
        console.log("in chatRoom");
        let message = props.navigation.getState().routes[1].params;
        const _host = message.host;
        const _roomid = message.roomid;
        setHost(_host);
        setRoomid(_roomid);
        ws.connectWithSocketIOServer(socket,addStreamCallback,stream);
    
        socket.on('room member changed', (data) => {
          const { Usrs } = data;
          //存->显示
          setRoomMember(Usrs);
          setRoomSize(Usrs.length);
        });
    
        socket.on('roomID', (data) => {
          const { roomId } = data;
          //存
          if (_roomid === null) {
            createRoomMulti(roomId, userid);
          }
          console.log(roomId);
          setRoomID(roomId);
        });
    
        socket.on('message', (data) => {
          setMessageUpdate(data);
        })
    
        RoomManager.getLocalPreviewAndInitRoomConnection(_host, username, userid, _roomid, socket);
      }, [])

      const ri = roomid ? roomid : roomID;
      return (
        <View style={{flex:1,
            flexDirection: 'column', 
            justifyContent: 'center',}}>
                <Text>
                <TouchableOpacity  activeOpacity={0.8} onPress={()=>{ Clipboard.setString(ri);}}>
                    <Text>{`房间号${ri}`}</Text>
                </TouchableOpacity>
                </Text>
                {
                    showRTCView ? 
                    <RTCView
                    streamURL={stream.toURL()}
                    style={{flex:1}} />:null
                }

        {
            
            showRTCView? streams.map(
                (item,index)=>{
                    return (
                        <RTCView
                        streamURL={item.toURL()}
                        style={{flex:1}} />
                    )
                }
            ):null
        }
                  <Drawer
                sidebar={
                  <View style={{flex:1,backgroundColor:"#ffffff"}}>
                    <MessageArea userid={userid} roomid={roomid} fresh={fresh} />
                      <TextInput 
                      onChangeText={text => setMessageContent(text)}
                      value={messageContent}
                      backgroundColor={"#eeffff"}
                      />
                      <Button type="primary"onPress={async()=>{
                          console.log(messageContent);
                          const success = await sendMessage(userid, 0,roomid,messageContent );
                              if(success){
                                setFresh(!fresh);
                                socket.emit('message', {"Two": false, roomId:roomid});
                                // Toast.success("添加成功",1);
                                // getFriends((data)=>setFriends(data));
                              }else{
                                Toast.fail("发送失败",1);
                              }
                          ;
                      }}>发送</Button>
                    <Button  type="primary" onPress={drawerRef.current ? ()=>{
                      drawerRef.current.closeDrawer();
                      setShowRTCView(true);
                    }:()=>{setShowRTCView(true)}}>
                    关闭
                </Button></View>

                }
                position="right"
                drawerRef={el => (drawerRef.current=el)}
                // onOpenChange={this.onOpenChange}
                drawerBackgroundColor="#ccc"
            >
                <View >
                <Button type="primary" onPress={() => {
                    if(drawerRef.current){
                      drawerRef.current.openDrawer();
                      setShowRTCView(false);
                    }

                    }}>
                    文字聊天
                </Button>
                </View>
            </Drawer>
        <Button type="primary" onPress={()=>{props.navigation.navigate('Tab');}}>退出</Button>
        </View>
      )

}