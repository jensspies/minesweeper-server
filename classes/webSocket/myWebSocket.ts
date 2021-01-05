import { LoggedClass, LogLevel } from "../loggedClass";
import { Clients } from "./clients";

export class MyWebSocket extends LoggedClass {
    private webSocketLibrary = require('ws');
    private websocketServer;
    private host: string = 'localhost';
    private port = 8181;
    private clients: Clients;
    private debug: boolean = true;

    constructor(logger: any, webSocketUrl: string = '', port: number = 8181) {
        super(logger);
        if (webSocketUrl && webSocketUrl.length > 0) {
            this.host = webSocketUrl;
        }
        this.port = port;
        this.log('Opening websocket server on [' + this.host + '] port ' + this.port, LogLevel.debug);
        this.clients = new Clients(this.logger);
        this.websocketServer = new this.webSocketLibrary.Server({
            host: this.host,
            port: this.port,
            clientTracking: true
        });
        this._registerEvents();
    }

    public getClients() {
        return this.clients;
    }

    public sendUpdateToGroup(groupName: number, data: string|any) {
        const clients = this.clients.getClientsForGroup(groupName.toString());
        if ((typeof (data)) === 'string') {
            data = {message: data}
        }
        clients.forEach((client: WebSocket) => {
            try {
                client.send(JSON.stringify(data));
            } catch (exc) {
                this.log(exc, LogLevel.error);
            }
        });
    }

    public addClientToGroup(clientId: string, groupName: string) {
        this.clients.addClientToGroup(clientId, groupName);
    }

    private _registerEvents(): void {
        this._registerClientRegistrationEvent(this);
    }

    private _registerClientRegistrationEvent(socketConnection: MyWebSocket) {
        this.websocketServer.addListener('connection', function (client: WebSocket, request: any) {
            const clientId = socketConnection._getClientIdentifier(request);
            socketConnection.logger.info('Websocket user: [' + clientId + '] connected');
            const data = {welcome: clientId};
            client.send(JSON.stringify(data));

            socketConnection.clients.addClient(clientId, client);
            socketConnection.clients.addClientToGroup(clientId, 'all');

            client.addEventListener('close', function () {
                const clientId = socketConnection._getClientIdentifier(request);
                socketConnection.clients.removeClient(clientId);
            });
            client.addEventListener('message', function (event) {
                const clientId = socketConnection._getClientIdentifier(request);
                socketConnection.logger.debug('user: [' + clientId + '] sent a message ' + event.data);
            });
        });
    }

    private _getClientIdentifier(request: any): string {
        return request.headers['sec-websocket-key'].replace("/", "").replace("+", "");
    }

    checkIfUserIsConnected(userKey: string): boolean {
        return this.clients.userExists(userKey);
    }
}
export default MyWebSocket;