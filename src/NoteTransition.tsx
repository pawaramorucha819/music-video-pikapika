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

/** Lens flare wipe — the flare IS the wipe boundary */
const LensFlareWipe: React.FC<{ progress: number }> = ({ progress }) => {
  const flareX = interpolate(progress, [0.05, 0.95], [-20, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const intensity = interpolate(
    progress,
    [0, 0.15, 0.5, 0.85, 1],
    [0, 0.7, 1, 0.7, 0],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Wide bright flare glow at wipe edge */}
      <div
        style={{
          position: "absolute",
          left: `${flareX}%`,
          top: "50%",
          width: 900,
          height: 1200,
          borderRadius: "50%",
          background: `radial-gradient(ellipse,
            rgba(255,255,255,${0.95 * intensity}) 0%,
            rgba(255,250,220,${0.7 * intensity}) 15%,
            rgba(255,220,150,${0.4 * intensity}) 35%,
            rgba(255,180,100,${0.15 * intensity}) 55%,
            transparent 75%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Horizontal light streak */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "47%",
          height: 12,
          background: `linear-gradient(90deg,
            transparent ${Math.max(flareX - 25, 0)}%,
            rgba(255,240,200,${0.5 * intensity}) ${flareX - 10}%,
            rgba(255,255,255,${0.9 * intensity}) ${flareX}%,
            rgba(255,240,200,${0.5 * intensity}) ${flareX + 10}%,
            transparent ${Math.min(flareX + 25, 100)}%)`,
          filter: "blur(3px)",
        }}
      />

      {/* Secondary flare ring */}
      <div
        style={{
          position: "absolute",
          left: `${flareX + 6}%`,
          top: "42%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `2px solid rgba(255,230,180,${0.3 * intensity})`,
          background: `radial-gradient(circle,
            rgba(255,220,170,${0.15 * intensity}) 0%,
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

  // Lens flare wipe: clip the scenes at the flare boundary
  const wipePos = interpolate(
    presentationProgress,
    [0.05, 0.95],
    [0, 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  // Exiting scene: visible on the RIGHT side of the wipe (shrinks to nothing)
  // Entering scene: visible on the LEFT side of the wipe (grows to full)
  const clipPath = isExiting
    ? `inset(0 0 0 ${wipePos}%)`
    : `inset(0 ${100 - wipePos}% 0 0)`;

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
