# Juego simple usando Socket.io

Vamos a implementar un juego sencillo en el cual el objetivo es escribir más rápido palabras que nuestros contricantes. [Demo](https://word-o-bomb.herokuapp.com/).
Irán apareciendo palabras que hay que escribir lo más rápido posible, y de forma crrecta.

La mayoría de iteraciones están implementadas parcialmente, y solo hace falta añadir unas pocas líneas de código, salvo la Iteración 5-6.

## Iteración 1

En la parte cliente, modifica el código que recibe un evento de tipo 'game canstart', que habilite el botón identificado con id="start" para iniciar el juego.

## Iteración 2

Al hacer clic en el botón de empezar, se debe enviar un evento, de nombre 'game start' al servidor. Añade un listener al botón que emita el evento 'game start' cuando se pulse

## Iteración 3

El servidor, al recibir el evento 'game start', proporcionará la primera palabra a todos los jugadores. En server.js, instala un paquete de terceros que permita obtener una palabra en español al azar. Úsalo para obtener la siguiente palabra a adivinar. Emite un evento a todos los jugadores, de tipo 'game nextword', enviando la palabra a adivinar a todos los jugadores

Sugerencia: https://www.npmjs.com/package/random-spanish-words


## Iteración 4

Modifica el fichero client.html para gestionar el evento 'game nextword'; y colocar la palabra recibida en el h4 identificado con id="guess". Tienes una función a tu disposición que puedes usar

## Iteración 5

El usuario puede escribir la palabra y enviarla a través del input. Gestiona el evento 'submit'. ¿Dónde deberíamos comprobar si la palabra es correcta?¿En el cliente o el servidor?

## Iteración 6 (difícil)

Si la palabra introducida por el usuario es incorrecta
### Cliente
1. Muestra algun mensaje al usuario indicando que se ha equivocado

### Servidor 
Si la palabra es correcta
  0. Debe el servidor comprobar si la palabra enviada es correcta o es suficiente hacerlo en el cliente?
  1. Actualiza la puntuación del jugador (array usernames)
  2. Ofrece la siguiente palabra a adivinar a todos los jugadores
  3. Envia un evento para actualizar la puntuación en todos los clientes

