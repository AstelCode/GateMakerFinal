/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from "uuid";
import { Collider } from "./colliders/Collider";
import { AABB } from "./AABB/AABB";
import { V2 } from "./math/Vector";
import { EngineContext } from "./Engine";
import { Transform } from "./math/Transform";

export class Entity {
  public readonly id: string;
  public collider?: Collider;
  public aabb: AABB;
  /*  public position: V2; */
  public layer: number;
  public transform: Transform;
  protected context!: EngineContext<any>;
  protected children: Entity[];
  private parent?: Entity;
  public type: string;

  constructor() {
    this.id = uuid();
    this.transform = new Transform();
    this.aabb = new AABB(this.transform.position);
    this.layer = 0;
    this.children = [];
    this.type = "";
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
    this.aabb.combineMultipleRelative(
      this.children.map((item) => item.getAABB()),
    );
  }

  _update(time: number) {
    this.update(time);
    this.children.forEach((item) => item._update(time));
    this.afterUpdateChilds(time);
  }

  _draw() {
    const ctx = this.context.canvas.ctx;
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

  pointCollition(v: V2): undefined | Entity {
    this.transform.mulVInv(v);
    for (let i = this.children.length - 1; i >= 0; i--) {
      let entity = this.children[i];
      if (entity.aabb.pointInside(v) || entity.collider?.pointInside(v)) {
        entity = entity.pointCollition(v) ?? entity;
        return entity;
      }
    }
  }

  emit(event: string, ...data: any) {
    const methodName = "on_" + event;
    const method = (this as any)[methodName];
    if (typeof method === "function") {
      return method.call(this, ...data);
    }
    return undefined;
  }
}
