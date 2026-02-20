const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 1. Servimos el archivo HTML cuando entran a la página
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 2. Escuchamos las conexiones
io.on('connection', (socket) => {
  console.log('Un usuario se conectó en secreto...');

  // --- NUEVO: Escuchamos cuando un usuario nos dice su nombre al entrar ---
  socket.on('nuevo usuario', (nombre) => {
    // Guardamos el nombre en esta conexión (nos servirá más adelante)
    socket.username = nombre;
    
    // Le avisamos a TODOS LOS DEMÁS que alguien entró
    socket.broadcast.emit('mensaje de sistema', `${nombre} se ha unido al chat 🎉`);
  });

  // El que ya tenías para los mensajes normales
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });
});

// 3. Iniciamos el servidor en el puerto 3000
http.listen(3000, () => {
  console.log('Escuchando en http://localhost:3000');
});