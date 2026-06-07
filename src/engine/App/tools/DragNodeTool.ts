import { MouseEventType, IMouseEvent, Entity, V2, Tool } from "@/engine/core";

export class DragNodeTool extends Tool {
  name: string = "drag-node";
  mouseEvents: MouseEventType[] = ["down", "drag", "up"];
  shortcutsEvents: string[] = [];
  activationMouseEvents: string[] = ["down"];
  activeNode?: Entity;
  activationShortcutsEvents: string[] = [];

  isMouseActive(event: MouseEventType, e: IMouseEvent): boolean {
    if (e.button != 0) return false;
    const { entity } = this.context.tree.pointCollition(e);
    if (entity?.type == "NODE") {
      this.activeNode = entity;
      return true;
    }
    return false;
  }

  isShortcutActive(event: string): boolean {
    return false;
  }

  onEvent(name: MouseEventType, e: IMouseEvent): void {
    switch (name) {
      case "drag":
        if (!this.activeNode) return;
        const v = new V2(e.dx, e.dy);
        this.activeNode
          .getTransformPath()
          .forEach((item) => item.mulVInv(v, 0));
        this.activeNode?.emit("drag", v);
        break;
      case "up":
        this.activeNode?.emit("dragEnd");
        this.activeNode = undefined;

        this.disable?.(this);
        break;
    }
  }
  onShortcutEvent(shortcut: string): void {}
}
