import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const DipToWhiteComponent: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const whiteOpacity =
    presentationDirection === "exiting"
      ? interpolate(presentationProgress, [0, 1], [0, 1], {
          easing: Easing.in(Easing.quad),
        })
      : interpolate(presentationProgress, [0, 1], [1, 0], {
          easing: Easing.out(Easing.quad),
        });

  return (
    <AbsoluteFill>
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
