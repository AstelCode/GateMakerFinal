interface Options {
  autoResize: boolean;
}
export class CanvasHandler {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  constructor(canvas?: HTMLCanvasElement, options?: Options) {
    if (!canvas) {
      canvas = document.createElement("canvas");
    }

    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d")!;

    if (options?.autoResize) window.addEventListener("resize", this.onResize);
    /*     CanvasHandler.initCanvasRing(canvas); */
  }

  get width() {
    return this._canvas.width;
  }

  get canvas() {
    return this._canvas;
  }

  get height() {
    return this._canvas.height;
  }

  set width(value: number) {
    this._canvas.width = value;
    this.ctx.canvas.width = value;
  }

  set height(value: number) {
    this._canvas.height = value;
    this.ctx.canvas.height = value;
  }

  get ctx() {
    return this._ctx;
  }

  public async toImage() {
    debugger;

    /* const currentCanvasCopy = CanvasHandler.getCanvasCopy(this._canvas);
    if (currentCanvasCopy instanceof OffscreenCanvas) {
      return await new Promise<HTMLImageElement>((res, rej) => {
        currentCanvasCopy
          .convertToBlob()
          .then((blob) => {
            if (!blob) {
              rej();
              return;
            }
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            res(img);
          })
          .catch(rej);
      });
    } else { */
    return await new Promise<HTMLImageElement>((res, rej) => {
      this.canvas.toBlob((blob) => {
        if (!blob) {
          rej();
          return;
        }
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        res(img);
      });
    });
    /*   } */
  }

  public clearScreen() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public drawFPS(fps: number) {
    this.ctx.save();
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, 80, 20);
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "top";
    this.ctx.font = "20px serif";
    this.ctx.fillText(`FPS : ${fps}`, 0, 0);
    this.ctx.restore();
  }

  private onResize = () => {
    this._canvas.width = innerWidth;
    this._canvas.height = innerHeight;
  };
}
