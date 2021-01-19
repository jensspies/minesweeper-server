import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { GameKeeper} from './classes/gameKeeper';

const logger = require('simple-node-logger').createSimpleLogger();
logger.info('Starting service');
logger.setLevel('debug');
const apiPort = 3000;
const listenHost = '0.0.0.0';
const apiHost = listenHost;
const webSocketConfig = {
    url: listenHost,
    port: 8181
}
const gameKeeper = new GameKeeper(logger, webSocketConfig);
const fastServe = async function (server: FastifyInstance, opts: FastifyServerOptions) {
    logger.info('exporting fastify routes and settings');
    server.register(
        require('fastify-cors'),
        {
             origin: (origin: string, cb: CallableFunction) => {
                const localhost: RegExp = new RegExp(/localhost|127\.0\.0\.1/);
                const localNetwork: RegExp = new RegExp(/192\.168\.178\.\d{1,3}/);
                logger.debug('Testing origin [' + origin + '] against [' + localhost + '|' + localNetwork + ']')
                if(
                    localhost.test(origin)
                    || localNetwork.test(origin)
                    || /.*/.test(origin)
                    ) {
                    logger.debug('origin valid');
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
        const gameState = gameKeeper.getCurrentGameState(params.gameNumber);
        return gameState;
    });

    server.get('/gameTypes', async (request, reply) => {
        const data: any = gameKeeper.getAvailableGameLayouts();
        return data;
    });

    server.get('/runningGames', async (request, reply) => {
        const data: any = gameKeeper.getCurrentlyRunningGames();
        return data;
    });

    server.get('/reveal/:userKey/:game/:column/:row', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        gameKeeper.revealCellForUserAndGame(params.userKey, params.game, params.column, params.row);
        return JSON.stringify({});
    });

    server.get('/revealSafe/:userKey/:game/:column/:row', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        gameKeeper.revealSafeCellsForUserAndGame(params.userKey, params.game, params.column, params.row);
        return JSON.stringify({});
    });

    server.get('/toggle/:userKey/:game/:column/:row', async (request, reply) => {
        const params = JSON.parse(JSON.stringify(request.params));
        gameKeeper.toggleCellForUserAndGame(params.userKey, params.game, params.column, params.row);
        return JSON.stringify({});
    });

    server.get('/resetGames', async (request, reply) => {
        gameKeeper.resetGames();
        const data = {message: "games reset"};
        return data;
    });

    server.get('*', async (request, reply) => {

        return '{"message": "Sorry mate - wrong extension"}';
    });

    server.listen(apiPort, apiHost)
        .then((address) => {
            logger.info('API server listening on [' + address + ']');
        })
        .catch((err) => {
            logger.error('Error starting server!!!');
    });
}
const server = fastify();
const opts: FastifyServerOptions = {
    ignoreTrailingSlash: true
}
fastServe(server, opts);