import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import MyWebSocket from './classes/webSocket/myWebSocket';
import Game from './classes/game';

const server = fastify();

const myWebSocket = new MyWebSocket();
const thingy = this;
module.exports = async function (server: FastifyInstance, opts: FastifyServerOptions) {
    server.get('/', async (request, reply) => {
        // default route, explaining the API 
        return 'Hi! This is a Microgame API for playing good old mine sweeper';
    });
    
    server.get('/start/:userKey/:gameType', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        // check if game type is valid

        // Maybe check if there is already a game in progress

        // Maybe automatically close open games and start teh new one
        const newGame = 4;
        myWebSocket.addClientToGroup(params.userKey, '' + newGame);
        const returnValue = '{gameId: ' + newGame + '}';
        return returnValue;
    });
      
    server.get('/subscribeGame/:userKey/:game', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        // check if game type is valid

        // Maybe check if there is already a game in progress

        // Maybe automatically close open games and start teh new one

        myWebSocket.addClientToGroup(params.userKey, '' + params.game);
        const returnValue = '{gameId: ' + params.game + '}';
        return returnValue;
    });
      
    server.get('/gameUpdate/:gameNumber', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        // check if game type is valid

        // Maybe check if there is already a game in progress

        // Maybe automatically close open games and start teh new one
        const lorem = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor';
        const updateString = lorem.substr(Math.random() * lorem.length);
        const data = {message: updateString};
        console.log('sendign update (' + data + ')');
        myWebSocket.sendUpdateToGroup('4', data);
        return '';
    });
      
    server.get('/gameTypes', async (request, reply) => {
        // Fetch the list of game types and their definition from respective classes
        return {
            'beginner': {width: 15, height: 15},
            'advanced': {width: 30, height: 15},
            'master': {width: 40, height: 30}
        };
    });

    server.get('/reveal/:user/:game/:column/:row', async (request, reply) => {
        // check the user and current game

        // let the game reveal selected cell

        // send game status or changeset to client(s) 
        // (need to figure out which one is better regarding performance and/or timing issues)

        const clients = myWebSocket.getClients();
        return JSON.stringify(clients);
    });

    server.get('*', async (request, reply) => {
        return 'Sorry mate - wrong extension';
    });
}

