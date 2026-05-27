export class CanvasRing {
  private static _canvasRing: Array<HTMLCanvasElement | OffscreenCanvas> = [];
  private static readonly RING_SIZE = 5;
  private static _ctxRing: Array<
    CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  > = [];
  private static _ringIndex = 0;

  static initCanvasRing() {
    if (CanvasRing._canvasRing.length < CanvasRing.RING_SIZE) {
      for (let i = 0; i < CanvasRing.RING_SIZE; i++) {
        if (typeof OffscreenCanvas !== "undefined") {
          CanvasRing._canvasRing.push(new OffscreenCanvas(0, 0));
        } else {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.width;
          canvas.height = canvas.height;
          CanvasRing._canvasRing.push(canvas);
        }
        CanvasRing._ctxRing.push(CanvasRing._canvasRing[i].getContext("2d")!);
      }
    }
  }

  static getCanvas() {
    const canvas = CanvasRing._canvasRing[CanvasRing._ringIndex];
    const ctx = CanvasRing._ctxRing[CanvasRing._ringIndex];
    /*     currentCanvasCopy.width = canvas.width;
    currentCanvasCopy.height = canvas.height;
    currentCtxCopy.drawImage(canvas, 0, 0); */
    CanvasRing._ringIndex = (CanvasRing._ringIndex + 1) % CanvasRing.RING_SIZE;
    return { canvas, ctx };
  }

  static async toImage(canvas: HTMLCanvasElement | OffscreenCanvas) {
    if (canvas instanceof OffscreenCanvas) {
      return await new Promise<HTMLImageElement>((res, rej) => {
        canvas.convertToBlob().then((blob) => {
          if (!blob) {
            rej();
            return;
          }
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          img.width = canvas.width;
          img.height = canvas.height;
          res(img);
        });
      });
    } else {
      return await new Promise<HTMLImageElement>((res, rej) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            rej();
            return;
          }
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          img.width = canvas.width;
          img.height = canvas.height;
          res(img);
        });
      });
    }
  }
}
