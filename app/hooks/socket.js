import { io } from 'socket.io-client';

console.log('Starting connection...');
const socket = io('https://192.168.10.224:4000', {
  path: '/myAppSocket/socket.io'
});

socket.on('connect', () => {
    console.log('Connected to the server.');
});

socket.on('connect_error', (error) => {
    console.log('Connection error:', error);
});

socket.on('reconnect', (attemptNumber) => {
    console.log('Reconnected after', attemptNumber, 'attempts.');
});

socket.on('reconnect_attempt', () => {
    console.log('Reconnecting...');
});

socket.on('reconnecting', (attemptNumber) => {
    console.log('Reconnecting... Attempt number:', attemptNumber);
});

socket.on('reconnect_error', (error) => {
    console.log('Reconnection error:', error);
});

socket.on('reconnect_failed', () => {
    console.log('Failed to reconnect.');
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected. Reason:', reason);
});

console.log('Socket object:', socket);

export default socket;
