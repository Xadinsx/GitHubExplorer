/**
 * @format
 */
import 'react-native-gesture-handler';
import { withOnBootNetworkActivityRecording } from '@rozenite/network-activity-plugin';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { App } from './src/app/App';

// Query persist + the first search can fetch before React commits; record those too.
withOnBootNetworkActivityRecording({
  inspectors: { http: true, websocket: false, sse: false },
});

AppRegistry.registerComponent(appName, () => App);
