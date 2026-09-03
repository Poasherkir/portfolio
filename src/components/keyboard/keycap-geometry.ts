import * as THREE from "three";

export const CAP_SIZE = 0.72;
/** Tall enough that the side walls read. */
export const CAP_HEIGHT = 0.42;
const CORNER = 0.09;
const BEVEL = 0.03;
/** How deep the top face is scooped. */
export const DISH_DEPTH = 0.05;

const HALF = CAP_SIZE / 2;

/** The scoop, shared by the cap and its legend so the two never disagree. */
function dishAt(x: number) {
  const n = x / HALF;
  return DISH_DEPTH * Math.max(0, 1 - n * n);
}

function roundedSquare() {
  const w = HALF - CORNER;
  const s = new THREE.Shape();
  s.moveTo(-w, -HALF);
  s.lineTo(w, -HALF);
  s.quadraticCurveTo(HALF, -HALF, HALF, -w);
  s.lineTo(HALF, w);
  s.quadraticCurveTo(HALF, HALF, w, HALF);
  s.lineTo(-w, HALF);
  s.quadraticCurveTo(-HALF, HALF, -HALF, w);
  s.lineTo(-HALF, -w);
  s.quadraticCurveTo(-HALF, -HALF, -w, -HALF);
  return s;
}

function buildCap() {
  const geometry = new THREE.ExtrudeGeometry(roundedSquare(), {
    depth: CAP_HEIGHT,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 6,
    curveSegments: 16,
  });

  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  geometry.computeBoundingBox();

  // Flat top before scooping. Measure from here — the post-dish bounding box
  // is the scooped rim, which sits at a different height.
  const rimY = geometry.boundingBox!.max.y;
  const pos = geometry.attributes.position;
  const from = rimY - BEVEL * 1.2;

  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < from) continue;
    const t = (y - from) / (rimY - from);
    pos.setY(i, y - dishAt(pos.getX(i)) * t);
  }
  pos.needsUpdate = true;

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  return { geometry, rimY };
}

const built = buildCap();

export const CAP_GEOMETRY = built.geometry;
/** Height of the cap's flat top before dishing. Position legends from this. */
export const CAP_RIM_Y = built.rimY;
/**
 * Top-down planar UVs, so the logo is part of the cap's own surface rather than
 * a second plane floating above it. Side-wall vertices sample the texture edge,
 * which is plain cap colour, so the sides come out solid with no smearing.
 */
function applyPlanarUVs(geometry: THREE.BufferGeometry) {
  const pos = geometry.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const span = CAP_SIZE;

  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + span / 2) / span;
    // Flip V so the logo is not mirrored top-to-bottom.
    uv[i * 2 + 1] = 1 - (pos.getZ(i) + span / 2) / span;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

applyPlanarUVs(CAP_GEOMETRY);

/**
 * Rounded box, extruded from a rounded rectangle.
 *
 * three has no rounded box and drei's is the only thing that library was
 * pulled in for. Building it here drops the dependency entirely.
 *
 * The rectangle is drawn in XY and extruded along Z, then rotated so the
 * extrusion runs up the Y axis — which is the orientation the case and plate
 * are placed in.
 */
export function roundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  curveSegments = 5
) {
  // The bevel grows the shape outward by bevelSize on every side, so the
  // rectangle is inset by that much first — otherwise the finished box comes
  // out 2 x bevel too big on both horizontal axes.
  const bevel = Math.min(height * 0.18, radius * 0.5);
  // Never let the corner radius exceed half the shorter side, or the shape
  // self-intersects and the extrude comes out inside-out.
  const inset = Math.max(0, bevel);
  const w = Math.max(0.001, width / 2 - inset);
  const d = Math.max(0.001, depth / 2 - inset);
  const r = Math.max(0.001, Math.min(radius - inset, Math.min(w, d) - 0.001));

  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);

  // The bevel softens the top and bottom edges the way the rounded rectangle
  // softens the vertical ones, so the box reads as moulded rather than cut.
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, height - bevel * 2),
    bevelEnabled: bevel > 0.0005,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: Math.max(1, Math.round(curveSegments / 2)),
    curveSegments,
  });

  // Extrusion runs along +Z; stand it up so it runs along +Y, then centre it.
  geo.rotateX(-Math.PI / 2);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}
