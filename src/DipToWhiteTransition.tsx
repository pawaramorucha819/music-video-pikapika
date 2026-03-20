import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const DipToWhiteComponent: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  if (presentationDirection === "exiting") {
    // First half: scene gradually fades to white
    const whiteOpacity = interpolate(presentationProgress, [0, 0.5], [0, 1], {
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    });
    return (
      <AbsoluteFill>
        {children}
        <AbsoluteFill
          style={{ backgroundColor: "white", opacity: whiteOpacity }}
        />
      </AbsoluteFill>
    );
  }

  // Entering: invisible during first half (let exiting show through),
  // then appear with white overlay fading out in second half
  const visible = presentationProgress >= 0.5;
  const whiteOpacity = interpolate(presentationProgress, [0.5, 1], [1, 0], {
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ opacity: visible ? 1 : 0 }}>
      {children}
      <AbsoluteFill
        style={{ backgroundColor: "white", opacity: whiteOpacity }}
      />
    </AbsoluteFill>
  );
};

export const dipToWhite = (): TransitionPresentation<
  Record<string, never>
> => ({
  component: DipToWhiteComponent,
  props: {} as Record<string, never>,
});
