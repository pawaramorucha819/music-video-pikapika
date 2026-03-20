import React from "react";
import { staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { LyricSection } from "./LyricSection";
import { TitleCard } from "./TitleCard";
import { ShootingStars } from "./ShootingStars";
import { IntroScene } from "./IntroScene";
import { VerseScene } from "./VerseScene";
import { zoom } from "./ZoomTransition";
import { noteTransition } from "./NoteTransition";

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
const PRECHORUS = 13 * FPS + TRANSITION; // 410 (29-42s)
const CHORUS1 = 9 * FPS + TRANSITION; // 290 (42-51s)
const CHORUS2 = 9 * FPS; // 270 (51-60s)

export const MUSIC_VIDEO_DURATION =
  PRELUDE + INTRO + VERSE + PRECHORUS + CHORUS1 + CHORUS2 -
  TRANSITION - NOTE_TRANSITION - TRANSITION - TRANSITION;

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
          <LyricSection
            lines={[
              "まばたき禁止の　この瞬間",
              "カラフル世界が　踊りだす",
              "せーのでいこうよ　まだまだもっと",
              "最高潮まで　つれてって！",
            ]}
            sectionLabel="PRE-CHORUS"
            bgColors={["#f59e0b", "#ef4444", "#ec4899"]}
            particleColor="rgba(253,230,138,0.7)"
            glowColor="rgba(239,68,68,0.6)"
            lineInterval={70}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />

        {/* CHORUS Part 1 42-51s */}
        <TransitionSeries.Sequence durationInFrames={CHORUS1}>
          <LyricSection
            lines={[
              "電波にのって　ぴぴぴっと！",
              "ハートが跳ねる　らびゅらびゅ！",
              "きらめくメロディ　むげん大",
              "キミとなら全部　たのしいじゃん！",
            ]}
            sectionLabel="CHORUS"
            bgColors={["#f43f5e", "#d946ef", "#06b6d4"]}
            particleColor="rgba(255,255,255,0.8)"
            glowColor="rgba(217,70,239,0.7)"
            lineInterval={48}
            fontSize={60}
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
