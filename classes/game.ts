import { DummyField, Layout } from './board/layout';
import { LoggedClass, LogLevel } from './loggedClass';
import { Cell } from './board/cell';
import { DummyCell } from './board/cells/dummyCell';
import { RegularCell } from './board/cells/regularCell';
import { BombCell } from './board/cells/bombCell';
import { CellStatus, CellMark } from './board/cellStatus';

export class Game extends LoggedClass{
    private gameBoardCells: Array<Cell> = [];
    private userKey: string = '';
    private gameId: number = -1;
    private layout: Layout;
    private started: boolean = false;
    private ongoing: boolean = false;
    private gameOver: boolean = false;
    private indexOffset: number = 1;
    private fieldsToReveal: number;
    private fieldNeighbours: Array<Array<Cell>> = [];
    private clientGameState: Array<CellStatus> = [];

    constructor(layout: Layout, userKey: string, gameId: number, logger: any) {
        super(logger);
        this.layout = layout;
        this.userKey = userKey;
        this.gameId = gameId;
        this._generateInitialLayout();
        this.fieldsToReveal = this.layout.getNumberOfCellFields() - this.layout.getNumberOfMines();
    }

    public revealCell(column: number, row: number) {
        column = parseInt(column.toString());
        row = parseInt(row.toString());
        this.log('Revealing Cell [' + column + ', ' + row + '] for game ' + this.gameId, LogLevel.info);
        if (this.started === false) {
            this.log('first cell reveal: generating bombs around revealed cell', LogLevel.debug);
            this._generateGameboard(column, row);
            this._startGame();
        }

        const revealPostition: number = this.getArrayPositionOfCell(column, row);
        this._revealCell(revealPostition);
        if (this.fieldsToReveal === 0) {
            this._setWinState();
        }
        this.log('cell has been revealed', LogLevel.info);
    }

    private _revealCell(revealPostition:number) {
        const cell: Cell = this.gameBoardCells[revealPostition];
        const cellCanNotBeOpened = (this._cellCanBeOpened(cell) === false);
        if (cellCanNotBeOpened || this.isOngoing() === false || this.isGameOver() === true) {
            return;
        }

        if (cell.isBomb()) {
            this._setGameOver();
            return;
        }


        cell.setRevealed();
        const bombCount = this._getBombNeighboursCount(revealPostition);
        this.clientGameState[revealPostition].setRevealed(bombCount);

        if (bombCount === 0) {
            this.revealNeighbours(cell);
        }
        this.fieldsToReveal--;
    }

    public revealSafeCells(column: any, row: any) {
        column = parseInt(column.toString());
        row = parseInt(row.toString());
        this.log('Revealing safe cells for [' + column + ', ' + row + '] for game ' + this.gameId, LogLevel.info);
        const revealPostition: number = this.getArrayPositionOfCell(column, row);

        const cell: Cell = this.gameBoardCells[revealPostition];

        const cellCanNotBeOpened = (this._isCellSafeAround(cell) === false);
        if (cellCanNotBeOpened || this.isOngoing() === false || this.isGameOver() === true) {
            this.log('not possible to reveal safe!', LogLevel.debug);
            return;
        }
        this.log('Revealing safe Neighbours', LogLevel.debug);
        this.revealNeighbours(cell);
        if (this.fieldsToReveal === 0) {
            this._setWinState();
        }
    }

    private revealNeighbours(cell: Cell): void {
        this.fieldNeighbours[cell.getIndex()].forEach((element: Cell) => {
            this._revealCell(element.getIndex())
        });
    }

    public toggleCell(column: number, row: number) {
        column = parseInt(column.toString());
        row = parseInt(row.toString());
        this.log('Toggeling Cell [' + column + ', ' + row + '] for game ' + this.gameId, LogLevel.info);
        if (this.isGameOver() || !this.started) {
            return;
        }

        const togglePostition: number = this.getArrayPositionOfCell(column, row);
        this.gameBoardCells[togglePostition].toggleMarker();
        this.clientGameState[togglePostition].toggleMark();
    }

    private _setWinState() {
        this.ongoing = false;
    }

    private _getBombNeighboursCount(revealPostition: number): number {
        let bombCount = 0;
        this.fieldNeighbours[revealPostition].forEach((cell: Cell) => {
            if (cell.isBomb()) {
                bombCount++;
            }
        })
        return bombCount;
    }

    private _revealBombsToClient() {
        const cellIds: number[] = [];

        const bombs = this.gameBoardCells.filter((cell, index) => {
            const isBomb = cell.isBomb();
            if (isBomb) {
                cellIds.push(index);
                cell.setRevealed();
            }
            return isBomb;
        });

        cellIds.forEach((index) => {
            this.clientGameState[index].setRevealed(-2, true);
        });
    }

    private _cellCanBeOpened(cell: Cell): boolean {
        const isNotADummy = (cell.isDummy() === false);
        const isNotMarkedAsBomb = (cell.isMarkedAsBomb() === false);
        const isNotAlreadyRevealed = (cell.isRevealed() === false);
        return isNotADummy && isNotMarkedAsBomb && isNotAlreadyRevealed;
    }

    private _isCellSafeAround(cell: Cell): boolean {
        const isNotADummy = (cell.isDummy() === false);
        const isRevealed = (cell.isRevealed() === true);
        const bombCount = this._getBombNeighboursCount(cell.getIndex());
        const hasAtLeastOneBomb = (bombCount > 0);
        const markedBombCount = this._getMarkedUnsafeNeighboursCount(cell.getIndex());
        const hasExactlyBombCountMarkedNeighbours = (bombCount === markedBombCount);

        const isSafeToOpenNeighbours = isNotADummy
                                    && isRevealed
                                    && hasAtLeastOneBomb
                                    && hasExactlyBombCountMarkedNeighbours;
        if (!isSafeToOpenNeighbours) {
            this.log(
                'Dummy: ' + isNotADummy +
                ' - Revealed: ' + isRevealed +
                ' - bombCount: ' + bombCount +
                ' - atLeastOne: ' + hasAtLeastOneBomb +
                ' - markedBombs: ' + markedBombCount,
                LogLevel.debug
            );
        }
        return isSafeToOpenNeighbours;
    }

    private _getMarkedUnsafeNeighboursCount(revealPostition: number): number {
        let bombMarkedCount = 0;
        this.fieldNeighbours[revealPostition].forEach((cell: Cell) => {
            if (cell.isMarkedAsBomb() === true) {
                bombMarkedCount++;
            }
        })
        return bombMarkedCount;
    }

    public getLayout(): Layout {
        return this.layout;
    }

    public getUserKey(): string {
        return this.userKey;
    }

    public getGameId(): number {
        return this.gameId;
    }

    public isOngoing(): boolean {
        return this.ongoing;
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public getLayoutName(): string {
        return this.layout.getName();
    }

    public getLayoutDescription(): string {
        return this.layout.getDescription();
    }

    public getLayoutTechnicalName(): string {
        return this.layout.getTechnicalName();
    }

    public getBoardWidth():number {
        return this.layout.getNumberOfColumns();
    }

    public getBoardHeight():number {
        return this.layout.getNumberOfRows();
    }

    public getCurrentCellStates(): CellStatus[] {
        return this.clientGameState;
    }

    public getCurrentGameState(): any {
        let returnValue: any = '';
        switch (true) {
            case (this.started === false):
                returnValue = 'PendingStart';
                break;
            case (this.gameOver):
                returnValue = 'GameOver';
                break;
            case (this.started && this.ongoing === false && this.fieldsToReveal === 0):
                returnValue = 'Won';
                break;
            case (this.started):
                returnValue = 'Started';
                break;
        }
        return returnValue;
    }

    public getGameOverviewObject(): any {
        const gameData: any = {};
        gameData['desc'] = this.getLayoutDescription();
        gameData['Name'] = this.getLayoutName();
        gameData['tachnicalName'] = this.getLayoutTechnicalName();
        gameData['gameId'] = this.getGameId();
        return gameData;
    }

    private _startGame(): void {
        this.started = true;
        this.ongoing = true;
    }

    private _setGameOver(): void {
        this._revealBombsToClient();
        this.ongoing = false;
        this.gameOver = true;
    }

    /**
     * after first cellis clicked, this one needs to be a regular cell and bombs need to be distributed
     */
    private _generateGameboard(column: number, row: number): void {
        const clickedCell = this.getArrayPositionOfCell(column, row);

        let bombsToDistribute = this.layout.getNumberOfMines();
        const totalBombableCells = this.layout.getNumberOfCellFields();
        const fieldBigEnough = totalBombableCells > bombsToDistribute;
        while (fieldBigEnough && bombsToDistribute > 0 ) {
            const possibleNextBombIndex = this.getIndexOfNextBomb();

            const isNotClickedCell = possibleNextBombIndex !== clickedCell;
            const isValidCell = this.gameBoardCells[possibleNextBombIndex].isRegularCell();
            if(isNotClickedCell && isValidCell) {
                this.gameBoardCells[possibleNextBombIndex] = new BombCell(possibleNextBombIndex);
                bombsToDistribute--;
            }
        }
        for (let cellIndex = 0; cellIndex < this.layout.getNumberOfMatrixFields(); cellIndex++) {
            this.fieldNeighbours[cellIndex] = this._calculateNeighbours(cellIndex);
        }

    }

    private getIndexOfNextBomb() {
        return Math.floor(Math.random() * this.layout.getNumberOfMatrixFields());
    }

    /**
     * generate an array of cells that do not yet contain bombs but the dummy fields
     */
    private _generateInitialLayout(): void {
        // Generate gameboard without a bomb on given field
        const dummyField: Array<DummyField> = this.layout.getDummyFields();
        this.log('creating dummy fields', LogLevel.debug);
        dummyField.forEach((coord: DummyField) => {
            const position = this.getArrayPositionOfCell(coord.column, coord.row);
            this.gameBoardCells[position] = new DummyCell(position);
            this.clientGameState[position] = new CellStatus(this.getRowAndColumnFromArrayIndex(position), true);
        });

        for (let cellIndex = 0; cellIndex < this.layout.getNumberOfMatrixFields(); cellIndex++) {
            if (!this.gameBoardCells[cellIndex]) {
                this.gameBoardCells[cellIndex] = new RegularCell(cellIndex);
                this.clientGameState[cellIndex] = new CellStatus(this.getRowAndColumnFromArrayIndex(cellIndex), false);
            }
        }
    }

    private getArrayPositionOfCell(column: number, row: number) {
        column = parseInt(column.toString());
        row = parseInt(row.toString());
        const position: number = (this.layout.getNumberOfColumns() * (row - 1)) + column - this.indexOffset;
        return position;
    }

    private getRowAndColumnFromArrayIndex(index: number): any {
        const row = Math.floor(index / this.layout.getNumberOfColumns()) + 1;
        const column = (index % this.layout.getNumberOfColumns()) + this.indexOffset;
        const position = {column, row};
        return position;
    }

    public _calculateNeighbours(cellIndex: number): Array<Cell> {
        const neighbours: Array<Cell> = [];
        const cellId = cellIndex;
        const fieldWidth = this.layout.getNumberOfColumns();
        const fieldHeight = this.layout.getNumberOfRows();
        const isLeftEdge = cellId % fieldWidth === 0;
        const isTopEdge = cellId - fieldWidth < 0;
        const isRightEdge = cellId % fieldWidth === fieldWidth - 1;
        const isBottomEdge = cellId + fieldWidth > fieldWidth * fieldHeight - this.indexOffset;

        if (!isTopEdge && !isLeftEdge) {
            neighbours.push(this._getCell(cellId - fieldWidth - 1));
        }
        if (!isTopEdge) {
            neighbours.push(this._getCell(cellId - fieldWidth));
        }
        if (!isTopEdge && !isRightEdge) {
            neighbours.push(this._getCell(cellId - fieldWidth + 1));
        }
        if (!isLeftEdge) {
            neighbours.push(this._getCell(cellId - 1));
        }
        if (!isRightEdge) {
            neighbours.push(this._getCell(cellId + 1));
        }
        if (!isBottomEdge && !isLeftEdge) {
            neighbours.push(this._getCell(cellId + fieldWidth - 1));
        }
        if (!isBottomEdge) {
            neighbours.push(this._getCell(cellId + fieldWidth));
        }
        if (!isBottomEdge && !isRightEdge) {
            neighbours.push(this._getCell(cellId + fieldWidth + 1));
        }
        return neighbours;
    }

    private _getCell(index: number): Cell {
        return this.gameBoardCells[index];
    }

}