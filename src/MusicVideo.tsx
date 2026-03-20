import React from "react";
import { staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { LyricSection } from "./LyricSection";
import { PreChorusScene } from "./PreChorusScene";
import { TitleCard } from "./TitleCard";
import { ShootingStars } from "./ShootingStars";
import { IntroScene } from "./IntroScene";
import { VerseScene } from "./VerseScene";
import { zoom } from "./ZoomTransition";
import { noteTransition } from "./NoteTransition";
import { dipToWhite } from "./DipToWhiteTransition";
import { Chorus1Scene } from "./Chorus1Scene";

const FPS = 30;
const TRANSITION = 20;

// Timing from MUSIC-DETAIL.md (in seconds):
// 0-6s: 前奏, 7-18s: Intro, 18-29s: Verse1, 29-42s: PreChorus, 42-60s: Chorus
//
// TransitionSeries duration formula:
//   section_duration = (next_start - this_start) * FPS + TRANSITION
//   last_section_duration = (end - this_start) * FPS
const SHOOTING_STAR_OVERLAY = 30;
const PRELUDE = 6 * FPS; // 180 (0-6s) — overlay doesn't shorten timeline
const INTRO = 11 * FPS + TRANSITION; // 350 (7-18s)
const NOTE_TRANSITION = 35;
const VERSE = 11 * FPS + NOTE_TRANSITION; // 365 (18-29s)
const DIP_TO_WHITE = 70;
const PRECHORUS = 13 * FPS + DIP_TO_WHITE; // 460 (29-42s)
const CHORUS1 = Math.round(11.5 * FPS) + TRANSITION; // 365 (42-53.5s)
const CHORUS2 = Math.round(6.5 * FPS); // 195 (53.5-60s)

export const MUSIC_VIDEO_DURATION =
  PRELUDE + INTRO + VERSE + PRECHORUS + CHORUS1 + CHORUS2 -
  TRANSITION - NOTE_TRANSITION - DIP_TO_WHITE - TRANSITION;

export const MusicVideo: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("music/ピカピカ光る夢のステージで.wav")} />
      <TransitionSeries>
        {/* 前奏 0-6s */}
        <TransitionSeries.Sequence durationInFrames={PRELUDE}>
          <TitleCard />
        </TransitionSeries.Sequence>

        <TransitionSeries.Overlay durationInFrames={SHOOTING_STAR_OVERLAY}>
          <ShootingStars />
        </TransitionSeries.Overlay>

        {/* INTRO 6-18s: ライブ会場チルト → 歌詞 */}
        <TransitionSeries.Sequence durationInFrames={INTRO}>
          <IntroScene
            lines={[
              "ピカピカ光る　夢のステージで",
              "くるくる回る　ハートのノイズ",
              "ほら始まるよ　ミラクルモーション",
              "キミとわたしで　いま飛びこもう！",
            ]}
            glowColor="rgba(236,72,153,0.6)"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={zoom()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* VERSE 1 18-29s */}
        <TransitionSeries.Sequence durationInFrames={VERSE}>
          <VerseScene
            lines={[
              "しゅわしゅわソーダみたいな気分で",
              "パステル信号　空へはじけた",
              "ドキドキしちゃう　未来の合図",
              "リズムにのって　ぜんぶ変わるよ",
            ]}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={noteTransition()}
          timing={linearTiming({ durationInFrames: NOTE_TRANSITION })}
        />

        {/* PRE-CHORUS 29-42s */}
        <TransitionSeries.Sequence durationInFrames={PRECHORUS}>
          <PreChorusScene
            lines={[
              "まばたき禁止の　この瞬間",
              "カラフル世界が　踊りだす",
              "せーのでいこうよ　まだまだもっと",
              "最高潮まで　つれてって！",
            ]}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={dipToWhite()}
          timing={linearTiming({ durationInFrames: DIP_TO_WHITE })}
        />

        {/* CHORUS Part 1 42-53s */}
        <TransitionSeries.Sequence durationInFrames={CHORUS1}>
          <Chorus1Scene
            lines={[
              "電波にのって　ぴぴぴっと！",
              "ハートが跳ねる　らびゅらびゅ！",
              "きらめくメロディ　むげん大",
              "キミとなら全部　たのしいじゃん！",
            ]}
            lineDelays={[40, 120, 210, 300]}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* CHORUS Part 2 51-60s */}
        <TransitionSeries.Sequence durationInFrames={CHORUS2}>
          <LyricSection
            lines={[
              "ぱちぱち光る　まほうみたい",
              "世界を染める　ポップサイン",
              "歌って笑って　はしゃいじゃえ",
              "いっしょに今日は　最強だよ！",
            ]}
            sectionLabel="CHORUS"
            bgColors={["#8b5cf6", "#06b6d4", "#10b981"]}
            particleColor="rgba(255,255,255,0.8)"
            glowColor="rgba(139,92,246,0.7)"
            lineInterval={48}
            fontSize={60}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
