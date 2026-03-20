import "./index.css";
import { Composition } from "remotion";
import { MusicVideo, MUSIC_VIDEO_DURATION } from "./MusicVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MusicVideo"
      component={MusicVideo}
      durationInFrames={MUSIC_VIDEO_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
