const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var randomWords = require('random-spanish-words');

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

        console.log(usernames);

        // Comprobamos si ya hay dos jugadores activos. En tal caso enviaremos un evento para habilitar el botón del juego, que cualquier usuario va a poder pulsar desde el navegador
        if (usernames.length >= 2) {
            io.emit('game canstart');
        }

    });

    socket.on('game start', () => {
        console.log("Iteración 2: Un jugador ha pulsado el botón de Start");
        /** Iteración 3. Siempre enviamos la misma palabra. Echa un vistazo al README.md para utilizar un paquete de terceros que nos permite enviar una palabra aleatoria cada vez. GUARDA dicha palabra el la variable global currentRandomWord */

        // Verificar si habéis actualizado correctamente la palabra a enviar a los clientes
        currentRandomWord = randomWords();
        console.log("Palabra enviada: " + currentRandomWord);
        io.emit('game nextword', currentRandomWord);
        io.emit('game updatescore', usernames);
    });


    /** Iteración 6: Necesitamos gestionar un nuevo evento aquí cuando un jugador escriba la palabra correctamente. socket.on(...)*/
    socket.on('game inputword', (inputWord) => {
        // Mirar Iteración 6 de README.md
        // 1. El servidor debe revisar si la palabra es correcta. Si no es correcta, no hacer nada (return?)
        // Debemos comprobar si inputWord == currentRandomWord
        if (inputWord != currentRandomWord) {
            return;
        }

        // 2. Actualizar la puntuación del jugador
        // El identificador del jugador está en la variable  socket.id . 
        // 2.1 Buscar el usuario cuya id coincida con socket.id . método find
        // 2.2 Sumar un punto a la propiedad que almacena la puntuación: score
        let user = usernames.find(u => u.id == socket.id);
        user.score++;
        console.log('Usuario para actualizar la puntuación', user);

        // 3. Actualizar la variable:  currentRandomWord = randomWords();
        currentRandomWord = randomWords();

        // 4. Enviar un evento a todos los jugadores para que actualicen sus puntuaciones
        // Tenemos que emitir de nuevo el evento 'game updatescore' (línea 51)
        // 5. También debemos enviar la nueva palabra a todos los jugadores mediante el evento 'game nextword'
        io.emit('game nextword', currentRandomWord);
        io.emit('game updatescore', usernames);
    });


    // Elimina el jugador de la 'bbdd' cuando se desconecta
    socket.on('disconnect', () => {
        usernames = usernames.filter(u => u.id != socket.id);
        io.emit('game updatescore', usernames);

        // Mirar si hay menos de 2 jugadores activos, en tal caso, hay que bloquear al usuario activo actualmente
        if (usernames.length < 2) {
            io.emit('game muststop');
        }
    })

});




server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});