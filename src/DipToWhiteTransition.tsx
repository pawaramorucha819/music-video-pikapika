import React from "react";
import { AbsoluteFill } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const DipToWhiteComponent: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const whiteOpacity =
    presentationDirection === "exiting"
      ? presentationProgress
      : 1 - presentationProgress;

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
