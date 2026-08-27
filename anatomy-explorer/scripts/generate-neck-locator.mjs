import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then((value) => { this.result = value; this.onloadend?.(); }); }
};

const root = new THREE.Group();
root.name = 'locator-fullbody-draft';
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xc9b8a5, roughness: 0.82 });
const regionMaterial = new THREE.MeshStandardMaterial({ color: 0xe07a5f, roughness: 0.7 });

const mesh = (name, geometry, material, position, scale = [1, 1, 1]) => {
  const item = new THREE.Mesh(geometry, material);
  item.name = name;
  item.position.set(...position);
  item.scale.set(...scale);
  root.add(item);
};

mesh('head', new THREE.SphereGeometry(0.43, 20, 14), bodyMaterial, [0, 2.3, 0], [1, 1.12, 0.92]);
mesh('region-neck', new THREE.CapsuleGeometry(0.19, 0.22, 5, 12), regionMaterial, [0, 1.72, 0]);
mesh('torso', new THREE.CapsuleGeometry(0.58, 1.25, 7, 16), bodyMaterial, [0, 0.78, 0], [1.15, 1, 0.62]);
mesh('region-shoulder-l', new THREE.SphereGeometry(0.27, 16, 12), regionMaterial, [-0.62, 1.33, 0], [1.12, 0.9, 0.86]);
mesh('region-shoulder-r', new THREE.SphereGeometry(0.27, 16, 12), regionMaterial, [0.62, 1.33, 0], [1.12, 0.9, 0.86]);
mesh('arm-left', new THREE.CapsuleGeometry(0.16, 1.28, 5, 10), bodyMaterial, [-0.76, 0.58, 0], [1, 1, 0.9]);
mesh('arm-right', new THREE.CapsuleGeometry(0.16, 1.28, 5, 10), bodyMaterial, [0.76, 0.58, 0], [1, 1, 0.9]);
mesh('leg-left', new THREE.CapsuleGeometry(0.23, 1.75, 5, 12), bodyMaterial, [-0.3, -1.2, 0]);
mesh('leg-right', new THREE.CapsuleGeometry(0.23, 1.75, 5, 12), bodyMaterial, [0.3, -1.2, 0]);

const exporter = new GLTFExporter();
const output = await new Promise((resolve, reject) => exporter.parse(root, resolve, reject, { binary: true }));
const target = path.join(process.cwd(), 'public', 'anatomy', 'models', 'human-body-locator.glb');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, Buffer.from(output));
console.log(`${target}: ${fs.statSync(target).size} bytes`);
