import React from "react";
import { staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { LyricSection } from "./LyricSection";

const TRANSITION = 20;

export const MUSIC_VIDEO_DURATION =
  300 + 300 + 300 + 270 + 300 - 4 * TRANSITION;

export const MusicVideo: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("music/ピカピカ光る夢のステージで.wav")} />
      <TransitionSeries>
      {/* INTRO */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <LyricSection
          lines={[
            "ピカピカ光る　夢のステージで",
            "くるくる回る　ハートのノイズ",
            "ほら始まるよ　ミラクルモーション",
            "キミとわたしで　いま飛びこもう！",
          ]}
          sectionLabel="INTRO"
          bgColors={["#7c3aed", "#ec4899", "#f43f5e"]}
          particleColor="rgba(255,182,255,0.7)"
          glowColor="rgba(236,72,153,0.6)"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* VERSE 1 */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <LyricSection
          lines={[
            "しゅわしゅわソーダみたいな気分で",
            "パステル信号　空へはじけた",
            "ドキドキしちゃう　未来の合図",
            "リズムにのって　ぜんぶ変わるよ",
          ]}
          sectionLabel="VERSE 1"
          bgColors={["#0ea5e9", "#6366f1", "#a855f7"]}
          particleColor="rgba(186,230,253,0.7)"
          glowColor="rgba(99,102,241,0.6)"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* PRE-CHORUS */}
      <TransitionSeries.Sequence durationInFrames={300}>
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
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION })}
      />

      {/* CHORUS - Part 1 */}
      <TransitionSeries.Sequence durationInFrames={270}>
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

      {/* CHORUS - Part 2 */}
      <TransitionSeries.Sequence durationInFrames={300}>
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
