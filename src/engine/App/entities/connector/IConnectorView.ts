import { ViewData } from "@/engine/core";
import { Direction } from "../NodeBase/NodeBase";

export interface IConnectorView extends ViewData {
  name: string;
  direction: Direction;
  showLabel: boolean;
}
