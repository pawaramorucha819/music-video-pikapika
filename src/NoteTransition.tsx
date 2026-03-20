import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";

const NOTES = ["♪", "♫", "♬", "♩", "♭", "♪", "♫", "♬"];

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

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

const NoteFlood: React.FC<{
  progress: number;
}> = ({ progress }) => {
  const count = 40;

  return (
    <AbsoluteFill
      style={{ overflow: "hidden", pointerEvents: "none" }}
    >
      {Array.from({ length: count }, (_, i) => {
        const y = hash(i * 7 + 1, 90) + 5;
        const size = hash(i * 11 + 2, 30) + 28;
        const speed = hash(i * 13 + 3, 30) + 70;
        const startOffset = hash(i * 17 + 4, 40);
        const rotation = hash(i * 19 + 5, 40) - 20;
        const note = NOTES[hash(i * 23 + 6, NOTES.length)];
        const color = NOTE_COLORS[hash(i * 29 + 7, NOTE_COLORS.length)];

        // Each note travels from right (120%) to left (-20%)
        const noteProgress = interpolate(
          progress * 100,
          [startOffset, startOffset + speed],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        const x = interpolate(noteProgress, [0, 1], [120, -20]);

        const opacity = interpolate(
          noteProgress,
          [0, 0.1, 0.8, 1],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp" },
        );

        const bounce = Math.sin(noteProgress * Math.PI * 3) * 15;

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
              textShadow: `0 0 10px ${color}80`,
              fontWeight: "bold",
            }}
          >
            {note}
          </div>
        );
      })}

      {/* White flash at midpoint */}
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: interpolate(
            progress,
            [0.35, 0.5, 0.65],
            [0, 0.5, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
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

  const opacity = isExiting
    ? interpolate(presentationProgress, [0.3, 0.5], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(presentationProgress, [0.5, 0.7], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
      {/* Notes flow only on the exiting scene */}
      {isExiting && <NoteFlood progress={presentationProgress} />}
    </AbsoluteFill>
  );
};

export const noteTransition =
  (): TransitionPresentation<Record<string, never>> => ({
    component: NoteTransitionComponent,
    props: {},
  });
