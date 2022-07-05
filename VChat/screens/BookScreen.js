// /**
//  * Created by lpp on 2020/3/14.
//  */
// import React from 'react';
// import {View,Text,Image,StyleSheet} from 'react-native';

// export class BookScreen extends React.Component {
//     render(){
//         // console.log(this.props.route.params.detail);
//         let detail=this.props.route.params.detail;
//         return (
//             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                 <Image
//                     source={{uri: detail.image}}
//                     style={styles.image}
//                 />
//                 <View >
//                     <Text style={styles.name}>{detail.name}</Text>
//                 </View>
//                 <View >
//                     <Text >作者：{detail.author}</Text>
//                     <Text >ISBD：{detail.isbn}</Text>
//                     <Text >类型：{detail.type}</Text>
//                     <Text>单价：¥{detail.price}</Text>
//                     <Text>库存：{detail.inventory}</Text>
//                 </View>
//                 <View>
//                     <Text style={styles.description}>{detail.description}</Text>
//                 </View>
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     name:{
//         fontSize:20
//     },
//     image: {
//         width: 182,
//         height: 245
//     },
//     description:{
//         paddingLeft:50,
//         paddingRight:55
//     }
// });