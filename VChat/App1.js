
import React from 'react';
import CoverScreen from './screens/CoverScreen';

import { Text } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Demo from './demo';
import { HomeScreen } from './screens/HomeScreen';

const Stack = createStackNavigator();


//使用路由跳转 会导致没有切换到对应画面的时候 已经执行了连接操作 但却无法收到返回值
const App = () => {

  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="Cover">
         <Stack.Screen name="Cover" component={CoverScreen} options={{headerShown:false}}/>
         <Stack.Screen name="Demo" component={Demo}  options={{headerShown:false}}/>
       </Stack.Navigator>
    </NavigationContainer>
  )
};


export default App;
