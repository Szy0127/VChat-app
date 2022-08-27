export const configure = {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
    //   {
    //     urls:['stun:123.60.74.226:3478']
    //   },
      {
        username:'user',
        credential:'123123',
        urls:['turn:123.60.74.226:3478']
      }
    ],
  };