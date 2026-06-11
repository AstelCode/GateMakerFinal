export class V2 {
  private _x: number;
  private _y: number;

  constructor();
  constructor(x: V2);
  constructor(x: number);
  constructor(x: number, y: number);
  constructor(x?: unknown, y?: unknown) {
    if (x instanceof V2) {
      this.copy(x);
      this._x = x._x;
      this._y = x._y;
      return;
    }

    if (y == undefined) {
      if (x != undefined) {
        this._x = x as number;
        this._y = x as number;
        return;
      }
      this._x = this._y = 0;
      return;
    }

    this._x = x as number;
    this._y = y as number;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }

  copy(v: V2) {
    this._x = v._x;
    this._y = v._y;
    return this;
  }

  set(x: number, y: number) {
    this._x = x;
    this._y = y;
    return this;
  }

  clone(): V2 {
    return new V2(this._x, this._y);
  }

  sub(x: number, y: number): V2 {
    this._x -= x;
    this._y -= y;
    return this;
  }

  add(x: number, y: number): V2 {
    this._x += x;
    this._y += y;
    return this;
  }
  div(x: number, y: number): V2 {
    if (x == 0 || y == 0) throw new Error("Division by zero is not allowed.");
    this._x /= x;
    this._y /= y;
    return this;
  }

  mul(x: number, y: number): V2 {
    this._x *= x;
    this._y *= y;
    return this;
  }

  addV(v: V2): V2 {
    this._x += v._x;
    this._y += v._y;
    return this;
  }

  subV(v: V2): V2 {
    this._x -= v._x;
    this._y -= v._y;
    return this;
  }

  divV(v: V2): V2 {
    if (v._x == 0 || v._y == 0)
      throw new Error("Division by zero is not allowed.");
    this._x /= v._x;
    this._y /= v._y;
    return this;
  }

  mulV(v: V2): V2 {
    this._x *= v._x;
    this._y *= v._y;
    return this;
  }

  addS(s: number): V2 {
    this._x += s;
    this._y += s;
    return this;
  }
  subS(s: number): V2 {
    this._x -= s;
    this._y -= s;
    return this;
  }
  divS(s: number): V2 {
    if (s == 0) throw new Error("Division by zero is not allowed.");
    this._x /= s;
    this._y /= s;
    return this;
  }
  mulS(s: number): V2 {
    this._x *= s;
    this._y *= s;
    return this;
  }

  dot(v: V2): number {
    return this._x * v._x + this._y * v._y;
  }

  cross(v: V2): number {
    return this._x * v._y - this._y * v._x;
  }

  length(): number {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  SQRTLength(): number {
    return this._x * this._x + this._y * this._y;
  }

  normalize(): V2 {
    const len = this.length();
    if (len === 0) return new V2(0, 0);
    return new V2(this._x / len, this._y / len);
  }

  tangent(): V2 {
    const len = this.length();
    if (len === 0) return new V2(0, 0);
    const tempX = -this._y / len;
    const tempY = this._x / len;
    return new V2(tempX, tempY);
  }

  angleTo(v: V2): number {
    const dot = this.dot(v);
    const det = this.cross(v);
    return Math.atan2(det, dot);
  }

  angle(): number {
    return Math.atan2(this._y, this._x);
  }

  toArray(): [number, number] {
    return [this._x, this._y];
  }

  snapToGridRound(cellSize: number) {
    this.x = Math.round(this.x / cellSize) * cellSize;
    this.y = Math.round(this.y / cellSize) * cellSize;
    return this;
  }

  snapToGridFloor(cellSize: number) {
    this.x = Math.floor(this.x / cellSize) * cellSize;
    this.y = Math.floor(this.y / cellSize) * cellSize;
    return this;
  }

  snapToGridSmooth(cellSize: number, easing: number = 1) {
    const snappedX = Math.round(this.x / cellSize) * cellSize;
    const snappedY = Math.round(this.y / cellSize) * cellSize;
    this.x += (snappedX - this.x) * easing;
    this.y += (snappedY - this.y) * easing;
    return this;
  }
}
