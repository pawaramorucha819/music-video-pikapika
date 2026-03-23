# Music Video

Remotion + React で構築されたミュージックビデオプロジェクトです。楽曲に合わせた歌詞表示やビジュアルエフェクトをプログラマブルに制御し、1920x1080 / 30fps の映像を生成します。

## 構成

楽曲の構造に沿って、以下のシーンで構成されています。

| セクション | 時間 | シーン |
|-----------|------|--------|
| 前奏 | 0:00 - 0:06 | TitleCard + ShootingStars |
| Intro | 0:07 - 0:18 | IntroScene |
| Verse | 0:18 - 0:29 | VerseScene |
| Pre-Chorus | 0:29 - 0:42 | PreChorusScene |
| Chorus 1 | 0:42 - 0:53 | Chorus1Scene |
| Chorus 2 | 0:53 - 1:08 | Chorus2Scene |

映像終了後は黒画面でフェードアウトしながら、音楽をフル尺（約2分55秒）まで再生します。

## ビジュアルエフェクト

- **ShootingStars** - 流れ星アニメーション
- **Particles** - 星型パーティクル
- **PenLights** - ペンライト演出
- **SpinningHearts** - 回転するハート
- **FlowingNotes** - 流れる音符
- **SodaBubbles** - ソーダの泡
- **PastelBurst** - パステルカラーのバースト
- **AudioWaveform** - 音声波形の可視化

## トランジション

- **ZoomTransition** - ズームイン/アウト
- **NoteTransition** - 音符モチーフの切り替え
- **DipToWhiteTransition** - ホワイトアウト

## 技術スタック

- [Remotion](https://remotion.dev/) v4
- React 19
- TypeScript
- Tailwind CSS v4
- フォント: LightNovelPOP v2

## コマンド

```bash
# 依存関係のインストール
npm install

# プレビュー（Remotion Studio）
npm run dev

# 動画のレンダリング
npx remotion render

# Remotion のアップグレード
npm run upgrade
```

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
