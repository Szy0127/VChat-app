import FriendList from "../components/friendList"
import React, { useEffect, useState } from "react"
import { View,ImageBackground,FlatList } from "react-native"
import backgroundImg from "../asserts/background-vertical.png";
import { TextInput,Text,StyleSheet } from "react-native";
import { Button, Toast } from "@ant-design/react-native";
import { getUsers,addFriend,getFriendRequestReceived,acceptFriendRequest } from "../services/userService";
import { Avatar } from "../components/Avatar";
import AsyncStorage from "@react-native-community/async-storage";
export const FriendScreen = (props)=>{

    const [searchName,setSearchName] = useState('');
    const [users,setUsers] = useState([]);
    const [users_to_accept,setUsers_to_accept] = useState([]);
    
    const [userid,setUserid] = useState(0);
    AsyncStorage.getItem("userID").then(data=>setUserid(data));

    const renderItem = ({item})=>{
        const me = item.userID == userid ? "(我)":"";
        return   (
        <View style={styles.row}>
            <View style={{...styles.column,flex:1}}><Avatar userID={item.userID} size={30} /></View>
            <View style={{...styles.column,flex:5}}><Text style={{...styles.text}}>{`${item.username}${me}`}</Text></View>
            <View style={{...styles.column,flex:3}}><Button type="primary" onPress={()=>{
                        if(item.userID==userid){
                            Toast.fail("不可添加自己为好友",1);
                            return;
                        }
                        addFriend(item.username,(data)=>{
                            if(data){
                                Toast.success("添加成功",1);
                            }else{
                                Toast.error("已成为好友",1);
                            }
                        })
            }}>添加好友</Button></View>
        </View>    
      );
    }
    const [flag,setFlag] = useState(false);
    const fresh = ()=>{
        getFriendRequestReceived((data) => {
            setUsers_to_accept(data.filter((item)=>item.userID!=userid));
        })
    }
        useEffect(()=>{
            fresh();
        },[])
        const renderItem2 = ({item})=>{
            return   (
            <View style={styles.row}>
                <View style={{...styles.column,flex:1}}><Avatar userID={item.userID} size={30} /></View>
                <View style={{...styles.column,flex:5}}><Text style={{...styles.text}}>{item.username}</Text></View>
                <View style={{...styles.column,flex:3}}><Button type="primary" onPress={async()=>{
                        await acceptFriendRequest(item.userID);
                        fresh();
                        setFlag(!flag);
                }}>同意</Button></View>
            </View>    
          );
            }

    return (
        <ImageBackground source={backgroundImg} style={{        flex:1,
            width:'100%',
            height:'100%',
            position:'absolute'}}>


                <View style={{flexDirection:"row",marginVertical:5}}>
                    <TextInput style={{flex:6,backgroundColor:"#ffffff"}} placeholder={"用户名"} onChangeText={(e) => {
                        setSearchName(e);
                        if(e==''){
                            setUsers([]);
                        }
                    }} />
                    <Button style={{flex:1}} type="primary" onPress={()=>{
                            getUsers(searchName, (data) => {
                                console.log(data);
                                if (!data || data.length === 0) {
                                    Toast.fail("未找到用户", 1);
                                }
                                setUsers(data);
                            })

                    }}>搜索用户</Button>
                </View>
                {
                    users.length > 0?
                    <FlatList
                    data={users}
                    renderItem={renderItem}
                    // style={{flex:1}}
                />:null
                }
                {
                    users_to_accept.length > 0?
                    <View >
                    <Text style={styles.title}>好友申请：</Text>
                    <FlatList
                    data={users_to_accept}
                    renderItem={renderItem2}
                    // style={{flex:1}}
                />
                </View>:null
                }
                <View 
                // style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}
                >
                    <Text style={styles.title}>好友列表：</Text>
                <FriendList navigation={props.navigation} fresh={flag}/>
                </View>
            

        </ImageBackground>
    )
}

const styles = StyleSheet.create({

    row:{
      flex:1,
      flexDirection: 'row', 
      justifyContent: 'space-around',
      marginHorizontal:10,
      backgroundColor:"#ffffff"
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
    title:{
        fontSize:25,
        color:"#0000ff"
    }

  });