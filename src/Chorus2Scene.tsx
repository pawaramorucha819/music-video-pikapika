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

const PIXEL = 4;
const SPRITE_W = 48;
const SPRITE_H = 48;

/* ── idle.json palette (all colors including 0) ── */
const PALETTE: Record<string, string> = {
  "0": "#EFEEEC",
  "1": "#1F0D08", "2": "#8F5730", "3": "#D66254", "4": "#572514",
  "5": "#A66152", "6": "#CA4839", "7": "#A63229", "8": "#E39770",
  "9": "#F5D8B7", "A": "#E4A992", "B": "#A8A4A0", "C": "#724C31",
  "D": "#685D55", "E": "#C7352A", "F": "#49778D",
};

/* ── idle.json sprite data ── */
const IDLE_DATA = [
  "000000000000000000000000000000000000000000000000",
  "0000000000000000000000111D0000000000000000000000",
  "000000000000000000012222222210000000000000000000",
  "000000000000000001222222222222100000000000000000",
  "0000000000000000C2222222222222211000000000000000",
  "000000000000000822222222222222BB0100000000000000",
  "0000000000000088822122221222220B1B00000000000000",
  "00000000000001282221222292222215B130000000000000",
  "00000000000008C212142222822C22335560000000000000",
  "000000000000B22225002222A45221121710000000000000",
  "000000000000122229092422001522213C08000000000000",
  "00000000000011222901102201111222315B000000000000",
  "000000000000112211000001019011222C21000000000000",
  "000000000000002200100090000100225221000000000000",
  "000000000000001200111909011100221221000000000000",
  "000000000000002100F10000910F00220C22000000000000",
  "0000000000000124000F000000010022A122000000000000",
  "00000000000001240990005119999125A422000000000000",
  "000000000001011409000288800005201412000000000000",
  "0000000000110004C000088880D102244402000000000000",
  "00000000000000041410001800911244C100000000000000",
  "00000000001990000101511AA11718101000000000000000",
  "0000000000001A11600183A8079321500000000000000000",
  "000000000000118761670211050D231B0000000000000000",
  "00000000000006333465370D043664140000000000000000",
  "000000000000036663636313366763361000000000000000",
  "000000000000017E36743133311415133100000000000000",
  "000000000000000737133494344503366100000000000000",
  "000000000000000000136944663608633D00000000000000",
  "000000000000000000347834337110137000000000000000",
  "000000000000000018415115461190110000000000000000",
  "0000000000000007E10377E3A77111700000000000000000",
  "0000000000000013A5603030300757A10000000000000000",
  "0000000000000083137813A1531354352000000000000000",
  "0000000000000108170EA030727015310100000000000000",
  "00000000000000000133345330331EB07310000000000000",
  "000000000000005040011000631000010380000000000000",
  "000000000000000C4211100D11DD10134100000000000000",
  "0000000000000000560100800A00A1031A00000000000000",
  "00000000000000008A07115001B3540A7100000000000000",
  "000000000000000001070000000011050000000000000000",
  "000000000000000000000000001001000000000000000000",
  "000000000000000000007111001201100000000000000000",
  "000000000000000000051600000331100000000000000000",
  "000000000000000000101061000410500000000000000000",
  "00000000000000000000001B00B001100000000000000000",
  "000000000000000000163100000131000000000000000000",
  "000000000000000000000000000000000000000000000000",
];

/* ── Flood fill from edges to find background 0s ── */
const buildSprite = (): (string | null)[][] => {
  const grid = IDLE_DATA.map((row) => row.split(""));
  const isBg: boolean[][] = Array.from({ length: SPRITE_H }, () => Array(SPRITE_W).fill(false));

  // BFS from all edge "0" pixels
  const queue: [number, number][] = [];
  for (let y = 0; y < SPRITE_H; y++) {
    for (let x = 0; x < SPRITE_W; x++) {
      if ((y === 0 || y === SPRITE_H - 1 || x === 0 || x === SPRITE_W - 1) && grid[y][x] === "0") {
        isBg[y][x] = true;
        queue.push([y, x]);
      }
    }
  }
  while (queue.length > 0) {
    const [cy, cx] = queue.shift()!;
    for (const [dy, dx] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const ny = cy + dy;
      const nx = cx + dx;
      if (ny >= 0 && ny < SPRITE_H && nx >= 0 && nx < SPRITE_W && !isBg[ny][nx] && grid[ny][nx] === "0") {
        isBg[ny][nx] = true;
        queue.push([ny, nx]);
      }
    }
  }

  return grid.map((row, y) =>
    row.map((ch, x) => (isBg[y][x] ? null : PALETTE[ch] ?? null))
  );
};

const IDLE_SPRITE = buildSprite();

/* ── Render a pixel sprite with dance animation ── */
const PixelIdol: React.FC<{
  x: number;
  y: number;
  frame: number;
  scale?: number;
}> = ({ x, y, frame, scale = 1 }) => {
  const px = PIXEL * scale;

  // Simple dance: sway left/right + bounce
  const swayX = Math.sin(frame * 0.15) * 8 * scale;
  const bounceY = Math.abs(Math.sin(frame * 0.2)) * -12 * scale;
  // Slight tilt for dance feel
  const tilt = Math.sin(frame * 0.15) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: x + swayX,
        top: y + bounceY,
        imageRendering: "pixelated",
        transform: `rotate(${tilt}deg)`,
        transformOrigin: "center bottom",
      }}
    >
      {IDLE_SPRITE.map((row, ry) =>
        row.map((color, rx) => {
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

  // Idol center position (48px * 4px * 4scale = 768px wide)
  const idolScale = 4;
  const idolW = SPRITE_W * PIXEL * idolScale;
  const idolX = (1920 - idolW) / 2;
  const idolH = SPRITE_H * PIXEL * idolScale;
  const idolY = 1080 - 200 - idolH - 40; // above stage floor

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <AbsoluteFill style={{ background: `linear-gradient(${bgAngle}deg, #1a0533, #2d1854, #0c2461)` }} />

      {/* Spotlight */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        width: 0, height: 0, transform: "translateX(-50%)",
        borderLeft: "200px solid transparent",
        borderRight: "200px solid transparent",
        borderTop: "800px solid rgba(139,92,246,0.08)",
        filter: "blur(8px)",
      }} />

      <PixelStage />

      {/* Single idol */}
      <PixelIdol x={idolX} y={idolY} frame={frame} scale={idolScale} />

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

      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
