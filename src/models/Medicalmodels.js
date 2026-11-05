import * as THREE from 'three';


const std = (color, o = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.1, ...o });
const glass = (color = 0xcfe8f5, opacity = 0.3) =>
  new THREE.MeshStandardMaterial({ color, transparent: true, opacity, roughness: 0.05, metalness: 0, depthWrite: false });
const cyl = (rt, rb, h, m, seg = 48) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);

function roundedRect(w, h, r) {
  const x = -w / 2, y = -h / 2, s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function createGlucometer({ value = '5.6', unit = 'ммоль/л' } = {}) {
  const g = new THREE.Group();

  const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(5.7, 10.2, 1.2), {
    depth: 1.2, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 4, curveSegments: 16,
  });
  bodyGeo.translate(0, 0, -0.6);
  g.add(new THREE.Mesh(bodyGeo, std(0xf5f5f7, { roughness: 0.3 })));

  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 384;
  const tex = new THREE.CanvasTexture(canvas);
  const draw = (v) => {
    const c = canvas.getContext('2d');
    c.fillStyle = '#c6d6bf'; c.fillRect(0, 0, 512, 384);
    c.fillStyle = '#1d261b';
    c.font = 'bold 190px monospace'; c.textAlign = 'center';
    c.fillText(String(v), 256, 215);
    c.font = 'bold 48px monospace';
    c.fillText(unit, 256, 300);
    tex.needsUpdate = true;
  };
  draw(value);
  const bezel = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(4.6, 3.5, 0.3)), std(0x15171a, { roughness: 0.2 }));
  bezel.position.set(0, 1.9, 0.76);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(4.1, 3.075),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  screen.position.set(0, 1.9, 0.77);
  g.add(bezel, screen);

  const btn = (x, y, r, color) => {
    const b = cyl(r, r, 0.2, std(color, { roughness: 0.4 }), 32);
    b.rotation.x = Math.PI / 2;
    b.position.set(x, y, 0.8);
    g.add(b);
  };
  btn(-1.4, -1.1, 0.45, 0x8a93a0);
  btn(1.4, -1.1, 0.45, 0x8a93a0);
  btn(0, -3.0, 0.75, 0x2f6fd6);

  const port = box(1.5, 0.5, 1.0, std(0x15171a));
  port.position.set(0, 5.2, 0);
  const strip = box(0.85, 3, 0.08, std(0xffffff));
  strip.position.set(0, 6.7, 0);
  const stripTip = box(0.85, 0.5, 0.09, std(0x2f6fd6));
  stripTip.position.set(0, 8.0, 0);
  g.add(port, strip, stripTip);

  g.position.y = -1.5;
  g.userData = { setValue: draw };
  return g;
}

const UNIT_Y = (u) => -2.8 + ((u - 10) / 90) * 5.4;

export function createInsulinSyringe({ capOn = true } = {}) {
  const g = new THREE.Group();
  const R = 0.45, H = 7;

  const barrel = cyl(R, R, H, glass(0xe8f4fb, 0.25), 40);
  const flange = cyl(1.0, 1.0, 0.12, std(0xf4f4f4, { transparent: true, opacity: 0.92 }), 40);
  flange.scale.z = 0.65;
  flange.position.y = 3.45;
  const tip = cyl(0.12, 0.38, 0.5, std(0xf4f4f4));
  tip.position.y = -3.75;
  g.add(barrel, flange, tip);

  const W = 256, HP = 2048;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = HP;
  const c = cv.getContext('2d');
  const py = (u) => ((H / 2 - UNIT_Y(u)) / H) * HP;
  c.fillStyle = '#111'; c.strokeStyle = '#111'; c.textBaseline = 'middle';
  c.font = 'bold 46px sans-serif';
  for (let u = 10; u <= 100; u += 2) {
    const major = u % 10 === 0, y = py(u);
    c.lineWidth = major ? 4 : 3;
    c.beginPath(); c.moveTo(22, y); c.lineTo(22 + (major ? 46 : 22), y); c.stroke();
    if (major) c.fillText(String(u), 80, y);
  }
  c.font = 'bold 34px sans-serif';
  c.fillText('Units', 60, py(100) - 70);
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 8;
  if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
  const arc = 1.9;
  g.add(new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.006, R + 0.006, H, 40, 1, true, -arc / 2, arc),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  ));

  const liqGeo = new THREE.CylinderGeometry(R - 0.06, R - 0.06, 1, 32);
  liqGeo.translate(0, 0.5, 0);
  const liquid = new THREE.Mesh(liqGeo, std(0xeaf2ff, { transparent: true, opacity: 0.45, roughness: 0.2 }));
  liquid.position.y = -H / 2;

  const plunger = new THREE.Group();
  const stopper = cyl(R - 0.02, R - 0.02, 0.9, std(0x151515, { roughness: 0.85 }), 32);
  stopper.position.y = 0.45;
  const rodMat = std(0xf4f4f4);
  const r1 = box(0.8, 6.8, 0.1, rodMat), r2 = box(0.1, 6.8, 0.8, rodMat);
  r1.position.y = r2.position.y = 0.9 + 3.4;
  const pad = cyl(0.85, 0.85, 0.35, rodMat, 40);
  pad.position.y = 0.9 + 6.8 + 0.17;
  plunger.add(stopper, r1, r2, pad);
  g.add(liquid, plunger);

  const needle = cyl(0.015, 0.015, 0.9, std(0xd8d8d8, { metalness: 0.9, roughness: 0.2 }), 8);
  needle.position.y = -4.45;
  const orange = std(0xff7a1a, { roughness: 0.4 });
  const cap = new THREE.Group();
  const capBody = cyl(0.38, 0.33, 3.5, orange, 32);
  capBody.position.y = -5.65;
  const rim = cyl(0.46, 0.46, 0.18, orange, 32);
  rim.position.y = -7.5;
  cap.add(capBody, rim);
  cap.visible = capOn;
  g.add(needle, cap);

  g.userData = { plunger, liquid, cap, needle };
  setInsulinSyringeUnits(g, 30);
  return g;
}

export function setInsulinSyringeUnits(syringe, units) {
  const y = UNIT_Y(THREE.MathUtils.clamp(units, 0, 100));
  syringe.userData.plunger.position.y = y;
  syringe.userData.liquid.scale.y = Math.max(0.001, y + 3.5);
}