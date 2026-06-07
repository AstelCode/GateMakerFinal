import { MouseEventType, IMouseEvent, Tool } from "@/engine/core";

export class DragAndZoomGridTool extends Tool {
  name: string = "drag-zoom-grid";
  shortcutsEvents: string[] = [];
  mouseEvents: MouseEventType[] = ["down", "drag", "up", "wheel"];
  activationMouseEvents: string[] = ["down", "wheel"];
  activationShortcutsEvents: string[] = [];

  isMouseActive(event: MouseEventType, e: IMouseEvent): boolean {
    if (event == "wheel") return true;
    if (e.button == 1) return true;
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isShortcutActive(_: string): boolean {
    return false;
  }

  onEvent(event: MouseEventType, e: IMouseEvent): void {
    switch (event) {
      case "wheel":
        const grid = this.context.tree.getEntity("GRID")!;
        grid.emit("wheel", e);
        this.disable?.(this);
        break;
      case "down":
      case "drag":
        this.context.tree.getEntity("GRID")?.emit("drag", e);
        break;
      case "up":
        this.disable?.(this);
        break;
      default:
        this.disable?.(this);
        break;
    }
  }

  onShortcutEvent(shortcut: string): void {}
}
