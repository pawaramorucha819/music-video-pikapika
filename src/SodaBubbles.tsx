import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

export const SodaBubbles: React.FC<{ count?: number }> = ({ count = 50 }) => {
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
        const size = hash(i * 11 + 3, 16) + 6;
        const speed = hash(i * 13 + 4, 40) + 60; // frames to travel full height
        const phase = hash(i * 17 + 5, 200);
        const wobbleAmt = hash(i * 19 + 6, 15) + 5;
        const wobbleSpeed = hash(i * 23 + 7, 20) + 20;

        // Continuous looping rise
        const t = (frame + phase) % speed;
        const y = interpolate(t, [0, speed], [110, -10]); // bottom to top

        // Horizontal wobble
        const wobble = interpolate(
          (frame + phase) % wobbleSpeed,
          [0, wobbleSpeed / 2, wobbleSpeed],
          [-wobbleAmt, wobbleAmt, -wobbleAmt],
        );

        // Fade in at bottom, fade out at top (inputRange must be ascending)
        const opacity = interpolate(y, [-5, 20, 80, 100], [0, 0.5, 0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(${x}% + ${wobble}px)`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), rgba(200,230,255,0.15))`,
              border: "1px solid rgba(255,255,255,0.3)",
              opacity,
              boxShadow: `inset 0 -2px 4px rgba(255,255,255,0.15), 0 0 ${size}px rgba(150,220,255,0.15)`,
            }}
          />
        );
      })}
    </div>
  );
};
