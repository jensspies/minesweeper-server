import { LoggedClass, LogLevel } from "../loggedClass";

export class Clients extends LoggedClass {
    private clients: any = {};
    private groupsByObject: any = {};
    private groupsById: any = {};

    constructor(logger: any) {
        super(logger);
    }

    public addClient(id: string, client: WebSocket): boolean {
        if (!this.clients.id) {
            this.clients[id] = client;
            this.log('added user: [' + id + '] to client list', LogLevel.debug);
        } else {
            return false;
        }
        return true;
    }

    private registerGroup(name: string) {
        if (!this.groupsByObject[name]) {
            this.groupsByObject[name] = [];
        }
        if (!this.groupsById[name]) {
            this.groupsById[name] = [];
        }
    }

    public addClientToGroup(clientId: string, groupName: string) {
        this.registerGroup(groupName);
        const clientIsNotYetInList = (this.groupsById[groupName].indexOf(clientId) < 0);
        if (clientIsNotYetInList) {
            this.log('added user: [' + clientId + '] to client group "' + groupName + '"', LogLevel.debug);
            this.groupsById[groupName].push(clientId);
            this.groupsByObject[groupName].push(this.clients[clientId]);
        }
    }

    public getClientsForGroup(groupName: string): WebSocket[] {
        const clients = this.groupsByObject[groupName] || [];
        return clients;
    }

    public removeClient(id: string) {
        this.log('user: [' + id + '] disconnected and removed from list', LogLevel.debug);
        this.clients.id = null;
    }
}
export default Clients;