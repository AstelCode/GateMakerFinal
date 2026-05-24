import { CanvasHandler, Entity, M3, V2 } from "@/engine/core";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  smoothZoom,
  START_T,
  ZOOM_STEP,
} from "../constants";

export class Grid extends Entity {
  private image!: HTMLImageElement;
  private pattern!: CanvasPattern;

  private transform: M3 = new M3();
  private pivot: V2 = new V2();
  private scale: number = 1;
  private t: number = START_T;

  async loadAssets(): Promise<void> {
    this.context.assets.addAsset(
      "GRID_PATTERN",
      async ({ ctx }) => {
        ctx.fillStyle = "red";
        ctx.fillRect(10, 10, 40, 40);
      },
      { image: true, width: 50, height: 50 },
    );
    await this.context.assets.load();
    this.context.assets.getAssetSync("GRID_PATTERN", (data) => {
      this.image = data as HTMLImageElement;
    });
  }

  ready(): void {
    this.pivot.x = this.context.canvas.width / 2;
    this.pivot.y = this.context.canvas.height / 2;
    this.position.x = this.pivot.x;
    this.position.y = this.pivot.y;

    const range = MAX_ZOOM - MIN_ZOOM;
    this.scale = range * smoothZoom(this.t) + MIN_ZOOM;

    this.transform.transform(
      this.position.x,
      this.position.y,
      0,
      this.scale,
      this.scale,
    );
  }

  on_drag({ dx, dy }: { dx: number; dy: number }) {
    this.position.x += dx / this.scale;
    this.position.y += dy / this.scale;
    this.transform.transform(
      this.position.x,
      this.position.y,
      0,
      this.scale,
      this.scale,
    );
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

    this.position.x = x / newScale - x / this.scale + this.position.x;
    this.position.y = y / newScale - y / this.scale + this.position.y;
    this.scale = newScale;

    this.transform.transform(
      this.position.x,
      this.position.y,
      0,
      this.scale,
      this.scale,
    );
  }

  draw(canvas: CanvasHandler): void {
    const ctx = canvas.ctx;
    if (this.image && !this.pattern) {
      this.pattern = ctx.createPattern(this.image, "repeat")!;
    }
    if (this.pattern) {
      this.pattern.setTransform(this.transform.toDOMMatriz());
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.pattern;
      ctx.fill();

      ctx.save();
      ctx.setTransform(this.transform.toDOMMatriz());
      ctx.fillStyle = "yellow";
      ctx.fillRect(-10, -10, 20, 20);
      ctx.restore();
    }
  }
}
