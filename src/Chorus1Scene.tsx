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

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

// TV position constants
const TV_CX = 1050;
const TV_CY = 500;
const TOWER_X = 320;
const TOWER_TIP_Y = 20;

/* ── Realistic TV Tower ── */
const TvTower: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const entry = spring({ frame, fps, config: { damping: 200 } });
  const scaleY = interpolate(entry, [0, 1], [0, 1]);
  const blink = interpolate(frame % 40, [0, 15, 20, 40], [1, 0.2, 1, 0.2]);

  const towerTop = 60;
  const towerBottom = 750;
  const w = (y: number) => interpolate(y, [towerTop, towerBottom], [8, 70]);

  return (
    <g
      transform={`scale(1, ${scaleY})`}
      style={{ transformOrigin: `${TOWER_X}px ${towerBottom}px` }}
    >
      {/* Tower legs with red-white banding */}
      {Array.from({ length: 14 }, (_, i) => {
        const y1 = towerTop + 50 + i * 48;
        const y2 = y1 + 48;
        if (y2 > towerBottom) return null;
        const w1 = w(y1);
        const w2 = w(y2);
        const isRed = i % 2 === 0;
        return (
          <React.Fragment key={`band-${i}`}>
            <polygon
              points={`${TOWER_X - w1},${y1} ${TOWER_X - w2},${y2} ${TOWER_X - w2 + 6},${y2} ${TOWER_X - w1 + 6},${y1}`}
              fill={isRed ? "#d63031" : "rgba(240,240,240,0.9)"}
            />
            <polygon
              points={`${TOWER_X + w1},${y1} ${TOWER_X + w2},${y2} ${TOWER_X + w2 - 6},${y2} ${TOWER_X + w1 - 6},${y1}`}
              fill={isRed ? "#d63031" : "rgba(240,240,240,0.9)"}
            />
            <line
              x1={TOWER_X - w1 + 3} y1={y1} x2={TOWER_X + w2 - 3} y2={y2}
              stroke={isRed ? "rgba(180,40,40,0.6)" : "rgba(200,200,200,0.5)"} strokeWidth={1.5}
            />
            <line
              x1={TOWER_X + w1 - 3} y1={y1} x2={TOWER_X - w2 + 3} y2={y2}
              stroke={isRed ? "rgba(180,40,40,0.6)" : "rgba(200,200,200,0.5)"} strokeWidth={1.5}
            />
            <line
              x1={TOWER_X - w1} y1={y1} x2={TOWER_X + w1} y2={y1}
              stroke="rgba(200,200,200,0.4)" strokeWidth={1.2}
            />
          </React.Fragment>
        );
      })}

      {/* Observation decks */}
      {[280, 450].map((py, i) => {
        const pw = w(py) + 15;
        return (
          <React.Fragment key={`deck-${i}`}>
            <rect x={TOWER_X - pw} y={py - 4} width={pw * 2} height={8} rx={2} fill="rgba(180,180,190,0.8)" />
            <rect x={TOWER_X - pw + 4} y={py - 14} width={pw * 2 - 8} height={10} rx={1} fill="rgba(120,120,140,0.6)" />
          </React.Fragment>
        );
      })}

      {/* Antenna mast */}
      <rect x={TOWER_X - 3} y={towerTop - 10} width={6} height={65} fill="rgba(220,220,220,0.9)" />
      <line x1={TOWER_X} y1={towerTop - 10} x2={TOWER_X} y2={towerTop - 40} stroke="rgba(240,240,240,0.9)" strokeWidth={3} />
      {[-25, -15].map((dy, i) => (
        <line key={`arm-${i}`} x1={TOWER_X - 12 - i * 4} y1={towerTop + dy} x2={TOWER_X + 12 + i * 4} y2={towerTop + dy} stroke="rgba(220,220,220,0.7)" strokeWidth={2} />
      ))}

      {/* Beacons */}
      <circle cx={TOWER_X} cy={towerTop - 40} r={5} fill="#ff4757" opacity={blink} />
      <circle cx={TOWER_X} cy={towerTop - 40} r={14} fill="none" stroke="#ff4757" strokeWidth={1.5} opacity={blink * 0.4} />
      <circle cx={TOWER_X} cy={280} r={4} fill="#ff4757" opacity={blink * 0.7} />
      <circle cx={TOWER_X} cy={450} r={4} fill="#ff4757" opacity={blink * 0.7} />
    </g>
  );
};

/* ── Yellow signal beam from tower to TV ── */
const SignalBeam: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = interpolate(frame % 20, [0, 10, 20], [0.15, 0.35, 0.15]);
  return (
    <g>
      {/* Main beam path (straight line glow) */}
      <line
        x1={TOWER_X} y1={TOWER_TIP_Y}
        x2={TV_CX} y2={TV_CY}
        stroke="#fbbf24"
        strokeWidth={4}
        opacity={pulse}
      />
      <line
        x1={TOWER_X} y1={TOWER_TIP_Y}
        x2={TV_CX} y2={TV_CY}
        stroke="#fde68a"
        strokeWidth={12}
        opacity={pulse * 0.3}
        filter="url(#beamglow)"
      />
      {/* Signal dots traveling along beam */}
      {Array.from({ length: 6 }, (_, i) => {
        const period = 30 + i * 4;
        const t = ((frame + i * 8) % period) / period;
        const x = interpolate(t, [0, 1], [TOWER_X, TV_CX]);
        const y = interpolate(t, [0, 1], [TOWER_TIP_Y, TV_CY]);
        const opacity = interpolate(t, [0, 0.1, 0.8, 1], [0, 1, 0.8, 0]);
        const size = interpolate(t, [0, 0.5, 1], [2, 5, 3]);
        return (
          <React.Fragment key={i}>
            <circle cx={x} cy={y} r={size} fill="#fbbf24" opacity={opacity} />
            <circle cx={x} cy={y} r={size * 2.5} fill="#fde68a" opacity={opacity * 0.3} />
          </React.Fragment>
        );
      })}
    </g>
  );
};

/* ── Large CRT TV with pulsing heart ── */
const BigTv: React.FC<{
  frame: number;
  fps: number;
  heartStartFrame: number;
}> = ({ frame, fps, heartStartFrame }) => {
  const entry = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const scale = interpolate(entry, [0, 1], [0.5, 1]);
  const opacity = interpolate(entry, [0, 1], [0, 1]);

  const screenOn = frame >= 15;
  const staticNoise = frame >= 15 && frame < 35;
  const showHeart = frame >= heartStartFrame;

  const screenBg = screenOn ? "#0a1628" : "#111";
  const glowColor = showHeart ? "rgba(244,63,94,0.25)" : "rgba(251,191,36,0.15)";

  const tvW = 480;
  const tvH = 360;
  const bezel = 30;
  const screenW = tvW - bezel * 2;
  const screenH = tvH - bezel * 2;

  // Heart beat: rhythmic pulse (~120 BPM = every 15 frames at 30fps)
  const heartFrame = frame - heartStartFrame;
  const beatCycle = heartFrame % 15;
  const beatScale = showHeart
    ? interpolate(beatCycle, [0, 3, 6, 15], [1, 1.25, 1.05, 1], { extrapolateRight: "clamp" })
    : 0;
  const beatGlow = showHeart
    ? interpolate(beatCycle, [0, 3, 6, 15], [0.5, 1, 0.6, 0.5], { extrapolateRight: "clamp" })
    : 0;

  return (
    <g transform={`translate(${TV_CX}, ${TV_CY}) scale(${scale})`} opacity={opacity}>
      {/* TV body */}
      <rect
        x={-tvW / 2 - 10} y={-tvH / 2 - 10}
        width={tvW + 20} height={tvH + 30}
        rx={20} fill="#2d2d3d"
        stroke="rgba(100,100,120,0.6)" strokeWidth={2}
      />
      <rect x={-tvW / 2} y={-tvH / 2} width={tvW} height={tvH} rx={12} fill="#1a1a2e" />

      {/* Screen */}
      <clipPath id="screen-clip">
        <rect x={-screenW / 2} y={-screenH / 2} width={screenW} height={screenH} rx={6} />
      </clipPath>
      <rect x={-screenW / 2} y={-screenH / 2} width={screenW} height={screenH} rx={6} fill={screenBg} />
      <rect x={-screenW / 2} y={-screenH / 2} width={screenW} height={screenH} rx={6} fill={glowColor} />

      {/* Static noise */}
      {staticNoise && (
        <g clipPath="url(#screen-clip)">
          {Array.from({ length: 60 }, (_, i) => {
            const sx = hash(i * 3 + frame * 7, screenW) - screenW / 2;
            const sy = hash(i * 11 + frame * 13, screenH) - screenH / 2;
            const sw = hash(i * 17 + frame, 30) + 5;
            return (
              <rect key={i} x={sx} y={sy} width={sw} height={2}
                fill={`rgba(255,255,255,${hash(i * 19 + frame, 60) / 100})`} />
            );
          })}
        </g>
      )}

      {/* Large pulsing heart (same shape as SpinningHearts) */}
      {showHeart && (
        <g clipPath="url(#screen-clip)">
          {/* Heart glow background */}
          <circle cx={0} cy={0} r={100} fill="#ec4899" opacity={beatGlow * 0.2} />
          <g transform={`translate(-90, -80) scale(${beatScale * 7.5})`}>
            <path
              d={HEART_PATH}
              fill="#ec4899"
              filter="drop-shadow(0 0 3px rgba(236,72,153,0.8))"
            />
          </g>
        </g>
      )}

      {/* Screen reflection */}
      <rect x={-screenW / 2} y={-screenH / 2} width={screenW} height={screenH / 3} rx={6} fill="url(#screen-reflect)" opacity={0.06} />

      {/* Buttons */}
      <rect x={tvW / 2 - 60} y={tvH / 2 - 15} width={50} height={8} rx={4} fill="rgba(80,80,100,0.5)" />
      <circle cx={tvW / 2 - 20} cy={tvH / 2 - 2} r={5} fill="rgba(100,100,120,0.6)" />

      {/* Stand */}
      <rect x={-60} y={tvH / 2 + 20} width={120} height={12} rx={6} fill="rgba(50,50,65,0.9)" />
      <rect x={-80} y={tvH / 2 + 32} width={160} height={6} rx={3} fill="rgba(60,60,75,0.8)" />
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

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Background */}
      <AbsoluteFill
        style={{ background: `linear-gradient(${bgAngle}deg, #0f0525, #1a0a3e, #0c1445)` }}
      />

      {/* Starfield */}
      {Array.from({ length: 50 }, (_, i) => {
        const x = hash(i * 3 + 100, 1920);
        const y = hash(i * 7 + 200, 1080);
        const size = hash(i * 11, 3) + 1;
        const twinkle = interpolate((frame + hash(i * 13, 40)) % 60, [0, 30, 60], [0.2, 0.9, 0.2]);
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: size, height: size, borderRadius: "50%",
            backgroundColor: "white", opacity: twinkle,
          }} />
        );
      })}

      {/* City skyline */}
      <svg style={{ position: "absolute", bottom: 0, left: 0 }} width="1920" height="180" viewBox="0 0 1920 180">
        <rect x={40} y={60} width={80} height={120} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={130} y={35} width={55} height={145} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={200} y={80} width={70} height={100} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={450} y={55} width={90} height={125} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={560} y={70} width={60} height={110} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={1250} y={50} width={80} height={130} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={1400} y={65} width={100} height={115} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={1550} y={40} width={60} height={140} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={1700} y={75} width={90} height={105} rx={2} fill="rgba(15,10,35,1)" />
        <rect x={0} y={160} width={1920} height={20} fill="rgba(15,10,35,1)" />
      </svg>

      {/* Main SVG layer */}
      <svg style={{ position: "absolute", top: 0, left: 0 }} width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="screen-reflect" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="beamglow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <TvTower frame={frame} fps={fps} />
        <SignalBeam frame={frame} />
        <BigTv frame={frame} fps={fps} heartStartFrame={lineDelays[1]} />
      </svg>

      <Particles count={15} color="rgba(251,191,36,0.4)" />

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
              fontSize={60} glowColor="rgba(251,191,36,0.7)" />
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
