import { AABB, Entity, RectangleCollider, V2 } from "@/engine/core";
import {
  CELL_SIZE,
  MAX_ZOOM,
  MIN_ZOOM,
  smoothZoom,
  START_T,
  ZOOM_STEP,
} from "../../constants";
import { GridView } from "./GridView";

export class Grid extends Entity {
  private pivot: V2 = new V2();
  private t: number = START_T;
  public collider: RectangleCollider;

  constructor() {
    super();
    this.collider = new RectangleCollider();
    this.collider.setPosition(this.pivot);
    this.bounds = new AABB(this.pivot);
    this.bounds.setPosition(this.pivot);
    this.type = "GRID";
    this.view = new GridView(this);
    this.dragable = false;
  }

  private resize = () => {
    const { width: w, height: h } = this._context.renderer;

    this.collider.width = w;
    this.collider.height = h;

    this.bounds.width = w;
    this.bounds.height = h;

    this.pivot.x = w / 2;
    this.pivot.y = h / 2;
    this.transform.position.copy(this.pivot);
    this.transform.updateMatriz();
  };

  ready(): void {
    this._context.tree.registerEntity("GRID", this);
    const { width: w, height: h } = this._context.renderer;

    this.collider.width = w;
    this.collider.height = h;

    this.bounds.width = w;
    this.bounds.height = h;

    this.pivot.x = w / 2;
    this.pivot.y = h / 2;

    this.transform.position.copy(this.pivot);
    const range = MAX_ZOOM - MIN_ZOOM;
    this.transform.scale = range * smoothZoom(this.t) + MIN_ZOOM;
    this.transform.updateMatriz();

    window.addEventListener("resize", this.resize);
  }

  destroy(): void {
    window.removeEventListener("resize", this.resize);
  }

  on_drag({ dx, dy }: { dx: number; dy: number }) {
    this.transform.translate({ x: dx, y: dy });
  }

  on_wheel({ delta, x, y }: { delta: number; x: number; y: number }) {
    if (delta > 0) {
      this.t -= ZOOM_STEP;
    } else {
      this.t += ZOOM_STEP;
    }
    this.t = Math.max(Math.min(this.t, 1), 0);
    let newScale = 0;
    const range = MAX_ZOOM - MIN_ZOOM;
    newScale = range * smoothZoom(this.t) + MIN_ZOOM;

    this.transform.zoomInPoint(newScale, { x, y });
  }

  on_toGridPos({ x, y }: { x: number; y: number }) {
    const v = new V2(x, y);
    this.transform.mulVInv(v);
    v.x = Math.floor(v.x / CELL_SIZE);
    v.y = Math.floor(v.y / CELL_SIZE);
    return { x: v.x, y: v.y };
  }
}
