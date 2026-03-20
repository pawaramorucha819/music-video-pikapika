import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  useWindowedAudioData,
  visualizeAudio,
  visualizeAudioWaveform,
  createSmoothSvgPath,
} from "@remotion/media-utils";

const AUDIO_SRC = staticFile("music/ピカピカ光る夢のステージで.wav");

/**
 * Audio waveform + frequency bars visualization.
 * `audioOffsetInSeconds` shifts the audio read position to match the
 * global song time (e.g., if this component is inside a Sequence that
 * starts at 6 s, pass 6).
 */
export const AudioWaveform: React.FC<{
  audioOffsetInSeconds?: number;
  enterFrame: number;
  color?: string;
  barColor?: string;
}> = ({
  audioOffsetInSeconds = 0,
  enterFrame,
  color = "rgba(236,72,153,0.6)",
  barColor = "rgba(168,85,247,0.5)",
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const localFrame = frame - enterFrame;

  // Read a 30-second window of audio around the current position
  const globalFrame = frame + audioOffsetInSeconds * fps;

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: AUDIO_SRC,
    frame: globalFrame,
    fps,
    windowInSeconds: 30,
  });

  if (!audioData || localFrame < 0) return null;

  // --- Frequency bars (for bass intensity export) ---
  const frequencies = visualizeAudio({
    fps,
    frame: globalFrame,
    audioData,
    numberOfSamples: 128,
    optimizeFor: "speed",
    dataOffsetInSeconds,
  });

  // --- Waveform SVG ---
  const waveHeight = 120;
  const waveform = visualizeAudioWaveform({
    fps,
    frame: globalFrame,
    audioData,
    numberOfSamples: 128,
    windowInSeconds: 0.3,
    dataOffsetInSeconds,
  });

  const path = createSmoothSvgPath({
    points: waveform.map((y, i) => ({
      x: (i / (waveform.length - 1)) * width,
      y: waveHeight / 2 + (y * waveHeight) / 2,
    })),
  });

  // Fade in
  const opacity =
    localFrame < 10
      ? localFrame / 10
      : 1;

  // Select a subset of frequencies for the bar display
  const barCount = 32;
  const barWidth = width / barCount - 2;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Frequency bars */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {frequencies.slice(0, barCount).map((v, i) => (
          <div
            key={i}
            style={{
              width: barWidth,
              height: `${Math.max(v * 100, 2)}%`,
              background: `linear-gradient(to top, ${barColor}, ${color})`,
              borderRadius: 2,
              boxShadow: `0 0 6px ${barColor}`,
            }}
          />
        ))}
      </div>

      {/* Waveform line */}
      <svg
        width={width}
        height={waveHeight}
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
        }}
      >
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          filter={`drop-shadow(0 0 4px ${color})`}
        />
      </svg>
    </div>
  );
};

/** Hook to get bass intensity for external use */
export const useAudioBass = (audioOffsetInSeconds: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalFrame = frame + audioOffsetInSeconds * fps;

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: AUDIO_SRC,
    frame: globalFrame,
    fps,
    windowInSeconds: 30,
  });

  if (!audioData) return 0;

  const frequencies = visualizeAudio({
    fps,
    frame: globalFrame,
    audioData,
    numberOfSamples: 128,
    optimizeFor: "speed",
    dataOffsetInSeconds,
  });

  const lowFreqs = frequencies.slice(0, 16);
  return lowFreqs.reduce((sum, v) => sum + v, 0) / lowFreqs.length;
};
