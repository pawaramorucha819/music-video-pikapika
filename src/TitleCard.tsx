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
      {/* Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${bgAngle}deg, #1e1b4b, #4c1d95, #7c3aed)`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.15)" }} />

      {/* Particles */}
      <Particles count={35} color="rgba(196,157,255,0.6)" />

      {/* Radial glow behind title */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 65%)",
          transform: `translate(-50%, -50%) scale(${finalScale})`,
        }}
      />

      {/* Title text */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "LightNovelPOPv2",
            fontSize: 90,
            color: "white",
            opacity,
            transform: `scale(${finalScale})`,
            textShadow: `0 0 ${glowIntensity}px rgba(236,72,153,0.8), 0 0 ${glowIntensity * 2}px rgba(168,85,247,0.5), 0 4px 12px rgba(0,0,0,0.4)`,
            textAlign: "center",
            lineHeight: 1.4,
            letterSpacing: 6,
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
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
