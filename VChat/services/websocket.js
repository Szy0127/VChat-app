import io from 'socket.io-client';
import { updateSocketID } from './userService';
import { nodeServerUrl } from '../configs/urlConfig';
import * as RoomManager from './RoomManager';
import {MediaStream} from "react-native-webrtc"
// let socket = null;
//客户端连接 socketio 服务器
export const connectWithSocketIOServer = (socket,addStreamCallback,stream) => {
    // socket = io(nodeServerUrl);
    console.log(socket);
    // socket.on('connect', () => {
    //     console.log(socket.id);
    //     //存储soketId
    //     updateSocketID(socket.id);
    // });

    socket.on('conn-prepare', (data) => {
        const { connUserSocketId } = data;
        //isinitiator = false
        console.log("conn-prepare");
        RoomManager.prepareNewPeerConnection(connUserSocketId, false, socket,addStreamCallback,stream);

        //让initiator = ture一方创建peer
        socket.emit('IniConnect', { connUserSocketId: connUserSocketId });
    });
    socket.on('Signal', (data) => {
        RoomManager.handleSignalingData(data);
    });

    socket.on('IniConnect', (data) => {
        const { connUserSocketId } = data;
        //isinitiator = true
        console.log("IniConnect");
        RoomManager.prepareNewPeerConnection(connUserSocketId, true, socket,addStreamCallback,stream);
    });

    socket.on('user leave', (data) => {
        RoomManager.removePeerConnection(data);
    });

};

//创建Room
export const createNewRoom = (username, userid, socket) => {
    const data = {
        username,
        userid
    };
    console.log("create");

    socket.emit('createRoom', data);
};

//加入Room
export const joinRoom = (roomId, username, userid, socket) => {
    //向socket发送信息
    const data = {
        roomId,
        username,
        userid
    };
    console.log(data);
    socket.emit('joinRoom', data);
};

export const signalPeerData = (data, socket) => {
    socket.emit('Signal', data);
};


export const socket_on = (signal, callback,socket) => {
    socket.on(signal, callback);
}

export const socket_emit = (signal, data,socket) => {
    socket.emit(signal, data);
}

// export const socket_id = () => socket.id;
