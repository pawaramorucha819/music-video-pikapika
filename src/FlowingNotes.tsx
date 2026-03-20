import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

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

/**
 * Continuously flowing music notes from right to left.
 * `enterFrame` — when the notes start appearing.
 */
export const FlowingNotes: React.FC<{
  enterFrame: number;
  count?: number;
}> = ({ enterFrame, count = 50 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;
  if (localFrame < 0) return null;

  // Fade in the whole effect
  const globalOpacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: globalOpacity,
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const y = hash(i * 7 + 1, 85) + 5;
        const size = hash(i * 11 + 2, 28) + 24;
        const travelTime = hash(i * 13 + 3, 30) + 50;
        const spawnDelay = hash(i * 17 + 4, 80);
        const rotation = hash(i * 19 + 5, 30) - 15;
        const note = NOTES[hash(i * 23 + 6, NOTES.length)];
        const color = NOTE_COLORS[hash(i * 29 + 7, NOTE_COLORS.length)];
        const bounceAmp = hash(i * 31 + 8, 15) + 8;

        // Looping: each note repeats after its cycle
        const cycle = travelTime + spawnDelay;
        const t = ((localFrame - spawnDelay) % cycle + cycle) % cycle;

        // Only show if we've passed the initial spawn delay
        if (localFrame < spawnDelay) return null;

        const progress = interpolate(t, [0, travelTime], [0, 1], {
          extrapolateRight: "clamp",
        });

        const x = interpolate(progress, [0, 1], [115, -15]);

        const opacity = interpolate(
          progress,
          [0, 0.05, 0.85, 1],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp" },
        );

        const bounce = Math.sin(progress * Math.PI * 2.5) * bounceAmp;

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
    </div>
  );
};
