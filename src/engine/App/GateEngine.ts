/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Engine, EngineContext, Entity } from "../core";
import { IFontData } from "../core/assetManager";
import { FONTS_DATA } from "./constants";
import { Grid } from "./entities/grid/Grid";
import { NodeBase } from "./entities/NodeBase/NodeBase";
import { DragAndZoomGridTool } from "./tools/DragAndZoomGridTool";
import { Selection } from "./entities/selection/Selection";
import { SelectionTool } from "./tools/SelectionTool";
import { AddWireTool } from "./tools/AddWireTool";

export interface GateEngineEvents {}

export interface GateEngineContext extends EngineContext<GateEngineEvents> {
  activeSelection: Selection[];
}

export class GateEngine extends Engine<GateEngineEvents, GateEngineContext> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.toolManager.setContext(this.context);
    this.toolManager.addTool(new DragAndZoomGridTool());
    this.toolManager.addTool(new SelectionTool());
    this.toolManager.addTool(new AddWireTool());
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
    const node1 = new NodeBase(10, 3);
    node1.transform.position.y += 800;
    node1.transform.updateMatriz();
    grid.addChild(node1);
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

  protected createContext(): GateEngineContext {
    const context = super.createContext();
    context.activeSelection = [];
    return context;
  }
}
