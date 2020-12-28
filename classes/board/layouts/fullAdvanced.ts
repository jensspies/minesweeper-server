import { FullMatrix } from "./fullMatrix";

export class FullAdvanced extends FullMatrix {

    public getName(): string {
        return 'Advanced';
    }

    public getTechnicalName(): string {
        return 'fullMatrixAdvanced';
    }

    protected getColumnCount() {
        return 16;
    }

    protected getRowCount() {
        return 16;
    }
    
    protected getMineCount() {
        return 40;
    }
}