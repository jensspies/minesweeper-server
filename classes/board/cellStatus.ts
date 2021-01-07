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
    private coord: any;
    private bombNeighbours: number = -1;

    constructor(coordinates: any, isDummy: boolean) {
        this.isDummy = isDummy;
        this.coord = coordinates;
    }

    private setMarked(mark: CellMark) {
        this.mark = mark;
    }

    public toggleMark() {
        let newMark: CellMark;
        switch (this.mark) {
            case CellMark.MarkedUnsafe:
                newMark = CellMark.MarkedUnsure;
                break;
            case CellMark.MarkedUnsure:
                newMark = CellMark.None
                break;
            default: newMark = CellMark.MarkedUnsafe;
        }
        this.setMarked(newMark);
    }

    public setRevealed(bombNeighbours: number, exploded: boolean = false) {
        this.isRevealed = true;
        this.exploded = exploded;
        this.bombNeighbours = bombNeighbours;
    }
}