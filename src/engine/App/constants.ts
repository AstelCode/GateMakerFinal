import { createCubicBezier } from "../core";

export const CELL_SIZE = 40;
export const MAX_ZOOM = 1.5;
export const MIN_ZOOM = 0.5;
export const START_T = 0.15;
export const smoothZoom = createCubicBezier(0.45, 0.91, 0.49, 0.98);
export const ZOOM_STEP = 0.045;
