import { ILogic, V2 } from "@/engine/core";

export interface INodeBaseLogic extends ILogic {
  width: number;
  height: number;
  pivot: V2;
  isDragging: boolean;
  newPosition: V2;
}
