export function createCubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  // Las coordenadas X deben estar estrictamente entre 0 y 1
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
    throw new Error("Los valores de X deben estar entre 0 y 1");
  }

  // Fórmulas polinomiales implícitas de Bézier
  const A = (aA1: number, aA2: number) => 1.0 - 3.0 * aA2 + 3.0 * aA1;
  const B = (aA1: number, aA2: number) => 3.0 * aA2 - 6.0 * aA1;
  const C = (aA1: number) => 3.0 * aA1;

  // Calcula la coordenada (X o Y) para un punto 't' dado
  const calcBezier = (t: number, a1: number, a2: number) =>
    ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;

  // Obtiene la pendiente (derivada) en un punto 't' para el método Newton-Raphson
  const getSlope = (t: number, a1: number, a2: number) =>
    3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1);

  // Busca el valor de 't' que corresponde al tiempo 'x' solicitado
  function getTForX(xSolve: number) {
    let t = xSolve;
    // Realiza 4 iteraciones del método Newton-Raphson (suficiente para precisión visual)
    for (let i = 0; i < 4; ++i) {
      const slope = getSlope(t, x1, x2);
      if (slope === 0.0) return t;
      const currentX = calcBezier(t, x1, x2) - xSolve;
      t -= currentX / slope;
    }
    return t;
  }

  // Retorna la función que recibe el tiempo (0 a 1) y devuelve el progreso (0 a 1)
  return function (x: number) {
    if (x === 0 || x === 1) return x;
    return calcBezier(getTForX(x), y1, y2);
  };
}
