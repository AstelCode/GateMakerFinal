import {
  IMouseEvent,
  KeyEventType,
  MouseEventType,
  Tool,
  V2,
} from "@/engine/core";
import { Wire } from "../entities/wire/Wire";
import { Connector } from "../entities/connector/Connector";
import { Grid } from "../entities/grid/Grid";
import { CELL_SIZE } from "../constants";

export class AddWireTool extends Tool {
  name: string = "add-wire";
  mouseEvents: MouseEventType[] = ["move", "down"];
  shortcutsEvents: string[] = [];
  activationMouseEvents: string[] = ["down"];
  activationShortcutsEvents: string[] = [];
  priority: number = 2;

  startConnector!: Connector;
  isMouseActive(event: MouseEventType, e: IMouseEvent): boolean {
    const { entity } = this.context.tree.pointCollition(e);

    if (entity?.type == "CONNECTOR") {
      this.startConnector = entity as Connector;
      return true;
    }
    return false;
  }
  isShortcutActive(event: string): boolean {
    return false;
  }
  grid!: Grid;
  loadEntities() {
    if (this.grid == undefined) {
      this.grid = this.context.tree.getEntity("GRID")! as Grid;
    }
  }

  private currentWire: Wire | undefined;
  onEvent(name: MouseEventType, e: IMouseEvent): void {
    this.loadEntities();

    if (name == "down") {
      const { entity } = this.context.tree.pointCollition(e);
      if (this.currentWire) {
        this.currentWire.addPoint();
        if (
          entity?.type == "CONNECTOR" &&
          entity.id != this.startConnector.id
        ) {
          const v = entity.transform.position.clone();
          entity.mulGlobalTrasform(v, 1);
          this.currentWire.setEnd(v);
          this.currentWire = undefined;
          this.disable?.(this);
          return;
        }
      } else {
        if (!entity) return;
        this.currentWire = new Wire();
        const v = entity.transform.position.clone();
        entity.mulGlobalTrasform(v, 1);
        this.currentWire.setStart(v);
        this.grid.addChild(this.currentWire);
      }
    }

    if (name == "move") {
      const v = new V2(e.x, e.y);
      this.grid.transform.mulVInv(v);
      if (this.currentWire) {
        this.currentWire.moveLast(v);
      }
    }
  }

  onShortcutEvent(shortcut: string, event: KeyEventType): void {}
}
