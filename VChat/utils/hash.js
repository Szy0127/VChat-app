export function hash(str){
    let i,hashCode = 0;
    for(i = 0;i < str.length;++i){
        let c = str.charCodeAt(i);
        hashCode += hashCode *13 + c;
    }
    return hashCode;
}

export function TwoUsrRoomID(user1,user2){
    let arr = [];
    arr.push(user1);
    arr.push(user2);
    arr.sort();
    return (arr.join("-"));
}
