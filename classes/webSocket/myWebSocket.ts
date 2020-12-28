import { LoggedClass, LogLevel } from "../loggedClass";
import { Clients } from "./clients";

export class MyWebSocket extends LoggedClass {
    private webSocketLibrary = require('ws');
    private websocketServer;
    private port = 8181;
    private clients: Clients;
    private debug: boolean = true;

    constructor(logger: any) {
        super(logger);
        this.log('Opening websocket server on port ' + this.port, LogLevel.debug);
        this.clients = new Clients(this.logger);
        this.websocketServer = new this.webSocketLibrary.Server({port: this.port, clientTracking: true});
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
                console.log(exc);
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
            const clientId = socketConnection._getClientIdentifier(request).replace("/", "");
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
        return request.headers['sec-websocket-key'];
    }
}
export default MyWebSocket;