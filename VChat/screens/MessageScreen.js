import React from "react";
import { useState,useEffect } from "react";
import { View,Text, FlatList } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-community/async-storage";
import DetailedHistory from "../components/history";
import { getAttendance } from "../services/historyService";
import { Card,Button } from "@ant-design/react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
export const MessageScreen =()=>{
    const [history, setHistory] = useState([]);
    const [roomid, setRoomid] = useState('');
    const [mode, setMode] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect( () => {
        const f = async ()=>{
                    let id = await AsyncStorage.getItem("userID");
        getAttendance(id, (data) => {
                console.log(id,data);
                setHistory(data);
            });
        }
        f();

    },[])

    const toggleModal = (values) => {
        console.log(values)
        setRoomid(values.roomID);
        setMode(values.mode);
        setVisible(true);
    }

    const renderItem = ({item})=>{
        const time = new Date(item.time);
        const time_str = `${time.toLocaleDateString()} --- ${time.toTimeString().slice(0, 8)}`;
        let content = '', state = '', icon = '';

        if (item.mode === 0) {
            if (item.invitorID === -1)
                content = '你邀请好友进行了聊天 ----- ';
            else
                content = '好友邀请你进行了聊天 ----- ';
            if (item.accepted === 1) {
                state = '已接听';

                icon = <AntDesign name="checkcircle" color={"#52c41a"} size={25} />
            }
            else {
                state = '未接听';
                icon = <AntDesign name="closecircle" color={"#f5222d"} size={25} />
            }
        } else {
            if (item.invitorID === -1)
                content = '你创建了一个聊天室';
            else if (item.invitorID === 0)
                content = '你加入了一个聊天室';
            else {
                content = '你受邀请加入了一个聊天室 ----- ';
                if (item.accepted === 1) {
                    state = '已接受';
                    icon = <AntDesign name="checkcircle" color={"#52c41a"} size={25} />
                }
                else {
                    state = '未接受';
                    icon = <AntDesign name="closecircle" color={"#f5222d"} size={25} />
                }
            }
        }


        return (
            <View style={{flex:1,flexDirection: 'column',justifyContent:"center",backgroundColor:"#ffffff"}}>
                <Text style={{flex:1,fontSize:20,backgroundColor:"#C0C0C0",paddingLeft:3,paddingVertical:5}}>
                    {time_str}
                </Text>
                <View style={{flex:1,flexDirection: 'row',alignItems:"center"}}>
                    <Text style={{flex:4,fontSize:15,paddingLeft:3}}>
                        {`${content}${state}`}
                    </Text>
                    {icon}
                    
                    <Button
                        style={{flex:1,size:8}}
                        type="primary"
                        onPress={() => {
                            toggleModal(item)
                        }}
                    >
                        <Text>详情</Text>
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <View>
            <DetailedHistory
                mode={mode}
                roomid={roomid}
                visible={visible}
                onCancel={() => {setVisible(false);}}
            />
            {
                history.length === 0 ?
                    <Text>暂无消息</Text> :
                <FlatList data={history} renderItem={renderItem}/>
            }
        </View>
    )
}