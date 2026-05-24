/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from "uuid";
import { Collider } from "./colliders/Collider";
import { AABB } from "./AABB/AABB";
import { V2 } from "./math/Vector";
import { EngineContext } from "./Engine";
import { CanvasHandler } from "./handlers/CanvasHandler";

export class Entity {
  public readonly id: string;
  public collider?: Collider;
  public aabb: AABB;
  public position: V2;
  public layer: number;
  protected context!: EngineContext<any>;

  constructor() {
    this.id = uuid();
    this.position = new V2();
    this.aabb = new AABB(this.position);
    this.layer = 0;
  }

  setContext(context: EngineContext<any>) {
    this.context = context;
  }

  async _ready() {
    await this.loadAssets();
    this.ready();
  }

  async loadAssets() {}
  ready() {}
  update(time: number) {}
  draw(canvas: CanvasHandler) {}

  emit(event: string, data?: any) {
    const methodName = "on_" + event;
    const method = (this as any)[methodName];
    if (typeof method === "function") {
      method.call(this, data);
    }
  }
}
