import {
  IMouseEvent,
  Tool,
  MouseEventType,
  V2,
  KeyEventType,
  Entity,
} from "@/engine/core";
import { GateEngineContext } from "../GateEngine";
import { Selection } from "../entities/selection/Selection";
import { Grid } from "../entities/grid/Grid";
export class SelectionTool extends Tool {
  name: string = "selection";
  mouseEvents: MouseEventType[] = ["down", "drag", "up"];
  shortcutsEvents: string[] = ["Shift"];
  activationMouseEvents: string[] = ["down"];
  activationShortcutsEvents: string[] = ["Shift"];

  isMouseActive(event: MouseEventType, e: IMouseEvent): boolean {
    if (e.button != 0) return false;
    const { entity } = this.context.tree.pointCollition(e);

    return (
      entity?.type == "GRID" || entity?.dragable || entity?.type == "SELECTION"
    );
  }

  isShortcutActive(): boolean {
    return true;
  }

  isDragging: boolean = false;
  selection!: Selection;
  grid!: Grid;

  loadEntities() {
    if (this.selection == undefined) {
      this.selection = this.context.tree.getEntity("SELECTION")! as Selection;
    }
    if (this.grid == undefined) {
      this.grid = this.context.tree.getEntity("GRID")! as Grid;
    }
  }

  onEvent(name: MouseEventType, e: IMouseEvent): void {
    const ctx = this.context as GateEngineContext;
    if (e.button != 0) {
      this.disable?.(this);
      return;
    }
    this.loadEntities();

    if (name == "down") {
      const { entity } = ctx.tree.pointCollition(e);
      const v = new V2(e.x, e.y);
      this.grid.transform.mulVInv(v);
      this.onDown(entity, v);
    }

    if (name == "drag") {
      const v = new V2(e.x, e.y);
      this.grid.transform.mulVInv(v);
      this.onDrag(v, e);
    }

    if (name == "up") {
      this.onUp();
    }
  }

  isShift: boolean = false;

  onDown(entity: Entity | undefined, v: V2) {
    this.selection.emit("start", v);
    this.selection.visible = true;
    const ctx = this.context as GateEngineContext;

    if (!this.isShift && entity?.type != "SELECTION") {
      for (const sl of ctx.activeSelection) {
        sl._destroy();
      }
      ctx.activeSelection = [];
    }

    if (entity?.type == "SELECTION") {
      for (const e of ctx.activeSelection) {
        e.entity?.emit("dragStart");
      }
      this.isDragging = true;
      return;
    }

    if (
      entity?.dragable &&
      !ctx.activeSelection.some((item) => item.entity?.id == entity.id)
    ) {
      this.selectEntities([entity]);
      this.isDragging = true;
    }
  }

  onDrag(v: V2, e: IMouseEvent) {
    const ctx = this.context as GateEngineContext;
    if (this.isDragging) {
      const delta = new V2(e.dx, e.dy);
      this.grid.transform.mulVInv(delta, 0);
      for (const e of ctx.activeSelection) {
        e.entity?.emit("drag", delta);
      }
      return;
    }
    this.selection.visible = true;
    this.selection.emit("end", v);
  }

  onUp() {
    const ctx = this.context as GateEngineContext;
    if (this.isDragging) {
      for (const e of ctx.activeSelection) {
        e.entity?.emit("dragEnd");
      }
      this.isDragging = false;
    }
    this.findCollitions();
    this.selection.visible = false;
    if (!this.isShift) this.disable?.(this);
  }

  findCollitions() {
    const ctx = this.context as GateEngineContext;

    const selection = ctx.tree.getEntity("SELECTION");
    const grid = ctx.tree.getEntity("GRID")!;

    const selectedEntities: Entity[] = [];
    for (const entity of grid.children) {
      if (entity.type == "SELECTION") continue;
      if (ctx.activeSelection.some((item) => item.entity?.id == entity.id))
        continue;
      if (selection?.getAABB().contains(entity.getAABB())) {
        selectedEntities.push(entity);
      }
    }
    this.selectEntities(selectedEntities);
  }

  private selectEntities(selectedEntities: Entity[]) {
    const ctx = this.context as GateEngineContext;
    const grid = ctx.tree.getEntity("GRID")!;
    for (const entity of selectedEntities) {
      const sl = new Selection(entity);
      ctx.activeSelection.push(sl);
      grid.addChild(sl);
    }
  }

  onShortcutEvent(shortcut: string, event: KeyEventType): void {
    if (event == "keydown") {
      this.isShift = true;
    } else {
      this.isShift = false;
    }
  }
}
