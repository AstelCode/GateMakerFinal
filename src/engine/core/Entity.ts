/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from "uuid";
import { Collider } from "./colliders/Collider";
import { AABB } from "./AABB/AABB";
import { V2 } from "./math/Vector";
import { EngineContext } from "./Engine";
import { M3 } from "./math";

export class Entity {
  public readonly id: string;
  public collider?: Collider;
  public aabb: AABB;
  public position: V2;
  public layer: number;
  public transform: M3 = new M3();
  protected context!: EngineContext<any>;
  protected children: Entity[];
  private parent?: Entity;
  private updatedLayout: boolean;
  private updated: boolean;
  public name: string;

  constructor() {
    this.id = uuid();
    this.position = new V2();
    this.aabb = new AABB(this.position);
    this.layer = 0;
    this.children = [];
    this.updatedLayout = false;
    this.updated = false;
    this.name = "";
  }

  setContext(context: EngineContext<any>) {
    this.context = context;
  }

  addChild(child: Entity) {
    child.parent = child;
    this.children.push(child);
    this.sortChildsLayers();
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

  adjustPosition() {}

  updateLayout() {
    if (this.children.length == 0) return;
    this.aabb.combineMultiple(this.children.map((item) => item.getAABB()));
  }

  _updateLayout() {
    if (this.updatedLayout) return;
    for (const item of this.children) {
      item._updateLayout();
    }
    this.updateLayout();
    this.updatedLayout = true;
  }

  _update(time: number) {
    if (this.updated) return;
    this.update(time);
    this.children.forEach((item) => item._update(time));
    this.afterUpdateChilds(time);
    this.updated = false;
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

  toRelativePosition(v: V2) {
    return new V2();
  }

  pointCollition(v: V2): undefined | Entity {
    const copy = this.toRelativePosition(v.clone());
    for (let i = this.children.length - 1; i >= 0; i--) {
      const entity = this.children[i];
      if (entity.aabb.pointInside(copy) || entity.collider?.pointInside(copy)) {
        return entity.pointCollition(copy) ?? entity;
      }
    }
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
