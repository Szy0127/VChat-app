import React, {useState} from 'react';
import {
    Text,
    View,
    Image,
    SafeAreaView,
    StyleSheet,
	ImageBackground
} from 'react-native';
import {Button} from '@ant-design/react-native'

const pad = (num) => {
    if (num < 10) {
        return '0' + num;
    }
    return num;
};
const formatDate = (date) => {
    let datestr = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
    let timestr = pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
    return datestr + ' ' + timestr;
};
const TimeCounter = () => {
    const [now, setNow] = useState(new Date());
    setInterval(() => {
        setNow(new Date);
    }, 1000);
    now.getMinutes;
    return <View style={styles.center}>
        <Text style={{fontSize:20}}>{formatDate(now)}</Text>
    </View>;
};


const CoverScreen = (props) => {

    return <SafeAreaView style={styles.container} backgroundColor='blue'>

                <View style={{...styles.center,flex:4,paddingHorizontal:10}}><Text style={{fontSize:30,color:'red',backgroundColor:'#E0FFFF'}}>test</Text></View>
                <View style={{flex:5}}>
                    <TimeCounter/>
                </View>
            <View style={{...styles.center,flex:2}}>
                <Button size='large' type="primary" onPress={()=>props.navigation.navigate('demo')}>demo</Button>
                {/* <Button size='large' type="primary" onPress={()=>props.navigation.navigate('Webrtc')}>webrtc</Button> */}
                </View>
    </SafeAreaView>;
};
const styles = StyleSheet.create({
	container:{
		flex: 1, 
		flexDirection: 'column', 
		justifyContent: 'center',
        alignItems:'center'
	},
    center:{
        justifyContent: 'center',
        alignItems:'center'
    },
    backgroundImage:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
		height:'100%',
		position:'absolute'
      }
});

export  default  CoverScreen;
