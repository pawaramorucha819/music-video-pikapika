import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const COLORS = [
  "#ff6b9d",
  "#00e5ff",
  "#76ff03",
  "#ffea00",
  "#e040fb",
  "#ff3d00",
  "#448aff",
  "#69f0ae",
];

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

export const PenLights: React.FC<{ count?: number }> = ({ count = 60 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "45%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const x = hash(i * 3 + 1, 1000) / 10;
        const baseY = hash(i * 7 + 2, 400) / 10 + 20;
        const swingSpeed = hash(i * 11 + 3, 20) + 25;
        const swingAmount = hash(i * 13 + 4, 15) + 10;
        const phase = hash(i * 17 + 5, 100);
        const color = COLORS[hash(i * 19 + 6, COLORS.length)];
        const stickLength = hash(i * 23 + 7, 40) + 60;
        const brightness = hash(i * 29 + 8, 40) + 60;

        const swingAngle = interpolate(
          (frame + phase) % swingSpeed,
          [0, swingSpeed / 2, swingSpeed],
          [-swingAmount, swingAmount, -swingAmount],
        );

        const glowPulse = interpolate(
          (frame + phase * 2) % 30,
          [0, 15, 30],
          [0.6, 1, 0.6],
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              bottom: `${baseY}%`,
              transformOrigin: "bottom center",
              transform: `rotate(${swingAngle}deg)`,
            }}
          >
            {/* Stick */}
            <div
              style={{
                width: 3,
                height: stickLength,
                background: `linear-gradient(to top, rgba(200,200,200,0.2), rgba(200,200,200,0.05))`,
                margin: "0 auto",
              }}
            />
            {/* Light tip */}
            <div
              style={{
                width: 8,
                height: 20,
                borderRadius: "4px 4px 2px 2px",
                backgroundColor: color,
                opacity: (brightness / 100) * glowPulse,
                boxShadow: `0 0 12px ${color}, 0 0 24px ${color}80, 0 -4px 16px ${color}60`,
                margin: "-2px auto 0",
                transform: "translateY(-100%)",
                position: "relative",
                top: -stickLength + 2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
