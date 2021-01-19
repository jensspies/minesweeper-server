import { LoggedClass, LogLevel } from "../loggedClass";

export class Clients extends LoggedClass {
    private clients: any = {};
    private groupsByObject: any = {};
    private groupsById: any = {};
    private clientGroupSubscriptions: any = {};

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

            const currentSubs = this.clientGroupSubscriptions[clientId] || [];
            currentSubs.push(groupName);
            this.clientGroupSubscriptions[clientId] = currentSubs;
        }
    }

    public getClient(userKey: string): any {
        return this.clients[userKey];
    }

    public getClientsForGroup(groupName: string): WebSocket[] {
        const clients = this.groupsByObject[groupName] || [];
        return clients;
    }

    public removeClient(id: string) {
        this.log('user: [' + id + '] disconnected and removed from list', LogLevel.debug);
        this._removeFromGroups(id);
        this._removeFromGlobalClientList(id);
    }

    private _removeFromGlobalClientList(id: string) {
        this.clients.id = null;
    }

    private _removeFromGroups(id: string) {
        const groupSubscriptions = this.clientGroupSubscriptions[id];
        groupSubscriptions.forEach((groupId: string) => {
            const clientObject = this.clients[id];
            const objIndex = this.groupsByObject[groupId].indexOf(clientObject);
            this.groupsByObject[groupId].splice(objIndex,1);
            const idIndex = this.groupsById[groupId].indexOf(id);
            this.groupsById[groupId].splice(idIndex,1);
        });
    }

    public userExists(id: string): boolean {
        // TODO: implement user Check
        return true;
    }
}
export default Clients;