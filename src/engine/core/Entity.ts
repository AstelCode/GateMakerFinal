/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from "uuid";
import { Collider } from "./colliders/Collider";
import { AABB } from "./AABB/AABB";
import { V2 } from "./math/Vector";
import { EngineContext } from "./Engine";
import { Transform } from "./math/Transform";
import { EntityView } from "./EntityView";

export abstract class Entity {
  public readonly id: string;
  public type: string;

  public collider?: Collider;
  public bounds: AABB;
  public transform: Transform;

  protected children: Entity[];
  protected parent?: Entity;

  protected _context!: EngineContext<any>;

  protected view!: EntityView<any>;

  public dragable: boolean;

  constructor() {
    this.id = uuid();
    this.transform = new Transform();
    this.bounds = new AABB(this.transform.position);
    this.children = [];
    this.type = "";
    this.dragable = true;
  }

  get layer() {
    return this.view.layer;
  }

  set layer(value: number) {
    this.view.layer = value;
  }

  set context(context: EngineContext<any>) {
    this.view.context = context;
    this._context = context;
  }

  get context() {
    return this._context;
  }

  async addChild(child: Entity) {
    child.parent = this;
    child.context = this.context;
    this.children.push(child);
    this.sortChildsLayers();
    await child._ready();
  }

  async _ready() {
    await this.view.loadAssets();
    this.ready();
  }

  ready() {}
  update(time: number) {}
  afterUpdateChilds(time: number) {}

  adjustPosition() {}

  updateLayout() {
    if (this.children.length == 0) return;
    this.bounds.combineMultipleRelative(
      this.children.map((item) => item.getAABB()),
    );
  }

  _update(time: number) {
    this.update(time);
    this.children.forEach((item) => item._update(time));
    this.afterUpdateChilds(time);
  }

  _render() {
    const r = this._context.renderer;
    this.view.renderAbsolute();
    r.save();
    r.transform(this.transform);
    this.view.render();
    this.children.forEach((item) => item._render());
    this.view.afterDrawChilds();
    r.restore();
  }

  sortChildsLayers() {
    this.children = this.children.sort((a, b) => a.view.layer - b.view.layer);
  }

  getAABB() {
    return this.collider ? this.collider.getAABB() : this.bounds;
  }

  pointCollition(v: V2): undefined | Entity {
    this.transform.mulVInv(v);
    for (let i = this.children.length - 1; i >= 0; i--) {
      let entity = this.children[i];
      if (entity.bounds.pointInside(v) || entity.collider?.pointInside(v)) {
        entity = entity.pointCollition(v) ?? entity;
        return entity;
      }
    }
  }

  getTransformPath() {
    const path: Transform[] = [];
    let parent = this.parent;
    while (parent != undefined) {
      path.unshift(parent.transform);
      parent = parent.parent;
    }
    return path;
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
