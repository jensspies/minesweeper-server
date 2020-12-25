import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import myWebSocket from './classes/webSocket/myWebSocket';

const server = fastify()

const webSocket = new myWebSocket();

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

        const returnValue = 'hello user: ' + params.userKey;
        return returnValue;
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

        const clients = webSocket.getClients();
        return {clients: '{' + JSON.stringify(clients) + '}'};
    });

    server.get('*', async (request, reply) => {
        return 'Sorry mate - wrong extension';
    });
}

