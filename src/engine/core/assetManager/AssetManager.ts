/* eslint-disable @typescript-eslint/no-explicit-any */

/* import { CanvasHandler } from "../handlers"; */
import { CanvasRing } from "./CanvasRing";

type AssetLoaderArg = {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
};
type AssetLoader<T> = T extends true
  ? (arg: AssetLoaderArg) => Promise<any>
  : () => Promise<any>;
type AssetOptions = { image?: boolean; width?: number; height?: number };
type AssetInfo = {
  name: string;
  loader: AssetLoader<true>;
  options: AssetOptions;
  callbacks: ((data: any) => void)[];
};
type AssetGetCallback = { name: string; callback: (data: any) => void };

export class AssetManager {
  /*  private static initCanvas() {
    if (this.canvas) return;
    this.canvas = new CanvasHandler();
  } */

  private loadedAssets: Map<string, any> = new Map();
  private queue: AssetInfo[] = [];
  private assetsInfo: Map<string, AssetInfo> = new Map();
  private callbacks: Record<string, AssetGetCallback[]> = {};

  constructor() {
    CanvasRing.initCanvasRing();
    /*  AssetManager.initCanvas(); */
  }

  public addAsset<T>(
    name: string,
    loader: AssetLoader<T>,
    options: AssetOptions = {},
    callback?: (data: any) => void,
  ) {
    if (this.assetsInfo.has(name)) return;
    const assetInfo: AssetInfo = {
      name,
      loader,
      options,
      callbacks: callback ? [callback] : [],
    };
    this.assetsInfo.set(name, assetInfo);
    this.queue.push(assetInfo);
  }

  public getAsset(name: string) {
    return this.loadedAssets.get(name);
  }

  public getAssetSync(name: string, callback: (data: any) => void) {
    // Si el asset ya está cargado, ejecutar el callback inmediatamente
    if (this.loadedAssets.has(name)) {
      callback(this.loadedAssets.get(name));
      return;
    }
    // Si no, registrar el callback para cuando se cargue
    this.callbacks[name] ??= [];
    this.callbacks[name].push({ name, callback });
  }

  public async load() {
    const loaders: Promise<void>[] = [];
    for (let i = 0; i < this.queue.length; i++) {
      const loader = async () => {
        const asset = this.queue.pop();
        if (!asset) return;
        if (this.loadedAssets.has(asset.name)) return;

        const { canvas, ctx } = CanvasRing.getCanvas();
        let result;
        if (asset.options.image) {
          canvas.width = asset.options.width || 0;
          canvas.height = asset.options.height || 0;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          result = await asset.loader({
            ctx,
          });
          result = await CanvasRing.toImage(canvas);
        } else {
          debugger;
          result = await (asset.loader as AssetLoader<false>)();
        }

        // Ejecutar callbacks registrados en addAsset
        if (asset.callbacks) {
          asset.callbacks.forEach((callback) => callback(result));
        }

        // Ejecutar callbacks registrados con getAssetSync
        if (this.callbacks[asset.name]) {
          this.callbacks[asset.name].forEach((item) => item.callback(result));
          this.callbacks[asset.name].length = 0;
        }
        this.loadedAssets.set(asset.name, result);
      };
      loaders.push(loader());
    }
    await Promise.all(loaders);
  }

  public destroy() {
    this.loadedAssets.clear();
    this.assetsInfo.clear();
  }
}
