/* eslint-disable @typescript-eslint/no-explicit-any */

import { ILoader } from "./loaders/ILoader";

export class AssetManager {
  private loaders: Map<string, ILoader<any>>;
  private loadedAssets: Map<string, any> = new Map();
  private assetsRegistred: Record<string, boolean>;
  private queue: Array<() => Promise<{ name: string; data: any }>>;

  constructor() {
    this.loaders = new Map();
    this.assetsRegistred = {};
    this.queue = [];
  }

  addLoader(loader: ILoader<any>) {
    this.loaders.set(loader.name, loader);
  }

  get(name: string) {
    return this.loadedAssets.get(name);
  }

  register<T>(
    loaderName: string,
    name: string,
    data: T,
    onLoaded?: (data: any) => void,
  ) {
    if (this.assetsRegistred[name] && this.loadedAssets.has(name)) {
      onLoaded?.(this.loadedAssets.get(name));
      return;
    }

    const loader = this.loaders.get(loaderName);
    if (!loader) return;

    const callback = loader.register(name, data, ({ name, data }) => {
      this.loadedAssets.set(name, data);
      onLoaded?.(data);
    });
    this.assetsRegistred[name] = true;
    this.queue.push(callback);
  }

  async load() {
    const promises: Array<Promise<{ name: string; data: any }>> = [];
    while (this.queue.length > 0) {
      const promise = this.queue.pop();
      if (!promise) break;
      promises.push(promise());
    }
    await Promise.all(promises);
  }

  destroy() {
    this.loadedAssets.clear();
    this.loaders.clear();
  }
}
