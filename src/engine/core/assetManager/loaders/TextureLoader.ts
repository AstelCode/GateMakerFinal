/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanvasRing } from "../../utils/CanvasRing";
import { ILoader } from "./ILoader";

export type ITextureData = {
  width: number;
  height: number;
  callback: (
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  ) => void;
};

export class TextureLoader implements ILoader<ITextureData> {
  name: string = "texture";

  constructor() {
    CanvasRing.initCanvasRing();
  }
  register(
    name: string,
    data: ITextureData,
    onLoaded?: (data: { name: string; data: any }) => void,
  ): () => Promise<{ name: string; data: any }> {
    const { canvas, ctx } = CanvasRing.getCanvas();
    canvas.width = data.width;
    canvas.height = data.height;

    const callback = async () => {
      data.callback(ctx);
      const result = await CanvasRing.toImage(canvas);
      onLoaded?.({
        name,
        data: result,
      });
      return {
        name,
        data: result,
      };
    };

    return callback;
  }
}
