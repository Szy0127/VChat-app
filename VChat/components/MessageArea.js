import React,{useState,useEffect} from "react"
import { FlatList,View,Text } from "react-native"
import { Button } from "@ant-design/react-native"
import { getMessage } from "../services/chatService"
import { Avatar } from "./Avatar"
export const MessageArea = (props)=>{

    const [msg, setMsg] = useState([]);

    useEffect(() => {
        console.log(props.roomid,props.userid);
        if(props.roomid === '')
            return;
        getMessage(props.roomid, props.userid, (data) => {
            setMsg(data);
        });
    }, [props.roomid,props.userid,props.fresh])
    return         <View style={{flex:1}}>
                {
                    msg ? msg.map((item, idx) => {
                        return item['userID'] === parseInt(props.userid) ?
                        <View key={idx} style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-end",backgroundColor:"#9acd32",height:40,marginVertical:3}}>
                            <Text style={{fontSize:22}}>{item.content}</Text>
                            <Avatar userID={item.userID} size={30}/>
                            
                            {/* <Text>{item.time}</Text> */}
                        </View>:
                        <View key={idx} style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start",backgroundColor:"#f8c301",height:40,marginVertical:3}}>
                        <Avatar userID={item.userID} size={30}/>
                        <Text style={{fontSize:22}}>{item.content}</Text>
                        {/* <Text>{item.time}</Text> */}
                        </View>
                    }):null
                }
</View>
}