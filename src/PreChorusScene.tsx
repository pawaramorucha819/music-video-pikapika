import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { LightLeak } from "@remotion/light-leaks";
import { LyricLine } from "./LyricLine";
import { Particles } from "./Particles";
import { PenLights } from "./PenLights";

const { fontFamily } = loadFont();

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

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
  durationInFrames: number;
}> = ({ lines, durationInFrames }) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  // Line delays: lineInterval=97, base=40
  const lineDelays = [40, 137, 234, 331];

  // Grayscale → color transition at line 1 ("カラフル世界が 踊りだす")
  const GRAYSCALE_END_START = 125;
  const GRAYSCALE_END_DURATION = 40;
  const grayscale = interpolate(
    frame,
    [GRAYSCALE_END_START, GRAYSCALE_END_START + GRAYSCALE_END_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );

  // Light leak at line 3 ("最高潮まで つれてって！")
  const LIGHT_LEAK_START = 315;
  const lightLeakDuration = durationInFrames - LIGHT_LEAK_START;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* ── Stage background with grayscale filter ── */}
      <AbsoluteFill
        style={{
          filter: `grayscale(${grayscale})`,
        }}
      >
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

        <Particles count={25} color="rgba(253,230,138,0.7)" />
      </AbsoluteFill>

      {/* ── Light leak at "最高潮まで つれてって！" ── */}
      {frame >= LIGHT_LEAK_START && (
        <Sequence from={LIGHT_LEAK_START} durationInFrames={lightLeakDuration} layout="none">
          <AbsoluteFill>
            <LightLeak seed={3} hueShift={30} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ── Lyrics (outside grayscale filter) ── */}
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
                i < 1
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
