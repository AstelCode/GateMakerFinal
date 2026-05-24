import { V2 } from "../math/Vector";
import { Collider } from "./Collider";

export class PathCollider extends Collider {
  private _path: V2[] = [];
  private _width: number = 0;

  constructor();
  constructor(path: V2[] = [], width: number = 0) {
    super();
    this._path = path;
    this._width = width;
  }

  get path() {
    return this._path;
  }

  get width() {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  public updateAABB() {
    let maxX = 0,
      maxY = 0;
    let minY = Number.MAX_VALUE,
      minX = Number.MAX_VALUE;
    for (const v of this.path) {
      maxX = Math.max(v.x, maxX);
      maxY = Math.max(v.y, maxY);
      minX = Math.min(v.x, minX);
      minY = Math.min(v.y, minY);
    }

    this.aabb.fromMaxAndMin(maxX, maxY, minX, minY);
  }

  public pointInside(v: V2): boolean {
    if (!this.aabb.pointInside(v)) return false;
    const radius = this._width / 2;

    // Check each line segment in the path
    for (let i = 0; i < this._path.length - 1; i++) {
      const p1 = this._path[i];
      const p2 = this._path[i + 1];

      // Calculate distance from point to line segment
      const distance = this.distancePointToSegment(v, p1, p2);

      if (distance <= radius) {
        return true;
      }
    }

    return false;
  }

  private distancePointToSegment(p: V2, a: V2, b: V2): number {
    // Vector from a to b
    const abx = b.x - a.x;
    const aby = b.y - a.y;

    // Vector from a to p
    const apx = p.x - a.x;
    const apy = p.y - a.y;

    // Square length of segment ab
    const abLengthSq = abx * abx + aby * aby;

    if (abLengthSq === 0) {
      // a and b are the same point
      return Math.sqrt(apx * apx + apy * apy);
    }

    // Parameter t of the closest point on the line
    let t = (apx * abx + apy * aby) / abLengthSq;

    // Clamp t to [0, 1] to stay within the segment
    t = Math.max(0, Math.min(1, t));

    // Closest point on the segment
    const closestX = a.x + t * abx;
    const closestY = a.y + t * aby;

    // Distance from p to closest point
    const dx = p.x - closestX;
    const dy = p.y - closestY;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
