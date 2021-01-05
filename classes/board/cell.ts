export class Cell {
    protected _dummyField: boolean = false;
    protected _bombField: boolean = false;
    protected _isMarkedAsBomb: boolean = false;
    protected _isMarkedAsPossibleBomb: boolean = false;
    protected _isRevealed: boolean = false;

    constructor(id: number) {
        this.setIsDummyField();
        this.setIsBombField();
    }

    public isBomb(): boolean {
        return this._bombField;
    }

    public isDummy(): boolean {
        return this._dummyField;
    }

    public isRegularCell(): boolean {
        return !this.isDummy() && !this.isBomb();
    }

    public isMarkedAsBomb(): boolean {
        return this._isMarkedAsBomb;
    }

    public isMarkedAsPossibleBomb(): boolean {
        return this._isMarkedAsPossibleBomb;
    }

    public isRevealed(): boolean {
        return this._isRevealed;
    }

    protected setIsDummyField() {
        this._dummyField = false;
    }

    protected setIsBombField() {
         this._bombField = false;
    }

    public setRevealed() {
        this._isRevealed = true;
    }

    public resetMark() {
        this._isMarkedAsBomb = false;
        this._isMarkedAsPossibleBomb = false;
    }

    public setIsMarkedAsBomb() {
        this.resetMark();
        this._isMarkedAsBomb = true;
    }

    protected setIsMarkedAsPossibleBomb() {
        this.resetMark();
        this._isMarkedAsPossibleBomb = true;
    }
}