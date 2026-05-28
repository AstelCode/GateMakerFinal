import { ILogic } from "@/engine/core";
import { Direction } from "../NodeBase/NodeBase";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IConnectorLogic extends ILogic {
  name: string;
  direction: Direction;
}
