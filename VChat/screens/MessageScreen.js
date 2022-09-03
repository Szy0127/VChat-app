import React from "react";
import { useState,useEffect } from "react";
import { View,Text, FlatList } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-community/async-storage";
import DetailedHistory from "../components/history";
import { getAttendance } from "../services/historyService";
import { Card,Button } from "@ant-design/react-native";
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
                // icon = <CheckCircleOutlined style={{color: "#52c41a"}}/>
            }
            else {
                state = '未接听';
                // icon = <InfoCircleOutlined style={{color: "#f5222d"}}/>;
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
                    // icon = <CheckCircleOutlined style={{color: "#52c41a"}}/>
                }
                else {
                    state = '未接受';
                    // icon = <InfoCircleOutlined style={{color: "#f5222d"}}/>;
                }
            }
        }


        return (
            <View>
                <Text>
                    {time_str}
                </Text>
                <Text>
                    {`${content}${state}`}
                </Text>
                
                <Button
                    type="primary"
                    onPress={() => {
                        toggleModal(item)
                    }}
                >
                    <Text>详情</Text>
                </Button>
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