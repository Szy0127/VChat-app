import React, { useEffect, useRef, useState,useContext,useReducer } from 'react'
import { Button,Toast } from '@ant-design/react-native'
import { Text,TextInput ,View,StyleSheet,FlatList} from 'react-native'
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
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
/*


_pc 是 _wrtc.RTCPeerConnection 然而对于react-native  并没有实现addTrack 加了的PR还没有接受 
https://github.com/react-native-webrtc/react-native-webrtc/issues/1159
所以react-native不能用simple-peer

*/
//console.log(new RTCPeerConnection().addStream);

const State = {
  asking: false,
  asked: false,
  on: false,
}

const Dispatch = (prevState, type) => {
  switch (type) {
      case 'asking':
          return {
              ...prevState,
              asking: true,
          };
      case 'asked':
          return {
              ...prevState,
              asked: true,
          };
      case 'accepted':
          return {
              ...prevState,
              on: true
          };
      case 'reset':
          return {
              ...State
          }
  }
}






function ChatScreen(props) {


  const {socket,stream} = useContext(SocketContext);

  const [otherStream, setOtherStream] = useState(null);
  const [opposite,setOpposite] = useState('');
  const myVideo = useRef();
  const [me, setMe] = useState('');
  const [idtoCall, setidtoCall] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);

  const [caller, setCaller] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const userVideo = useRef();
  const connectionRef = useRef();

  const [friendName,setFriendName] = useState('');

  const [inConversation,setInConversation] = useState(false);

  const [friends,setFriends] = useState([]);

  const [quit,setQuit] = useState(false);

  const { signOut } = useContext(AuthContext);

  const [songName, setSongName] = useState('');
  const [songUrl, setSongUrl] = useState('');

  const [gobangState, gobangDispatcher] = useReducer(
      Dispatch,
      State
  );
  const [songState, songDispatcher] = useReducer(
      Dispatch,
      State
  );

  const timeout = useRef();





  //呼叫
  const callusr = async (idtoCall,roomid,userid) => {
    const addr = await getIPRegion();
    console.log('ip addr:', addr);
    setInConversation(true);
    console.log(idtoCall);
    //对等连接
    const peer = new Peer(
      {initiator: true,
        trickle: false, 
        config:configure,
       wrtc: { 
        RTCPeerConnection,
        RTCIceCandidate,
        RTCSessionDescription,
        RTCView,
        MediaStream,
        MediaStreamTrack,
        mediaDevices,
        registerGlobals
        },
      });
      //react-native-webrtc的RTCPeerConnection 没有实现addTrack
      //Peer.addStream 也需要调用addTrack
      //只能用RTCPeerConnection实现的addTream
      //_pc = _wrtc.RTCPeerConnection()
    peer._pc.addStream(stream);
    // 向对等连接传送数据
    let username;
    try {
        username = await AsyncStorage.getItem('username');
    } catch (e) {
        console.log(e);
    }
    console.log("username:",username);

    peer.on('signal', (data) => {
      socket.emit('callUsr', {
          usrtoCall: idtoCall,
          signalData: data,
          from: {
              socketID: socket.id,
              username,
              addr,
              userID:userid
          }
      })
  })
    //接受返回的answer
    //似乎react-native 不支持 peer.on('stream')

    peer._pc.addEventListener('addstream',event=>{
      setOtherStream(event.stream);
    })
    //接受answer
    socket.on('callAccepted', (signal) => {
      console.log("")
      if(quit){
        return;
      }
      console.log('in callAccepted', idtoCall);
      setCallAccepted(true);
      peer.signal(signal);
      socket.emit("callAccepted3", idtoCall);
      clearTimeout(timeout.current);
      addAttendance(roomid, 0, userid, -1, 1);
  })
    //存储peer
    connectionRef.current = peer;
  }

  //接听视频流
  const answerCall = (callerInfo,callerSignal) => {
    console.log("answerCall");
    socket.on('callAccepted3', () => {

      setCallAccepted(true);
      setInConversation(true);
      console.log("call accepted");
      clearTimeout(timeout.current);
    })
  console.log(1);
    const peer = new Peer(
      {initiator: false,
        trickle: false, 
        config:configure,
       wrtc: { 
        RTCPeerConnection,
        RTCIceCandidate,
        RTCSessionDescription,
        RTCView,
        MediaStream,
        MediaStreamTrack,
        mediaDevices,
        registerGlobals
        },
      });
      console.log(2);
      peer._pc.addStream(stream);
      console.log(3);

    peer.on('signal', (data) => {
      socket.emit('answerCall', {
          signalData: data,
          to: callerInfo.socketID,
      })
  });

    console.log(4);

    peer._pc.addEventListener('addstream',event=>{
      setOtherStream(event.stream);
    })
    console.log(peer);
    peer.signal(callerSignal);
    console.log(6);
    connectionRef.current = peer;
    console.log("answer call finish");
  }
  const endcall = () => {
    setCallEnded(true);
    connectionRef.current.destory();
  }


  // //RTCView外面如果还有View则不能正常显示
  // const call_onPress = (callID)=>{
  //     // console.log(callID);
  //     getSocketIDByUserID(callID,
  //       (data)=>{
  //         if(data.length>0){
  //             callusr(data);
  //         }else{
  //           alert("好友不在线");
  //         }
  //       }
  //       )
  // }


  useEffect(() => {
    // getFriends((data)=>setFriends(data));

      let message = props.navigation.getState().routes[1].params;
      const userid = message.userid;
      const roomid = message.roomid;
      console.log("userid,roomid:",userid,roomid);
      const startPeer = async ()=>{
        // console.log("type:",props.navigation.getParam('type',''));
        
        if (message.type === 'caller') {
                  setOpposite(message.calleeSocketID);
                  await callusr(message.calleeSocketID,roomid,userid);
                  console.log("callusr finish");
              } else {
                  setOpposite(message.callerInfo.socketID);
                  answerCall(message.callerInfo, message.callerSignal);
              }

      }
      timeout.current = setTimeout(()=>{
        setQuit(true);
        addAttendance(roomid, 0, userid, -1, 0);
        console.log("对方未接听或网络不畅");
        Toast.fail("对方未接听或网络不畅",3);
        props.navigation.navigate('Tab');
  },wait_for);
      startPeer();

  socket.on('launchGobang', (data) => {
      // setAskGobang(true);
      gobangDispatcher("asked");
  });
  socket.on('acceptGobang', (data) => {
      // setGobangOn(true);
      gobangDispatcher("accepted");
  })

  socket.on('launchSong', (data) => {
      setSongName(data.songName);
      setSongUrl(data.songUrl);
      songDispatcher("asked");
  });
  socket.on('launchSongError', () => {
      songDispatcher("reset");
      alert("查找歌曲失败");
  });

  socket.on('acceptSong', (data) => {
      // setGobangOn(true);
      if (data.songUrl === "") {
          alert("找不到此歌曲")
          return;
      }
      setSongUrl(data.songUrl);
      playMusic(data.songUrl);
      songDispatcher("accepted");
  })
}, []);

const launchGobang = () => {
  if (opposite.length == 0) {
      alert("请先发起通话");
      return;
  }
  socket.emit('launchGobang', { to: opposite });
  gobangDispatcher("asking");
}
const acceptGobang = () => {
  if (!gobangState.asked) {
      alert("未接受到请求");
  }
  socket.emit('acceptGobang', { to: opposite });
  // setGobangOn(true);
  gobangDispatcher("accepted");
}

const launchSong = () => {
  if (opposite.length == 0) {
      alert("请先发起通话");
      return;
  }
  if (songName.length == 0) {
      alert("请输入歌名");
      return;
  }
  socket.emit('launchSong', { to: opposite, from: socket.id, songName });
  songDispatcher("asking");
}
const acceptSong = () => {
  if (!songState.asked) {
      alert("未接受到请求");
      return;
  }
  if (songUrl === "") {
      alert("无音乐链接")
      return;
  }
  socket.emit('acceptSong', { to: opposite, songUrl: songUrl });

  playMusic(songUrl);
  songDispatcher("accepted");
}


  return (
    <SafeAreaView style={styles.body}>
      {/* {
        !inConversation &&
        (
          <View>
            <View>
            <TextTextInput 
            placeholder='好友用户名'
            onChangeText={text => setFriendName(text)}
            value={friendName}
            />
            <Button onPress={()=>{
                console.log(friendName);
                addFriend(friendName,(data)=>{
                    if(data){
                      Toast.success("添加成功",1);
                      getFriends((data)=>setFriends(data));
                    }else{
                      Toast.fail("不存在此用户",1);
                    }
                });
            }}>添加好友</Button>
          </View>
              <FlatList
                data={friends}
                renderItem={renderItem}
                styles={{flex:1}}
              />
        </View>
        )
      } */}

          {stream &&
              <RTCView
              streamURL={stream.toURL()}
              style={styles.stream} />
          }
          {callAccepted ?
            // <video
            //   style={{ width: "300px" }}
            //   playsInline
            //   autoPlay
            //   muted
            //   ref={userVideo} /> 
            otherStream && 
            <RTCView
            streamURL={otherStream.toURL()}
            style={styles.stream} />
              : null
          }
                              {!callAccepted ? <Text>连接中</Text> : null}
                        {callAccepted && !gobangState.asking && !gobangState.asked ? (
                            <>
                                <Button onPress={launchGobang}>五子棋</Button>
                            </>
                        ) : null}

                        {gobangState.asked && !gobangState.on ? (
                            <>
                                <Text>对方向你发送五子棋邀请</Text>
                                <Button onPress={acceptGobang}>接受</Button>
                            </>
                        ) : null}
                        {gobangState.asking && !gobangState.on ? (
                            <>
                                <Text>正在发送五子棋邀请</Text>
                                <Button onPress={launchGobang}>再次发送</Button>
                            </>
                        ) : null}

                        {
                            // gobangOn ? <GobangTest meID={me} opponentID={opposite}/> : null
                            gobangState.on ?
                                <Gobang meID={socket.id} opponentID={opposite} tag={gobangState.asked ? 1 : 2} /> : null
                        }

                        {callAccepted && !songState.asking && !songState.asked ? (
                            <>
                                <TextInput placeholder={"歌名"} onChangeText={(e) => {
                                    setSongName(e)
                                }} />
                                <Button onPress={launchSong}>一起听歌</Button>
                            </>
                        ) : null}

                        {songState.asked && !songState.on ? (
                            <>
                                <Text>{`对方邀请你听歌${songName}`}</Text>
                                <Button onPress={acceptSong}>接受</Button>
                            </>
                        ) : null}
                        {songState.asking && !songState.on ? (
                            <>
                                <Text>正在发送听歌邀请</Text>
                                <Button onPress={launchSong}>再次发送</Button>
                            </>
                        ) : null}
                        {songState.on ?
                            <Text>{`正在一起听歌${songName}`}</Text>
                            : null
                        }
        <View style={styles.footer}>
          <Button onPress={()=>{
        props.navigation.navigate('Tab');
      }}>结束通话</Button>
        </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill,
    flex:1,
    flexDirection: 'column', 
    justifyContent: 'center',
    // alignItems:'center'
  },
  stream: {
    flex: 5,
    height:100
  },
  row:{
    flex:1,
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginHorizontal:10,
    // alignItems:'center'
  },
    column:{
    flex:1,
    marginVertical:3,
  },
  text:{
		flex: 1, 
    fontSize:25,
    paddingHorizontal:2
		// justifyContent: 'center',
        // alignItems:'center'
	},
  footer: {
    backgroundColor: Colors.lighter,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
});
export default ChatScreen;