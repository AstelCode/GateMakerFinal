import { ViewData, V2 } from "@/engine/core";

export interface INodeBaseView extends ViewData {
  width: number;
  height: number;
  /*   pivot: V2; */
  isDragging: boolean;
  newPosition: V2;
}
