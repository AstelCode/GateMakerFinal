import { CanvasHandler, Entity, RectangleCollider } from "@/engine/core";

export class $Rect extends Entity {
  private _width!: number;
  private _height!: number;
  protected active!: boolean;
  public _color: string;
  public collider: RectangleCollider;

  constructor(width: number, height: number) {
    super();
    this.collider = new RectangleCollider();
    this.collider.setPosition(this.position);
    this.width = width;
    this.height = height;
    this._color = "red";
    this.active = false;
  }

  set width(value: number) {
    this._width = value;
    this.aabb.width = this._width;
    this.collider.width = this._width;
  }

  set height(value: number) {
    this._height = value;
    this.aabb.height = this.height;
    this.collider.height = this._height;
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  on_down() {
    this.active = !this.active;
    if (this.active) {
      this._color = "red";
    } else {
      this._color = "green";
    }
  }

  ready(): void {
    this.context.assets.addAsset(
      "LOGO",
      async ({ ctx }) => {
        ctx.font = "bold 60px serif";
        ctx.fillStyle = "black"; // Color ANTES de dibujar
        ctx.fillText("hola", 10, 10);
      },
      { image: true },
    );
    this.context.assets.load();
  }

  draw(canvas: CanvasHandler): void {
    const image = this.context.assets.getAsset("LOGO") as HTMLImageElement;
    canvas.ctx.save();

    canvas.ctx.fillStyle = this._color;

    canvas.ctx.fillRect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height,
    );
    if (image) {
      canvas.ctx.drawImage(
        image,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height,
      );
    }
    canvas.ctx.restore();
  }
}
