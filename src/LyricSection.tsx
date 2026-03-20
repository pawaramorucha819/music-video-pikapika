import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import { LyricLine } from "./LyricLine";
import { Particles } from "./Particles";

const { fontFamily } = loadFont();

export const LyricSection: React.FC<{
  lines: string[];
  sectionLabel: string;
  bgColors: [string, string, string];
  particleColor?: string;
  glowColor?: string;
  lineInterval?: number;
  fontSize?: number;
}> = ({
  lines,
  sectionLabel,
  bgColors,
  particleColor = "rgba(255,255,255,0.6)",
  glowColor = "rgba(255,255,255,0.5)",
  lineInterval = 55,
  fontSize = 56,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgAngle = interpolate(frame, [0, 600], [0, 360]);

  const labelProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const labelOpacity = interpolate(
    frame,
    [0, 10, 40, 60],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const pulseScale = interpolate(frame % 60, [0, 30, 60], [1, 1.06, 1]);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${bgAngle}deg, ${bgColors[0]}, ${bgColors[1]}, ${bgColors[2]})`,
        }}
      />

      {/* Dark overlay for readability */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.12)" }} />

      {/* Pulsing accent circle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${bgColors[1]}30 0%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
        }}
      />

      {/* Particles */}
      <Particles count={30} color={particleColor} />

      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 50,
          width: "100%",
          textAlign: "center",
          opacity: labelOpacity * labelProgress,
          fontSize: 24,
          fontWeight: 300,
          color: "rgba(255,255,255,0.6)",
          letterSpacing: 10,
        }}
      >
        {sectionLabel}
      </div>

      {/* Lyrics — one line at a time, bottom of screen */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {lines.map((line, i) => {
          const delay = 40 + i * lineInterval;
          const endDelay =
            i < lines.length - 1
              ? 40 + (i + 1) * lineInterval
              : undefined;
          return (
            <LyricLine
              key={i}
              text={line}
              delay={delay}
              endDelay={endDelay}
              fontSize={fontSize}
              glowColor={glowColor}
            />
          );
        })}
      </div>

      {/* Vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
