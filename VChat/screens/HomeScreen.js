/**
 * Created by lpp on 2020/3/14.
 */
import React from 'react';
import {Button, View,Text} from 'react-native';
import {Profile} from '../components/Profile';
import { createStackNavigator } from '@react-navigation/stack';
import {BookScreen} from './BookScreen';
import {BookListScreen} from "./BookListScreen"
import { SafeAreaProvider} from 'react-native-safe-area-context';
import Demo from '../demo';
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
        </View>
    );
}

function MyOrderScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>My Order</Text>
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
export function HomeScreen(){
    return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="demo" component={Demo} />
                <Stack.Screen name="MyCart" component={MyCartScreen} />
                <Stack.Screen name="MyOrder" component={MyOrderScreen} />
                <Stack.Screen name="MyProfile" component={MyProfileScreen} />
            </Stack.Navigator>
    );
}