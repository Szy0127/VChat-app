
import 'react-native-gesture-handler';
import React,{useReducer,useMemo,useEffect} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {LoginScreen} from "./screens/LoginScreen";
import {HomeScreen} from "./screens/HomeScreen";
import {SplashScreen} from "./components/splash";
import {AuthContext} from "./context"
import {apiUrl} from "./urlconfig"
const Stack = createStackNavigator();
const CHECK_URL=apiUrl+"/checkSession";


/*
前端需要根据是否登录 限制用户可以访问的界面
利用本地存储判断是否已经登录
如果本地存储为是 则向后端发送请求检查session 如果失效则移除本地存储
*/


const Dispatch = (prevState, action) => {
  switch (action.type) {
      case 'RESTORE_TOKEN':
          return {
              ...prevState,
              userToken: action.token,
              isLoading: false,
          };
      case 'SIGN_IN':
          return {
              ...prevState,
              isSignout: false,
              userToken: action.token,
          };
      case 'SIGN_OUT':
          return {
              ...prevState,
              isSignout: true,
              userToken: null,
          };
  }
}
const App = ()=> {
  /*
    state为object 包含了3个state
    reducer是通过同一个函数dispatch 处理state的变化
  */
    const [state, dispatch] = useReducer(
        Dispatch,
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    const checkToken = async () => {
      let userToken;
      try {
          userToken = await AsyncStorage.getItem('@Bookstore:token');
      } catch (e) {
          // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps
      fetch(CHECK_URL,{
          method:'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body:JSON.stringify({}),
      })
          .then((response) =>{return response.json();})
          .then((responseData) => {
              if(responseData.status<0){
                  AsyncStorage.removeItem("@Bookstore:token");
                  dispatch({ type: 'RESTORE_TOKEN', token: null });
              }else{
                  dispatch({ type: 'RESTORE_TOKEN', token: userToken });
              }
          })
          .catch((error)=>{
              console.error(error);
          });
  };

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        checkToken();
    }, []);//只执行一次

    /*
      context 提供3个函数
      用相同名字的对象可以直接把context中的对象拿出来然后直接调用
    */
    const authContext = useMemo(
        () => ({
            signIn: async data => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async data => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
        }),
        []
    )//只执行一次
    return(
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator>
                    {state.isLoading ? (
                        // We haven't finished checking for the token yet
                        <Stack.Screen name="验证中" component={SplashScreen} />
                    ) : state.userToken == null ? (
                        // No token found, user isn't signed in
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                title: 'Log in',
                                // When logging out, a pop animation feels intuitive
                                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                                headerShown:false,
                            }}
                        />
                    ) : (
                        // User is signed in
                        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
}

export default App;