/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Engine, EngineContext, Entity, V2 } from "../core";
import { CELL_SIZE, FONTS } from "./constants";
import { Grid } from "./entities/Grid";
import { NodeBase } from "./entities/NodeBase";

interface GateEngineEvents {}

interface GateEngineContext extends EngineContext<GateEngineEvents> {}

export class GateEngine extends Engine<GateEngineEvents, GateEngineContext> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  protected registerAssets(): void {
    this.fontsLoader.registerFonts(FONTS);
  }

  protected ready(): void {
    const grid = new Grid();
    this.tree.addEntity(grid);
    this.tree.setChild(grid, new NodeBase(10, 3));
    const node = new NodeBase(10, 3);
    node.transform.position.y += 400;
    node.transform.updateMatriz();
    this.tree.setChild(grid, node);
    this.initEvents();
  }

  protected initEvents() {
    this.mouse.on("drag", (e) => {
      const grid = this.tree.getEntity("GRID")!;
      grid.emit("drag", e);
    });
    this.mouse.on("wheel", (e) => {
      const grid = this.tree.getEntity("GRID")!;
      grid.emit("wheel", e);
    });

    this.mouse.on("down", (e) => {
      const { entity, v } = this.tree.pointCollition(e);
      entity?.emit("down", v, e);
      /* const grid = this.tree.getEntity("GRID");
      console.log(grid?.collider?.pointInside(new V2(e.x, e.y))); */
      /* const grid = this.tree.getEntity("GRID");
      const v = grid?.emit("toGridPos", e);
      console.log(v); */
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
