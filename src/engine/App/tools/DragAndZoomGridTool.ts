import { MouseEventType, IMouseEvent, Tool } from "@/engine/core";

export class DragAndZoomGridTool extends Tool {
  name: string = "drag-zoom-grid";
  shortcutsEvents: string[] = [];
  mouseEvents: MouseEventType[] = [
    "down:wheel",
    "drag:wheel",
    "up:wheel",
    "wheel",
  ];
  activationMouseEvents: string[] = ["down:wheel", "wheel"];
  activationShortcutsEvents: string[] = [];
  priority: number = 0;

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
      case "down:wheel":
      case "drag:wheel":
        if (e.button != 1) {
          this.disable?.(this);
          break;
        }
        this.context.tree.getEntity("GRID")?.emit("drag", e);
        break;
      case "up:wheel":
        this.disable?.(this);
        break;
      default:
        this.disable?.(this);
        break;
    }
  }

  onShortcutEvent(shortcut: string): void {}
}
