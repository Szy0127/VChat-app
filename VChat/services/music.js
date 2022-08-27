// const { cloudsearch,song_url } = require("NeteaseCloudMusicApi");
//
//
//
//
// async function getSongUrl(songName) {
//     try {
//         const result = await cloudsearch({
//             keywords: songName,
//             limit:5
//         });
//         let songs = result.body.result.songs;
//         //console.log(songs);
//         let default_ = songs[0];
//         //console.log(default_.id);
//
//         let res = await song_url(
//             {id:default_.id}
//         );
//         if(res.status=="200"){
//             let url = res.body.data[0].url;
//             console.log(url);
//             return url;
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }




// const yhbk = "http://m801.music.126.net/20220725001810/958adae6f73596e64dbf4c0fa3913d1a/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096552127/ca22/20d1/47b4/cc093fe0ef38d6345477c2adf55a26f7.mp3";
const playMusic = (url)=>{
    const audio = new Audio(url);
    console.log(url);
    audio.play();
}

export {playMusic}
