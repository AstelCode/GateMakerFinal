import { EntityView } from "@/engine/core";
import { IWireLogic } from "./IWireLogic";

export class WireView extends EntityView<IWireLogic> {
  protected _layer: number = 0;
  render(): void {
    const { path, thicknest } = this.logic;
    const r = this.context.renderer;

    r.strokeStyle("red");
    r.drawPath(path, thicknest, 24);
  }
}
