/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {randomBytes} from 'crypto';

randomBytes();
AppRegistry.registerComponent(appName, () => App);
