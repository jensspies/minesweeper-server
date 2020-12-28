import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { GameKeeper} from './classes/gameKeeper';

const server = fastify();
const logger = require('simple-node-logger').createSimpleLogger();
logger.info('Starting service');
logger.setLevel('debug');
const gameKeeper = new GameKeeper(logger);
//server.listen(3000, '0.0.0.0');

module.exports = async function (server: FastifyInstance, opts: FastifyServerOptions) {
    logger.info('exporting fastify routes and settings');
    server.register(
        require('fastify-cors'),
        {
             origin: (origin: string, cb: CallableFunction) => {
                const localhost: RegExp = new RegExp(/localhost/);
                const localNetwork: RegExp = new RegExp(/192\.168\.178\.\d{1,3}/);
                logger.debug('Testing origin [' + origin + '] against [' + localhost + '|' + localNetwork + ']')
                if(
                    localhost.test(origin)
                    || localNetwork.test(origin)
                    ){
                  cb(null, true)
                  return
                }
                logger.error('illigal call from [' + origin + ']');
                cb(new Error("really not allowed!"))
            },
            methods: 'GET, POST'
        }
    );
    server.get('/', async (request, reply) => {
        // default route, explaining the API 
        return 'Hi! This is a Microgame API for playing good old mine sweeper';
    });
    
    server.get('/start/:userKey/:gameType', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        const gameType = params.gameType;
        const user = params.userKey;
        const gameData = gameKeeper.startNewGame(user, gameType);
        return gameData;
    });
      
    server.get('/subscribeGame/:userKey/:game', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        let returnValue;
        try{
            gameKeeper.subscribeToGameRequest(params.userKey, params.game);
        } catch (err) {
            returnValue = err.message;
        }
        returnValue = '{"gameId": "' + params.game + '"}';
        return returnValue;
    });
      
    server.get('/gameUpdate/:gameNumber', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        gameKeeper.getCurrentGameState(params.gameNumber);
        return '';
    });
      
    server.get('/gameTypes', async (request, reply) => {
        const gameTypes: any[] = gameKeeper.getAvailableGameLayouts();
        return gameTypes;
    });

    server.get('/runningGames', async (request, reply) => {
        const gameList: any[] = gameKeeper.getCurrentlyRunningGames();
        return gameList;
    });

    server.get('/reveal/:user/:game/:column/:row', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        gameKeeper.revealCellForUserAndGame(params.userKey, params.game, params.column, params.row);
        return JSON.stringify({});
    });

    server.get('*', async (request, reply) => {
        return 'Sorry mate - wrong extension';
    });
}

