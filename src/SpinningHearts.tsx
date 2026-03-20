import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const HEART_COLORS = [
  "#ec4899",
  "#f43f5e",
  "#f472b6",
  "#fb7185",
  "#e879f9",
  "#c084fc",
];

const hash = (seed: number, mod: number) =>
  ((seed * 7919 + 104729) % mod + mod) % mod;

/** Orbiting hearts that spin around a center point */
const OrbitingHearts: React.FC<{
  enterFrame: number;
  bassIntensity: number;
}> = ({ enterFrame, bassIntensity }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;
  if (localFrame < 0) return null;

  const heartCount = 6;
  const orbitRadius = 160 + bassIntensity * 40;

  // Entrance scale
  const entrance = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Orbit rotation speed (くるくる)
  const orbitAngle = interpolate(localFrame, [0, 60], [0, 360], {
    extrapolateRight: "extend",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 0,
        height: 0,
        transform: `scale(${entrance})`,
      }}
    >
      {Array.from({ length: heartCount }, (_, i) => {
        const angle = (i / heartCount) * 360 + orbitAngle;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * orbitRadius;
        const y = Math.sin(rad) * orbitRadius * 0.6; // Elliptical orbit
        const color = HEART_COLORS[i % HEART_COLORS.length];
        const selfSpin = interpolate(localFrame, [0, 90], [0, 720], {
          extrapolateRight: "extend",
        });
        const pulseScale = 1 + bassIntensity * 0.3;
        const size = 36 + bassIntensity * 12;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) rotate(${selfSpin + i * 60}deg) scale(${pulseScale})`,
            }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24">
              <path
                d={HEART_PATH}
                fill={color}
                filter={`drop-shadow(0 0 8px ${color})`}
              />
            </svg>
          </div>
        );
      })}

      {/* Center large heart */}
      <div
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) scale(${1 + bassIntensity * 0.2})`,
        }}
      >
        <svg width={64} height={64} viewBox="0 0 24 24">
          <path
            d={HEART_PATH}
            fill="#ec4899"
            filter="drop-shadow(0 0 16px #ec4899) drop-shadow(0 0 32px rgba(236,72,153,0.5))"
          />
        </svg>
      </div>
    </div>
  );
};

/** Heart-shaped particles that burst outward */
const HeartParticles: React.FC<{
  enterFrame: number;
  bassIntensity: number;
}> = ({ enterFrame, bassIntensity }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;
  if (localFrame < 0) return null;

  const count = 20;

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
        const angle = hash(i * 13 + 1, 360);
        const speed = hash(i * 17 + 2, 80) + 40;
        const size = hash(i * 19 + 3, 12) + 8;
        const delay = hash(i * 23 + 4, 40);
        const period = hash(i * 29 + 5, 60) + 60;
        const color = HEART_COLORS[hash(i * 31, HEART_COLORS.length)];

        const particleLocal = (localFrame - delay + period * 10) % period;
        const rad = (angle * Math.PI) / 180;
        const dist = interpolate(particleLocal, [0, period], [0, speed], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(
          particleLocal,
          [0, 5, period * 0.6, period],
          [0, 0.8 + bassIntensity * 0.2, 0.4, 0],
          { extrapolateRight: "clamp" },
        );
        const x = 50 + Math.cos(rad) * dist * 0.8;
        const y = 50 + Math.sin(rad) * dist * 0.5;
        const rotation = interpolate(particleLocal, [0, period], [0, 180]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              opacity,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24">
              <path d={HEART_PATH} fill={color} />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export const SpinningHearts: React.FC<{
  enterFrame: number;
  bassIntensity: number;
}> = ({ enterFrame, bassIntensity }) => {
  return (
    <>
      <HeartParticles enterFrame={enterFrame} bassIntensity={bassIntensity} />
      <OrbitingHearts enterFrame={enterFrame} bassIntensity={bassIntensity} />
    </>
  );
};
