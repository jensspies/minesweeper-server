import { FullMatrix } from "./fullMatrix";

export class FullBeginner extends FullMatrix {

    public getName(): string {
        return 'Beginner';
    }

    public getTechnicalName(): string {
        return 'fullMatrixBeginner';
    }

    protected getColumnCount() {
        return 8;
    }

    protected getRowCount() {
        return 8;
    }
    
    protected getMineCount() {
        return 10;
    }
}