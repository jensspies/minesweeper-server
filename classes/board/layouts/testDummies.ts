import { Layout } from "../layout";

export class TestDummies extends Layout {

    public getDescription(): string {
        return 'simple setup for a gameboard having dummy cells';
    }

    public getName(): string {
        return 'TestDummis';
    }

    public getTechnicalName(): string {
        return 'dummiesTest';
    }

    protected getColumnCount() {
        return 8;
    }

    protected getRowCount() {
        return 8;
    }

    protected getMineCount() {
        return 8;
    }

    protected defineDummyFields(): void {
        this.dummyFields = [
            {column: 3, row: 2}
            , {column: 6, row: 2}
            , {column: 2, row: 3}
            , {column: 7, row: 3}
            , {column: 2, row: 6}
            , {column: 7, row: 6}
            , {column: 3, row: 7}
            , {column: 6, row: 7}
        ];
    }
}