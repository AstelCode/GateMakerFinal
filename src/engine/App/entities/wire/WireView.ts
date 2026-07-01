import { EntityView } from "@/engine/core";
import { IWireView } from "./IWireView";

export class WireView extends EntityView<IWireView> {
  protected _layer: number = 0;
  render(): void {
    const { path, thicknest } = this.data;
    const r = this.context.renderer;

    r.strokeStyle("red");
    r.drawPath(path, thicknest, 24);

    debugger;
    for (let i = 1; i < path.length - 1; i++) {
      r.fillStyle("gray");
      r.fillRect(
        path[i].x - thicknest / 2 - 5,
        path[i].y - thicknest / 2 - 5,
        thicknest + 10,
        thicknest + 10,
        8
      );
    }
  }
}
