/* eslint-disable @typescript-eslint/no-explicit-any */
import { EngineContext } from "./Engine";
import { Entity } from "./Entity";
import { V2 } from "./math";

let i;
export class EntityTree {
  private _layers: Entity[][]; // canvas rendering context 2d
  private _entities: Entity[];
  private _context!: EngineContext<any>;
  private entityRecord: Map<string, Entity>;

  constructor() {
    this._layers = [];
    this._entities = [];
    this.entityRecord = new Map();
  }

  get layers() {
    return this._layers;
  }

  get entities() {
    return this._entities;
  }

  setContext(context: EngineContext<any>) {
    this._context = context;
  }

  registerEntity(name: string, entity: Entity) {
    this.entityRecord.set(name, entity);
  }

  getEntity(name: string) {
    return this.entityRecord.get(name);
  }

  async addEntity(entity: Entity) {
    if (this._layers.length <= entity.layer) {
      for (i = this._layers.length; i <= entity.layer; i++) {
        this._layers.push([]);
      }
    }
    this._layers[entity.layer].push(entity);
    this._entities.push(entity);
    entity.setContext(this._context);
    await entity._ready();
  }

  async setChild(entity: Entity, child: Entity) {
    if (entity.id == child.id) return;
    entity.addChild(child);
    child.setContext(this._context);
    await child._ready();
  }

  removeEntity(entity: Entity) {
    this._layers[entity.layer] = this._layers[entity.layer].filter(
      (item) => item.id != entity.id,
    );
    this._entities = this._entities.filter((item) => item.id != entity.id);
  }

  changeLayer(entity: Entity, newLayer: number) {
    this._layers[entity.layer] = this._layers[entity.layer].filter(
      (item) => item.id != entity.id,
    );
    entity.layer = newLayer;
    if (this._layers.length < entity.layer) {
      for (i = this._layers.length; i < entity.layer; i++) {
        this._layers.push([]);
      }
    }
    this._layers[entity.layer].push(entity);
  }

  draw() {
    const layers = this.layers;
    for (let i = 0; i < layers.length; i++) {
      for (let j = 0; j < layers[i].length; j++) {
        layers[i][j]._draw();
      }
    }
  }

  pointCollition(p: { x: number; y: number }) {
    const v = new V2(p.x, p.y);
    const layers = this.layers;
    for (let i = 0; i < layers.length; i++) {
      for (let j = 0; j < layers[i].length; j++) {
        const entity = layers[i][j];
        if (entity.aabb.pointInside(v) || entity.collider?.pointInside(v)) {
          return entity.pointCollition(v) ?? entity;
        }
      }
    }
  }

  update(time: number) {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i]._update(time);
      /* this.entities[i]._updateLayout(); */
    }
  }

  destroy() {
    this._layers.length = 0;
    this._entities.length = 0;
    this.entityRecord.clear();
  }
}
