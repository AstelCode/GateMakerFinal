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

  protected _children: Entity[];
  public parent?: Entity;

  protected _context!: EngineContext<any>;

  protected view!: EntityView<any>;

  public dragable: boolean;
  public visible: boolean;
  public childrenVisible: boolean;
  public selectable: boolean;

  constructor() {
    this.id = uuid();
    this.transform = new Transform();
    this.bounds = new AABB(this.transform.position);
    this._children = [];
    this.type = "";
    this.dragable = true;
    this.childrenVisible = true;
    this.visible = true;
    this.selectable = true;
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

  get children() {
    return this._children;
  }

  async addChild(child: Entity) {
    child.parent = this;
    child.context = this.context;
    this._children.push(child);
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
  destroy() {}

  adjustPosition() {}

  updateLayout() {
    if (this._children.length == 0) return;
    this.bounds.combineMultipleRelative(
      this._children.map((item) => item.getAABB()),
    );
  }

  removeChild(child: Entity) {
    this._children = this._children.filter((item) => item != child);
  }

  _update(time: number) {
    this.update(time);
    this._children.forEach((item) => item._update(time));
    this.afterUpdateChilds(time);
  }

  _destroy() {
    this._children.forEach((item) => item._destroy());
    this.destroy();
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  _render() {
    const r = this._context.renderer;

    if (!this.visible) {
      if (this.childrenVisible) {
        r.save();
        r.transform(this.transform);
        this._children.forEach((item) => item._render());
        r.restore();
      }
      return;
    }
    this.view.renderAbsolute();
    r.save();
    r.transform(this.transform);
    this.view.render();
    this._children.forEach((item) => item._render());
    this.view.afterDrawChilds();
    r.restore();
  }

  sortChildsLayers() {
    this._children = this._children.sort((a, b) => a.view.layer - b.view.layer);
  }

  getAABB() {
    return this.collider ? this.collider.getAABB() : this.bounds;
  }

  pointCollition(v: V2): undefined | Entity {
    this.transform.mulVInv(v);
    for (let i = this._children.length - 1; i >= 0; i--) {
      let entity: Entity | undefined = this._children[i];
      if (!entity.selectable) continue;
      if (!entity.bounds.pointInside(v)) continue;

      const insideEntity = entity.collider && entity.collider.pointInside(v);
      const child = entity.pointCollition(v);
      if (!insideEntity && entity.collider) {
        entity = undefined;
      }
      entity = child ?? entity;

      return entity;
    }
  }

  getInvGlobalTransformPath(depth: number = 0) {
    const path: Transform[] = [];
    let parent = this.parent;
    while (parent != undefined) {
      path.unshift(parent.transform);
      parent = parent.parent;
    }
    path.slice(0, path.length - depth);
    return path;
  }

  mulInvGlobalTrasform(v: V2, depth: number = 0) {
    let path: Transform[] = [];
    let parent = this.parent;
    while (parent != undefined) {
      path.unshift(parent.transform);
      parent = parent.parent;
    }
    path = path.slice(0, path.length - depth);
    for (const transform of path) {
      transform.mulVInv(v);
    }
    return v;
  }

  mulGlobalTrasform(v: V2, depth: number = 0) {
    let path: Transform[] = [];
    let parent = this.parent;
    while (parent != undefined) {
      path.push(parent.transform);
      parent = parent.parent;
    }
    debugger;
    path = path.slice(0, path.length - depth);
    for (const transform of path) {
      transform.mulV(v);
    }
    return v;
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
