import { Layout } from "./layout";

class GameBoard {
    private layout: Layout;

    constructor(layout: Layout) {
        this.layout = layout;
    }

    public getLayout(): Layout {
        return this.layout;
    }

}
export default GameBoard;