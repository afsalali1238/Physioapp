import fs from 'node:fs';
import path from 'node:path';

const cdpPort = 9223;
const base = 'http://127.0.0.1:4322/preview/anatomy/neck/';
const outputDir = path.join(process.cwd(), 'docs', 'v2-qa');
fs.mkdirSync(outputDir, { recursive: true });

async function target() {
  const page = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  return page.json();
}

async function session() {
  const page = await target();
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const callId = ++id;
    pending.set(callId, { resolve, reject });
    socket.send(JSON.stringify({ id: callId, method, params }));
  });
  return { socket, send };
}

async function runCase(name, url, width, height, setup = '') {
  const { socket, send } = await session();
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 400 });
  if (name.includes('reduced-motion')) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Page.navigate', { url });
  await new Promise((resolve) => setTimeout(resolve, 3500));
  if (setup) await send('Runtime.evaluate', { expression: setup, awaitPromise: true });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const evidence = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const canvas = document.querySelector('[data-canvas]');
      const error = document.querySelector('[data-error]');
      const selected = document.querySelector('[data-selected]');
      const buttons = [...document.querySelectorAll('[data-orientation]')].map(b => ({ view: b.dataset.orientation, pressed: b.getAttribute('aria-pressed') }));
      if (!canvas || canvas.hidden || !canvas.width || !canvas.height) return { canvas: 'unavailable', error: error?.textContent, selected: selected?.textContent, buttons };
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return { canvas: 'no-context', error: error?.textContent, selected: selected?.textContent, buttons };
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let nonZero = 0, min = 255, max = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const sum = pixels[i] + pixels[i+1] + pixels[i+2];
        if (sum > 0) nonZero++;
        min = Math.min(min, pixels[i], pixels[i+1], pixels[i+2]);
        max = Math.max(max, pixels[i], pixels[i+1], pixels[i+2]);
      }
      return { canvas: 'read', width: canvas.width, height: canvas.height, nonZeroPixels: nonZero, totalPixels: canvas.width * canvas.height, minChannel: min, maxChannel: max, nonblank: nonZero > 0 && max > min, selected: selected?.textContent, buttons };
    })()`,
  });
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(outputDir, `${name}.png`), Buffer.from(shot.data, 'base64'));
  socket.close();
  return { name, url, viewport: `${width}x${height}`, ...evidence.result.value };
}

const cases = [
  ['desktop-front', base, 1440, 1100, ''],
  ['desktop-back', `${base}?qa=back`, 1440, 1100, ''],
  ['mobile-360-front', base, 360, 800, ''],
  ['reduced-motion-back', `${base}?qa=back`, 1440, 1100, ''],
  ['webgl-failure', `${base}?qa=webgl-failure`, 1440, 1100, ''],
  ['asset-failure', `${base}?qa=asset-failure`, 1440, 1100, ''],
  ['zoom-200', base, 720, 550, `document.documentElement.style.zoom='2';`],
  ['keyboard-back', base, 1440, 1100, `(() => { const b=document.querySelector('[data-orientation="back"]'); b.focus(); b.click(); document.querySelector('.continue-link').focus(); })()`],
];

const results = [];
for (const item of cases) results.push(await runCase(...item));
fs.writeFileSync(path.join(outputDir, 'pixel-results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
