import { ViewData, V2 } from "@/engine/core";

export interface IWireView extends ViewData {
  path: V2[];
  thicknest: number;
}
