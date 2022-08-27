import { mediaDevices } from "react-native-webrtc";
export async function openCamera() {
    return await mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
}

