"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyboardController } from "./controllers/KeyboardController";
import { MouseController } from "./controllers/MouseController";
import { CanvasHandler } from "./handlers/CanvasHandler";
import { EventsHandler } from "./events/EventsHandler";
import { EntityTree } from "./EntityTree";
import { AssetManager } from "./assetManager/AssetManager";

let i, j;

export interface EngineContext<T extends Record<string, any>> {
  mouse: MouseController;
  keyboard: KeyboardController;
  events: EventsHandler<T>;
  tree: EntityTree;
  assets: AssetManager;
  canvas: CanvasHandler;
}

export class Engine<
  T extends Record<string, any>,
  Context extends EngineContext<T>,
> {
  protected mouse: MouseController;
  protected keyboard: KeyboardController;
  protected events: EventsHandler<T>;
  protected canvas: CanvasHandler;
  protected requestAnimationFrameId!: number;
  protected context: Context;
  protected tree: EntityTree;
  protected assets: AssetManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new CanvasHandler(canvas, { autoResize: true });
    this.mouse = new MouseController(canvas);
    this.keyboard = new KeyboardController();
    this.events = new EventsHandler();
    this.assets = new AssetManager();
    this.tree = new EntityTree();
    this.context = this.createContext();
  }

  protected createContext(): Context {
    const context = {
      mouse: this.mouse,
      keyboard: this.keyboard,
      events: this.events,
      tree: this.tree,
      assets: this.assets,
      canvas: this.canvas,
    } as Context;
    this.tree.setContext(context);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    return context;
  }

  public async start() {
    this.init();
    this.registerAssets();
    await this.assets.load();
    this.ready();
    this.startLoop();
  }

  protected init() {}
  protected registerAssets() {}
  protected ready() {}

  public destroy() {
    this.stopLoop();
    this.mouse.destroy();
    this.keyboard.destroy();
    this.events.destroy();
    this.assets.destroy();
    this.tree.destroy();
  }

  //* principal loop
  private running: boolean = false;
  private visible: boolean = true;
  private loop = (time: number) => {
    this.canvas.clearScreen();
    for (i = 0; i < this.tree.entities.length; i++) {
      this.tree.entities[i].update(time);
    }

    const layers = this.tree.layers;
    for (i = 0; i < layers.length; i++) {
      for (j = 0; j < layers[i].length; j++) {
        layers[i][j].draw(this.canvas);
      }
    }

    if (this.running && this.visible)
      this.requestAnimationFrameId = window.requestAnimationFrame(this.loop);
  };

  onVisibilityChange = () => {
    if (document.hidden) {
      this.visible = false;
      console.info("supence loop");
    } else {
      if (!this.visible) this.startLoop();
      this.visible = true;
    }
  };

  protected startLoop() {
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
