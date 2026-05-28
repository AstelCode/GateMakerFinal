import { Entity, EntityView, RectangleCollider, V2 } from "@/engine/core";
import {
  CONECTOR_COLOR,
  CONECTOR_COLOR_HOVER,
  CONECTOR_SIZE,
} from "../../constants";
import { ConnectorView } from "./ConnectorView";
import { IConnectorLogic } from "./IConnectorLogic";

export class Connector extends Entity implements IConnectorLogic {
  public collider: RectangleCollider;
  protected view: ConnectorView;
  constructor(public name: string, position: V2) {
    super();
    this.collider = new RectangleCollider();
    this.collider.setPosition(this.transform.position);
    this.bounds.setPosition(this.transform.position);

    this.collider.size = CONECTOR_SIZE;
    this.bounds.size = CONECTOR_SIZE;

    this.view = new ConnectorView(this);
    this.transform.position.copy(position);
    this.transform.updateMatriz();
    this.view.color = CONECTOR_COLOR;
  }

  on_hover() {
    this.view.color = CONECTOR_COLOR_HOVER;
  }

  on_leave() {
    this.view.color = CONECTOR_COLOR;
  }
}
