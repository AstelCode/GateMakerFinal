/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Engine, EngineContext, Entity, V2 } from "../core";
import { IFontData } from "../core/assetManager";
import { FONTS_DATA } from "./constants";
import { Grid } from "./entities/grid/Grid";
import { NodeBase } from "./entities/NodeBase/NodeBase";

interface GateEngineEvents {}

interface GateEngineContext extends EngineContext<GateEngineEvents> {}

export class GateEngine extends Engine<GateEngineEvents, GateEngineContext> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  protected registerAssets(): void {
    this.assets.register<IFontData>("font", "default", FONTS_DATA);
  }

  protected ready(): void {
    const grid = new Grid();
    this.tree.addEntity(grid);
    grid.addChild(new NodeBase(10, 3));
    const node = new NodeBase(10, 3);
    node.transform.position.y += 400;
    node.transform.updateMatriz();
    grid.addChild(node);
    this.initEvents();
  }

  selectedNode: Entity | undefined = undefined;
  activeNode: Entity | undefined = undefined;
  protected initEvents() {
    this.mouse.on("drag", (e) => {
      if (!this.activeNode) return;
      if (!this.activeNode.dragable) return;
      const v = new V2(e.dx, e.dy);
      this.activeNode.getTransformPath().forEach((item) => item.mulVInv(v, 0));
      this.activeNode.emit("drag", e, v);
      /*       if (this.activeNode instanceof Grid) {
        return;
      } */

      //if(this.)

      /* const v = new V2(e.dx, e.dy);
      this.activeNode.getTransformPath().forEach((item) => item.mulVInv(v, 0));
      this.activeNode.transform.position.addV(v);
      this.activeNode.transform.updateMatriz(); */
      //if()
    });
    this.mouse.on("wheel", (e) => {
      const grid = this.tree.getEntity("GRID")!;
      grid.emit("wheel", e);
    });

    this.mouse.on("down", (e) => {
      const { entity, v } = this.tree.pointCollition(e);
      entity?.emit("down", v, e);
      entity?.emit("dragStart");
      this.activeNode = entity;
    });

    this.mouse.on("move", (e) => {
      const { entity, v } = this.tree.pointCollition(e);
      if (this.selectedNode) {
        this.selectedNode.emit("leave");
      }
      this.selectedNode = entity;
      entity?.emit("hover", v, e);
    });

    // this.mouse.on("drag", ({ dx, dy }) => {});

    this.mouse.on("up", () => {
      this.activeNode?.emit("dragEnd");
      this.activeNode = undefined;
    });
  }
}
