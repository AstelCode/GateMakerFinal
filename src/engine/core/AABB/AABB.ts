import { V2 } from "../math/Vector";

export class AABB {
  public position: V2;
  private static aux_v: V2 = new V2();

  private leftRelative: number;
  private rightRelative: number;
  private topRelative: number;
  private bottomRelative: number;

  constructor(position: V2 = new V2(), width: number = 0, height: number = 0) {
    /* this.width = width; */
    this.position = position;
    /*  this.height = height; */
    this.position = new V2();
    this.leftRelative = -width / 2;
    this.rightRelative = width / 2;
    this.topRelative = height / 2;
    this.bottomRelative = -height / 2;
  }

  set width(width: number) {
    this.leftRelative = -width / 2;
    this.rightRelative = width / 2;
  }

  get width() {
    return this.right - this.left;
  }
  get height() {
    return this.top - this.bottom;
  }

  set height(height: number) {
    this.topRelative = height / 2;
    this.bottomRelative = -height / 2;
  }

  set size(value: number) {
    this.width = value;
    this.height = value;
  }

  setPosition(position: V2) {
    this.position = position;
  }

  private get left() {
    return this.position.x + this.leftRelative;
  }

  private get right() {
    return this.position.x + this.rightRelative;
  }

  private get top() {
    return this.position.y + this.topRelative;
  }

  private get bottom() {
    return this.position.y + this.bottomRelative;
  }

  public pointInside(v: V2): boolean {
    const d = AABB.aux_v.copy(v).subV(this.position);
    return (
      this.leftRelative < d.x &&
      d.x < this.rightRelative &&
      this.bottomRelative < d.y &&
      d.y < this.topRelative
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
    height: number,
  ) {
    this.fromMaxAndMin(startX + width, startY + height, startX, startY);
    return this;
  }

  public fromPoints(a: V2, b: V2) {
    this.position.x = (a.x + b.x) / 2;
    this.position.y = (a.y + b.y) / 2;
    this.width = Math.abs(a.x - b.x);
    this.height = Math.abs(a.y - b.y);
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

  public combineMultipleRelative(aabbs: AABB[]) {
    if (aabbs.length === 0) {
      return this;
    }

    let maxX = this.rightRelative;
    let minX = this.leftRelative;
    let maxY = this.topRelative;
    let minY = this.bottomRelative;

    for (const aabb of aabbs) {
      maxX = Math.max(maxX, aabb.right);
      minX = Math.min(minX, aabb.left);
      maxY = Math.max(maxY, aabb.top);
      minY = Math.min(minY, aabb.bottom);
    }

    this.leftRelative = minX;
    this.rightRelative = maxX;
    this.topRelative = maxY;
    this.bottomRelative = minY;

    /* this.width = Math.max(Math.abs(maxX), Math.abs(minX)) * 2;
    this.height = Math.max(Math.abs(maxY), Math.abs(minY)) * 2; */
  }
}
