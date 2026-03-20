import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

export const ShootingStars: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const starCount = 15;

  // White flash at midpoint for scene change
  const flashOpacity = interpolate(
    frame,
    [
      durationInFrames * 0.35,
      durationInFrames * 0.5,
      durationInFrames * 0.65,
    ],
    [0, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: starCount }, (_, i) => {
        // Stagger star launches across the overlay duration
        const startFrame = hash(i * 7 + 1, Math.floor(durationInFrames * 0.5));
        const flyDuration = hash(i * 11 + 2, 8) + 10;
        const startX = hash(i * 13 + 3, 80) - 10;
        const startY = hash(i * 17 + 4, 60) - 10;
        const angle = hash(i * 19 + 5, 25) + 25; // 25-50 degrees
        const travelDist = hash(i * 23 + 6, 800) + 1200;
        const headSize = hash(i * 29 + 7, 4) + 3;
        const tailLen = hash(i * 31 + 8, 120) + 100;

        const localFrame = frame - startFrame;
        if (localFrame < 0 || localFrame > flyDuration) return null;

        const progress = interpolate(localFrame, [0, flyDuration], [0, 1], {
          easing: Easing.in(Easing.quad),
          extrapolateRight: "clamp",
        });

        const opacity = interpolate(
          localFrame,
          [0, 2, flyDuration - 2, flyDuration],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
        );

        const radians = (angle * Math.PI) / 180;
        const moveX = Math.cos(radians) * travelDist * progress;
        const moveY = Math.sin(radians) * travelDist * progress;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${startX}%`,
              top: `${startY}%`,
              opacity,
              transform: `translate(${moveX}px, ${moveY}px) rotate(${angle}deg)`,
            }}
          >
            {/* Star head */}
            <div
              style={{
                width: headSize * 2,
                height: headSize * 2,
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: `0 0 ${headSize * 6}px white, 0 0 ${headSize * 12}px rgba(180,200,255,0.8), 0 0 ${headSize * 20}px rgba(140,160,255,0.4)`,
              }}
            />
            {/* Tail */}
            <div
              style={{
                position: "absolute",
                top: headSize - 1,
                right: headSize * 2 - 2,
                width: tailLen,
                height: 2,
                background:
                  "linear-gradient(to left, rgba(255,255,255,0.9), rgba(180,200,255,0.4), transparent)",
                borderRadius: 1,
                boxShadow: "0 0 6px rgba(180,200,255,0.5)",
              }}
            />
          </div>
        );
      })}

      {/* Flash overlay for scene change */}
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: flashOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
