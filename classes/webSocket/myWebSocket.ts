import Clients from "./clients";

class MyWebSocket {
    private webSocketLibrary = require('ws');
    private websocketServer;
    private clients: Clients = new Clients();
    private debug: boolean = true;

    constructor() {
        this.websocketServer = new this.webSocketLibrary.Server({port: 8181, clientTracking: true});
        this._registerEvents();
    }

    public getClients() {
        return this.clients;
    }

    public sendUpdateToGroup(groupName: string, data: string|any) {
        const clients = this.clients.getClientsForGroup(groupName);
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
            const clientId = socketConnection._getClientIdentifier(request);
            const data = {welcome: clientId};
            client.send(JSON.stringify(data));
            
            socketConnection.clients.addClient(clientId, client);
            socketConnection.clients.addClientToGroup(clientId, 'all');

            client.addEventListener('close', function () {
                const clientId = socketConnection._getClientIdentifier(request);
                socketConnection.clients.removeClient(clientId);
            })
            client.addEventListener('message', function (event) {
                const clientId = socketConnection._getClientIdentifier(request);
            })
        });
    }

    private _getClientIdentifier(request: any): string {
        return request.headers['sec-websocket-key'];
    }
    
    private devLog(msg: string) {
        if (this.debug === true) {
            console.log(msg);
        }
    }
}
export default MyWebSocket;