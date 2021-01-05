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
        console.log('DEFINING DUMMY FIELDS!')
        this.dummyFields = [{column: 2, row: 1}, {column: 2, row: 3}];
    }
}