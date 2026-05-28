"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyboardController } from "./controllers/KeyboardController";
import { MouseController } from "./controllers/MouseController";
import { CanvasRenderer } from "./renderer/CanvasRenderer";
import { EventsHandler } from "./events/EventsHandler";
import { EntityTree } from "./EntityTree";
import { AssetManager } from "./assetManager/AssetManager";
import { FontLoader, TextureLoader } from "./assetManager";
import { IRenderer } from "./renderer";

export interface EngineContext<T extends Record<string, any>> {
  mouse: MouseController;
  keyboard: KeyboardController;
  events: EventsHandler<T>;
  tree: EntityTree;
  assets: AssetManager;
  renderer: IRenderer;
}

export class Engine<
  T extends Record<string, any>,
  Context extends EngineContext<T>
> {
  protected mouse: MouseController;
  protected keyboard: KeyboardController;
  protected events: EventsHandler<T>;
  protected renderer: IRenderer;
  protected requestAnimationFrameId!: number;
  protected context: Context;
  protected tree: EntityTree;
  protected assets: AssetManager;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new CanvasRenderer(canvas, { autoResize: true });
    this.mouse = new MouseController(canvas);
    this.keyboard = new KeyboardController();
    this.events = new EventsHandler();
    this.assets = new AssetManager();
    this.tree = new EntityTree();
    this.assets.addLoader(new TextureLoader());
    this.assets.addLoader(new FontLoader());
    this.context = this.createContext();
  }

  protected createContext(): Context {
    const context = {
      mouse: this.mouse,
      keyboard: this.keyboard,
      events: this.events,
      tree: this.tree,
      assets: this.assets,
      renderer: this.renderer,
    } as Context;
    this.tree.setContext(context);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    return context;
  }

  public async start() {
    this.init();
    this.registerAssets();
    await this.assets.load();
    await this.loadAssets();
    this.ready();
    this.startLoop();
  }

  protected async loadAssets() {}

  protected init() {}
  protected registerAssets() {}
  protected ready() {}

  public destroy() {
    this.stopLoop();
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.mouse.destroy();
    this.keyboard.destroy();
    this.events.destroy();
    this.assets.destroy();
    this.tree.destroy();
  }

  //* principal loop
  private running: boolean = false;
  private counter: number = 0;
  private fps: number = 0;
  private lastTime = Date.now();
  private loop = (time: number) => {
    this.renderer.clearScreen();
    this.tree.update(time);
    this.tree.render();
    this.updateFPS();
    if (this.running) {
      this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
    }
  };

  private updateFPS() {
    const currentTime = Date.now();
    if (currentTime - this.lastTime > 1000) {
      this.fps = this.counter;
      this.counter = 0;
      this.lastTime = currentTime;
    }
    this.renderer.drawFPS(this.fps);
    this.counter++;
  }

  private onVisibilityChange = () => {
    if (document.hidden) {
      this.stopLoop();
    } else {
      if (!this.running) {
        this.startLoop();
      }
    }
  };

  protected startLoop() {
    if (this.running) return;
    console.info("Staring loop");
    this.running = true;
    this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
  }

  protected stopLoop() {
    console.info("Staring loop");
    this.running = false;
    window.cancelAnimationFrame(this.requestAnimationFrameId);
  }
}
