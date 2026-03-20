import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

export const Particles: React.FC<{
  count?: number;
  color?: string;
}> = ({ count = 30, color = "rgba(255,255,255,0.8)" }) => {
  const frame = useCurrentFrame();

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
        const x = hash(i * 3 + 1, 1000) / 10;
        const y = hash(i * 7 + 2, 1000) / 10;
        const size = hash(i * 11 + 3, 6) + 3;
        const period = hash(i * 13 + 4, 40) + 30;
        const phase = hash(i * 17 + 5, 60);
        const drift = hash(i * 19 + 6, 40) - 20;

        const t = (frame + phase) % period;
        const opacity = interpolate(t, [0, period / 2, period], [0, 0.8, 0]);
        const yOffset = interpolate(frame, [0, 300], [0, drift], {
          extrapolateRight: "extend",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `calc(${y}% + ${yOffset}px)`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
