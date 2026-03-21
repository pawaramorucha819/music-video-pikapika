import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { LyricLine } from "./LyricLine";
import { PenLights } from "./PenLights";
import { Particles } from "./Particles";
import { SpinningHearts } from "./SpinningHearts";
import { AudioWaveform, useAudioBass } from "./AudioWaveform";

loadFont({
  family: "LightNovelPOPv2",
  url: staticFile("fonts/LightNovelPOPv2.otf"),
});
const fontFamily = "LightNovelPOPv2";

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

/** Stage spotlight beams */
const StageBeams: React.FC<{ frame: number }> = ({ frame }) => {
  const beamCount = 8;
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
        const colors = [
          "rgba(236,72,153,0.12)",
          "rgba(99,102,241,0.12)",
          "rgba(6,182,212,0.12)",
          "rgba(168,85,247,0.12)",
          "rgba(244,63,94,0.10)",
          "rgba(34,211,238,0.10)",
          "rgba(192,132,252,0.10)",
          "rgba(251,146,60,0.10)",
        ];
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

/** LED dot array on stage */
const StageLEDs: React.FC<{ frame: number }> = ({ frame }) => {
  const rows = 3;
  const cols = 20;
  const ledColors = ["#ec4899", "#8b5cf6", "#06b6d4", "#f43f5e", "#a855f7"];
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

export const IntroScene: React.FC<{
  lines: string[];
  glowColor?: string;
}> = ({ lines, glowColor = "rgba(236,72,153,0.6)" }) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  // Audio offset: this section starts at 6s in the song
  const AUDIO_OFFSET = 6;
  const bassIntensity = useAudioBass(AUDIO_OFFSET);

  // Hearts + waveform appear with 2nd lyric (frame ~60 = 8s in song)
  const HEARTS_ENTER = 55;

  // --- Tilt camera: first ~60 frames (2s) ---
  // The "virtual canvas" is 180% tall; we tilt from bottom (crowd) up to center (stage)
  const TILT_DURATION = 60;
  const tiltProgress = interpolate(frame, [0, TILT_DURATION], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  // translateY: start offset showing crowd area, move up to stage center
  const tiltY = interpolate(tiltProgress, [0, 1], [35, 0]);
  // Slight zoom-out as we tilt up
  const tiltScale = interpolate(tiltProgress, [0, 1], [1.3, 1.05], {
    extrapolateRight: "clamp",
  });

  // After tilt, a slow gentle drift
  const driftY = interpolate(frame, [TILT_DURATION, 600], [0, -2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Per-line delays (frames within this section; section starts at 6s)
  // Line 0: "ピカピカ光る…"   → 6.5s   = frame 15
  // Line 1: "くるくる回る…"   → 8.0s   = frame 60
  // Line 2: "ほら始まるよ…"   → 11.17s  = frame 155
  // Line 3: "キミとわたしで…" → 14.12s  = frame 244
  const lineDelays = [15, 60, 155, 244];

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      {/* Tilt container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "180%",
          transform: `translateY(-${tiltY + driftY}%) scale(${tiltScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Venue background gradient */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, #0a0018 0%, #150028 15%, #1a0035 30%, #12002a 50%, #0a0014 70%, #050008 100%)",
          }}
        />

        {/* Stage beams */}
        <StageBeams frame={frame} />

        {/* LED lights on stage */}
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
              "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(236,72,153,0.6), rgba(6,182,212,0.6), transparent)",
            boxShadow:
              "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(236,72,153,0.2)",
            borderRadius: 2,
          }}
        />

        {/* Crowd area with pen lights */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
          }}
        >
          {/* Dark crowd silhouette gradient */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.8) 100%)",
            }}
          />
          <PenLights count={80} />
        </div>

        {/* Floating particles (smoke/haze) */}
        <Particles count={25} color="rgba(180,160,255,0.3)" />
      </div>

      {/* Spinning hearts (8-11s: くるくる回る ハートのノイズ) */}
      <SpinningHearts enterFrame={HEARTS_ENTER} bassIntensity={bassIntensity} />

      {/* Audio waveform */}
      <AudioWaveform
        audioOffsetInSeconds={AUDIO_OFFSET}
        enterFrame={HEARTS_ENTER}
        color="rgba(236,72,153,0.6)"
        barColor="rgba(168,85,247,0.5)"
      />

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
            i < lines.length - 1
              ? lineDelays[i + 1]
              : undefined;
          return (
            <LyricLine
              key={i}
              text={line}
              delay={delay}
              endDelay={endDelay}
              fontSize={56}
              glowColor={glowColor}
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
