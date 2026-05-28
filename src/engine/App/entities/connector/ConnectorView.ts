import { EntityView } from "@/engine/core";
import { IConnectorLogic } from "./IConnectorLogic";
import { CONECTOR_SIZE, GRID_DOT_RADIUS } from "../../constants";

export class ConnectorView extends EntityView<IConnectorLogic> {
  public color: string = "";

  render(): void {
    const { transform, name } = this.logic;
    const r = this.context.renderer;
    r.save();
    r.transform(transform);
    r.fill(this.color);
    r.fillRectCenter(CONECTOR_SIZE, CONECTOR_SIZE, GRID_DOT_RADIUS);

    r.fillTextCenter(name, CONECTOR_SIZE + 10, 0, "18px Orbitron");

    r.restore();
  }
}
