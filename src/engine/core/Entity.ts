/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from "uuid";
import { Collider } from "./colliders/Collider";
import { AABB } from "./AABB/AABB";
import { V2 } from "./math/Vector";
import { EngineContext } from "./Engine";

export class Entity {
  public readonly id: string;
  public collider?: Collider;
  public aabb: AABB;
  public position: V2;
  public layer: number;

  protected context!: EngineContext<any>;
  protected children: Entity[];

  private parent?: Entity;

  private updated: boolean;

  constructor() {
    this.id = uuid();
    this.position = new V2();
    this.aabb = new AABB(this.position);
    this.layer = 0;
    this.children = [];
    this.updated = false;
  }

  setContext(context: EngineContext<any>) {
    this.context = context;
  }

  addChild(child: Entity) {
    child.parent = child;
    this.children.push(child);
  }

  async _ready() {
    await this.loadAssets();
    this.ready();
  }

  async loadAssets() {}
  ready() {}
  update(time: number) {}
  afterUpdateChilds(time: number) {}
  draw() {}
  afterDrawChilds() {}

  updateLayout() {
    if (this.children.length == 0) return;
    this.aabb.combineMultiple(this.children.map((item) => item.getAABB()));
  }

  _updateLayout() {
    if (this.updated) return;
    for (const item of this.children) {
      item._updateLayout();
    }
    this.updateLayout();
  }

  _update(time: number) {
    if (this.updated) return;
    this.update(time);
    this.children.forEach((item) => item._update(time));
    this.afterUpdateChilds(time);
  }

  _draw() {
    this.draw();
    this.children.forEach((item) => item._draw());
    this.afterDrawChilds();
  }
  sortChildsLayers() {
    this.children = this.children.sort((a, b) => (a.layer > b.layer ? 1 : 0));
  }
  getAABB() {
    return this.collider ? this.collider.getAABB() : this.aabb;
  }

  emit(event: string, data?: any) {
    const methodName = "on_" + event;
    const method = (this as any)[methodName];
    if (typeof method === "function") {
      return method.call(this, data);
    }
    return undefined;
  }
}
