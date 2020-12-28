import GameBoard from './board/gameBoard';
import { availableLayouts } from './board/availableLayouts';
import { Layout } from './board/layout';
import { LoggedClass, LogLevel } from './loggedClass';

export class Game extends LoggedClass{

    private gameBoard: GameBoard;
    constructor(layout: Layout, logger: any) {
        super(logger);
        this.gameBoard = new GameBoard(layout);
    }

    public getLayout(): Layout {
        return this.gameBoard.getLayout();
    }
}