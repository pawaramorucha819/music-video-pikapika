import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { LyricLine } from "./LyricLine";
import { Particles } from "./Particles";
import { PenLights } from "./PenLights";

const { fontFamily } = loadFont();

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

/* ── Anime-style eye (white lines on black) ── */
const AnimeEye: React.FC<{
  cx: number;
  cy: number;
  frame: number;
  fps: number;
  mirror?: boolean;
}> = ({ cx, cy, frame, fps, mirror = false }) => {
  const entry = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const scale = interpolate(entry, [0, 1], [0.3, 1]);
  const breathe = interpolate(frame % 90, [0, 45, 90], [1, 1.015, 1]);
  const sx = mirror ? -1 : 1;

  return (
    <g
      transform={`translate(${cx},${cy}) scale(${sx * scale * breathe},${scale * breathe})`}
      opacity={interpolate(entry, [0, 1], [0, 1])}
    >
      {/* Eye outline */}
      <path
        d="M -120 0 Q -90 -120, 0 -135 Q 90 -120, 120 0 Q 80 80, 0 95 Q -80 80, -120 0 Z"
        fill="none"
        stroke="white"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      {/* Thick upper eyelid */}
      <path
        d="M -120 0 Q -90 -120, 0 -135 Q 90 -120, 120 0"
        fill="none"
        stroke="white"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {/* Eyelashes */}
      <line x1={-105} y1={-30} x2={-125} y2={-60} stroke="white" strokeWidth={3} strokeLinecap="round" />
      <line x1={-75} y1={-80} x2={-95} y2={-115} stroke="white" strokeWidth={3} strokeLinecap="round" />
      <line x1={-35} y1={-115} x2={-45} y2={-155} stroke="white" strokeWidth={3.5} strokeLinecap="round" />
      <line x1={10} y1={-132} x2={10} y2={-170} stroke="white" strokeWidth={3.5} strokeLinecap="round" />
      <line x1={55} y1={-115} x2={70} y2={-150} stroke="white" strokeWidth={3} strokeLinecap="round" />
      <line x1={95} y1={-70} x2={115} y2={-95} stroke="white" strokeWidth={3} strokeLinecap="round" />
      {/* Iris */}
      <circle cx={0} cy={5} r={72} fill="none" stroke="white" strokeWidth={2.5} />
      {/* Pupil */}
      <circle cx={0} cy={5} r={42} fill="none" stroke="white" strokeWidth={2} />
      {/* Main catchlight */}
      <circle cx={-28} cy={-25} r={22} fill="white" opacity={0.95} />
      {/* Small catchlight */}
      <circle cx={18} cy={30} r={10} fill="white" opacity={0.7} />
      {/* Lower eyelid accent */}
      <path
        d="M -100 20 Q -50 85, 0 95 Q 50 85, 100 20"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
};

/* ── Stage spotlight beams ── */
const StageBeams: React.FC<{ frame: number }> = ({ frame }) => {
  const beamCount = 8;
  const colors = [
    "rgba(245,158,11,0.15)",
    "rgba(239,68,68,0.15)",
    "rgba(236,72,153,0.15)",
    "rgba(168,85,247,0.15)",
    "rgba(6,182,212,0.12)",
    "rgba(244,63,94,0.12)",
    "rgba(253,230,138,0.10)",
    "rgba(251,146,60,0.12)",
  ];
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "60%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: beamCount }, (_, i) => {
        const baseAngle = (i / beamCount) * 60 - 30;
        const sway = interpolate(
          (frame + hash(i * 7, 40)) % 80,
          [0, 40, 80],
          [-5, 5, -5],
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: 0,
              height: 0,
              borderLeft: "120px solid transparent",
              borderRight: "120px solid transparent",
              borderTop: `700px solid ${colors[i % colors.length]}`,
              transformOrigin: "top center",
              transform: `translateX(-50%) rotate(${baseAngle + sway}deg)`,
              filter: "blur(8px)",
            }}
          />
        );
      })}
    </div>
  );
};

/* ── LED dot array ── */
const StageLEDs: React.FC<{ frame: number }> = ({ frame }) => {
  const rows = 3;
  const cols = 20;
  const ledColors = ["#f59e0b", "#ef4444", "#ec4899", "#a855f7", "#06b6d4"];
  return (
    <div
      style={{
        position: "absolute",
        top: "18%",
        left: "10%",
        right: "10%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {Array.from({ length: cols }, (_, c) => {
            const idx = r * cols + c;
            const period = hash(idx * 13, 20) + 15;
            const phase = hash(idx * 17, 30);
            const color = ledColors[hash(idx * 11, ledColors.length)];
            const brightness = interpolate(
              (frame + phase) % period,
              [0, period / 2, period],
              [0.2, 1, 0.2],
            );
            return (
              <div
                key={c}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: color,
                  opacity: brightness,
                  boxShadow: `0 0 8px ${color}`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ── PreChorusScene ── */
export const PreChorusScene: React.FC<{
  lines: string[];
}> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line delays: lineInterval=97, base=40
  const lineDelays = [40, 137, 234, 331];

  // Phase transition: eyes (black) → stage (colorful)
  // Start transitioning just before line 1 appears
  const TRANSITION_START = 125;
  const TRANSITION_DURATION = 35;

  const stageProgress = interpolate(
    frame,
    [TRANSITION_START, TRANSITION_START + TRANSITION_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  const eyesOpacity = 1 - stageProgress;

  // Color saturation ramps up slightly after stage appears
  const colorSaturation = interpolate(
    frame,
    [TRANSITION_START + TRANSITION_DURATION, TRANSITION_START + TRANSITION_DURATION + 20],
    [0.6, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* ── Stage background (fades in at line 1) ── */}
      {stageProgress > 0 && (
        <AbsoluteFill style={{ opacity: stageProgress }}>
          {/* Venue gradient */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, #0a0018 0%, #150028 15%, #1a0035 30%, #12002a 50%, #0a0014 70%, #050008 100%)",
            }}
          />

          <StageBeams frame={frame} />
          <StageLEDs frame={frame} />

          {/* Stage floor glow */}
          <div
            style={{
              position: "absolute",
              top: "28%",
              left: "20%",
              right: "20%",
              height: 4,
              background:
                "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), rgba(239,68,68,0.6), rgba(236,72,153,0.6), transparent)",
              boxShadow:
                "0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(239,68,68,0.2)",
              borderRadius: 2,
              opacity: colorSaturation,
            }}
          />

          {/* Crowd with pen lights */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
            }}
          >
            <AbsoluteFill
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.8) 100%)",
              }}
            />
            <PenLights count={60} />
          </div>

          <Particles count={25} color={`rgba(253,230,138,${(0.7 * colorSaturation).toFixed(2)})`} />
        </AbsoluteFill>
      )}

      {/* ── Eyes scene (black bg, fades out) ── */}
      {eyesOpacity > 0 && (
        <AbsoluteFill style={{ opacity: eyesOpacity }}>
          <AbsoluteFill style={{ backgroundColor: "#000" }} />

          {/* Two large anime eyes */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <svg width={1000} height={450} viewBox="-500 -225 1000 450">
              <AnimeEye cx={-195} cy={0} frame={frame} fps={fps} />
              <AnimeEye cx={195} cy={0} frame={frame} fps={fps} mirror />
            </svg>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Lyrics ── */}
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
              fontSize={56}
              glowColor={
                i === 0
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(239,68,68,0.6)"
              }
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
