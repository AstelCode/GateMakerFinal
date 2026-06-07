import {
  EngineContext,
  HandlerCallback,
  IMouseEvent,
  KeyEventType,
  MouseEventType,
} from "@/engine/core";

export abstract class Tool<T extends EngineContext = EngineContext> {
  abstract name: string;
  abstract mouseEvents: MouseEventType[];
  abstract shortcutsEvents: string[];
  abstract activationMouseEvents: string[];
  abstract activationShortcutsEvents: string[];
  priority: number = 1;
  context!: T;
  disable?: (tool: Tool<T>) => void;
  abstract isMouseActive(event: MouseEventType, e: IMouseEvent): boolean;
  abstract isShortcutActive(event: string): boolean;
  abstract onEvent(name: MouseEventType, e: IMouseEvent): void;
  abstract onShortcutEvent(shortcut: string, event: KeyEventType): void;
}

export class ToolManager {
  private toolsMouse: Tool<EngineContext>[] = [];
  private toolsShortcut: Tool[] = [];
  private context!: EngineContext;

  private activeMouseTools: Map<MouseEventType, Tool> = new Map();
  private activeShortcutsTools: Map<string, Tool> = new Map();

  setContext(context: EngineContext) {
    this.context = context;
  }

  addTool(tool: Tool) {
    tool.context = this.context;
    tool.disable = this.disableTool.bind(this);
    if (tool.mouseEvents.length > 0) {
      this.toolsMouse.push(tool);
      this.toolsMouse.sort((a, b) => a.priority - b.priority);
    }
    if (tool.shortcutsEvents.length > 0) {
      this.toolsShortcut.push(tool);
      this.toolsShortcut.sort((a, b) => a.priority - b.priority);
    }
  }

  init() {
    this.context.mouse.on("down", this.mouse_down.bind(this));
    this.context.mouse.on("drag", this.mouse_drag.bind(this));
    this.context.mouse.on("move", this.mouse_move.bind(this));
    this.context.mouse.on("up", this.mouse_up.bind(this));
    this.context.mouse.on("wheel", this.mouse_wheel.bind(this));
    this.context.keyboard.on("keydown", this.keydown.bind(this));
    this.context.keyboard.on("keyup", this.keyup.bind(this));
  }

  destroy() {
    this.activeMouseTools.clear();
  }

  private disableTool = (tool: Tool) => {
    for (const key of tool.mouseEvents) {
      this.activeMouseTools.delete(key as MouseEventType);
    }
    for (const key of tool.shortcutsEvents) {
      this.activeShortcutsTools.delete(key);
    }
  };

  private mouse_down: HandlerCallback = (e: IMouseEvent) => {
    this.activateMouseTool("down", e);
  };

  private mouse_drag: HandlerCallback = (e) => {
    this.activateMouseTool("drag", e);
  };

  private mouse_move: HandlerCallback = (e) => {
    this.activateMouseTool("move", e);
  };

  private mouse_up: HandlerCallback = (e) => {
    this.activateMouseTool("up", e);
  };

  private mouse_wheel: HandlerCallback = (e) => {
    this.activateMouseTool("wheel", e);
  };

  private keydown = () => {
    this.activateShortcutTool("keydown");
  };

  private keyup = () => {
    this.activateShortcutTool("keyup");
  };

  private activateMouseTool(event: MouseEventType, e: IMouseEvent) {
    if (this.activeMouseTools.has(event)) {
      this.activeMouseTools.get(event)?.onEvent(event, e);
      return;
    }

    for (const tool of this.toolsMouse) {
      if (
        tool.activationMouseEvents.indexOf(event) != -1 &&
        tool.isMouseActive(event, e)
      ) {
        for (const key of tool.mouseEvents) {
          this.activeMouseTools.set(key as MouseEventType, tool);
        }
        for (const key of tool.shortcutsEvents) {
          this.activeShortcutsTools.set(key as MouseEventType, tool);
        }
        tool.onEvent(event, e);
        break;
      }
    }
  }

  private activateShortcutTool(event: KeyEventType) {
    for (const shortcut of this.activeShortcutsTools.keys()) {
      if (this.context.keyboard.isActiveShortcut(shortcut)) {
        this.activeShortcutsTools
          .get(shortcut)
          ?.onShortcutEvent(shortcut, event);
        return;
      }
    }

    for (const tool of this.toolsShortcut) {
      for (const shortcut of tool.activationShortcutsEvents) {
        if (
          this.context.keyboard.isActiveShortcut(shortcut) &&
          tool.isShortcutActive(shortcut)
        ) {
          for (const key of tool.shortcutsEvents) {
            this.activeShortcutsTools.set(key as MouseEventType, tool);
          }
          for (const key of tool.mouseEvents) {
            this.activeMouseTools.set(key as MouseEventType, tool);
          }
          tool.onShortcutEvent(shortcut, event);
          break;
        }
      }
    }
  }
}
