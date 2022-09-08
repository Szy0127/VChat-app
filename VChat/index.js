/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {randomBytes} from 'crypto';

randomBytes();
if (typeof process === 'undefined') process = {};
process.nextTick = setImmediate;

module.exports = process;
AppRegistry.registerComponent(appName, () => App);
