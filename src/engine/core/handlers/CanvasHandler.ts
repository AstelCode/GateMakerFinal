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
    if (options?.autoResize)
      this._canvas.addEventListener("resize", this.onResize);
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
  }

  set height(value: number) {
    this._canvas.height = value;
  }

  get ctx() {
    return this._ctx;
  }

  public async toImage() {
    return await new Promise<HTMLImageElement>((res, rej) => {
      this._canvas.toBlob((blob) => {
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
  }

  public clearScreen() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  private onResize = () => {
    this._canvas.width = innerWidth;
    this._canvas.height = innerHeight;
  };
}
