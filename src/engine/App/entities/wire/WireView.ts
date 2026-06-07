import { EntityView } from "@/engine/core";
import { IWireView } from "./IWireView";

export class WireView extends EntityView<IWireView> {
  protected _layer: number = 0;
  render(): void {
    const { path, thicknest } = this.data;
    const r = this.context.renderer;

    r.strokeStyle("red");
    r.drawPath(path, thicknest, 24);
  }
}
