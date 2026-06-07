import {
  IMouseEvent,
  Tool,
  MouseEventType,
  V2,
  KeyEventType,
} from "@/engine/core";

export class SelectionTool extends Tool {
  name: string = "selection";
  mouseEvents: MouseEventType[] = ["down", "drag", "up"];
  shortcutsEvents: string[] = ["Shift"];
  activationMouseEvents: string[] = ["down"];
  activationShortcutsEvents: string[] = ["Shift"];

  isMouseActive(event: MouseEventType, e: IMouseEvent): boolean {
    if (e.button != 0) return false;
    const { entity } = this.context.tree.pointCollition(e);
    return entity?.type == "GRID";
  }
  isShortcutActive(event: string): boolean {
    return true;
  }
  onEvent(name: MouseEventType, e: IMouseEvent): void {
    if (e.button != 0) {
      this.disable?.(this);
      return;
    }
    const selection = this.context.tree.getEntity("SELECTION")!;
    const v = new V2(e.x, e.y);
    selection.getTransformPath().forEach((item) => item.mulVInv(v));

    switch (name) {
      case "down":
        selection.emit("start", v);
        selection.visible = true;
        break;
      case "drag":
        selection.visible = true;
        selection.emit("end", v);
        break;
      case "up":
        selection.visible = false;
        this.disable?.(this);
        return;
    }
  }

  onShortcutEvent(shortcut: string, event: KeyEventType): void {
    console.log(shortcut);
  }
}
