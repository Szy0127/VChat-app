
import React from 'react';
import {Text,View} from 'react-native';



export function SplashScreen() {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:40,color:'blue'}}>Loading...</Text>
        </View>
    );
}