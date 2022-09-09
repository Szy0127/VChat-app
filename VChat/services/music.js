import Sound from 'react-native-sound';




// const yhbk = "http://m801.music.126.net/20220725001810/958adae6f73596e64dbf4c0fa3913d1a/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096552127/ca22/20d1/47b4/cc093fe0ef38d6345477c2adf55a26f7.mp3";
let audios = [];
const playMusic = (url)=>{
    const audio = new Sound(url,null,(e)=>{
        if(e){
            console.log('播放失败');
            return;
        }
        audio.play(()=>audio.release());
        audios.push(audio);
    });
    // console.log(url);
    // audio.play();
    // audios.push(audio);
}
const stopMusic = ()=>{
    audios[0].pause();
    audios[0].release();
    audios.pop();

}

export {playMusic,stopMusic}
