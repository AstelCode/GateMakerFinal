import { MouseEventType, IMouseEvent, Tool } from "@/engine/core";

export class DragGridTool extends Tool {
  name: string = "drag-grid";
  shortcutsEvents: string[] = [];
  mouseEvents: MouseEventType[] = ["down", "drag", "up"];
  activationMouseEvents: string[] = ["down"];
  activationShortcutsEvents: string[] = [];

  isMouseActive(event: MouseEventType, e: IMouseEvent): boolean {
    if (e.button != 1 /*! middle button */) return false;
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isShortcutActive(_: string): boolean {
    return false;
  }

  onEvent(event: MouseEventType, e: IMouseEvent): void {
    if (e.button != 1) {
      this.disable?.(this);
      return;
    }
    switch (event) {
      case "drag":
        this.context.tree.getEntity("GRID")?.emit("drag", e);
        break;
      case "up":
        this.disable?.(this);
        break;
    }
  }

  onShortcutEvent(shortcut: string): void {}
}
