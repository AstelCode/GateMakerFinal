import { EntityView } from "@/engine/core";
import { IGridLogic } from "./IGridLogic";
import { ITextureData } from "@/engine/core/assetManager";
import {
  CELL_SIZE,
  BACKGROUND,
  GRID_DOT_SIZE,
  GRID_DOT_RADIUS,
  GRID_DOT_COLOR,
} from "../../constants";

export class GridView extends EntityView<IGridLogic> {
  private texture!: HTMLImageElement;
  async loadAssets(): Promise<void> {
    this._context.assets.register<ITextureData>(
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
            radius
          );
          ctx.fill();
        },
      },
      (data) => {
        this.texture = data as HTMLImageElement;
      }
    );
    await this._context.assets.load();
  }

  render(): void {
    const { transform } = this.logic;
    const r = this._context.renderer;
    r.applyPattern("GRID", this.texture, "repeat", {
      transform: transform,
    });
    r.fillRect(0, 0, r.width, r.height);
    r.save();
    r.transform(transform);
    r.fill("yellow");
    r.drawCircle(0, 0, 5);
  }

  afterDrawChilds(): void {
    this._context.renderer.restore();
  }
}
