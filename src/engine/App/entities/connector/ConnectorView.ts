import { EntityView } from "@/engine/core";
import { IConnectorLogic } from "./IConnectorLogic";
import { CONECTOR_SIZE, CONNECTOR_RADIUS, FONTS } from "../../constants";
import { Direction } from "../NodeBase/NodeBase";

export class ConnectorView extends EntityView<IConnectorLogic> {
  public color: string = "";

  render(): void {
    const { name, direction, showLabel } = this.logic;
    const r = this.context.renderer;
    r.fillStyle(this.color);
    r.fillRectCenter(CONECTOR_SIZE, CONECTOR_SIZE, CONNECTOR_RADIUS);

    const font = {
      size: 18,
      name: FONTS.Orbitron,
    };

    if (!showLabel) return;

    if (direction == Direction.BOTTOM) {
      r.fillText(name, 0, -CONECTOR_SIZE / 2 - 5, font, "bottom:center");
    }

    if (direction == Direction.TOP) {
      r.fillTextCenter(name, 0, CONECTOR_SIZE + 5, font);
    }

    if (direction == Direction.LEFT) {
      r.fillText(name, CONECTOR_SIZE / 2 + 5, 0, font, "middle:start");
    }

    if (direction == Direction.RIGHT) {
      r.fillText(name, -CONECTOR_SIZE / 2 - 5, 0, font, "middle:end");
    }
  }
}
