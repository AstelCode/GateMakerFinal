/* eslint-disable @typescript-eslint/no-explicit-any */

import { CanvasHandler } from "../handlers";

type AssetLoaderArg = { ctx: CanvasRenderingContext2D };
type AssetLoader = (arg: AssetLoaderArg) => Promise<any>;
type AssetOptions = { image?: boolean; width?: number; height?: number };
type AssetInfo = {
  name: string;
  loader: AssetLoader;
  options: AssetOptions;
  callbacks: ((data: any) => void)[];
};
type AssetGetCallback = { name: string; callback: (data: any) => void };

export class AssetManager {
  private static canvas: CanvasHandler;
  private static initCanvas() {
    if (this.canvas) return;
    this.canvas = new CanvasHandler();
  }

  private loadedAssets: Map<string, any> = new Map();
  private assetsInfo: Array<AssetInfo> = [];
  private callbacks: Record<string, AssetGetCallback[]> = {};

  constructor() {
    AssetManager.initCanvas();
  }

  public addAsset(
    name: string,
    loader: AssetLoader,
    options: AssetOptions = {},
    callback?: (data: any) => void,
  ) {
    if (this.loadedAssets.has(name)) return;
    const assetInfo: AssetInfo = {
      name,
      loader,
      options,
      callbacks: callback ? [callback] : [],
    };
    this.assetsInfo.push(assetInfo);
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
    for (const asset of this.assetsInfo) {
      if (this.loadedAssets.has(asset.name)) continue;
      const loader = async () => {
        if (asset.options.image) {
          AssetManager.canvas.clearScreen();
          AssetManager.canvas.width = asset.options.width || 0;
          AssetManager.canvas.height = asset.options.height || 0;
        }

        let result = await asset.loader({
          ctx: AssetManager.canvas.ctx,
        });

        if (asset.options.image) {
          result = await AssetManager.canvas.toImage();
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
    this.assetsInfo.length = 0;
  }
}
