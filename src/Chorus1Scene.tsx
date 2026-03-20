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

/* ── Realistic TV Tower ── */
const TvTower: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const entry = spring({ frame, fps, config: { damping: 200 } });
  const scaleY = interpolate(entry, [0, 1], [0, 1]);
  const blink = interpolate(frame % 40, [0, 15, 20, 40], [1, 0.2, 1, 0.2]);

  const towerX = 320;
  const towerTop = 60;
  const towerBottom = 750;

  // Width at a given y
  const w = (y: number) => interpolate(y, [towerTop, towerBottom], [8, 70]);

  return (
    <g
      transform={`translate(0, ${towerBottom}) scale(1, ${scaleY})`}
      style={{ transformOrigin: `${towerX}px ${towerBottom}px` }}
    >
      {/* Main tower legs (red-white banding) */}
      {Array.from({ length: 14 }, (_, i) => {
        const y1 = towerTop + 50 + i * 48;
        const y2 = y1 + 48;
        if (y2 > towerBottom) return null;
        const w1 = w(y1);
        const w2 = w(y2);
        const isRed = i % 2 === 0;
        return (
          <React.Fragment key={`band-${i}`}>
            {/* Left leg segment */}
            <polygon
              points={`${towerX - w1},${y1} ${towerX - w2},${y2} ${towerX - w2 + 6},${y2} ${towerX - w1 + 6},${y1}`}
              fill={isRed ? "#d63031" : "rgba(240,240,240,0.9)"}
            />
            {/* Right leg segment */}
            <polygon
              points={`${towerX + w1},${y1} ${towerX + w2},${y2} ${towerX + w2 - 6},${y2} ${towerX + w1 - 6},${y1}`}
              fill={isRed ? "#d63031" : "rgba(240,240,240,0.9)"}
            />
            {/* Cross brace */}
            <line
              x1={towerX - w1 + 3} y1={y1}
              x2={towerX + w2 - 3} y2={y2}
              stroke={isRed ? "rgba(180,40,40,0.6)" : "rgba(200,200,200,0.5)"}
              strokeWidth={1.5}
            />
            <line
              x1={towerX + w1 - 3} y1={y1}
              x2={towerX - w2 + 3} y2={y2}
              stroke={isRed ? "rgba(180,40,40,0.6)" : "rgba(200,200,200,0.5)"}
              strokeWidth={1.5}
            />
            {/* Horizontal beam */}
            <line
              x1={towerX - w1} y1={y1}
              x2={towerX + w1} y2={y1}
              stroke="rgba(200,200,200,0.4)"
              strokeWidth={1.2}
            />
          </React.Fragment>
        );
      })}

      {/* Observation deck (platform) */}
      {[280, 450].map((py, i) => {
        const pw = w(py) + 15;
        return (
          <React.Fragment key={`deck-${i}`}>
            <rect
              x={towerX - pw} y={py - 4}
              width={pw * 2} height={8}
              rx={2}
              fill="rgba(180,180,190,0.8)"
            />
            <rect
              x={towerX - pw + 4} y={py - 14}
              width={pw * 2 - 8} height={10}
              rx={1}
              fill="rgba(120,120,140,0.6)"
            />
          </React.Fragment>
        );
      })}

      {/* Antenna mast */}
      <rect
        x={towerX - 3} y={towerTop - 10}
        width={6} height={65}
        fill="rgba(220,220,220,0.9)"
      />
      {/* Antenna tip */}
      <line
        x1={towerX} y1={towerTop - 10}
        x2={towerX} y2={towerTop - 40}
        stroke="rgba(240,240,240,0.9)" strokeWidth={3}
      />
      {/* Antenna cross arms */}
      {[-25, -15].map((dy, i) => (
        <line
          key={`arm-${i}`}
          x1={towerX - 12 - i * 4} y1={towerTop + dy}
          x2={towerX + 12 + i * 4} y2={towerTop + dy}
          stroke="rgba(220,220,220,0.7)" strokeWidth={2}
        />
      ))}

      {/* Blinking beacons */}
      <circle cx={towerX} cy={towerTop - 40} r={5} fill="#ff4757" opacity={blink} />
      <circle cx={towerX} cy={towerTop - 40} r={14} fill="none" stroke="#ff4757" strokeWidth={1.5} opacity={blink * 0.4} />
      <circle cx={towerX} cy={280} r={4} fill="#ff4757" opacity={blink * 0.7} />
      <circle cx={towerX} cy={450} r={4} fill="#ff4757" opacity={blink * 0.7} />
    </g>
  );
};

/* ── Radio waves from tower ── */
const RadioWaves: React.FC<{ frame: number }> = ({ frame }) => {
  const originX = 320;
  const originY = 20;
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const period = 55;
        const t = ((frame + i * (period / 6)) % period) / period;
        const radius = interpolate(t, [0, 1], [15, 500]);
        const opacity = interpolate(t, [0, 0.15, 1], [0, 0.5, 0]);
        // Arc from upper-right direction toward the TV
        const startAngle = -0.75 * Math.PI;
        const endAngle = -0.1 * Math.PI;
        return (
          <path
            key={i}
            d={`M ${originX + radius * Math.cos(startAngle)} ${originY + radius * Math.sin(startAngle)}
                A ${radius} ${radius} 0 0 1 ${originX + radius * Math.cos(endAngle)} ${originY + radius * Math.sin(endAngle)}`}
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

/* ── Large CRT TV ── */
const BigTv: React.FC<{
  frame: number;
  fps: number;
  heartStartFrame: number;
}> = ({ frame, fps, heartStartFrame }) => {
  const entry = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });
  const scale = interpolate(entry, [0, 1], [0.5, 1]);
  const opacity = interpolate(entry, [0, 1], [0, 1]);

  // Screen turns on with static then clears
  const screenOn = frame >= 15;
  const staticNoise = frame >= 15 && frame < 35;
  const showHearts = frame >= heartStartFrame;

  // Screen glow color
  const screenBg = screenOn ? "#0a1628" : "#111";
  const glowColor = showHearts ? "rgba(244,63,94,0.3)" : "rgba(6,182,212,0.2)";

  // TV dimensions
  const tvW = 480;
  const tvH = 360;
  const bezel = 30;
  const screenW = tvW - bezel * 2;
  const screenH = tvH - bezel * 2;
  const cx = 960;
  const cy = 380;

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity}>
      {/* TV body - rounded rectangle */}
      <rect
        x={-tvW / 2 - 10} y={-tvH / 2 - 10}
        width={tvW + 20} height={tvH + 30}
        rx={20}
        fill="#2d2d3d"
        stroke="rgba(100,100,120,0.6)"
        strokeWidth={2}
      />
      {/* Inner bezel */}
      <rect
        x={-tvW / 2} y={-tvH / 2}
        width={tvW} height={tvH}
        rx={12}
        fill="#1a1a2e"
      />
      {/* Screen */}
      <clipPath id="screen-clip">
        <rect
          x={-screenW / 2} y={-screenH / 2}
          width={screenW} height={screenH}
          rx={6}
        />
      </clipPath>
      <rect
        x={-screenW / 2} y={-screenH / 2}
        width={screenW} height={screenH}
        rx={6}
        fill={screenBg}
      />
      {/* Screen glow */}
      <rect
        x={-screenW / 2} y={-screenH / 2}
        width={screenW} height={screenH}
        rx={6}
        fill={glowColor}
      />

      {/* Static noise */}
      {staticNoise && (
        <g clipPath="url(#screen-clip)">
          {Array.from({ length: 60 }, (_, i) => {
            const sx = hash(i * 3 + frame * 7, screenW) - screenW / 2;
            const sy = hash(i * 11 + frame * 13, screenH) - screenH / 2;
            const sw = hash(i * 17 + frame, 30) + 5;
            return (
              <rect
                key={i}
                x={sx} y={sy}
                width={sw} height={2}
                fill={`rgba(255,255,255,${hash(i * 19 + frame, 60) / 100})`}
              />
            );
          })}
        </g>
      )}

      {/* Bouncing hearts inside screen */}
      {showHearts && (
        <g clipPath="url(#screen-clip)">
          {Array.from({ length: 8 }, (_, i) => {
            const heartFrame = frame - heartStartFrame;
            const speed = 1.5 + hash(i * 7, 10) / 10;
            const phaseX = hash(i * 13, 100);
            const phaseY = hash(i * 19, 100);
            const bounceX = Math.sin((heartFrame * speed + phaseX) * 0.08) * (screenW / 2 - 30);
            const bounceY = Math.cos((heartFrame * speed + phaseY) * 0.1) * (screenH / 2 - 25);
            const heartSize = 14 + hash(i * 23, 16);
            const rotation = Math.sin((heartFrame + phaseX) * 0.05) * 20;
            const heartColors = ["#f43f5e", "#ec4899", "#f472b6", "#fb7185", "#e11d48", "#be123c", "#ff6b9d", "#ff3d7f"];
            const color = heartColors[i % heartColors.length];
            const heartBounce = Math.abs(Math.sin((heartFrame * speed + phaseY) * 0.12)) * 0.3 + 0.85;

            return (
              <g
                key={i}
                transform={`translate(${bounceX}, ${bounceY}) rotate(${rotation}) scale(${heartBounce})`}
              >
                <path
                  d={`M 0 ${heartSize * 0.35}
                      C 0 ${-heartSize * 0.1}, ${-heartSize * 0.55} ${-heartSize * 0.4}, ${-heartSize * 0.55} ${-heartSize * 0.1}
                      C ${-heartSize * 0.55} ${heartSize * 0.2}, 0 ${heartSize * 0.45}, 0 ${heartSize * 0.7}
                      C 0 ${heartSize * 0.45}, ${heartSize * 0.55} ${heartSize * 0.2}, ${heartSize * 0.55} ${-heartSize * 0.1}
                      C ${heartSize * 0.55} ${-heartSize * 0.4}, 0 ${-heartSize * 0.1}, 0 ${heartSize * 0.35} Z`}
                  fill={color}
                  opacity={0.9}
                />
              </g>
            );
          })}
        </g>
      )}

      {/* Screen reflection */}
      <rect
        x={-screenW / 2} y={-screenH / 2}
        width={screenW} height={screenH / 3}
        rx={6}
        fill="url(#screen-reflect)"
        opacity={0.08}
      />

      {/* TV brand/buttons area */}
      <rect
        x={tvW / 2 - 60} y={tvH / 2 - 15}
        width={50} height={8}
        rx={4}
        fill="rgba(80,80,100,0.5)"
      />
      <circle cx={tvW / 2 - 20} cy={tvH / 2 - 2} r={5} fill="rgba(100,100,120,0.6)" />

      {/* Stand */}
      <rect
        x={-60} y={tvH / 2 + 20}
        width={120} height={12}
        rx={6}
        fill="rgba(50,50,65,0.9)"
      />
      <rect
        x={-80} y={tvH / 2 + 32}
        width={160} height={6}
        rx={3}
        fill="rgba(60,60,75,0.8)"
      />
    </g>
  );
};

/* ── Signal dots from tower to TV ── */
const SignalDots: React.FC<{ frame: number }> = ({ frame }) => {
  const towerX = 320;
  const towerY = 20;
  const tvX = 960;
  const tvY = 380;
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const period = 35 + i * 5;
        const t = ((frame + i * 10) % period) / period;
        if (t > 0.85) return null;
        const x = interpolate(t, [0, 1], [towerX, tvX]);
        const y = interpolate(t, [0, 0.5, 1], [towerY, towerY + (tvY - towerY) * 0.3, tvY]);
        const opacity = interpolate(t, [0, 0.1, 0.7, 0.85], [0, 0.9, 0.7, 0]);
        const colors = ["#06b6d4", "#22d3ee", "#67e8f9", "#a5f3fc", "#06b6d4"];
        const size = interpolate(t, [0, 0.5, 1], [2, 4, 3]);
        return (
          <React.Fragment key={i}>
            <circle cx={x} cy={y} r={size} fill={colors[i]} opacity={opacity} />
            <circle cx={x} cy={y} r={size * 3} fill={colors[i]} opacity={opacity * 0.2} />
          </React.Fragment>
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

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${bgAngle}deg, #0f0525, #1a0a3e, #0c1445)`,
        }}
      />

      {/* Starfield */}
      {Array.from({ length: 50 }, (_, i) => {
        const x = hash(i * 3 + 100, 1920);
        const y = hash(i * 7 + 200, 1080);
        const size = hash(i * 11, 3) + 1;
        const twinkle = interpolate(
          (frame + hash(i * 13, 40)) % 60,
          [0, 30, 60],
          [0.2, 0.9, 0.2],
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

      {/* City skyline */}
      <svg
        style={{ position: "absolute", bottom: 0, left: 0 }}
        width="1920" height="180" viewBox="0 0 1920 180"
      >
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

      {/* Tower + waves + TV (SVG layer) */}
      <svg
        style={{ position: "absolute", top: 0, left: 0 }}
        width="1920" height="1080" viewBox="0 0 1920 1080"
      >
        <defs>
          <linearGradient id="screen-reflect" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <TvTower frame={frame} fps={fps} />
        <RadioWaves frame={frame} />
        <SignalDots frame={frame} />
        <BigTv frame={frame} fps={fps} heartStartFrame={lineDelays[1]} />
      </svg>

      <Particles count={15} color="rgba(6,182,212,0.4)" />

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
