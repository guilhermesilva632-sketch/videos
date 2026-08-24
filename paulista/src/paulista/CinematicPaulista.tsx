import React, { useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CinematicProps } from "./schema";

// Smooth, film-like ease used for the whole camera move.
const CINEMATIC_EASE = Easing.bezier(0.33, 0, 0.2, 1);

// Fallback shown until the real frame is dropped into /public.
// Keeps the Studio and renders working out of the box.
const Placeholder: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(160deg, #2b2f36 0%, #3c4048 45%, #1b1d22 100%)",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.92)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 32 }}>🎞️</div>
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>
          Add your frame
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 28,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Save your image as
          <br />
          <code style={{ color: "#7fd1ff" }}>public/paulista.jpg</code>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CinematicPaulista: React.FC<CinematicProps> = ({
  imageSrc,
  zoomStart,
  zoomEnd,
  panX,
  panY,
  vignette,
  grade,
  grain,
  letterbox,
  fadeInSeconds,
  fadeOutSeconds,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();

  const [imageFailed, setImageFailed] = useState(false);

  // Normalized progress 0 -> 1 across the shot, eased for a slow cinematic feel.
  const linear = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  const progress = CINEMATIC_EASE(Math.min(1, Math.max(0, linear)));

  // Slow push-in.
  const scale = interpolate(progress, [0, 1], [zoomStart, zoomEnd]);

  // Simulated tracking drift (as a percentage of the frame).
  const translateX = interpolate(progress, [0, 1], [panX * 100, -panX * 100]);
  const translateY = interpolate(progress, [0, 1], [-panY * 100, panY * 100]);

  // Open on black and settle to black at the end.
  const fadeInFrames = fadeInSeconds * fps;
  const fadeOutFrames = fadeOutSeconds * fps;
  const opacity =
    interpolate(frame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(
      frame,
      [durationInFrames - fadeOutFrames, durationInFrames - 1],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  // Subtle per-frame grain flicker so it doesn't look static.
  const grainSeed = Math.floor(random(`grain-${Math.floor(frame / 2)}`) * 100);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ opacity }}>
        {/* Camera layer: the still is scaled to cover and moved over time. */}
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
            transformOrigin: "center center",
          }}
        >
          {imageFailed ? (
            <Placeholder />
          ) : (
            <Img
              src={staticFile(imageSrc)}
              onError={() => setImageFailed(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 40%",
              }}
            />
          )}
        </AbsoluteFill>

        {/* Warm daylight grade: soft teal shadows + warm highlights. */}
        {grade && (
          <>
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,214,170,0.10) 0%, rgba(255,255,255,0) 40%, rgba(20,40,60,0.14) 100%)",
                mixBlendMode: "overlay",
              }}
            />
            <AbsoluteFill
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 42%, rgba(255,244,224,0.14) 0%, rgba(0,0,0,0) 55%)",
                mixBlendMode: "soft-light",
              }}
            />
          </>
        )}

        {/* Vignette to focus the eye and add depth. */}
        {vignette > 0 && (
          <AbsoluteFill
            style={{
              background: `radial-gradient(115% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
            }}
          />
        )}

        {/* Cinematic top/bottom falloff (soft "letterbox" without hard bars). */}
        {letterbox && (
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 14%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        )}

        {/* Film grain. */}
        {grain && (
          <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay" }}>
            <svg width={width} height={height}>
              <filter id="paulista-grain">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves={2}
                  seed={grainSeed}
                  stitchTiles="stitch"
                />
              </filter>
              <rect
                width="100%"
                height="100%"
                filter="url(#paulista-grain)"
              />
            </svg>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
