import { EntityView, ITextureData } from "@/engine/core";
import { INodeBaseView } from "./INodeBaseView";

export class NodeBaseView extends EntityView<INodeBaseView> {
  private texture!: HTMLImageElement;
  protected _layer: number = 1;
  async loadAssets(): Promise<void> {
    const { width: w, height: h } = this.data;

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
      },
    );
    await this._context.assets.load();
  }

  render(): void {
    const { width, height, isDragging } = this.data;
    const r = this._context.renderer;
    // if (isDragging) return;
    r.imageCenter(this.texture, width, height);
  }

  renderAbsolute(): void {
    const { width, height, isDragging, newPosition: v } = this.data;
    if (!isDragging) return;
    const r = this._context.renderer;
    //r.save();
    //r.transform()
    //r.imageCenter(this.texture, width, height);
    r.save();
    r.begin();
    r.fillStyle("rgba(131, 131, 131, 0.2)");
    r.strokeStyle("rgba(207, 207, 207, 0.5)", 4);
    r.rect(v.x - width / 2, v.y - height / 2, width, height, 12);
    r.fill();
    r.stroke();
    r.restore();
  }
}
