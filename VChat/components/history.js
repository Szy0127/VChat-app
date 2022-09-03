import { Modal } from "@ant-design/react-native";
import {useEffect, useState} from "react";
import { getHistoryMulti,getHistoryTwo } from "../services/historyService";
import React from "react";
import { View,Text } from "react-native";

export default function DetailedHistory(props) {
    const {mode, roomid, visible, onCancel} = props;
    const [users, setUsers] = useState([]);
    const [sponsor, setSponsor] = useState('');

    useEffect(() => {
        if (mode) {
            getHistoryMulti(roomid, (data) => {
                console.log(data)
                setUsers(data);
                setSponsor(data["participants"].find((item) => item["userID"] === data["sponsorID"])["username"])
            })
        } else {
            getHistoryTwo(roomid, (data) => {
                console.log(data)
                setUsers(data);
                setSponsor(data["participants"].find((item) => item["userID"] === data["callerID"])["username"])
            })
        }
    }, [roomid])

    return (
        <Modal
            footer={null}
            onCancel={onCancel}
            title={`房间号: ${roomid}`}
            visible={visible}
        >
            <View label="发起用户">

                    {/* <Avatar className="header-avatar" icon={<UserOutlined/>}/> */}
                    <Text>{sponsor}</Text>

            </View>
            <View label="参与用户">
                {
                    users["participants"] !== undefined ?
                    users["participants"].map((item, index) => {
                        return (
                            <View key={index}>

                                    {/* <Avatar className="header-avatar" icon={<UserOutlined/>}/> */}
                                    <Text>{item.username}</Text>

                            </View>
                        )
                    }) : null
                }
            </View>
        </Modal>
    )
}
