import { createCubicBezier } from "../core";

export const CELL_SIZE = 50;
export const MAX_ZOOM = 1.5;
export const MIN_ZOOM = 0.3;
export const START_T = 0.15;
export const smoothZoom = createCubicBezier(0.45, 0.91, 0.49, 0.98);
export const ZOOM_STEP = 0.045;
export const FONTS_DATA = [
  { name: "Orbitron", url: "/fonts/Orbitron-Regular.ttf" },
];

export enum FONTS {
  Orbitron = "Orbitron",
}

export const GRID_DOT_SIZE = 10;
export const GRID_DOT_RADIUS = 4;
export const GRID_DOT_COLOR = "#434343";

export const BACKGROUND = "#080808";
export const CONECTOR_COLOR_HOVER = "#76e68e";
export const CONECTOR_COLOR = "#dfdfdf";
export const CONECTOR_SIZE = 24;
export const CONNECTOR_RADIUS = 4;
