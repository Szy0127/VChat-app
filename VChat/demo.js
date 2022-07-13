import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { Button } from '@ant-design/react-native'
import { Text,TextInput ,View,StyleSheet } from 'react-native'
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

import { nodeServerUrl } from './urlconfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { getFriends } from './service/userService';
/*


_pc 是 _wrtc.RTCPeerConnection 然而对于react-native  并没有实现addTrack 加了的PR还没有接受 
https://github.com/react-native-webrtc/react-native-webrtc/issues/1159
所以react-native不能用simple-peer

*/
//console.log(new RTCPeerConnection().addStream);

const socket = io.connect(nodeServerUrl);



const MyMediaStream = {
  video: true,
  audio: true
}
function Demo() {
  const [stream, setStream] = useState(null);
  const [otherStream, setOtherStream] = useState(null);
  const myVideo = useRef();
  const [me, setMe] = useState('');
  const [idtoCall, setidtoCall] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [caller, setCaller] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const userVideo = useRef();
  const connectionRef = useRef();

  const [friends,setFriends] = useState([]);


  const start_stream = async () => {
    console.log('start');
    if (!stream) {
      let s;
      try {
        s = await mediaDevices.getUserMedia(MyMediaStream);
        setStream(s);
      } catch(e) {
        console.error(e);
      }
    }
  };
  useEffect(() => {
    getFriends((data)=>setFriends(data));
    start_stream();
    socket.on('me', (id) => {
      setMe(id);
      console.log("in");
      console.log(id)
    })
    socket.on('callUsr', (data) => {
      console.log("incallUsr");
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      //setState 不会马上变 所以这里调answer会null
    })
  }, [])
  //呼叫
  const callusr = (idtoCall) => {
    console.log(idtoCall);
    //对等连接
    const peer = new Peer(
      {initiator: true,
        trickle: false, 
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
    peer.on('signal', (data) => {
      console.log("inSignal");
      socket.emit('callUsr', {
        usrtoCall: idtoCall,
        signalData: data,
        from: me,
      })
    })
    //接受返回的answer
    //似乎react-native 不支持 peer.on('stream')

    peer._pc.addEventListener('addstream',event=>{
      setOtherStream(event.stream);
    })
    //接受answer
    socket.on('callAccepted', (signal) => {
      //console.log(signal);
      setCallAccepted(true);
      peer.signal(signal);
    })
    //存储peer
    connectionRef.current = peer;
  }

  //接听视频流
  const answerCall = () => {
    console.log("answerCall");
    setCallAccepted(true);
    const peer = new Peer(
      {initiator: false,
        trickle: false, 
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
      peer._pc.addStream(stream);
    peer.on('signal', (data) => {
      console.log("inAnswerCallSignal");
      socket.emit('answerCall', {
        signalData: data,
        to: caller,
      })
    });

    peer._pc.addEventListener('addstream',event=>{
      setOtherStream(event.stream);
    })
    peer.signal(callerSignal);
    connectionRef.current = peer;
  }
  const endcall = () => {
    setCallEnded(true);
    connectionRef.current.destory();
  }

  console.log("fresh");
  console.log(friends);
  //RTCView外面如果还有View则不能正常显示
  return (
    <SafeAreaView style={styles.body}>
            {/* <FlatList
              data={birthday_data}
              renderItem={renderItem}
            /> */}

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
        <View style={styles.footer}>
        {/* <Button onPress = {start_stream}>开始视频</Button> */}
          <TextInput 
            onChangeText={(text) => { setidtoCall(text) }}
          />
          <>
            {callAccepted ?
              (<Button onPress={endcall}>结束通话</Button>) :
              (<Button onPress={() => callusr(idtoCall)}>通话</Button>)
            }
          </>
          {receivingCall && !callAccepted ? (
            <>
              <Text>正在呼叫</Text>
              <Button onPress={answerCall}>接听</Button>
            </>
          ) : null}
        </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill
  },
  stream: {
    flex: 1,
    height:100
  },
  footer: {
    backgroundColor: Colors.lighter,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
});
export default Demo;
