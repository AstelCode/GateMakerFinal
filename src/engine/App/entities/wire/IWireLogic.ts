import { ILogic, V2 } from "@/engine/core";

export interface IWireLogic extends ILogic {
  path: V2[];
  thicknest: number;
}
