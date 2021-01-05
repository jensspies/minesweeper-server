import { Cell } from "../cell";

export class BombCell extends Cell {

    protected setIsBombField() {
         this._bombField = true;
    }
}