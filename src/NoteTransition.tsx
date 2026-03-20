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
];

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

/** Notes flowing right to left during the transition */
const TransitionNotes: React.FC<{ progress: number }> = ({ progress }) => {
  const count = 50;
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const y = hash(i * 7 + 1, 90) + 5;
        const size = hash(i * 11 + 2, 28) + 24;
        const speed = hash(i * 13 + 3, 40) + 60;
        const startOffset = hash(i * 17 + 4, 30);
        const rotation = hash(i * 19 + 5, 30) - 15;
        const note = NOTES[hash(i * 23 + 6, NOTES.length)];
        const color = NOTE_COLORS[hash(i * 29 + 7, NOTE_COLORS.length)];
        const bounceAmp = hash(i * 31 + 8, 15) + 8;

        const noteProgress = interpolate(
          progress * 100,
          [startOffset, startOffset + speed],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        const x = interpolate(noteProgress, [0, 1], [115, -15]);
        const opacity = interpolate(
          noteProgress,
          [0, 0.05, 0.85, 1],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp" },
        );
        const bounce = Math.sin(noteProgress * Math.PI * 2.5) * bounceAmp;

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
              textShadow: `0 0 12px ${color}80, 0 0 24px ${color}40`,
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

/** Lens flare wipe — warm glow sweeps across the screen */
const LensFlareWipe: React.FC<{ progress: number }> = ({ progress }) => {
  // Flare sweeps from left to right
  const flareX = interpolate(progress, [0, 1], [-30, 130], {
    easing: Easing.inOut(Easing.quad),
  });

  // Intensity peaks at midpoint
  const intensity = interpolate(
    progress,
    [0, 0.3, 0.5, 0.7, 1],
    [0, 0.4, 1, 0.4, 0],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Main flare glow */}
      <div
        style={{
          position: "absolute",
          left: `${flareX}%`,
          top: "50%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle,
            rgba(255,250,220,${0.9 * intensity}) 0%,
            rgba(255,220,150,${0.5 * intensity}) 25%,
            rgba(255,180,100,${0.2 * intensity}) 50%,
            transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Horizontal flare streak */}
      <div
        style={{
          position: "absolute",
          left: `${flareX - 20}%`,
          top: "48%",
          width: "40%",
          height: 8,
          background: `linear-gradient(90deg,
            transparent,
            rgba(255,240,200,${0.6 * intensity}),
            rgba(255,255,255,${0.8 * intensity}),
            rgba(255,240,200,${0.6 * intensity}),
            transparent)`,
          borderRadius: 4,
          filter: `blur(4px)`,
        }}
      />

      {/* Secondary smaller flare */}
      <div
        style={{
          position: "absolute",
          left: `${flareX + 8}%`,
          top: "45%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle,
            rgba(255,200,150,${0.4 * intensity}) 0%,
            transparent 60%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Overall warm glow */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(255,240,220,${0.15 * intensity})`,
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

  // Soft crossfade driven by the lens flare
  const opacity = isExiting
    ? interpolate(presentationProgress, [0.2, 0.55], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(presentationProgress, [0.45, 0.8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
      {/* Lens flare wipe + notes on exiting scene (visible on top) */}
      {isExiting && (
        <>
          <LensFlareWipe progress={presentationProgress} />
          <TransitionNotes progress={presentationProgress} />
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
