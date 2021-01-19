import { Layout } from "../layout";

export class Smiley extends Layout {

    public getDescription(): string {
        return 'Little smiley face on top :-)';
    }

    public getName(): string {
        return 'Smiley 1';
    }

    public getTechnicalName(): string {
        return 'smiley1';
    }

    protected getColumnCount() {
        return 12;
    }

    protected getRowCount() {
        return 12;
    }

    protected getMineCount() {
        return 13;
    }

    protected defineDummyFields(): void {
        this.dummyFields = [
            // left eye
            {column: 3, row: 2}
            , {column: 4, row: 2}
            , {column: 2, row: 3}
            // right eye
            , {column: 9, row: 2}
            , {column: 10, row: 2}
            , {column: 11, row: 3}
            // nose
            , {column: 6, row: 5}
            , {column: 6, row: 6}
            , {column: 7, row: 7}
            // mouth
            , {column: 4, row: 9}
            , {column: 5, row: 10}
            , {column: 6, row: 10}
            , {column: 7, row: 10}
            , {column: 8, row: 10}
            , {column: 9, row: 9}
        ];
    }
}