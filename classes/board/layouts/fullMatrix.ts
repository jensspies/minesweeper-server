import { Layout } from "../layout";

export abstract class FullMatrix extends Layout {
    
    public getDescription(): string {
        const description = 'Basic setup for ' + this.getName() + ' players [' + 
            this.getColumnCount() + 'x' +
            this.getRowCount() + '] -> ' +
            this.getMineCount() + ' mines';
        return description;
    }
}
