/* eslint-disable @typescript-eslint/no-explicit-any */
import { EngineContext } from "./Engine";
import { Entity } from "./Entity";

let i;
export class EntityTree {
  private _layers: Entity[][]; // canvas rendering context 2d
  private _entities: Entity[];
  private _context!: EngineContext<any>;

  constructor() {
    this._layers = [];
    this._entities = [];
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

  destroy() {
    this._layers.length = 0;
    this._entities.length = 0;
  }
}
