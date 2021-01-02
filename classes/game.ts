import GameBoard from './board/gameBoard';
import { Layout } from './board/layout';
import { LoggedClass, LogLevel } from './loggedClass';
import { Cell } from './board/cell';

export class Game extends LoggedClass{

    private gameBoard: GameBoard;
    private state: any = null;
    private layout: Layout;
    private started: boolean = false;
    private ongoing: boolean = false;
    private gameOver: boolean = false;

    constructor(layout: Layout, logger: any) {
        super(logger);
        this.layout = layout;
        this.gameBoard = new GameBoard(layout);
    }

    public getLayout(): Layout {
        return this.gameBoard.getLayout();
    }

    public isOngoing(): boolean {
        return this.ongoing;
    }

    public getLayoutName() {
        return this.layout.getName();
    }

    public getLayoutDescription() {
        return this.layout.getDescription();
    }

    public getLayoutTechnicalName() {
        return this.layout.getTechnicalName();
    }

    public getBoardWidth():number {
        return this.layout.getNumberOfColumns();
    }

    public getBoardHeight():number {
        return this.layout.getNumberOfRows();
    }

    public getCurrentGameState(): Cell[] {
        const fieldState = [];
        for (let cellIndex = 0; cellIndex < this.layout.getNumberOfMatrixFields(); cellIndex++) {
            fieldState[cellIndex] = new Cell();
        }
        return fieldState;
    }

    public getGameOverviewObject() {
        const gameData: any = {};
        gameData['desc'] = this.getLayoutDescription();
        gameData['Name'] = this.getLayoutName();
        gameData['tachnicalName'] = this.getLayoutTechnicalName();
        return gameData;
    }
}