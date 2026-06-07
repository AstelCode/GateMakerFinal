import { MouseEventType, IMouseEvent, Tool } from "@/engine/core";

export class ZoomGridTool extends Tool {
  name: string = "zoom-grid";
  mouseEvents: MouseEventType[] = ["wheel"];
  shortcutsEvents: string[] = [];
  activationMouseEvents: string[] = ["wheel"];
  activationShortcutsEvents: string[] = [];

  isMouseActive(event: MouseEventType, e: IMouseEvent): boolean {
    return true;
  }
  isShortcutActive(event: string): boolean {
    return false;
  }
  onEvent(name: MouseEventType, e: IMouseEvent): void {
    if (e.button != 0) {
      this.disable?.(this);
      return;
    }
    switch (name) {
      case "wheel":
        const grid = this.context.tree.getEntity("GRID")!;
        grid.emit("wheel", e);
        break;
      default:
        this.disable?.(this);
        break;
    }
  }
  onShortcutEvent(shortcut: string): void {}
}
