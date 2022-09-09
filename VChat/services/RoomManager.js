import Peer from 'simple-peer';
// import {success} from '../configs/cameraConfig';
import {configure} from '../configs/iceServerConfig';
import * as ws from './websocket';

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
let localStream = new MediaStream();

export const getLocalPreviewAndInitRoomConnection = async (
  initiator,
  username,
  userid,
  roomId = null,
  socket,
  // stream
) => {
    // localStream = stream;
    // success(localStream, 'video-user1');

    initiator
      ? ws.createNewRoom(username, userid, socket)
      : ws.joinRoom(roomId, username, userid, socket);
};

let peers = {};
let streams = [];
let id = 2;
//webrtc
export const prepareNewPeerConnection = (connUserSocketId, isInitiator, socket,addStreamCallback,stream) => {
  console.log("in Peer");
  //实例化对等连接对象
  peers[connUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configure,
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
  peers[connUserSocketId]._pc.addStream(stream);
  //信令数据传递
  peers[connUserSocketId].on('signal', (data) => {
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    };
    ws.signalPeerData(signalData, socket);
  });

  //获取媒体流stream
  peers[connUserSocketId].on('stream', (_stream) => {
    console.log('成功获取远程Stream');
    //显示接收的stream媒体流
    // success(stream, `video-user${id}`);
    // id++;
    streams = [...streams, _stream];
    addStreamCallback(streams);
  });

};

export const handleSignalingData = (data) => {
  peers[data.connUserSocketId].signal(data.signal);
};

export const removePeerConnection = (data) => {
  // const { socketId } = data;
  // const videoContainer = document.getElementById(socketId);
  // const videoElement = document.getElementById(`${socketId}-video`);

  // if (videoContainer && videoElement) {
  //   const tracks = videoElement.srcObject.getTracks();

  //   tracks.forEach((track) => track.stop());

  //   videoElement.srcObject = null;
  //   videoContainer.removeChild(videoElement);
  //   videoContainer.parentNode.removeChild(videoContainer);

  //   if (peers[socketId]) {
  //     peers[socketId].destroy();
  //   }

  //   delete peers[socketId];
  // }
};

const changeStream = (stream) => {
  for (let socket_id in peers) {
    for (let index in peers[socket_id].streams[0].getTracks()) {
      for (let index2 in stream.getTracks()) {
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          );
        }
      }
    }
  }
};
