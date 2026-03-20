import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

const PASTEL_COLORS = [
  "#ffb3d9", // pink
  "#b3e0ff", // light blue
  "#c9b3ff", // lavender
  "#ffe0b3", // peach
  "#b3ffd9", // mint
  "#fff0b3", // lemon
  "#ffb3b3", // salmon
  "#d9b3ff", // purple
];

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

export const PastelBurst: React.FC<{
  enterFrame: number;
  count?: number;
}> = ({ enterFrame, count = 30 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;
  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const burstDelay = hash(i * 7, 30);
        const t = localFrame - burstDelay;
        if (t < 0) return null;

        const angle = hash(i * 13, 360);
        const maxDist = hash(i * 17, 300) + 200;
        const size = hash(i * 19, 30) + 15;
        const color = PASTEL_COLORS[hash(i * 23, PASTEL_COLORS.length)];
        const duration = hash(i * 29, 30) + 40;
        const isCircle = hash(i * 31, 3) !== 0;

        const progress = interpolate(t, [0, duration], [0, 1], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        });

        const rad = (angle * Math.PI) / 180;
        const dist = maxDist * progress;
        const x = 50 + (Math.cos(rad) * dist * 100) / 1920;
        const y = 50 + (Math.sin(rad) * dist * 100) / 1080;

        const opacity = interpolate(t, [0, 5, duration * 0.6, duration], [0, 0.8, 0.6, 0], {
          extrapolateRight: "clamp",
        });

        const scale = interpolate(t, [0, 10, duration], [0, 1.2, 0.6], {
          extrapolateRight: "clamp",
        });

        const rotation = interpolate(t, [0, duration], [0, hash(i * 37, 180)], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: isCircle ? size : size * 0.6,
              borderRadius: isCircle ? "50%" : "4px",
              backgroundColor: color,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
              boxShadow: `0 0 ${size}px ${color}80`,
            }}
          />
        );
      })}
    </div>
  );
};
