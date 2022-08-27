import { Toast } from "@ant-design/react-native"

/*
1. 必须由Provider包裹
2. 必须由Button的onPress 调用 直接调用无效
*/
const loading = ()=>{
    Toast.loading('正在处理...', 0, () => {
        //Toast.info('成功!')
      })
}

export {loading};