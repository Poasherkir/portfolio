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
