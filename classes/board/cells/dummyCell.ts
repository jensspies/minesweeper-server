import { Cell } from "../cell";

export class DummyCell extends Cell {

    protected setIsDummyField() {
        this._dummyField = true;
    }

}