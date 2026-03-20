import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { Particles } from "./Particles";
import { PenLights } from "./PenLights";

loadFont({
  family: "LightNovelPOPv2",
  url: staticFile("fonts/LightNovelPOPv2.otf"),
});

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgAngle = interpolate(frame, [0, 600], [0, 360]);

  // Scale bounce animation using spring
  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 150, mass: 1.2 },
  });

  const scale = interpolate(scaleSpring, [0, 1], [0, 1.1], {
    extrapolateRight: "clamp",
  });

  // Settle after the bounce
  const settleSpring = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 200, stiffness: 100 },
  });

  const settleScale = interpolate(settleSpring, [0, 1], [0, -0.1], {
    extrapolateRight: "clamp",
  });

  const finalScale = scale + settleScale;

  // Glow pulse after entrance
  const glowIntensity = interpolate(
    frame % 40,
    [0, 20, 40],
    [30, 50, 30],
  );

  // Fade in opacity
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark venue background */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #0a0014 0%, #1a0030 40%, #0d0d2b 100%)",
        }}
      />

      {/* Stage light beams */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "120%",
          height: "60%",
          transform: "translateX(-50%)",
          background: `conic-gradient(from ${bgAngle}deg at 50% 0%, transparent 0deg, rgba(236,72,153,0.08) 15deg, transparent 30deg, rgba(99,102,241,0.08) 75deg, transparent 90deg, rgba(6,182,212,0.08) 135deg, transparent 150deg, rgba(168,85,247,0.08) 195deg, transparent 210deg, rgba(236,72,153,0.06) 255deg, transparent 270deg, rgba(34,211,238,0.06) 315deg, transparent 330deg)`,
          pointerEvents: "none",
        }}
      />

      {/* Particles (floating in air) */}
      <Particles count={20} color="rgba(196,157,255,0.4)" />

      {/* Pen lights crowd */}
      <PenLights count={70} />

      {/* Radial glow behind title */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          width: 1200,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.1) 40%, transparent 70%)",
          transform: `translate(-50%, -50%) scale(${finalScale})`,
        }}
      />

      {/* Title text */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 200,
        }}
      >
        <div
          style={{
            fontFamily: "LightNovelPOPv2",
            fontSize: 140,
            color: "white",
            opacity,
            transform: `scale(${finalScale})`,
            textShadow: `0 0 ${glowIntensity}px rgba(236,72,153,0.9), 0 0 ${glowIntensity * 2}px rgba(168,85,247,0.6), 0 0 ${glowIntensity * 3}px rgba(99,102,241,0.3), 0 6px 20px rgba(0,0,0,0.5)`,
            textAlign: "center",
            lineHeight: 1.3,
            letterSpacing: 8,
          }}
        >
          ピカピカ光る
          <br />
          夢のステージで
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
