import { EntityView } from "@/engine/core";
import { IConnectorLogic } from "./IConnectorLogic";
import { CONECTOR_SIZE, GRID_DOT_RADIUS } from "../../constants";
import { Direction } from "../NodeBase/NodeBase";

export class ConnectorView extends EntityView<IConnectorLogic> {
  public color: string = "";

  render(): void {
    const { transform, name, direction } = this.logic;
    const r = this.context.renderer;
    r.save();
    r.transform(transform);
    r.fill(this.color);
    r.fillRectCenter(CONECTOR_SIZE, CONECTOR_SIZE, GRID_DOT_RADIUS);

    if (direction == Direction.BOTTOM) {
      r.fillTextCenter(name, 0, -CONECTOR_SIZE - 10, "18px Orbitron");
    }

    if (direction == Direction.TOP) {
      r.fillTextCenter(name, 0, CONECTOR_SIZE + 10, "18px Orbitron");
    }

    if (direction == Direction.LEFT) {
      r.fillTextCenter(name, CONECTOR_SIZE + 10, 0, "18px Orbitron");
    }

    if (direction == Direction.RIGHT) {
      r.fillTextCenter(name, -CONECTOR_SIZE - 10, 0, "18px Orbitron");
    }

    r.restore();
  }
}
