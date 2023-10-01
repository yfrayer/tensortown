import Constants from 'expo-constants';
import { io } from 'socket.io-client';

const url = Constants.expoConfig.extra.baseUrl;
const socket = io.connect(url, { path: '/socket.io/' });

export default socket;
