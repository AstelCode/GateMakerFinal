import { AABB, Entity, RectangleCollider, V2 } from "@/engine/core";
import {
  BACKGROUND,
  CELL_SIZE,
  GRID_DOT_COLOR,
  GRID_DOT_RADIUS,
  GRID_DOT_SIZE,
  MAX_ZOOM,
  MIN_ZOOM,
  smoothZoom,
  START_T,
  ZOOM_STEP,
} from "../constants";
import { ITextureData } from "@/engine/core/assetManager";

export class Grid extends Entity {
  private texture!: HTMLImageElement;
  private pivot: V2 = new V2();
  private t: number = START_T;
  public collider: RectangleCollider;

  constructor() {
    super();
    this.collider = new RectangleCollider();
    this.collider.setPosition(this.pivot);
    this.aabb = new AABB(this.pivot);
    this.type = "GRID";
  }

  async loadAssets(): Promise<void> {
    this.context.assets.register<ITextureData>(
      "texture",
      "GRID_PATTERN",
      {
        width: CELL_SIZE,
        height: CELL_SIZE,
        callback: (ctx) => {
          ctx.fillStyle = BACKGROUND;
          ctx.fillRect(0, 0, CELL_SIZE, CELL_SIZE);
          const size = GRID_DOT_SIZE;
          const radius = GRID_DOT_RADIUS;
          ctx.fillStyle = GRID_DOT_COLOR;

          ctx.beginPath();
          ctx.roundRect(
            CELL_SIZE / 2 - size / 2,
            CELL_SIZE / 2 - size / 2,
            size,
            size,
            radius,
          );
          ctx.fill();
        },
      },
      (data) => {
        this.texture = data as HTMLImageElement;
      },
    );
    await this.context.assets.load();
  }

  ready(): void {
    this.context.tree.registerEntity("GRID", this);

    this.collider.width = this.context.renderer.width;
    this.collider.height = this.context.renderer.height;

    this.aabb.width = this.context.renderer.width;
    this.aabb.height = this.context.renderer.height;

    this.pivot.x = this.context.renderer.width / 2;
    this.pivot.y = this.context.renderer.height / 2;

    this.transform.position.copy(this.pivot);
    const range = MAX_ZOOM - MIN_ZOOM;
    this.transform.scale = range * smoothZoom(this.t) + MIN_ZOOM;
    this.transform.updateMatriz();
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

  draw(): void {
    const r = this.context.renderer;
    r.applyPattern("GRID", this.texture, "repeat", {
      transform: this.transform,
    });
    r.fillRect(0, 0, r.width, r.height);
    r.save();
    r.transform(this.transform);
    r.fill("yellow");
    r.drawCircle(0, 0, 5);
  }

  afterDrawChilds(): void {
    this.context.renderer.restore();
  }
}
