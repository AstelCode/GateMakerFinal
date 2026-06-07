import { Entity, V2 } from "@/engine/core";
import { SelectionView } from "./SelectionView";
import { ISelectionView } from "./ISelectionView";

export class Selection extends Entity implements ISelectionView {
  start: V2;
  end: V2;
  color: string;
  constructor(public entity?: Entity) {
    super();
    this.start = new V2();
    this.end = new V2();
    this.type = "SELECTION";
    this.dragable = !!entity;
    this.color = "#7dcfff6e";
    if (entity) {
      this.bounds = entity.bounds;
    }

    this.view = new SelectionView(this);
    this.layer = 2;
  }

  ready(): void {
    if (!this.entity) {
      this._context.tree.registerEntity("SELECTION", this);
    }
  }

  on_start(v: V2) {
    this.end.copy(v);
    this.start.copy(v);
    this.bounds.fromPoints(this.start, this.end);
  }

  on_end(v: V2) {
    this.end.copy(v);
    this.bounds.fromPoints(this.start, this.end);
  }
}
