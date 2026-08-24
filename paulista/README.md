# Paulista — Cinematic still-to-video (Remotion)

Turns a single photorealistic still into a cinematic vertical clip: a slow
camera push-in with simulated tracking drift, a warm daylight grade, vignette,
soft letterbox falloff, film grain, and fade in/out.

Composition: **`Paulista`** — 4K vertical (2160×3840), 30fps, 8s.

## 1. Add your frame

Save your image as **`public/paulista.jpg`** (keep the filename — no code change
needed). Until you do, the composition renders a placeholder telling you where
the file goes.

## 2. Preview in Studio

```bash
npm run dev
# or: npx remotion studio --no-open
```

Every look parameter (zoom, pan, vignette, grade, grain, letterbox, fades) is
editable live in the right-hand props panel.

## 3. Render

```bash
npx remotion render Paulista out/paulista.mp4
```

## Browser note (this environment)

Remotion's own Chromium download host is blocked here, so `remotion.config.ts`
points at the pre-installed headless Chromium. Override the path if needed:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/headless_shell npx remotion render
```
