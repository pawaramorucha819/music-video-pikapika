import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { LyricLine } from "./LyricLine";

const { fontFamily } = loadFont();

const PIXEL = 6; // Base pixel size for dot art

/* ── Pixel art idol sprite frames ── */
// Each frame is a 12x16 grid (width x height), 1=skin, 2=hair, 3=outfit, 4=skirt, 5=boots, 6=eye, 7=cheek
const IDLE_POSE: number[][] = [
  [0,0,0,0,2,2,2,2,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,1,6,1,1,6,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,7,1,1,7,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,3,3,3,3,3,3,0,0,0],
  [0,0,3,3,3,3,3,3,3,3,0,0],
  [0,0,0,1,3,3,3,3,1,0,0,0],
  [0,0,0,0,4,4,4,4,0,0,0,0],
  [0,0,0,4,4,4,4,4,4,0,0,0],
  [0,0,0,4,4,0,0,4,4,0,0,0],
  [0,0,0,1,1,0,0,1,1,0,0,0],
  [0,0,0,5,5,0,0,5,5,0,0,0],
  [0,0,0,5,5,0,0,5,5,0,0,0],
];

const DANCE_LEFT: number[][] = [
  [0,0,0,0,2,2,2,2,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,1,6,1,1,6,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,7,1,1,7,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,3,3,3,3,3,3,0,0,0],
  [0,1,3,3,3,3,3,3,3,0,0,0],
  [0,1,0,0,3,3,3,3,0,1,0,0],
  [0,0,0,0,4,4,4,4,0,0,0,0],
  [0,0,0,4,4,4,4,4,4,0,0,0],
  [0,0,4,4,0,0,0,0,4,4,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
  [0,5,5,0,0,0,0,0,5,5,0,0],
  [0,5,5,0,0,0,0,0,0,5,5,0],
];

const DANCE_RIGHT: number[][] = [
  [0,0,0,0,2,2,2,2,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,1,6,1,1,6,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,7,1,1,7,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,3,3,3,3,3,3,0,0,0],
  [0,0,0,3,3,3,3,3,3,1,0,0],
  [0,0,1,0,3,3,3,3,0,0,1,0],
  [0,0,0,0,4,4,4,4,0,0,0,0],
  [0,0,0,4,4,4,4,4,4,0,0,0],
  [0,0,4,4,0,0,0,0,4,4,0,0],
  [0,0,1,1,0,0,0,0,1,1,0,0],
  [0,0,5,5,0,0,0,0,0,5,5,0],
  [0,5,5,0,0,0,0,0,0,5,5,0],
];

const JUMP_POSE: number[][] = [
  [0,0,0,0,2,2,2,2,0,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,2,2,2,2,2,2,0,0,0],
  [0,0,0,1,6,1,1,6,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,7,1,1,7,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,1,0,3,3,3,3,3,3,0,1,0],
  [0,0,1,3,3,3,3,3,3,1,0,0],
  [0,0,0,0,3,3,3,3,0,0,0,0],
  [0,0,0,0,4,4,4,4,0,0,0,0],
  [0,0,0,4,4,4,4,4,4,0,0,0],
  [0,0,0,4,4,0,0,4,4,0,0,0],
  [0,0,0,0,1,0,0,1,0,0,0,0],
  [0,0,0,0,5,0,0,5,0,0,0,0],
  [0,0,0,0,5,0,0,5,0,0,0,0],
];

const POSES = [IDLE_POSE, DANCE_LEFT, IDLE_POSE, DANCE_RIGHT, JUMP_POSE];

type IdolColors = {
  hair: string;
  outfit: string;
  skirt: string;
  boots: string;
  cheek: string;
};

const getPixelColor = (value: number, colors: IdolColors): string | null => {
  switch (value) {
    case 1: return "#fcd5b8"; // skin
    case 2: return colors.hair;
    case 3: return colors.outfit;
    case 4: return colors.skirt;
    case 5: return colors.boots;
    case 6: return "#2d1b4e"; // eye
    case 7: return colors.cheek;
    default: return null;
  }
};

/* ── Single pixel art idol ── */
const PixelIdol: React.FC<{
  x: number;
  y: number;
  frame: number;
  colors: IdolColors;
  scale?: number;
  poseOffset?: number;
}> = ({ x, y, frame, colors, scale = 1, poseOffset = 0 }) => {
  // Cycle through poses: 8 frames per pose
  const poseIndex = (Math.floor((frame + poseOffset) / 8)) % POSES.length;
  const pose = POSES[poseIndex];

  // Bounce animation for jump
  const isJump = poseIndex === 4;
  const bounceY = isJump ? -12 * scale : 0;

  const px = PIXEL * scale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bounceY,
        imageRendering: "pixelated",
      }}
    >
      {pose.map((row, ry) =>
        row.map((val, rx) => {
          const color = getPixelColor(val, colors);
          if (!color) return null;
          return (
            <div
              key={`${ry}-${rx}`}
              style={{
                position: "absolute",
                left: rx * px,
                top: ry * px,
                width: px,
                height: px,
                backgroundColor: color,
              }}
            />
          );
        }),
      )}
    </div>
  );
};

/* ── Sparkle particles (ぱちぱち) ── */
const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

const Sparkles: React.FC<{ frame: number; count: number }> = ({ frame, count }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {Array.from({ length: count }, (_, i) => {
      const x = hash(i * 3, 1920);
      const y = hash(i * 7, 900);
      const period = hash(i * 11, 20) + 15;
      const phase = hash(i * 13, 40);
      const size = hash(i * 17, 4) + 3;
      const t = (frame + phase) % period;
      const opacity = interpolate(t, [0, period / 3, period], [0, 1, 0]);
      const colors = ["#fbbf24", "#ec4899", "#8b5cf6", "#06b6d4", "#fff", "#34d399"];
      const color = colors[i % colors.length];
      const rotation = interpolate(frame + phase, [0, 60], [0, 360], { extrapolateRight: "extend" });
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: size * 2,
            height: size * 2,
            opacity,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* 4-pointed star */}
          <div style={{
            position: "absolute", left: "50%", top: 0, width: 2, height: "100%",
            backgroundColor: color, transform: "translateX(-50%)",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: 0, width: "100%", height: 2,
            backgroundColor: color, transform: "translateY(-50%)",
          }} />
        </div>
      );
    })}
  </div>
);

/* ── Stage floor (pixel style) ── */
const PixelStage: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      background: "linear-gradient(to top, #1a0a3e 0%, #2d1854 60%, transparent 100%)",
      imageRendering: "pixelated",
    }}
  >
    {/* Stage floor checker pattern */}
    {Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          bottom: 0,
          left: `${i * 5}%`,
          width: "5%",
          height: 40,
          backgroundColor: i % 2 === 0 ? "rgba(139,92,246,0.3)" : "rgba(6,182,212,0.2)",
        }}
      />
    ))}
  </div>
);

/* ── Chorus2Scene ── */
export const Chorus2Scene: React.FC<{
  lines: string[];
  lineDelays: number[];
}> = ({ lines, lineDelays }) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const bgAngle = interpolate(frame, [0, 600], [120, 480]);

  const idolConfigs: { x: number; colors: IdolColors; offset: number; scale: number }[] = [
    { x: 300, colors: { hair: "#f472b6", outfit: "#ec4899", skirt: "#be185d", boots: "#831843", cheek: "#fda4af" }, offset: 0, scale: 1.8 },
    { x: 700, colors: { hair: "#a78bfa", outfit: "#8b5cf6", skirt: "#6d28d9", boots: "#4c1d95", cheek: "#fda4af" }, offset: 4, scale: 2.2 },
    { x: 1100, colors: { hair: "#22d3ee", outfit: "#06b6d4", skirt: "#0e7490", boots: "#164e63", cheek: "#fda4af" }, offset: 2, scale: 1.8 },
    { x: 1500, colors: { hair: "#fbbf24", outfit: "#f59e0b", skirt: "#d97706", boots: "#92400e", cheek: "#fda4af" }, offset: 6, scale: 1.8 },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, imageRendering: "pixelated" }}>
      {/* Background gradient */}
      <AbsoluteFill
        style={{ background: `linear-gradient(${bgAngle}deg, #1a0533, #2d1854, #0c2461)` }}
      />

      {/* Spotlight beams */}
      {idolConfigs.map((idol, i) => (
        <div
          key={`light-${i}`}
          style={{
            position: "absolute",
            top: 0,
            left: idol.x + 20,
            width: 0,
            height: 0,
            borderLeft: "80px solid transparent",
            borderRight: "80px solid transparent",
            borderTop: `600px solid ${idol.colors.outfit}15`,
            transformOrigin: "top center",
            filter: "blur(6px)",
          }}
        />
      ))}

      <PixelStage />

      {/* Pixel art idols */}
      {idolConfigs.map((idol, i) => (
        <PixelIdol
          key={i}
          x={idol.x}
          y={500}
          frame={frame}
          colors={idol.colors}
          scale={idol.scale}
          poseOffset={idol.offset}
        />
      ))}

      {/* Sparkles (ぱちぱち光る) */}
      <Sparkles frame={frame} count={40} />

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
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
