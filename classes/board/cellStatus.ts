export enum CellMark {
    None = 0,
    MarkedUnsafe,
    MarkedUnsure
}

export class CellStatus {
    private isRevealed: boolean = false;
    private exploded: boolean = false;
    private isDummy: boolean = false;
    private mark: CellMark = CellMark.None;
    private bombNeighbours: number = -1;

    constructor(isDummy: boolean) {
        this.isDummy = isDummy;
    }

    public setMarked(mark: CellMark) {
        this.mark = mark;
    }

    public setRevealed(bombNeighbours: number, exploded: boolean = false) {
        this.isRevealed = true;
        this.exploded = exploded;
        this.bombNeighbours = bombNeighbours;
    }
}