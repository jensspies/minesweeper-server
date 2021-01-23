export enum MessageType {
    WelcomeMessage = 'WelcomeMessage'
    , ChatMessage = 'ChatMessage'
    , GameTypes = 'GameTypes'
    , GameId = 'GameId'
    , GameStatus = 'GameStatus'
    , OpenGames = 'OpenGames'
}

import { Layout } from './board/layout';
import { availableLayouts } from './board/availableLayouts';
import { Game } from './game';
import { MyWebSocket } from './webSocket/myWebSocket';
import { LogLevel, LoggedClass} from './loggedClass';

export class GameKeeper extends LoggedClass{
    private games: Game[] = [];

    private myWebSocket: MyWebSocket;
    constructor(logger: any, webSocketOptions: any = {}) {
        super(logger);
        const options = Object.assign(this.getDefaultWebsocketOptions(), webSocketOptions);
        this.myWebSocket = new MyWebSocket(logger, options.url, options.port);
    }

    private getDefaultWebsocketOptions(): any {
        return {
            url: 'localhost',
            port: 8181
        }
    }

    public getAvailableGameLayouts(): any {
        const gameTypes: any[] = [];
        this.log('formating available layouts for API', LogLevel.info);
        for (const key in availableLayouts) {
            const entry: any = {}
            if (Object.prototype.hasOwnProperty.call(availableLayouts, key)) {
                const layout: Layout = availableLayouts[key];
                entry['technicalName'] = key;
                entry['name'] = layout.getName();
                entry['description'] = layout.getDescription();
            }
            gameTypes.push(entry);
        }
        const data = {type: MessageType.GameTypes, data: gameTypes}
        return data;
    }

    public getCurrentGameState(gameId: number): void {
        const askedGame = this.games[gameId];
        const data: any = {};
        if (askedGame) {
            this.log('Updating game [' + gameId + '] for registered users', LogLevel.info);
            data.timestamp = Date.now();
            data.gameId = gameId;
            data.type = MessageType.GameStatus;
            data.width = askedGame.getBoardWidth();
            data.height = askedGame.getBoardHeight();
            data.gameState = askedGame.getCurrentGameState();
            data.isOver = !askedGame.isOngoing() && data.gameState !== 'PendingStart';
            data.currentState = askedGame.getCurrentCellStates();
            data.markedBombs = askedGame.getMarkedBombCount();
            data.totalBombCount = askedGame.getLayout().getNumberOfMines();
        } else {
            this.log('Game [' + gameId + '] does not exist', LogLevel.debug);
            data.message = "Game does not exist";
        }
        return data;
    }

    public startNewGame(userKey: string, gameType: string): any {
        this.log('user [' + userKey + '] wants to create gameType [' + gameType + ']', LogLevel.debug);

        if (availableLayouts[gameType] === undefined) {
            this.log('user [' + userKey + '] wanted to create non existing gameType [' + gameType + ']', LogLevel.warn);
            throw new Error('unsupported gameType');
        }
        const layout = availableLayouts[gameType];

        // if (gameAlreadyExistsForUser) {
        // logger.debug('user [' + user + '] has pending open games');
        // Maybe automatically close open games and start the new one
        //}
        const newGameId = this.games.length;
        const gameCreated = new Game(layout, userKey, newGameId, this.logger);

        gameCreated.gameFinished().subscribe(() => {
            this.sendOpenGamesToClients(this.getCurrentlyRunningGames());
        });
        gameCreated.gameStarted().subscribe(() => {
            this.sendOpenGamesToClients(this.getCurrentlyRunningGames());
        });
        this.games[newGameId] = gameCreated;

        const desc = layout.getDescription();

        this.myWebSocket.addClientToGroup(userKey, '' + newGameId);
        const returnValue = '{"gameId": "' + newGameId + '", "description": "' + desc + '"}';
        this.log('game created: ' + returnValue, LogLevel.info);
        const gameState = this.getCurrentGameState(newGameId);
        this.myWebSocket.sendUpdateToGroup(newGameId, gameState);

        return gameState;
    }

    subscribeToGameRequest(userKey: any, gameId: any): any {
        this.log('User [' + userKey + '] requests to observe game #' + gameId, LogLevel.info);
        const userExists = this.myWebSocket.checkIfUserIsConnected(userKey);
        const gameStillRunning = this.games[gameId]?.isOngoing();
        const subscriptionPossible = (userExists &&  gameStillRunning);
        if (subscriptionPossible) {
            this.myWebSocket.addClientToGroup(userKey, gameId);
        } else {
            let result = 'Subscrition not possible: ';
            result += ((userExists) ? '' : "\n User " + userKey + ' is not connected!');
            result += ((gameStillRunning) ? '' : "\n Game #" + gameId + ' is already finished or doesn\'t exist!');
            this.log(result, LogLevel.info);
            throw new Error(result);
        }
        const gameState = this.getCurrentGameState(gameId);
        this.myWebSocket.sendUpdateToUser(userKey, gameState);
        return gameState;
    }

    public revealCellForUserAndGame(userKey: any, gameId: number, column: any, row: any) {
        const game = this.games[gameId];
        if (game && this.isUserAllowedForAction(game, userKey)) {
            game.revealCell(column, row);
            const gameState = this.getCurrentGameState(gameId);
            this.myWebSocket.sendUpdateToGroup(gameId, gameState);
        }
    }

    public revealSafeCellsForUserAndGame(userKey: any, gameId: any, column: any, row: any) {
        const game = this.games[gameId];
        if (game && this.isUserAllowedForAction(game, userKey)) {
            game.revealSafeCells(column, row);
            const gameState = this.getCurrentGameState(gameId);
            this.myWebSocket.sendUpdateToGroup(gameId, gameState);
        }
    }

    public toggleCellForUserAndGame(userKey: string, gameId: number, column: number, row: number) {
        const game = this.games[gameId];

        if (game && this.isUserAllowedForAction(game, userKey)) {
            game.toggleCell(column, row);
            const gameState = this.getCurrentGameState(gameId);
            this.myWebSocket.sendUpdateToGroup(gameId, gameState);
        }
    }

    private isUserAllowedForAction(game: Game, userKey: string): boolean {
        this.log('userKey game: ' + game.getUserKey() + ' # provided: ' + userKey, LogLevel.debug);
        return game && game.getUserKey() === userKey;
    }

    public getCurrentlyRunningGames(): any {
        const runningGames: Game[] = this._filterGamesForRunningOnes();
        const formattedGames: any[] = [];
        runningGames.forEach((game, index) => {
            const gameData: any = {};
            Object.assign(gameData, game.getGameOverviewObject());
            formattedGames.push(gameData);
        });
        const data = {type: MessageType.OpenGames, data: formattedGames};
        return data;
    }

    private sendOpenGamesToClients(data: any) {
        this.myWebSocket.sendUpdateToAll(data);
    }

    private _filterGamesForRunningOnes(): Game[] {
        const runningGames: Game[] = [];
        this.games.forEach((game, index) => {
            if (game.isOngoing()) {
                runningGames[index] = game;
            }
        });
        return runningGames
    }

    public resetGames() {
        this.games = [];
        this.sendOpenGamesToClients(this.getCurrentlyRunningGames());
        this.log('## Game memory has been cleared', LogLevel.info);
    }
}