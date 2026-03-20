import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { LyricLine } from "./LyricLine";
import { Particles } from "./Particles";

const { fontFamily } = loadFont();

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

/* ── TV Tower (silhouette) ── */
const TvTower: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const entry = spring({ frame, fps, config: { damping: 200 } });
  const scaleY = interpolate(entry, [0, 1], [0, 1]);
  // Blinking light on top
  const blink = interpolate(frame % 30, [0, 10, 20, 30], [1, 0.3, 1, 0.3]);

  return (
    <g transform={`translate(280, 620) scale(1, ${scaleY})`} style={{ transformOrigin: "280px 620px" }}>
      {/* Tower body — lattice structure */}
      <polygon
        points="280,80 240,620 320,620"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={2.5}
      />
      {/* Cross beams */}
      {[180, 280, 380, 480, 560].map((y, i) => {
        const w = interpolate(y, [80, 620], [0, 40]);
        return (
          <React.Fragment key={i}>
            <line
              x1={280 - w} y1={y} x2={280 + w} y2={y}
              stroke="rgba(255,255,255,0.4)" strokeWidth={1.5}
            />
            {i < 4 && (
              <>
                <line
                  x1={280 - w} y1={y}
                  x2={280 + interpolate(y + 100, [80, 620], [0, 40])}
                  y2={Math.min(y + 100, 620)}
                  stroke="rgba(255,255,255,0.25)" strokeWidth={1}
                />
                <line
                  x1={280 + w} y1={y}
                  x2={280 - interpolate(y + 100, [80, 620], [0, 40])}
                  y2={Math.min(y + 100, 620)}
                  stroke="rgba(255,255,255,0.25)" strokeWidth={1}
                />
              </>
            )}
          </React.Fragment>
        );
      })}
      {/* Antenna on top */}
      <line x1={280} y1={80} x2={280} y2={20} stroke="rgba(255,255,255,0.8)" strokeWidth={3} />
      <line x1={270} y1={60} x2={290} y2={60} stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
      <line x1={265} y1={45} x2={295} y2={45} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      {/* Blinking beacon */}
      <circle cx={280} cy={18} r={5} fill="#f43f5e" opacity={blink} />
      <circle cx={280} cy={18} r={12} fill="none" stroke="#f43f5e" strokeWidth={1} opacity={blink * 0.5} />
    </g>
  );
};

/* ── Radio waves emanating from tower ── */
const RadioWaves: React.FC<{ frame: number }> = ({ frame }) => {
  const waveCount = 5;
  return (
    <g>
      {Array.from({ length: waveCount }, (_, i) => {
        const period = 50;
        const t = ((frame + i * (period / waveCount)) % period) / period;
        const radius = interpolate(t, [0, 1], [20, 350]);
        const opacity = interpolate(t, [0, 0.2, 1], [0, 0.6, 0]);
        return (
          <path
            key={i}
            d={`M ${280 + radius * Math.cos(-Math.PI * 0.8)} ${18 + radius * Math.sin(-Math.PI * 0.8)}
                A ${radius} ${radius} 0 0 1 ${280 + radius * Math.cos(-Math.PI * 0.2)} ${18 + radius * Math.sin(-Math.PI * 0.2)}`}
            fill="none"
            stroke="#06b6d4"
            strokeWidth={2.5}
            opacity={opacity}
          />
        );
      })}
    </g>
  );
};

/* ── Small TV set ── */
const TvSet: React.FC<{
  x: number;
  y: number;
  size: number;
  frame: number;
  activateFrame: number;
  color: string;
}> = ({ x, y, size, frame, activateFrame, color }) => {
  const isActive = frame >= activateFrame;
  const glowProgress = isActive
    ? Math.min(1, (frame - activateFrame) / 8)
    : 0;
  const screenColor = isActive ? color : "rgba(50,50,50,0.8)";
  const flicker = isActive
    ? interpolate((frame + activateFrame) % 6, [0, 3, 6], [0.8, 1, 0.8])
    : 0;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* TV body */}
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size * 0.75}
        rx={4}
        fill="rgba(30,30,40,0.9)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1.5}
      />
      {/* Screen */}
      <rect
        x={-size / 2 + 4}
        y={-size / 2 + 4}
        width={size - 8}
        height={size * 0.75 - 8}
        rx={2}
        fill={screenColor}
        opacity={flicker || 0.3}
      />
      {/* Screen glow */}
      {isActive && (
        <rect
          x={-size / 2 + 4}
          y={-size / 2 + 4}
          width={size - 8}
          height={size * 0.75 - 8}
          rx={2}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={glowProgress * 0.8}
          filter="url(#tvglow)"
        />
      )}
      {/* Antenna */}
      <line
        x1={-6} y1={-size / 2}
        x2={-size / 3} y2={-size / 2 - size * 0.3}
        stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}
      />
      <line
        x1={6} y1={-size / 2}
        x2={size / 3} y2={-size / 2 - size * 0.3}
        stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}
      />
      {/* Stand */}
      <rect
        x={-size * 0.2}
        y={size * 0.75 / 2}
        width={size * 0.4}
        height={6}
        rx={2}
        fill="rgba(255,255,255,0.3)"
      />
    </g>
  );
};

/* ── Signal dots traveling from tower to TVs ── */
const SignalDots: React.FC<{
  frame: number;
  tvPositions: { x: number; y: number }[];
}> = ({ frame, tvPositions }) => {
  return (
    <g>
      {tvPositions.map((tv, i) => {
        const period = 40 + hash(i * 7, 20);
        const t = ((frame + hash(i * 13, 30)) % period) / period;
        if (t > 0.9) return null;
        const startX = 280;
        const startY = 18;
        const x = interpolate(t, [0, 1], [startX, tv.x]);
        const y = interpolate(t, [0, 1], [startY, tv.y]);
        const opacity = interpolate(t, [0, 0.1, 0.8, 0.9], [0, 0.8, 0.6, 0]);
        const colors = ["#06b6d4", "#d946ef", "#f43f5e", "#fbbf24", "#a78bfa"];
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill={colors[i % colors.length]}
            opacity={opacity}
          />
        );
      })}
    </g>
  );
};

/* ── Chorus1Scene ── */
export const Chorus1Scene: React.FC<{
  lines: string[];
  lineDelays: number[];
}> = ({ lines, lineDelays }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgAngle = interpolate(frame, [0, 600], [0, 360]);

  // TVs activate sequentially starting around the lyrics
  const tvData = [
    { x: 680, y: 200, size: 60, delay: 20 },
    { x: 820, y: 350, size: 50, delay: 30 },
    { x: 750, y: 500, size: 55, delay: 40 },
    { x: 900, y: 180, size: 45, delay: 35 },
    { x: 950, y: 420, size: 52, delay: 45 },
    { x: 580, y: 420, size: 48, delay: 50 },
    { x: 1050, y: 300, size: 42, delay: 55 },
  ];
  const tvColors = ["#06b6d4", "#d946ef", "#f43f5e", "#fbbf24", "#a78bfa", "#34d399", "#f472b6"];

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Background gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${bgAngle}deg, #0f0525, #1a0a3e, #0c1445)`,
        }}
      />

      {/* Starfield */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = hash(i * 3 + 100, 1920);
        const y = hash(i * 7 + 200, 1080);
        const size = hash(i * 11, 3) + 1;
        const twinkle = interpolate(
          (frame + hash(i * 13, 40)) % 60,
          [0, 30, 60],
          [0.3, 1, 0.3],
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "white",
              opacity: twinkle,
            }}
          />
        );
      })}

      {/* City skyline silhouette */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(to top, rgba(10,5,30,1) 0%, rgba(10,5,30,0.8) 60%, transparent 100%)",
        }}
      />
      <svg
        style={{ position: "absolute", bottom: 0, left: 0 }}
        width="1920"
        height="160"
        viewBox="0 0 1920 160"
      >
        {/* Simple building silhouettes */}
        <rect x={50} y={60} width={80} height={100} fill="rgba(15,10,35,1)" />
        <rect x={140} y={40} width={60} height={120} fill="rgba(15,10,35,1)" />
        <rect x={400} y={70} width={100} height={90} fill="rgba(15,10,35,1)" />
        <rect x={520} y={50} width={70} height={110} fill="rgba(15,10,35,1)" />
        <rect x={1200} y={55} width={90} height={105} fill="rgba(15,10,35,1)" />
        <rect x={1350} y={35} width={60} height={125} fill="rgba(15,10,35,1)" />
        <rect x={1500} y={65} width={110} height={95} fill="rgba(15,10,35,1)" />
        <rect x={1700} y={45} width={70} height={115} fill="rgba(15,10,35,1)" />
        {/* Ground */}
        <rect x={0} y={140} width={1920} height={20} fill="rgba(15,10,35,1)" />
      </svg>

      {/* Tower + waves + TVs (SVG) */}
      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
      >
        <defs>
          <filter id="tvglow">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <TvTower frame={frame} fps={fps} />
        <RadioWaves frame={frame} />
        <SignalDots
          frame={frame}
          tvPositions={tvData.map((tv) => ({ x: tv.x, y: tv.y }))}
        />

        {tvData.map((tv, i) => (
          <TvSet
            key={i}
            x={tv.x}
            y={tv.y}
            size={tv.size}
            frame={frame}
            activateFrame={tv.delay}
            color={tvColors[i % tvColors.length]}
          />
        ))}
      </svg>

      {/* Particles */}
      <Particles count={20} color="rgba(6,182,212,0.5)" />

      {/* Lyrics */}
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
          return (
            <LyricLine
              key={i}
              text={line}
              delay={delay}
              endDelay={endDelay}
              fontSize={60}
              glowColor="rgba(6,182,212,0.7)"
            />
          );
        })}
      </div>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
