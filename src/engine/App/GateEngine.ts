/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Engine, EngineContext, Entity, V2 } from "../core";
import { $Rect } from "./entities/$Rect";
import { Grid } from "./entities/Grid";

interface GateEngineEvents {}

interface GateEngineContext extends EngineContext<GateEngineEvents> {}

export class GateEngine extends Engine<GateEngineEvents, GateEngineContext> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  private grid: Entity = new Grid();
  protected ready(): void {
    this.tree.addEntity(this.grid);
    this.initEvents();
  }

  protected initEvents() {
    this.mouse.on("drag", (e) => {
      this.grid.emit("drag", e);
    });
    this.mouse.on("wheel", (e) => {
      this.grid.emit("wheel", e);
    });
    /*     this.mouseController.on("down", ({ x, y }) => {
      if (this.rect) return;
      const mousePos = new V2(x, y);
      const layers = this.entityTree.layers;

      for (let i = 0; i < layers.length; i++) {
        for (let j = 0; j < layers[i].length; j++) {
          const entity = layers[i][j];
          if (entity.collider?.pointInside(mousePos)) {
            this.rect = entity;
            return;
          }
        }
      }
    });

    this.mouseController.on("drag", ({ x, y, dx, dy }) => {
      if (this.rect) {
        this.rect.position.x += dx;
        this.rect.position.y += dy;
      }
    });

    this.mouseController.on("up", ({ x, y }) => {
      this.rect = undefined;
    }); */
  }
}
