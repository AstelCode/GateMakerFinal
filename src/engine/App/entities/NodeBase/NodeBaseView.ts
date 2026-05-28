import { EntityView, ITextureData } from "@/engine/core";
import { INodeBaseLogic } from "./INodeBaseLogic";

export class NodeBaseView extends EntityView<INodeBaseLogic> {
  private texture!: HTMLImageElement;
  async loadAssets(): Promise<void> {
    const { width: w, height: h } = this.logic;

    this._context.assets.register<ITextureData>(
      "texture",
      "NODE_BACKGROUND",
      {
        width: w,
        height: h,
        callback: (ctx) => {
          const margin = 2;
          const r = 8;
          ctx.beginPath();
          ctx.fillStyle = "#585d69";
          ctx.roundRect(0, 0, w, h, r);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = "#1e1f23";
          ctx.roundRect(margin, margin, w - margin * 2, h - margin * 2, r);
          ctx.fill();

          ctx.beginPath();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "white";
          ctx.font = "25px Orbitron";
          ctx.fillText("NODE", w / 2, h / 2);
          ctx.fill();
        },
      },
      (texture) => {
        this.texture = texture;
      }
    );
    await this._context.assets.load();
  }
  render(): void {
    const { transform, width, height } = this.logic;
    const r = this._context.renderer;
    r.save();
    r.transform(transform);
    r.drawImageCenter(this.texture, width, height);
  }

  afterDrawChilds(): void {
    this._context.renderer.restore();
  }
}
