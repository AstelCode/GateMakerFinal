import { V2 } from "./Vector";

type M3Data = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];
export class M3 {
  private _data: M3Data;
  private domMatriz: DOMMatrix;

  constructor(m?: M3) {
    if (m) {
      this._data = m._data.slice() as M3Data;
    } else {
      this._data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
    this.domMatriz = new DOMMatrix();
  }

  /**
   * Translación: mueve la matriz por tx, ty
   */
  translate(tx: number, ty: number): void {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this._data;
    this._data[2] = m0 * tx + m1 * ty + m2;
    this._data[5] = m3 * tx + m4 * ty + m5;
  }

  /**
   * Asigna la translación directamente (reemplaza los valores actuales)
   * No afecta el escalado o rotación
   */
  setTranslation(tx: number, ty: number): void {
    this._data[2] = tx;
    this._data[5] = ty;
  }

  /**
   * Asigna la rotación directamente (reemplaza los valores actuales)
   * Mantiene la escala existente
   */
  setRotation(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Extraer la escala actual
    const sx = Math.sqrt(
      this._data[0] * this._data[0] + this._data[1] * this._data[1],
    );
    const sy = Math.sqrt(
      this._data[3] * this._data[3] + this._data[4] * this._data[4],
    );

    // Aplicar rotación con escala preservada
    this._data[0] = cos * sx;
    this._data[1] = -sin * sy;
    this._data[3] = sin * sx;
    this._data[4] = cos * sy;
  }

  /**
   * Asigna la escala directamente (reemplaza los valores actuales)
   * No afecta la translación o rotación
   */
  setScale(sx: number, sy: number): void {
    this._data[0] = sx;
    this._data[4] = sy;
  }

  /**
   * Rotación: rota la matriz por un ángulo en radianes
   */
  rotate(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this._data;

    this._data[0] = m0 * cos + m1 * sin;
    this._data[1] = m0 * -sin + m1 * cos;
    this._data[3] = m3 * cos + m4 * sin;
    this._data[4] = m3 * -sin + m4 * cos;
  }

  /**
   * Escalado: escala la matriz por sx, sy
   */
  scale(sx: number, sy: number): void {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this._data;
    this._data[0] = m0 * sx;
    this._data[1] = m1 * sy;
    this._data[3] = m3 * sx;
    this._data[4] = m4 * sy;
  }

  /**
   * Combinado: aplica rotación, escala y translación en una sola operación
   * Orden: R * S * T (Rotación * Escala * Traslación)
   */
  transform(
    tx: number,
    ty: number,
    angle: number,
    sx: number,
    sy: number,
  ): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Componentes de R * S
    const a = cos * sx;
    const b = -sin * sy;
    const c = sin * sx;
    const d = cos * sy;

    // (R * S) * T
    this._data[0] = a;
    this._data[1] = b;
    this._data[2] = a * tx + b * ty;
    this._data[3] = c;
    this._data[4] = d;
    this._data[5] = c * tx + d * ty;
  }

  /**
   * Multiplica esta matriz con otra matriz
   * Actualiza esta matriz con el resultado: this = this * other
   */
  mul(other: M3): void {
    const [a0, a1, a2, a3, a4, a5, a6, a7, a8] = this._data;
    const [b0, b1, b2, b3, b4, b5, b6, b7, b8] = other._data;

    this._data[0] = a0 * b0 + a1 * b3 + a2 * b6;
    this._data[1] = a0 * b1 + a1 * b4 + a2 * b7;
    this._data[2] = a0 * b2 + a1 * b5 + a2 * b8;
    this._data[3] = a3 * b0 + a4 * b3 + a5 * b6;
    this._data[4] = a3 * b1 + a4 * b4 + a5 * b7;
    this._data[5] = a3 * b2 + a4 * b5 + a5 * b8;
    this._data[6] = a6 * b0 + a7 * b3 + a8 * b6;
    this._data[7] = a6 * b1 + a7 * b4 + a8 * b7;
    this._data[8] = a6 * b2 + a7 * b5 + a8 * b8;
  }

  mulV(v: V2) {
    v.x = v.x * this._data[0] + v.y * this._data[1] + this._data[2];
    v.y = v.x * this._data[3] + v.y * this._data[4] + this._data[5];
    return v;
  }

  /**
   * Calcula la inversa de la matriz
   * Actualiza esta matriz con su inversa
   */
  inv(): void {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8] = this._data;

    // Calcular el determinante
    const det =
      m0 * (m4 * m8 - m5 * m7) -
      m1 * (m3 * m8 - m5 * m6) +
      m2 * (m3 * m7 - m4 * m6);

    // Si el determinante es cero, la matriz no es invertible
    if (Math.abs(det) < 1e-10) {
      console.warn("La matriz no es invertible (determinante = 0)");
      return;
    }

    const inv = 1 / det;

    // Calcular la matriz inversa
    this._data[0] = (m4 * m8 - m5 * m7) * inv;
    this._data[1] = -(m1 * m8 - m2 * m7) * inv;
    this._data[2] = (m1 * m5 - m2 * m4) * inv;
    this._data[3] = -(m3 * m8 - m5 * m6) * inv;
    this._data[4] = (m0 * m8 - m2 * m6) * inv;
    this._data[5] = -(m0 * m5 - m2 * m3) * inv;
    this._data[6] = (m3 * m7 - m4 * m6) * inv;
    this._data[7] = -(m0 * m7 - m1 * m6) * inv;
    this._data[8] = (m0 * m4 - m1 * m3) * inv;
  }

  /**
   * Crea una matriz de translación estática
   */
  static translation(tx: number, ty: number): M3 {
    const matrix = new M3();
    matrix._data = [1, 0, tx, 0, 1, ty, 0, 0, 1] as M3Data;
    return matrix;
  }

  /**
   * Crea una matriz de rotación estática
   */
  static rotation(angle: number): M3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const matrix = new M3();
    matrix._data = [cos, -sin, 0, sin, cos, 0, 0, 0, 1] as M3Data;
    return matrix;
  }

  /**
   * Crea una matriz de escalamiento estática
   */
  static scale(sx: number, sy: number): M3 {
    const matrix = new M3();
    matrix._data = [sx, 0, 0, 0, sy, 0, 0, 0, 1] as M3Data;
    return matrix;
  }

  /**
   * Aplica la matriz al contexto de canvas
   * Extrae los valores de transformación 2D: a, b, c, d, e, f
   */
  applyToCanvas(ctx: CanvasRenderingContext2D): void {
    const [m0, m1, m2, m3, m4, m5] = this._data;
    ctx.setTransform(m0, m3, m1, m4, m2, m5);
  }

  toDOMMatriz() {
    const [m0, m1, m2, m3, m4, m5] = this._data;
    this.domMatriz.a = m0;
    this.domMatriz.b = m3;
    this.domMatriz.c = m1;
    this.domMatriz.d = m4;
    this.domMatriz.e = m2;
    this.domMatriz.f = m5;
    return this.domMatriz;
  }

  /**
   * Obtiene los valores de transformación 2D [a, b, c, d, e, f]
   * compatibles con canvas.setTransform()
   */
  getCanvasTransform(): [number, number, number, number, number, number] {
    const [m0, m1, m2, m3, m4, m5] = this._data;
    return [m0, m3, m1, m4, m2, m5];
  }

  /**
   * Obtiene todos los datos de la matriz
   */
  getData(): M3Data {
    return this._data.slice() as M3Data;
  }
}
