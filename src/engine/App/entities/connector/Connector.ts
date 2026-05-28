import { Entity, EntityView, RectangleCollider, V2 } from "@/engine/core";
import {
  CONECTOR_COLOR,
  CONECTOR_COLOR_HOVER,
  CONECTOR_SIZE,
} from "../../constants";
import { ConnectorView } from "./ConnectorView";
import { IConnectorLogic } from "./IConnectorLogic";
import { Direction } from "../NodeBase/NodeBase";

export class Connector extends Entity implements IConnectorLogic {
  public collider: RectangleCollider;
  protected view: ConnectorView;
  public showLabel: boolean;
  constructor(
    public name: string,
    public direction: Direction,
    position: V2,
  ) {
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

    this.showLabel = false;
    this.type = "CONNECTOR";
    this.dragable = false;
  }

  on_hover() {
    this.showLabel = true;
    this.view.color = CONECTOR_COLOR_HOVER;
  }

  on_leave() {
    this.showLabel = false;
    this.view.color = CONECTOR_COLOR;
  }

  on_down() {
    console.log(this.name + " " + this.parent?.id);
  }
}
