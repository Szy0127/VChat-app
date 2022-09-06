import { useState,useEffect } from "react";
import React from 'react';
// import {UserOutlined} from '@ant-design/icons'
// import {Row, Col, Card, Drawer, Avatar, Space, Button} from 'antd'

// import {history} from "../../utils/history";

import { addFriend } from "../services/userService";
import { getFriends,getSocketIDByUserID } from "../services/userService";
import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { View,FlatList,Text } from "react-native";
import { Button } from "@ant-design/react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AsyncStorage from "@react-native-community/async-storage";
import { TwoUsrRoomID } from "../utils/hash";
import { Avatar } from "./Avatar";
// const {Meta} = Card;

// function DrawerTitle(props) {
//     return (
//         <Space>
//             <Avatar icon={<UserOutlined/>}/>
//             {props.name}
//         </Space>
//     )
// }

export default function FriendList(props) {
    const [friends, setFriends] = useState([]);
    // const [visible, setVisible] = useState(false);
    const [id, setId] = useState(0);


    // const navigate = useNavigate();
    useEffect(() => {
        getFriends(data => {
            console.log(data);
            setFriends(data);
        });
    }, [])

    // const showDrawer = (index) => {
    //     setId(index);
    //     setVisible(true);
    // }

    const call_onPress = async(callID) => {
        // console.log(callID);
        if(callID < 0){
            return;
        }
        let userid = await AsyncStorage.getItem("userID");
        const roomid = TwoUsrRoomID(userid, callID);
        getSocketIDByUserID(callID,
            (data) => {
                if (data.length > 0) {
                    console.log(data);
                    props.navigation.navigate('chatting', 
                         {
                            type:'caller',
                            calleeSocketID:data[0],
                            roomid,
                            userid,
                            opposite: callID
                        }
                    )
                } else {
                    alert("好友不在线");
                }
            }
        )
    }

      const renderItem = ({item})=>{
    return   (
    <View style={styles.row}>
        <View style={{...styles.column,flex:1}}><Avatar userID={item.userID} size={30} /></View>
        <View style={{...styles.column,flex:5}}><Text style={{...styles.text}}>{item.username}</Text></View>
        <View style={{...styles.column,flex:3}}><Button onPress={()=>call_onPress(item.userID)}>视频通话</Button></View>
    </View>    
  );
  }


    return  <View>
        <FlatList
          data={friends}
          renderItem={renderItem}
          styles={{flex:1}}
        />
        {/* <Text>friendlist</Text> */}
  </View>
    ;
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