import React,{useState} from 'react';
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
import {login} from "../services/userService";
import { Toast,Button } from '@ant-design/react-native';
import { Header } from '../components/Header';
// 获取屏幕的宽和高
let {width,height} = Dimensions.get('window');

var isSuccess ;
function fetchData({name,password,signIn}) {
    login(name,password,
        (responseData) => {
            console.log(responseData);
            let _storeData = async () => {
                try {
                    await AsyncStorage.setItem("@VChat:token",'exist');
                } catch (error) {
                    // Error saving data
                }
            };
            _storeData();

            // 注意，这里使用了this关键字，为了保证this在调用时仍然指向当前组件，我们需要对其进行“绑定”操作

            isSuccess=(responseData.success?true:false);
            Toast.removeAll();
            if(isSuccess){
                signIn();
                console.log(responseData.data.username);
                let _storeName = async () => {
                    try {
                        await AsyncStorage.setItem("username",responseData.data.username);
                        await AsyncStorage.setItem("userID",responseData.data.userID.toString());
                    } catch (error) {
                        // Error saving data
                        console.log("save username error");
                    }
                };
                _storeName();

            }else{
                Toast.fail("用户名或密码错误！",2);
            }
        }
        )
}
export function LoginScreen(props){
    const [name, setName] = useState('');
    const [password,setPassword]=useState('');
    const { signIn } = React.useContext(AuthContext);
    return (
            <View style={{ flex: 1}}>
                <View style={styles.container}>
                    {/* <Text style={styles.titleStyle}>登录</Text> */}
                    <Header content={"登录"}/>
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

                    {/*登录*/}
                    <Button type="primary" style={styles.loginBtnStyle}onPress={() => {
                        loading();
                        fetchData({name,password,signIn});
                    }}>
                        登录
                    </Button>

                    {/*设置*/}
                    <View style={styles.settingStyle}>
                        <Button size="small" type="primary" onPress={()=>props.navigation.navigate('Register')}>注册</Button>
                        <Button size="small" type="primary" onPress={()=>props.navigation.navigate('Reset')}>忘记密码</Button>
                    </View>

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
        // backgroundColor:'blue',
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