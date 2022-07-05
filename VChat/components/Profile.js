// /**
//  * Created by lpp on 2020/3/14.
//  */
// import * as React from 'react';
// import {
//     AsyncStorage,
//     View,
//     Text,
//     Button
// } from 'react-native';
// import {AuthContext} from "../context"
// import {apiUrl} from "../urlconfig";
// const LOGOUT_URL=apiUrl+"/logout";
// export function  Profile(){
//     const { signOut } = React.useContext(AuthContext);
//     return(<View>
//         <Text>My Profile</Text>
//         <Button title="退出账户" onPress={() => {
//             AsyncStorage.removeItem("@Bookstore:token");
//             signOut();
//             fetch(LOGOUT_URL,{
//                 method:'POST',
//                 credentials: 'include',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body:JSON.stringify({}),
//             })
//                 .then((response) => {})
//                 .then((responseData) => {})
//                 .catch((error)=>{});
//         }}/>
//     </View>);
// }