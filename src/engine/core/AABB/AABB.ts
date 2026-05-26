import { V2 } from "../math/Vector";

export class AABB {
  public width: number;
  public height: number;
  public position: V2;
  private static aux_v: V2 = new V2();
  constructor(position: V2 = new V2(), width: number = 0, height: number = 0) {
    this.width = width;
    this.position = position;
    this.height = height;
    this.position = new V2();
  }

  setPosition(position: V2) {
    this.position = position;
  }

  get left() {
    return this.position.x - this.width / 2;
  }

  get right() {
    return this.position.x + this.width / 2;
  }

  get top() {
    return this.position.y + this.height / 2;
  }

  get bottom() {
    return this.position.y - this.height / 2;
  }

  public pointInside(v: V2): boolean {
    const d = AABB.aux_v.copy(v).subV(this.position);
    return (
      -this.width / 2 < d.x &&
      d.x < this.width / 2 &&
      -this.height / 2 < d.y &&
      d.y < this.height / 2
    );
  }

  public fromMaxAndMin(maxX: number, maxY: number, minX: number, minY: number) {
    this.position.x = (maxX + minX) / 2;
    this.position.y = (minY + maxY) / 2;
    this.width = maxX - minX;
    this.height = maxY - minY;
    return this;
  }

  public fromRect(
    startX: number,
    startY: number,
    width: number,
    height: number
  ) {
    this.fromMaxAndMin(startX + width, startY + height, startX, startY);
    return this;
  }

  public combine(other: AABB): AABB {
    const maxX = Math.max(this.right, other.right);
    const minX = Math.min(this.left, other.left);
    const maxY = Math.max(this.top, other.top);
    const minY = Math.min(this.bottom, other.bottom);

    this.fromMaxAndMin(maxX, maxY, minX, minY);
    return this;
  }

  public combineMultiple(aabbs: AABB[]): AABB {
    if (aabbs.length === 0) {
      return this;
    }

    let maxX = this.right;
    let minX = this.left;
    let maxY = this.top;
    let minY = this.bottom;

    for (const aabb of aabbs) {
      maxX = Math.max(maxX, aabb.right);
      minX = Math.min(minX, aabb.left);
      maxY = Math.max(maxY, aabb.top);
      minY = Math.min(minY, aabb.bottom);
    }

    this.fromMaxAndMin(maxX, maxY, minX, minY);
    return this;
  }
}
