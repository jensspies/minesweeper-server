class Clients {
    private clients: any = {};
    private groupsByObject: any = {};
    private groupsById: any = {};

    constructor() {
    }

    public addClient(id: string, client: WebSocket): boolean {
        if (!this.clients.id) {
            this.clients[id] = client;
        } else {
            return false;
        }
        console.log('connection established for [' + id + ']');
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
            this.groupsById[groupName].push(clientId);
            this.groupsByObject[groupName].push(this.clients[clientId]);
        }
    }

    public getClientsForGroup(groupName: string): WebSocket[] {
        return this.groupsByObject[groupName];
    }

    public removeClient(id: string) {
        this.clients.id = null;
        console.log('client [' + id + '] disconnected');
    }
}
export default Clients;