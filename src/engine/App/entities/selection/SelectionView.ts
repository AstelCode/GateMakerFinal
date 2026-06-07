import { EntityView } from "@/engine/core";
import { ISelectionView } from "./ISelectionView";

export class SelectionView extends EntityView<ISelectionView> {
  render(): void {
    const { bounds, color } = this.data;

    const r = this._context.renderer;

    r.save();
    r.begin();
    r.strokeStyle("rgb(5, 247, 255)", 4);
    r.fillStyle(color);
    r.rect(
      bounds.position.x - bounds.width / 2,
      bounds.position.y - bounds.height / 2,
      bounds.width,
      bounds.height,
    );
    r.stroke();
    r.fill();
    r.restore();
  }
}
