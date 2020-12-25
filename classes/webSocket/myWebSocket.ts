class myWebSocket {
    private webSocketLibrary = require('ws');
    private websocketServer;
    private clients: WebSocket[] = [];
    private ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    constructor() {
        this.websocketServer = new this.webSocketLibrary.Server({port: 8181, clientTracking: true});
        this._registerEvents();
    }

    public getClients() {
        return this.clients;
    }

    private _registerEvents(): void {
        const socketModule = this;
        this.websocketServer.addListener('connection', function (client: WebSocket) {
            const newConnectionid = socketModule._getRandomId();
            client.send('this could be an ID: ' + newConnectionid);
            socketModule.clients[newConnectionid] = client;
        });
        this.websocketServer.addListener('message', function(message: MessageEvent) {
            console.log(message);
        });
    }

    private _getRandomId() {
        let idString = '';
        let idPosition;
        for (idPosition = 0; idPosition < 6; idPosition++) {
            idString += this.ID_CHARACTERS[this._getRandomInt(this.ID_CHARACTERS.length)]
        }
        return idString;
    }
    
    private _getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}
export default myWebSocket;