import { Modal,Button } from "@ant-design/react-native";
import {useEffect, useState} from "react";
import { getHistoryMulti,getHistoryTwo } from "../services/historyService";
import React from "react";
import { View,Text } from "react-native";
import { Avatar } from "./Avatar";
import { StyleSheet } from "react-native";
export default function DetailedHistory(props) {
    const {mode, roomid, visible,userID, onCancel} = props;
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
            onClose={onCancel}
            title={`房间号: ${roomid}`}
            visible={visible}
            transparent
            style={{flexDirection:"column",justifyContent:"flex-start"}}
            animationType="slide-up"
        >
            <View  style={styles.row}>
                    <Text style={styles.title}>发起用户：</Text>
                    <Avatar userID={userID} size={25}  style={styles.column} />
                    <Text  style={styles.content}>{sponsor}</Text>

            </View>
            <View style={styles.row}>
                <Text  style={styles.title} >参与用户：</Text>
                {
                    users["participants"] !== undefined ?
                    users["participants"].map((item, index) => {
                        return (
                            <View key={index} style={styles.row}>

                                    <Avatar  userID={item.userID} size={25} />
                                    <Text style={styles.content}>{item.username}</Text>
                            </View>
                        )
                    }) : null
                }
            </View>
            <Button type="primary" onPress={onCancel}>
                关闭
          </Button>
        </Modal>
    )
}
const styles = StyleSheet.create({
	row:{
        // flex:1,
        flexDirection:"row",
        alignItems:"center",
        // justifyContent:"center"
        marginVertical:18

    },

    title:{
        fontSize:22,
        color:"#111111"
    },
    content:{
        fontSize:18,
        color:"#555555",
        marginLeft:5,
        marginRight:10
    }

});