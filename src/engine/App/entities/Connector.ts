import { Entity, RectangleCollider, V2 } from "@/engine/core";
import {
  CONECTOR_COLOR,
  CONECTOR_COLOR_HOVER,
  CONECTOR_SIZE,
  GRID_DOT_RADIUS,
} from "../constants";

export class Connector extends Entity {
  public collider: RectangleCollider;
  public color: string;

  constructor(
    public name: string,
    position: V2,
  ) {
    super();
    this.collider = new RectangleCollider();
    this.collider.setPosition(this.transform.position);
    this.aabb.setPosition(this.transform.position);
    this.collider.width = CONECTOR_SIZE;
    this.collider.height = CONECTOR_SIZE;
    this.aabb.width = CONECTOR_SIZE;
    this.aabb.height = CONECTOR_SIZE;
    this.transform.position.copy(position);
    this.transform.updateMatriz();
    this.color = CONECTOR_COLOR;
  }

  on_hover() {
    this.color = CONECTOR_COLOR_HOVER;
  }

  on_leave() {
    this.color = CONECTOR_COLOR;
  }

  draw(): void {
    const r = this.context.renderer;
    r.save();
    r.transform(this.transform);
    r.fill(this.color);
    r.fillRect(
      -CONECTOR_SIZE / 2,
      -CONECTOR_SIZE / 2,
      CONECTOR_SIZE,
      CONECTOR_SIZE,
      GRID_DOT_RADIUS,
    );
    r.restore();
    /*     const canvas = this.context.renderer;
    const ctx = canvas.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.transform(...this.transform.toTransformParams());
    ctx.fillStyle = this.color;
    ctx.roundRect(
      -CONECTOR_SIZE / 2,
      -CONECTOR_SIZE / 2,
      CONECTOR_SIZE,
      CONECTOR_SIZE,
      GRID_DOT_RADIUS,
    );
    ctx.fill();
    ctx.restore(); */
  }
}
