const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Siguiente palabra que deben adivinar los jugadores
var currentRandomWord = "holahola";

// Base de datos de usuarios
let usernames = []

// importar el paquete de terceros socket.io, y nos quedamos únicamente con el objeto 'Server'
const { Server } = require("socket.io");
// Crear una nueva instancia del objeto Server y le pasamos como parámetro nuestro servidor NodeJS
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client.html');
});

// Socket.io va a 'escuchar' los eventos de tipo 'connection', que son unos eventos que se emiten cuando un cliente (desde el navegador Web) accede a nuestra app
io.on('connection', (socket) => {

    // la propiedad id es el identificador único de cliente que Socket.io ha otorgado al cliente que se ha conectado
    console.log("Nuevo ID de usuario: ", socket.id);

    socket.on('change nickname', (username) => {
        // Añadimos el usuario al array de usuarios, su identificador, su nickname y puntuación inicial 
        usernames.push({
            id: socket.id,
            username,
            score: 0
        });

        // Comprobamos si ya hay dos jugadores activos. En tal caso enviaremos un evento para habilitar el botón del juego, que cualquier usuario va a poder pulsar desde el navegador
        if (usernames.length >= 2) {
            io.emit('game canstart');
        }

    });

    socket.on('game start', () => {
        /** Iteración 3. Siempre enviamos la misma palabra. Echa un vistazo al README.md para utilizar un paquete de terceros que nos permite enviar una palabra aleatoria cada vez. GUARDA dicha palabra el la variable global currentRandomWord */
        io.emit('game nextword', currentRandomWord);
        io.emit('game updatescore', usernames);
    });


    /** Iteración 6: Necesitamos gestionar un nuevo evento aquí cuando un jugador escriba la palabra correctamente. socket.on(...)*/


    // Elimina el jugador de la 'bbdd' cuando se desconecta
    socket.on('disconnect', () => {
        usernames = usernames.filter(u => u.id != socket.id);
        io.emit('game updatescore', usernames);
    })

});




server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});