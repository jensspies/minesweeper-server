export abstract class Layout {
    private columns: number = -1;
    private rows: number = -1;
    private mineCount: number = -1;

    private fieldsMatrix: number = -1;
    private fieldsCells: number = -1;
    private fieldsDummy: number = -1;

    private dummyFields: any[] = [];

    constructor() {
        this.initializeLayout();
        this.defineDummyFields();
        this.dummyFields;
        this.fieldsMatrix = this.columns * this.rows;
        this.fieldsDummy = this.dummyFields.length;
        this.fieldsCells = this.fieldsMatrix - this.fieldsDummy;
    }

    public getNumberOfColumns(): number {
        return this.columns;
    }

    public getNumberOfRows(): number {
        return this.rows;
    }

    public getNumberOfMines(): number {
        return this.mineCount;
    }

    public getNumberOfDummyFields(): number {
        return this.fieldsDummy;
    }

    public getNumberOfMatrixFields(): number {
        return this.fieldsMatrix;
    }

    public getNumberOfCellFields(): number {
        return this.fieldsCells;
    }

    public getDummyFields(): any[] {
        return this.dummyFields;
    }

    protected initializeLayout(): void {
        this.setColumns(this.getColumnCount());
        this.setRows(this.getRowCount());
        this.setMineCount(this.getMineCount());
    }

    protected abstract getColumnCount(): number;
    protected abstract getRowCount(): number;
    protected abstract getMineCount(): number;

    public abstract getName(): string;
    public abstract getTechnicalName(): string;
    public abstract getDescription(): string;

    protected setColumns(columns: number): void {
        this.columns = columns;
    }

    protected setRows(rows: number): void {
        this.rows = rows;
    }

    protected setMineCount(mines: number): void {
        this.mineCount = mines;
    }

/**
 *  define an array of field indices, that shall be blocked for game cells
 *  this.dummyFields = [{x: 1, y: 1}];
 *
 */
    protected defineDummyFields(): void {
        this.dummyFields = [];
    }
}