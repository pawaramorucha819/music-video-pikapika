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
import { SodaBubbles } from "./SodaBubbles";

const { fontFamily } = loadFont();

export const VerseScene: React.FC<{
  lines: string[];
  sectionLabel?: string;
  glowColor?: string;
  lineInterval?: number;
  fontSize?: number;
}> = ({
  lines,
  sectionLabel = "VERSE 1",
  glowColor = "rgba(100,180,255,0.5)",
  lineInterval = 60,
  fontSize = 56,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgAngle = interpolate(frame, [0, 600], [0, 120]);

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

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Light, transparent soda-like gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${180 + bgAngle}deg, #e0f4ff, #c7ecff, #ddd6fe, #e0f4ff)`,
        }}
      />

      {/* Soft light overlay for glass-like feel */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 60%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 70% 80%, rgba(200,230,255,0.3) 0%, transparent 50%)",
        }}
      />

      {/* Soda bubbles */}
      <SodaBubbles count={55} />

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
          color: "rgba(80,120,180,0.5)",
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
              color="rgba(30,60,120,0.9)"
              glowColor={glowColor}
            />
          );
        })}
      </div>

      {/* Soft vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(180,210,240,0.3) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
