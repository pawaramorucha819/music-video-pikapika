import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation } from "@remotion/transitions";

const ZoomComponent: React.FC<{
  children: React.ReactNode;
  presentationDirection: "entering" | "exiting";
  presentationProgress: number;
}> = ({ children, presentationDirection, presentationProgress }) => {
  const isExiting = presentationDirection === "exiting";

  const scale = isExiting
    ? interpolate(presentationProgress, [0, 1], [1, 3])
    : interpolate(presentationProgress, [0, 1], [0.3, 1]);

  const opacity = isExiting
    ? interpolate(presentationProgress, [0, 0.6], [1, 0], {
        extrapolateRight: "clamp",
      })
    : interpolate(presentationProgress, [0.4, 1], [0, 1], {
        extrapolateLeft: "clamp",
      });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const zoom = (): TransitionPresentation<Record<string, never>> => {
  return {
    component: ZoomComponent,
    props: {},
  };
};
