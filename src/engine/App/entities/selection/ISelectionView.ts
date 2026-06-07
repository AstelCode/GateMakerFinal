import { AABB, V2, ViewData } from "@/engine/core";

export interface ISelectionView extends ViewData {
  start: V2;
  end: V2;
  bounds: AABB;
}
