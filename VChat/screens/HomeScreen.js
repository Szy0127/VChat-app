/**
 * Created by lpp on 2020/3/14.
 */
import React from 'react';
import { View,Text} from 'react-native';
import {Profile} from '../components/Profile';
import { createStackNavigator } from '@react-navigation/stack';
import {BookScreen} from './BookScreen';
import {BookListScreen} from "./BookListScreen"
import { SafeAreaProvider} from 'react-native-safe-area-context';
import { Button } from '@ant-design/react-native';
import Demo from '../demo';
import { useState,useEffect } from 'react';
import { updateSocketID } from '../service/userService';
import { nodeServerUrl } from '../service/urlConfig';
import { io } from 'socket.io-client';
import { SocketContext } from '../context';
import { SafeAreaView } from 'react-navigation';
import { MediaStream,mediaDevices } from 'react-native-webrtc';
const Stack = createStackNavigator();
function BookListAndDetail(){
    return (
        <SafeAreaProvider>
        <Stack.Navigator>
            <Stack.Screen name="BookList" component={BookListScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Detail" component={BookScreen}/>
        </Stack.Navigator>
            </SafeAreaProvider>
    );
}
function MyCartScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>My Cart</Text>
            <Button size='large' type="primary" onPress={()=>navigation.navigate('demo')}>demo</Button>
        </View>
    );
}

function MyOrderScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>My Order</Text>
            <Button onPress={()=>{console.log(1);}}>test</Button>
        </View>
    );
}

function MyProfileScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Profile navigation={navigation}/>
        </View>
    );
}

const HomeScreen_ = (props)=>{
    return             props.receivingCall ?
                        <>
                            <Text>{`${props.callerInfo.username}(${props.callerInfo.addr.region})`}正在呼叫</Text>
                            <Button onPress={props.answerCall}>接听</Button>
                        </>
                        :
                        <Text>等待呼叫</Text>
                    

            
}
export function HomeScreen(props){

    const [receivingCall, setReceivingCall] = useState(false);
    const [callerInfo, setCallerInfo] = useState('');
    const [callerSignal, setCallerSignal] = useState('');

    const [socket, setSocket] = useState(null);
    const [stream,setStream] = useState(new MediaStream());

    const [virtual, setVirtual] = useState(false);

    useEffect(
        () => {

            const start_stream = async () => {
                console.log('start');
                  let s;
                  try {
                    s = await mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                      });
                    setStream(s);
                    console.log("set stream success");
                    return s;
                  } catch(e) {
                    console.error(e);
                  }
              };
              start_stream();


            console.log("connect");
            let _socket = io(nodeServerUrl);
            setSocket(_socket);
            _socket.on('connect', () => {
                console.log(_socket.id);
                //存储soketId
                updateSocketID(_socket.id);
            });


            _socket.on('callUsr', (data) => {
                console.log("incallUsr");
                setCallerSignal(data.signal);
                setCallerInfo(data.from);
                setReceivingCall(true);
                console.log(data.from);
            });
        }
        , []
    )




    const answerCall = () => {
        if (callerInfo == '' || callerSignal == '') {
            alert("请稍后重试");
            return;
        }

        props.navigation.navigate('chatting', 
             {
                type: 'callee',
                callerSignal: callerSignal,
                callerInfo: callerInfo
            }
        );

    }
    


    return (


        <SocketContext.Provider value={{socket,stream}}>
            <Stack.Navigator initialRouteName="Home">
            
                
                <Stack.Screen name='Home' options={{headerShown:false}}>
                    {()=>{
                        return receivingCall ?
                        <>
                            <Text>{`${callerInfo.username}(${callerInfo.addr.region})`}正在呼叫</Text>
                            <Button onPress={answerCall}>接听</Button>
                        </>
                        :
                         <Text>等待呼叫</Text>
                    }}
                    </Stack.Screen>
                
                <Stack.Screen name="chatting" component={Demo} options={{headerShown:false}}/>
            </Stack.Navigator>
            </SocketContext.Provider>

    );
}