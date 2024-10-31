import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'chat_struct.html'));
});

io.on('connection', (socket) => {
  socket.join("general");
  socket.broadcast.emit('system message', 'general', 'a user connected');

  socket.on('disconnect', () => {
    socket.leave("general");
    socket.broadcast.emit('system message', 'general', 'user disconnected');
  });

  socket.on('chat message', (room, msg) => {
    io.to(room).emit('chat message', room, msg);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});