import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocketUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  // backend base: http://host:3000/api → socket.io at http://host:3000
  return String(base).replace(/\/api\/?$/, '');
}

export function getRealtimeSocket() {
  if (socket) return socket;
  socket = io(getSocketUrl(), {
    withCredentials: true,
    transports: ['websocket'],
  });
  return socket;
}

export function disconnectRealtimeSocket() {
  socket?.disconnect();
  socket = null;
}

