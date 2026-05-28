import { ILogic } from "@/engine/core";
import { Direction } from "../NodeBase/NodeBase";

export interface IConnectorLogic extends ILogic {
  name: string;
  direction: Direction;
  showLabel: boolean;
}
