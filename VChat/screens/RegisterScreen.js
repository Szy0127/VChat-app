import React,{useState,useContext} from 'react';
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
import {register} from "../services/userService";
import { Toast,Button } from '@ant-design/react-native';
// 获取屏幕的宽和高
let {width,height} = Dimensions.get('window');


export function RegisterScreen(props){
    const [name, setName] = useState('');
    const [password,setPassword]=useState('');
    const [password_confirm,setPassword_confirm]=useState('');
    const [email,setEmail]=useState('');
    const { signUp } = useContext(AuthContext);
    return (
            <View style={{ flex: 1}}>
                <View style={styles.container}>
                    <Text style={styles.titleStyle}>注册</Text>
                    {/*账号和密码*/}
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={text => setName(text)}
                        value={name}
                        placeholder={'请输入用户名'} />

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
                        placeholder='请输入邮箱'
                        onChangeText={text => setEmail(text)}
                        value={email}
                        />
                    <Button  type="primary" style={styles.loginBtnStyle} onPress={() => {
                        register(name,password,password_confirm,email,(data)=>{
                            Toast.removeAll();
                            if(data){
                                // signUp();//用了signup后会修改状态 导致login不在stack中 只能直接跳到home
                                // 必须让后端在注册的同时记录session
                                Toast.success("注册成功",1);
                                props.navigation.navigate('Login');
                            }else{
                                Toast.fail("用户名或邮箱已被注册",1);
                            }
                        });
                    }}>
                        注册
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
        marginTop:30,
        marginBottom: 20,
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