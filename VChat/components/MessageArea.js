import React,{useState,useEffect} from "react"
import { FlatList,View,Text } from "react-native"
import { Button } from "@ant-design/react-native"
import { getMessage } from "../services/chatService"
export const MessageArea = (props)=>{

    const [msg, setMsg] = useState([]);

    useEffect(() => {
        console.log(props.roomid,props.userid);
        if(props.roomid === '')
            return;
        getMessage(props.roomid, props.userid, (data) => {
            setMsg(data);
        });
    }, [props.roomid,props.userid])
    return         <View style={{flex:1}}>
                {
                    msg.map((item, idx) => {
                        return item['userID'] === parseInt(props.userid) ?
                        <View key={idx}>
                            <Text>{item.userID}</Text>
                            <Text>{item.content}</Text>
                            <Text>{item.time}</Text>
                        </View>:
                        <View key={idx}>
                        <Text>{item.content}</Text>
                        <Text>{item.userID}</Text>
                        <Text>{item.time}</Text>
                        </View>
                    })
                }
        <Button  type="primary" onPress={props.close}>
            关闭
        </Button>
</View>
}