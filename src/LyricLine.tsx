import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const LyricLine: React.FC<{
  text: string;
  delay: number;
  endDelay?: number;
  fontSize?: number;
  color?: string;
  glowColor?: string;
}> = ({
  text,
  delay,
  endDelay,
  fontSize = 56,
  color = "white",
  glowColor = "rgba(255,255,255,0.5)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < delay) return null;

  const enterProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out when next line appears
  const exitOpacity =
    endDelay !== undefined
      ? interpolate(frame, [endDelay - 8, endDelay], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = enterOpacity * exitOpacity;
  if (opacity <= 0) return null;

  const translateY = interpolate(enterProgress, [0, 1], [30, 0], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(enterProgress, [0, 1], [0.85, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontSize,
        fontWeight: 900,
        color,
        textShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 4px 8px rgba(0,0,0,0.3)`,
        textAlign: "center",
        letterSpacing: 2,
      }}
    >
      {text}
    </div>
  );
};
