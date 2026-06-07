/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Engine, EngineContext, Entity } from "../core";
import { IFontData } from "../core/assetManager";
import { FONTS_DATA } from "./constants";
import { Grid } from "./entities/grid/Grid";
import { NodeBase } from "./entities/NodeBase/NodeBase";
import { ZoomGridTool } from "./tools/ZoomGridTool";
import { DragGridTool } from "./tools/DragGridTool";
import { DragNodeTool } from "./tools/DragNodeTool";
import { Selection } from "./entities/selection/Selection";
import { SelectionTool } from "./tools/SelectionTool";

export interface GateEngineEvents {}

export interface GateEngineContext extends EngineContext<GateEngineEvents> {}

export class GateEngine extends Engine<GateEngineEvents, GateEngineContext> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.toolManager.setContext(this.context);
    this.toolManager.addTool(new ZoomGridTool());
    this.toolManager.addTool(new DragGridTool());
    this.toolManager.addTool(new DragNodeTool());
    this.toolManager.addTool(new SelectionTool());
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
    grid.addChild(new Selection());
    this.initEvents();
  }

  selectedNode: Entity | undefined = undefined;
  activeNode: Entity | undefined = undefined;

  protected initEvents() {
    this.toolManager.init();
  }
  public destroy(): void {
    super.destroy();
    this.toolManager.destroy();
  }
}
