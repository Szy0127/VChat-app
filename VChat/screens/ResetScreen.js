import React,{useState,useContext,useRef, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    Dimensions,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from "../context";
import {loading} from "../utils/utils.js";
import {modifyPassword, register, sendVerification} from "../services/userService";
import { Toast,Button } from '@ant-design/react-native';
import { Header } from '../components/Header';
// 获取屏幕的宽和高
let {width,height} = Dimensions.get('window');


export function ResetScreen(props){
    const [code, setCode] = useState('');
    const [password,setPassword]=useState('');
    const [password_confirm,setPassword_confirm]=useState('');
    const [email,setEmail]=useState('');
    const countSaver = useRef(0);
    const [count,setCount] = useState(countSaver.current);
    const counter = useRef();
    console.log(count);
    const countDown = ()=>{
        console.log("count:",countSaver.current);
        if(countSaver.current<=1){
            console.log("close");
            clearInterval(counter.current);
            setCount(0);
        }else{
            countSaver.current -= 1;
            setCount(countSaver.current);
        }
    }
    useEffect(()=>{
        return ()=>{
            if(counter.current){
                clearInterval(counter.current);
            }
            
        }
    },[])
    return (
            <View style={{ flex: 1}}>
                <View style={styles.container}>
                <Header content={"重置密码"}/>
                    {/*账号和密码*/}
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={text => setEmail(text)}
                        value={email}
                        placeholder={'请输入注册使用邮箱'} />

                    <TextInput
                        style={styles.textInputStyle}
                        placeholder='请输入密码'
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={true}
                        value={password}
                        password={true}/>

                    <TextInput
                        style={styles.textInputStyle}
                        placeholder='请再次输入密码'
                        onChangeText={text => setPassword_confirm(text)}
                        secureTextEntry={true}
                        value={password_confirm}
                        password={true}/>

                        <TextInput
                        style={styles.textInputStyle}
                        placeholder='请输入验证码'
                        onChangeText={text => setCode(text)}
                        value={code}
                        />
                    <Button disabled={count>0} type="primary" style={styles.loginBtnStyle} onPress={() => {
                        countSaver.current =60;
                        counter.current = setInterval(countDown,1000);
                        sendVerification(email,(msg)=>{
                            Toast.removeAll();
                            if(msg.success){
                                Toast.success("发送成功，请查看邮箱",1);
                            }else{
                                Toast.fail("失败",1);
                            }
                        });
                    }}>
                        {count > 0 ? `重新发送(${count})` : "发送验证码"}
                    </Button>
                    <Button  type="primary" style={styles.loginBtnStyle} onPress={() => {
                        modifyPassword(email,password,password_confirm,code,(msg)=>{
                            Toast.removeAll();
                            if(msg.success){
                                Toast.success("修改成功",1);
                                props.navigation.navigate('Login');
                            }else{
                                Toast.fail("失败",1);
                            }
                        });
                    }}>
                        确认修改
                    </Button>

                </View>
            </View>
        );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // 侧轴的对齐方式
        justifyContent: "center",
        alignItems:'center',
        backgroundColor: '#add8e6'
    },
    textInputStyle: {
        width:width*0.9,
        height:40,
        backgroundColor:'white',
        textAlign:'center',
        marginBottom:5
    },
    loginBtnStyle: {
        width: width*0.9,
        height: 40,
        backgroundColor:'blue',
        marginBottom: 10,
        borderRadius:10
    },
    settingStyle: {
        width: width*0.85,
        height: 40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    titleStyle: {
        fontSize:40,
        alignItems:'center',
        paddingBottom:10
    },
});