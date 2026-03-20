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

const PIXEL = 4; // Base pixel size

/* ── 16x24 pixel art idol sprite ──
   0=transparent, 1=skin, 2=hair, 3=outfit, 4=skirt, 5=boots,
   6=eye(white), 7=cheek, 8=ribbon, 9=eye(pupil), A=mouth, B=skirt-frill, C=hair-highlight */
// Use numbers: 10=mouth, 11=frill, 12=highlight

const IDLE: number[][] = [
  [0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0],
  [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,12,2,2,12,2,2,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,8,8,2,2,2,2,2,2,8,8,0,0,0],
  [0,0,0,8,0,2,1,1,1,1,2,0,8,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,2,1,6,9,1,6,9,2,0,0,0,0],
  [0,0,0,0,2,1,1,1,1,1,1,2,0,0,0,0],
  [0,0,0,0,0,1,7,1,1,7,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,10,10,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,11,4,4,4,4,4,4,11,0,0,0,0],
  [0,0,0,11,4,4,4,4,4,4,4,4,11,0,0,0],
  [0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0],
  [0,0,0,0,4,4,4,0,0,4,4,4,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,5,5,0,0,5,5,0,0,0,0,0],
  [0,0,0,0,5,5,5,0,0,5,5,5,0,0,0,0],
];

const DANCE_L: number[][] = [
  [0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0],
  [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,12,2,2,12,2,2,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,8,8,2,2,2,2,2,2,8,8,0,0,0],
  [0,0,0,8,0,2,1,1,1,1,2,0,8,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,2,1,6,9,1,6,9,2,0,0,0,0],
  [0,0,0,0,2,1,1,1,1,1,1,2,0,0,0,0],
  [0,0,0,0,0,1,7,1,1,7,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,10,10,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,1,1,3,3,3,3,3,3,3,3,0,0,0,0],
  [0,0,0,1,1,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,11,11,4,4,4,4,4,4,11,0,0,0,0],
  [0,0,11,4,4,4,4,4,4,4,4,4,0,0,0,0],
  [0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0],
  [0,0,0,4,4,4,0,0,0,0,4,4,4,0,0,0],
  [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,5,5,0,0,0,0,0,0,0,0,5,5,0,0],
  [0,5,5,5,0,0,0,0,0,0,0,0,5,5,5,0],
];

const DANCE_R: number[][] = [
  [0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0],
  [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,12,2,2,12,2,2,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,8,8,2,2,2,2,2,2,8,8,0,0,0],
  [0,0,0,8,0,2,1,1,1,1,2,0,8,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,2,1,6,9,1,6,9,2,0,0,0,0],
  [0,0,0,0,2,1,1,1,1,1,1,2,0,0,0,0],
  [0,0,0,0,0,1,7,1,1,7,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,10,10,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,1,1,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,1,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,11,4,4,4,4,4,4,11,11,0,0,0],
  [0,0,0,0,4,4,4,4,4,4,4,4,11,0,0,0],
  [0,0,0,0,4,4,4,4,4,4,4,4,4,0,0,0],
  [0,0,0,4,4,4,0,0,0,0,4,4,4,0,0,0],
  [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,5,5,0,0,0,0,0,0,0,0,5,5,0,0],
  [0,5,5,5,0,0,0,0,0,0,0,0,5,5,5,0],
];

const JUMP: number[][] = [
  [0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0],
  [0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,12,2,2,12,2,2,0,0,0,0],
  [0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0],
  [0,0,0,8,8,2,2,2,2,2,2,8,8,0,0,0],
  [0,0,0,8,0,2,1,1,1,1,2,0,8,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,2,1,6,9,1,6,9,2,0,0,0,0],
  [0,0,0,0,2,1,1,1,1,1,1,2,0,0,0,0],
  [0,0,0,0,0,1,7,1,1,7,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,10,10,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,1,0,0,0,3,3,3,3,3,3,0,0,0,1,0],
  [0,0,1,0,3,3,3,3,3,3,3,3,0,1,0,0],
  [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
  [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,11,4,4,4,4,4,4,11,0,0,0,0],
  [0,0,0,11,4,4,4,4,4,4,4,4,11,0,0,0],
  [0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0],
  [0,0,0,0,0,4,4,0,0,4,4,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,5,5,0,0,5,5,0,0,0,0,0],
  [0,0,0,0,0,5,5,0,0,5,5,0,0,0,0,0],
];

const POSES = [IDLE, DANCE_L, IDLE, DANCE_R, JUMP];

type IdolColors = {
  hair: string;
  hairHighlight: string;
  outfit: string;
  skirt: string;
  frill: string;
  boots: string;
  ribbon: string;
  cheek: string;
};

const getPixelColor = (value: number, c: IdolColors): string | null => {
  switch (value) {
    case 1: return "#fcd5b8";   // skin
    case 2: return c.hair;
    case 3: return c.outfit;
    case 4: return c.skirt;
    case 5: return c.boots;
    case 6: return "#ffffff";   // eye white
    case 7: return c.cheek;
    case 8: return c.ribbon;
    case 9: return "#2d1b69";   // pupil
    case 10: return "#e8787a";  // mouth
    case 11: return c.frill;
    case 12: return c.hairHighlight;
    default: return null;
  }
};

/* ── Single pixel idol ── */
const PixelIdol: React.FC<{
  x: number;
  y: number;
  frame: number;
  colors: IdolColors;
  scale?: number;
  poseOffset?: number;
}> = ({ x, y, frame, colors, scale = 1, poseOffset = 0 }) => {
  const poseIndex = (Math.floor((frame + poseOffset) / 8)) % POSES.length;
  const pose = POSES[poseIndex];
  const isJump = poseIndex === 4;
  const bounceY = isJump ? -16 * scale : 0;
  const px = PIXEL * scale;

  return (
    <div style={{ position: "absolute", left: x, top: y + bounceY, imageRendering: "pixelated" }}>
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

/* ── Sparkles ── */
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
        <div key={i} style={{
          position: "absolute", left: x, top: y,
          width: size * 2, height: size * 2, opacity,
          transform: `rotate(${rotation}deg)`,
        }}>
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

/* ── Stage floor ── */
const PixelStage: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
    background: "linear-gradient(to top, #1a0a3e 0%, #2d1854 60%, transparent 100%)",
  }}>
    {Array.from({ length: 20 }, (_, i) => (
      <div key={i} style={{
        position: "absolute", bottom: 0, left: `${i * 5}%`, width: "5%", height: 40,
        backgroundColor: i % 2 === 0 ? "rgba(139,92,246,0.3)" : "rgba(6,182,212,0.2)",
      }} />
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
    {
      x: 250, scale: 1.6, offset: 0,
      colors: { hair: "#f472b6", hairHighlight: "#fbcfe8", outfit: "#ec4899", skirt: "#be185d", frill: "#f9a8d4", boots: "#9d174d", ribbon: "#fbbf24", cheek: "#fda4af" },
    },
    {
      x: 650, scale: 2.0, offset: 4,
      colors: { hair: "#a78bfa", hairHighlight: "#ddd6fe", outfit: "#8b5cf6", skirt: "#6d28d9", frill: "#c4b5fd", boots: "#5b21b6", ribbon: "#f472b6", cheek: "#fda4af" },
    },
    {
      x: 1050, scale: 2.0, offset: 2,
      colors: { hair: "#22d3ee", hairHighlight: "#a5f3fc", outfit: "#06b6d4", skirt: "#0e7490", frill: "#67e8f9", boots: "#155e75", ribbon: "#fbbf24", cheek: "#fda4af" },
    },
    {
      x: 1450, scale: 1.6, offset: 6,
      colors: { hair: "#fbbf24", hairHighlight: "#fef3c7", outfit: "#f59e0b", skirt: "#d97706", frill: "#fde68a", boots: "#92400e", ribbon: "#ec4899", cheek: "#fda4af" },
    },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, imageRendering: "pixelated" }}>
      <AbsoluteFill style={{ background: `linear-gradient(${bgAngle}deg, #1a0533, #2d1854, #0c2461)` }} />

      {/* Spotlights */}
      {idolConfigs.map((idol, i) => (
        <div key={`light-${i}`} style={{
          position: "absolute", top: 0, left: idol.x + 15,
          width: 0, height: 0,
          borderLeft: "80px solid transparent",
          borderRight: "80px solid transparent",
          borderTop: `600px solid ${idol.colors.outfit}15`,
          transformOrigin: "top center",
          filter: "blur(6px)",
        }} />
      ))}

      <PixelStage />

      {idolConfigs.map((idol, i) => (
        <PixelIdol key={i} x={idol.x} y={480} frame={frame}
          colors={idol.colors} scale={idol.scale} poseOffset={idol.offset} />
      ))}

      <Sparkles frame={frame} count={40} />

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

      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
