/* eslint-disable @typescript-eslint/no-explicit-any */
import { EngineContext } from "./Engine";

export abstract class EntityView<T> {
  protected _context!: EngineContext<any>;
  protected _layer: number = 0;
  protected _data!: T;

  constructor(logic: T) {
    this._data = logic;
  }

  set data(entity: T) {
    this._data = entity;
  }

  get data() {
    return this._data;
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
  renderAbsolute() {}
}
