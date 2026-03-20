import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { LyricLine } from "./LyricLine";

const { fontFamily } = loadFont();

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

/* ── Firework burst ── */
const Firework: React.FC<{
  cx: number;
  cy: number;
  frame: number;
  delay: number;
  color: string;
  particleCount?: number;
}> = ({ cx, cy, frame, delay, color, particleCount = 24 }) => {
  const local = frame - delay;
  if (local < 0) return null;

  const burstDuration = 45;
  const progress = Math.min(local / burstDuration, 1);
  const fadeOut = interpolate(local, [burstDuration * 0.5, burstDuration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (fadeOut <= 0) return null;

  return (
    <>
      {/* Center flash */}
      {local < 8 && (
        <div
          style={{
            position: "absolute",
            left: cx - 30,
            top: cy - 30,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "white",
            opacity: interpolate(local, [0, 8], [1, 0]),
            boxShadow: `0 0 40px 20px ${color}`,
          }}
        />
      )}
      {/* Particles */}
      {Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2 + hash(i * 7, 100) * 0.01;
        const speed = 80 + hash(i * 13, 60);
        const dist = progress * speed;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist + progress * progress * 30; // gravity
        const size = interpolate(progress, [0, 0.3, 1], [4, 6, 2]);
        const trailLen = interpolate(progress, [0, 0.5, 1], [0, 12, 4]);

        return (
          <React.Fragment key={i}>
            {/* Trail */}
            <div
              style={{
                position: "absolute",
                left: x - 1,
                top: y - trailLen,
                width: 2,
                height: trailLen,
                backgroundColor: color,
                opacity: fadeOut * 0.5,
                transform: `rotate(${(angle * 180) / Math.PI + 90}deg)`,
                transformOrigin: "bottom center",
              }}
            />
            {/* Particle */}
            <div
              style={{
                position: "absolute",
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: i % 3 === 0 ? "white" : color,
                opacity: fadeOut,
                boxShadow: `0 0 ${size * 2}px ${color}`,
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

/* ── Fireworks display ── */
const FireworksDisplay: React.FC<{ frame: number }> = ({ frame }) => {
  const fireworks = [
    { cx: 960, cy: 300, delay: 5, color: "#fbbf24" },
    { cx: 400, cy: 250, delay: 15, color: "#ec4899" },
    { cx: 1500, cy: 280, delay: 25, color: "#06b6d4" },
    { cx: 700, cy: 200, delay: 35, color: "#a78bfa" },
    { cx: 1200, cy: 350, delay: 45, color: "#34d399" },
    { cx: 300, cy: 400, delay: 55, color: "#f472b6" },
    { cx: 1600, cy: 200, delay: 60, color: "#fbbf24" },
    { cx: 960, cy: 150, delay: 70, color: "#ff6b6b" },
    { cx: 500, cy: 350, delay: 80, color: "#06b6d4" },
    { cx: 1400, cy: 300, delay: 85, color: "#a78bfa" },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {fireworks.map((fw, i) => (
        <Firework key={i} {...fw} frame={frame} />
      ))}
    </div>
  );
};

/* ── Paint splash (single blob) ── */
const PaintSplash: React.FC<{
  x: number;
  y: number;
  frame: number;
  delay: number;
  color: string;
  size: number;
  angle: number;
}> = ({ x, y, frame, delay, color, size, angle }) => {
  const local = frame - delay;
  if (local < 0) return null;

  const expandDuration = 20;
  const scale = interpolate(local, [0, expandDuration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Drip effect
  const dripY = local > expandDuration
    ? interpolate(local, [expandDuration, expandDuration + 40], [0, 30], { extrapolateRight: "clamp" })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${angle}deg) scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Main blob */}
      <div
        style={{
          width: size,
          height: size * 0.8,
          borderRadius: "50% 50% 45% 55% / 60% 40% 55% 45%",
          backgroundColor: color,
          opacity: 0.9,
        }}
      />
      {/* Drip */}
      {dripY > 2 && (
        <div
          style={{
            position: "absolute",
            left: size * 0.4,
            top: size * 0.6,
            width: 8,
            height: dripY,
            borderRadius: "0 0 4px 4px",
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
      )}
      {/* Small splatter dots */}
      {[
        { dx: -size * 0.3, dy: -size * 0.2, s: size * 0.15 },
        { dx: size * 0.9, dy: size * 0.1, s: size * 0.12 },
        { dx: size * 0.2, dy: -size * 0.35, s: size * 0.1 },
        { dx: size * 0.7, dy: size * 0.7, s: size * 0.08 },
      ].map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.dx,
            top: dot.dy,
            width: dot.s,
            height: dot.s,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
};

/* ── Paint flood that fills screen ── */
const PaintFlood: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const local = frame - startFrame;
  if (local < 0) return null;

  const splashes = [
    { x: 200, y: 100, delay: 0, color: "#ec4899", size: 250, angle: -10 },
    { x: 1400, y: 200, delay: 5, color: "#8b5cf6", size: 280, angle: 15 },
    { x: 800, y: 50, delay: 10, color: "#06b6d4", size: 300, angle: -5 },
    { x: 100, y: 500, delay: 14, color: "#fbbf24", size: 260, angle: 20 },
    { x: 1600, y: 600, delay: 18, color: "#f43f5e", size: 290, angle: -15 },
    { x: 500, y: 400, delay: 22, color: "#34d399", size: 270, angle: 8 },
    { x: 1100, y: 300, delay: 26, color: "#a78bfa", size: 310, angle: -20 },
    { x: 300, y: 700, delay: 30, color: "#06b6d4", size: 240, angle: 12 },
    { x: 1300, y: 500, delay: 34, color: "#ec4899", size: 280, angle: -8 },
    { x: 700, y: 650, delay: 38, color: "#fbbf24", size: 260, angle: 5 },
    { x: 960, y: 540, delay: 42, color: "#8b5cf6", size: 350, angle: 0 },
    { x: 1700, y: 400, delay: 46, color: "#f43f5e", size: 230, angle: -12 },
    { x: 150, y: 300, delay: 50, color: "#34d399", size: 270, angle: 18 },
    { x: 1500, y: 100, delay: 54, color: "#a78bfa", size: 290, angle: -7 },
    { x: 600, y: 200, delay: 58, color: "#fbbf24", size: 320, angle: 10 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {splashes.map((sp, i) => (
        <PaintSplash key={i} {...sp} frame={local} />
      ))}
    </div>
  );
};

/* ── Chorus2Scene ── */
export const Chorus2Scene: React.FC<{
  lines: string[];
  lineDelays: number[];
}> = ({ lines, lineDelays }) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const bgAngle = interpolate(frame, [0, 600], [120, 480]);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Background */}
      <AbsoluteFill
        style={{ background: `linear-gradient(${bgAngle}deg, #0a0020, #1a0a3e, #0c1445)` }}
      />

      {/* Fireworks (ぱちぱち光る まほうみたい) */}
      <FireworksDisplay frame={frame} />

      {/* Paint flood (世界を染める ポップサイン) */}
      <PaintFlood frame={frame} startFrame={lineDelays[1]} />

      {/* Lyrics */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center",
      }}>
        {lines.map((line, i) => {
          const delay = lineDelays[i] ?? 0;
          const endDelay = i < lines.length - 1 ? lineDelays[i + 1] : undefined;
          return (
            <LyricLine key={i} text={line} delay={delay} endDelay={endDelay}
              fontSize={60} glowColor="rgba(139,92,246,0.7)" />
          );
        })}
      </div>

      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
