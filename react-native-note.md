# react-native 开发记录
## react-native 项目配置
- 最新版0.68 要求jdk11 互联网课装好的是jdk8 所以使用0.66.4

  用intellij自动生成是最新版的，降级：
`npm install --save react-native@0.66.4`

- 用intellij自动生成的 跑不了 会报少文件 用官网说的命令行方式新建项目`npx react-native init Project --version 0.66.4`
  
  然而用命令行新建的项目再用intellij打开并不能识别 所以用vscode

- 安卓模拟器配置：https://reactnative.dev/docs/environment-setup
- 编译运行：`npx react-native run-android` (用vscode可以终端-运行任务)
- 打包发给手机：(android目录下)`gradlew assembleRelease`
  
  apk路径：Project\android\app\build\outputs\apk\release
- ios不像安卓这么容易，必须用Xcode，而Xcode又必须是mac环境

## package
包有互相依赖关系
`npm install --legacy-peer-deps` 避免报错
### 导航
```
"@react-navigation/native": "^6.0.10",
"@react-navigation/stack": "^6.2.1",
```
有如下依赖包
```
"react-native-gesture-handler": "^2.5.0",
"react-native-safe-area-context": "^4.3.1",
"react-native-safe-area-view": "^1.1.1",
"react-native-screens": "3.13.1"
```
### 本地存储
`"@react-native-community/async-storage": "^1.12.1"`

### antd
antd-mobile不支持react native 换一个支持的

https://github.com/ant-design/ant-design-mobile-rn

https://rn.mobile.ant.design/

`"@ant-design/react-native": "5.0.0"`

依赖包(issue中发现)
`npm install classnames rc-util fbjs`

但实际上移动端的antd实现的组件并不如web端那么丰富，很多时候react-native自带的组件已经挺不错了

### webrtc
https://github.com/react-native-webrtc/react-native-webrtc

下这个包会很慢，需要耐心等

启动有问题，不报任何错误 在issue中找到解决方法，修改安卓文件配置即可

https://github.com/react-native-webrtc/react-native-webrtc/issues/1080

针对安卓的权限问题解决如下

https://github.com/react-native-webrtc/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md


### simple peer
https://github.com/feross/simple-peer

simple-peer并没有说是支持移动端的，但是可以根据如下方法直接使用
https://stackoverflow.com/questions/66281342/simple-peer-with-react-native-webrtc

遇到的问题在于，react-native-webrtc中的RTCPeerConnection还没有实现很多API，因此在使用的时候会直接报错。

https://github.com/react-native-webrtc/react-native-webrtc/pull/1160
此PR增加API 但仍在开发中

若此后遇到问题，可尝试更换框架为peerjs

https://github.com/Zemke/react-native-peerjs

https://peerjs.com/docs/#api

### crypto
https://github.com/tradle/react-native-crypto

最后一句换成`node_modules\.bin\rn-nodeify --hack --install --legacy-peer-deps`
默认的crypto库的方法是基于浏览器内核的，在react-native项目中会报错(例如randomBytes)，使用react-native-randombytes并不能直接解决问题。

安装react-native-crypto后根据教程进行配置，可以使其替代原有的crypto而不用修改其他库的源代码。(simple-peer中实例化Peer遇到此问题)

之后package.json中会出现很多奇奇怪怪的包


## 一些错误

出现任何错误 通用解决方案：

1. 重启metro
2. node_modules删了再装
3. 重启电脑

- ```
  npm ERR! Error: read ECONNRESET
  npm ERR!     at TLSWrap.onStreamRead (node:internal/stream_base_commons:217:20) {
  npm ERR!   errno: -4077,
  npm ERR!   code: 'ECONNRESET',
  npm ERR!   syscall: 'read'
  npm ERR! }
  ```
  这个是网络不好 可以多试几次  或者用cnpm 或者换源

- `could not get batchedbridge` 重启metro
- `Invariant Violation: Module AppRegistry is not a registered callable module (calling runApplication)`重启metro
- `npm ERR! could not determine executable to run`仔细看命令 npm莫名其妙会变成npx
- `module could not be found within the project or in these directories:node_modules` 重启metro 如果不行删了node_modules再装
- `warn No apps connected. Sending "reload" to all React Native apps failed. Make sure your app is running in the simulator or on a phone connected via USB.
info Reloading app...`
这个的原因是app本身有问题 导致一打开就会闪退 或者其他原因根本打不开 和模拟器的连接没有问题  但是找不到任何报错的信息 因此只能控制变量去看;
少装几个包就没这个问题了 因此是装了的包 即使代码里没有用 也会导致这个问题;具体是react-native-webrtc要求安卓的minSdkVersion 需要修改android目录下的配置文件

- `'react-native' 不是内部或外部命令，也不是可运行的程序
或批处理文件。`这个可能是uninstall的时候多删东西了 直接`npm install`就行
- `TypeError: undefined is not an object (evaluating 'process.version.split')`这个问题并没有解决

https://github.com/facebook/react-native/issues/30654