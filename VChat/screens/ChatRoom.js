import React, { useEffect, useRef, useState,useContext,useReducer } from 'react'
import { Button,Toast,Drawer } from '@ant-design/react-native'
import { Text,TextInput ,View,StyleSheet,FlatList} from 'react-native'
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

    const [streams,setStreams] = useState([]);
    const addStreamCallback = (_streams)=>{setStreams(_streams)};
    
    let message = props.navigation.getState().routes[1].params;
    const host = message.host;
    const roomid = message.roomid;

    useEffect(() => {
        // getFriends(data => {
        //   setFriends(data);
        // });
    
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
          if (roomid === null) {
            createRoomMulti(roomId, userid);
          }
          console.log(roomId);
          setRoomID(roomId);
        });
    
        socket.on('message', (data) => {
          setMessageUpdate(data);
        })
    
        RoomManager.getLocalPreviewAndInitRoomConnection(host, username, userid, roomid, socket);
      }, [])

      return (
        <View style={{flex:1,
            flexDirection: 'column', 
            justifyContent: 'center',}}>
             <RTCView
                streamURL={stream.toURL()}
                style={{flex:1}} />
        {
            
            streams.map(
                (item,index)=>{
                    return (
                        <RTCView
                        streamURL={item.toURL()}
                        style={{flex:1}} />
                    )
                }
            )
        }
        </View>
      )

}