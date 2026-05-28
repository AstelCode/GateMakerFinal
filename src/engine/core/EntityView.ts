/* eslint-disable @typescript-eslint/no-explicit-any */
import { EngineContext } from "./Engine";

export abstract class EntityView<T> {
  protected _context!: EngineContext<any>;
  protected _layer: number = 0;
  protected _logic!: T;

  constructor(logic: T) {
    this._logic = logic;
  }

  set logic(entity: T) {
    this._logic = entity;
  }

  get logic() {
    return this._logic;
  }

  async loadAssets() {}

  setContext(context: EngineContext<any>) {
    this.context = context;
  }

  setLayer(layer: number) {
    this.layer = layer;
  }

  get layer() {
    return this._layer;
  }

  set layer(value: number) {
    this._layer = value;
  }

  set context(value: EngineContext<any>) {
    this._context = value;
  }

  get context() {
    return this._context;
  }

  render() {}
  afterDrawChilds() {}
}
