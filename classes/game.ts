import GameBoard from './board/gameBoard';
import { availableLayouts } from './board/availableLayouts';
import { Layout } from './board/layout';
import { LoggedClass, LogLevel } from './loggedClass';

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

    public getGameOverviewObject() {
        const gameData: any = {};
        gameData['desc'] = this.getLayoutDescription();
        gameData['Name'] = this.getLayoutName();
        gameData['tachnicalName'] = this.getLayoutTechnicalName();
        return gameData;
    }
}