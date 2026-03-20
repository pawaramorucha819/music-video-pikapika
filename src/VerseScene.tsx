import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { LyricLine } from "./LyricLine";
import { SodaBubbles } from "./SodaBubbles";
import { PastelBurst } from "./PastelBurst";

const { fontFamily } = loadFont();

/** CSS-drawn clouds */
const Clouds: React.FC<{ frame: number }> = ({ frame }) => {
  const clouds = [
    { x: 15, y: 18, w: 220, h: 80, speed: 0.08 },
    { x: 55, y: 10, w: 280, h: 100, speed: 0.05 },
    { x: 80, y: 25, w: 180, h: 70, speed: 0.07 },
    { x: 35, y: 35, w: 150, h: 55, speed: 0.1 },
    { x: -5, y: 30, w: 200, h: 75, speed: 0.06 },
    { x: 65, y: 40, w: 170, h: 60, speed: 0.09 },
  ];

  return (
    <>
      {clouds.map((c, i) => {
        const drift = frame * c.speed;
        const x = ((c.x + drift) % 120) - 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${c.y}%`,
              width: c.w,
              height: c.h,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 60%, transparent 100%)",
              filter: "blur(6px)",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

/** Soda glass edges (left/right borders with refraction) */
const GlassEdges: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "8%",
        height: "100%",
        background:
          "linear-gradient(to right, rgba(180,220,240,0.4), transparent)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "8%",
        height: "100%",
        background:
          "linear-gradient(to left, rgba(180,220,240,0.4), transparent)",
        pointerEvents: "none",
      }}
    />
  </>
);

export const VerseScene: React.FC<{
  lines: string[];
  fontSize?: number;
}> = ({ lines, fontSize = 56 }) => {
  const frame = useCurrentFrame();

  // Verse starts at 18s in the song
  // Line timings (frames within this section):
  // Line 0: "しゅわしゅわソーダ…"  → immediate (frame 5)
  // Line 1: "パステル信号…"        → 20.15s = frame 65
  // Line 2: "ドキドキしちゃう…"    → ~23s = frame 150
  // Line 3: "リズムにのって…"      → ~26s = frame 240
  const lineDelays = [5, 65, 150, 240];

  // --- Tilt: soda glass → sky ---
  // Tilt starts around frame 50, completes by frame 80
  const TILT_START = 50;
  const TILT_END = 80;
  const tiltProgress = interpolate(frame, [TILT_START, TILT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Virtual canvas: bottom = soda, top = sky
  // tiltY: 0% = showing soda (bottom), 50% = showing sky (top)
  const tiltY = interpolate(tiltProgress, [0, 1], [0, 50]);

  // Slight zoom change during tilt
  const tiltScale = interpolate(tiltProgress, [0, 1], [1.1, 1.0], {
    extrapolateRight: "clamp",
  });

  // Soda glass edge opacity fades during tilt
  const glassOpacity = interpolate(tiltProgress, [0, 0.8], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Pastel burst starts after tilt
  const BURST_FRAME = TILT_END;

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      {/* Tilt container — 200% tall */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "200%",
          transform: `translateY(-${tiltY}%) scale(${tiltScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* === TOP HALF: Summer blue sky === */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "50%",
            overflow: "hidden",
          }}
        >
          {/* Sky gradient */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, #1e90ff 0%, #57b9ff 30%, #87ceeb 60%, #b0e0ff 85%, #e0f0ff 100%)",
            }}
          />

          {/* Sun glow */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              right: "20%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,200,0.6) 0%, rgba(255,200,100,0.2) 40%, transparent 70%)",
            }}
          />

          {/* Clouds */}
          <Clouds frame={frame} />
        </div>

        {/* === BOTTOM HALF: Inside soda glass === */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "50%",
            overflow: "hidden",
          }}
        >
          {/* Soda liquid gradient */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, #e0f8ff 0%, #c7ecff 20%, #b0e4ff 50%, #a0d8ef 80%, #8ccde0 100%)",
            }}
          />

          {/* Light refractions inside soda */}
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)",
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 65% 60%, rgba(200,240,255,0.3) 0%, transparent 40%)",
            }}
          />

          {/* Soda bubbles */}
          <SodaBubbles count={60} />

          {/* Glass edges */}
          <div style={{ opacity: glassOpacity }}>
            <GlassEdges />
          </div>
        </div>
      </div>

      {/* Pastel burst (appears in sky after tilt) */}
      <PastelBurst enterFrame={BURST_FRAME} count={35} />

      {/* Continuous subtle pastel particles after burst settles */}
      {frame > BURST_FRAME + 40 && (
        <PastelBurst
          enterFrame={BURST_FRAME + 40}
          count={15}
        />
      )}

      {/* --- Lyrics: one line at a time, bottom of screen --- */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {lines.map((line, i) => {
          const delay = lineDelays[i] ?? 0;
          const endDelay =
            i < lines.length - 1 ? lineDelays[i + 1] : undefined;
          // Text color: dark while in soda, white after sky
          const inSky = frame > TILT_END;
          return (
            <LyricLine
              key={i}
              text={line}
              delay={delay}
              endDelay={endDelay}
              fontSize={fontSize}
              color={inSky ? "white" : "rgba(30,60,120,0.9)"}
              glowColor={
                inSky
                  ? "rgba(100,180,255,0.5)"
                  : "rgba(100,180,255,0.3)"
              }
            />
          );
        })}
      </div>

      {/* Soft vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.2) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
