import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";

const NOTES = ["♪", "♫", "♬", "♩", "♭", "♪", "♫", "♬", "♩", "♬"];

const NOTE_COLORS = [
  "#ec4899",
  "#a855f7",
  "#6366f1",
  "#06b6d4",
  "#f43f5e",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#f472b6",
  "#818cf8",
];

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

/** Massive notes flooding right to left, covering the screen */
const NoteFlood: React.FC<{ progress: number }> = ({ progress }) => {
  const count = 120;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const y = hash(i * 7 + 1, 100);
        const size = hash(i * 11 + 2, 36) + 22;
        const speed = hash(i * 13 + 3, 35) + 45;
        const startOffset = hash(i * 17 + 4, 50);
        const rotation = hash(i * 19 + 5, 40) - 20;
        const note = NOTES[hash(i * 23 + 6, NOTES.length)];
        const color = NOTE_COLORS[hash(i * 29 + 7, NOTE_COLORS.length)];
        const bounceAmp = hash(i * 31 + 8, 18) + 6;

        const noteProgress = interpolate(
          progress * 100,
          [startOffset, startOffset + speed],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        if (noteProgress <= 0) return null;

        const x = interpolate(noteProgress, [0, 1], [120, -20]);
        const opacity = interpolate(
          noteProgress,
          [0, 0.03, 0.9, 1],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp" },
        );
        const bounce = Math.sin(noteProgress * Math.PI * 2) * bounceAmp;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `calc(${y}% + ${bounce}px)`,
              fontSize: size,
              color,
              opacity,
              transform: `rotate(${rotation}deg)`,
              textShadow: `0 0 14px ${color}, 0 0 28px ${color}60`,
              fontWeight: "bold",
            }}
          >
            {note}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Lens flare wipe — sweeps RIGHT to LEFT to match note flow */
const LensFlareWipe: React.FC<{ progress: number }> = ({ progress }) => {
  // Right to left: 120% → -20%
  const flareX = interpolate(progress, [0.05, 0.95], [120, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const intensity = interpolate(
    progress,
    [0, 0.1, 0.4, 0.6, 0.9, 1],
    [0, 0.6, 1, 1, 0.6, 0],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Blinding white-out at peak */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,255,255,${0.5 * intensity})`,
        }}
      />

      {/* Main flare — very large, intense white core */}
      <div
        style={{
          position: "absolute",
          left: `${flareX}%`,
          top: "50%",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background: `radial-gradient(ellipse,
            rgba(255,255,255,${1.0 * intensity}) 0%,
            rgba(255,255,240,${0.85 * intensity}) 10%,
            rgba(255,240,200,${0.6 * intensity}) 25%,
            rgba(255,200,120,${0.3 * intensity}) 45%,
            rgba(255,160,80,${0.1 * intensity}) 65%,
            transparent 80%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Wide horizontal streak across entire screen */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "46%",
          height: 20,
          background: `linear-gradient(90deg,
            transparent ${Math.max(flareX - 40, 0)}%,
            rgba(255,240,200,${0.6 * intensity}) ${flareX - 15}%,
            rgba(255,255,255,${1.0 * intensity}) ${flareX}%,
            rgba(255,240,200,${0.6 * intensity}) ${flareX + 15}%,
            transparent ${Math.min(flareX + 40, 100)}%)`,
          filter: "blur(4px)",
        }}
      />

      {/* Thin secondary streak */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "52%",
          height: 6,
          background: `linear-gradient(90deg,
            transparent ${Math.max(flareX - 30, 0)}%,
            rgba(255,220,180,${0.4 * intensity}) ${flareX - 8}%,
            rgba(255,255,240,${0.7 * intensity}) ${flareX}%,
            rgba(255,220,180,${0.4 * intensity}) ${flareX + 8}%,
            transparent ${Math.min(flareX + 30, 100)}%)`,
          filter: "blur(2px)",
        }}
      />

      {/* Flare ring ghost */}
      <div
        style={{
          position: "absolute",
          left: `${flareX - 8}%`,
          top: "40%",
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `3px solid rgba(255,230,180,${0.35 * intensity})`,
          background: `radial-gradient(circle,
            rgba(255,240,200,${0.2 * intensity}) 0%,
            transparent 60%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Second ghost ring */}
      <div
        style={{
          position: "absolute",
          left: `${flareX + 12}%`,
          top: "58%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle,
            rgba(255,200,150,${0.25 * intensity}) 0%,
            transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </AbsoluteFill>
  );
};

const NoteTransitionComponent: React.FC<{
  children: React.ReactNode;
  presentationDirection: "entering" | "exiting";
  presentationProgress: number;
}> = ({ children, presentationDirection, presentationProgress }) => {
  const isExiting = presentationDirection === "exiting";

  // Lens flare wipe RIGHT→LEFT: clip the scenes at the flare boundary
  const wipePos = interpolate(
    presentationProgress,
    [0.05, 0.95],
    [100, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  // Wipe right→left: exiting shrinks from right, entering reveals from right
  // inset(top right bottom left)
  const clipPath = isExiting
    ? `inset(0 ${100 - wipePos}% 0 0)`
    : `inset(0 0 0 ${wipePos}%)`;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath }}>
        {children}
      </AbsoluteFill>

      {/* Lens flare and notes render on top of everything for BOTH layers */}
      {isExiting && (
        <>
          <LensFlareWipe progress={presentationProgress} />
          <NoteFlood progress={presentationProgress} />
        </>
      )}
    </AbsoluteFill>
  );
};

export const noteTransition =
  (): TransitionPresentation<Record<string, never>> => ({
    component: NoteTransitionComponent,
    props: {},
  });
