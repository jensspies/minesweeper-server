import { FullMatrix } from "./fullMatrix";

export class FullExpert extends FullMatrix {

    public getName(): string {
        return 'Expert';
    }

    public getTechnicalName(): string {
        return 'fullMatrixExpert';
    }

    protected getColumnCount() {
        return 30;
    }

    protected getRowCount() {
        return 16;
    }

    protected getMineCount() {
        return 99;
    }
}