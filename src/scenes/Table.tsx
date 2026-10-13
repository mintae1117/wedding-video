import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLIPS, DAILY, PHOTOS, type Extra, type Item} from '../plan';
import {Mat, WoodBackdrop, type Tone} from './Wood';

type Resolved = {src: string; aspect: number; videoFrom?: number; rate: number; rotate: number};

const resolve = (it: Item): Resolved => {
  if (it.kind === 'photo') {
    return {src: staticFile(`photos/${PHOTOS[it.key]}`), aspect: 2 / 3, rate: 1, rotate: it.rotate ?? 0};
  }
  if (it.kind === 'daily') {
    const d = DAILY[it.key];
    return {src: staticFile(d.file), aspect: d.aspect, rate: 1, rotate: it.rotate ?? 0};
  }
  const c = CLIPS[it.key];
  return {src: staticFile(c.file), aspect: c.aspect, videoFrom: c.from ?? 0, rate: c.rate ?? 1, rotate: it.rotate ?? 0};
};

/** 매트 바깥 높이(패딩 포함) — xl 은 전체화면급, m 은 여러 장을 놓을 때 */
export const SIZE = {xl: 1020, l: 930, m: 860} as const;
const PAD = 14;
const MARGIN = 90;

/**
 * 우드 테이블 위에 미디어 0~3개를 같은 높이로 나란히 놓는다 — 사진·영상·4컷 공용.
 * 매트 안쪽은 각 미디어의 비율 그대로이므로 어떤 것도 잘리지 않는다. 높이는 가장 넓은 조합이 들어가도록 자동으로 줄어든다.
 */
export const Table: React.FC<{
  tone: Tone;
  items: Item[];
  size?: keyof typeof SIZE;
  gap?: number;
  extras?: Extra[];
  fadeOut?: number;
}> = ({tone, items, size = 'l', gap = 56, extras = [], fadeOut}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const rs = items.map(resolve);
  const availW = 1920 - MARGIN * 2 - gap * (items.length - 1) - PAD * 2 * items.length;
  const availH = SIZE[size] - PAD * 2;
  const sumAspect = rs.reduce((a, r) => a + r.aspect, 0);
  const h = Math.round(sumAspect > 0 ? Math.min(availH, availW / sumAspect) : availH);
  const ws = rs.map((r) => Math.round(h * r.aspect));
  const totalW = ws.reduce((a, w) => a + w + PAD * 2, 0) + gap * (items.length - 1);
  const top = (1080 - (h + PAD * 2)) / 2;
  const p = frame / Math.max(1, durationInFrames);
  const dark = fadeOut
    ? interpolate(frame, [durationInFrames - fadeOut * fps, durationInFrames - 1], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;
  let x = (1920 - totalW) / 2;
  return (
    <WoodBackdrop tone={tone}>
      {rs.map((r, i) => {
        const left = x;
        x += ws[i] + PAD * 2 + gap;
        // 두 번째부터 9프레임씩 늦게 올라온다 — 한 장씩 내려놓는 느낌
        const rise = spring({frame: frame - i * 9, fps, config: {damping: 200, stiffness: 70}});
        const drift = (i % 2 === 0 ? -1 : 1) * 8 * p;
        return (
          <Mat key={i} left={left} top={top} innerW={ws[i]} innerH={h} pad={PAD} rotate={r.rotate} rise={rise} drift={drift} soft={tone === 'oak'}>
            {r.videoFrom !== undefined ? (
              <OffthreadVideo
                src={r.src}
                startFrom={Math.round(r.videoFrom * fps)}
                playbackRate={r.rate}
                muted
                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
              />
            ) : (
              <Img src={r.src} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
            )}
          </Mat>
        );
      })}
      {extras.map((e, i) => {
        const t = spring({frame: frame - (e.delay ?? 24), fps, config: {damping: 14, stiffness: 120}});
        return (
          <Img
            key={`x${i}`}
            src={staticFile(e.file)}
            style={{
              position: 'absolute',
              left: e.left,
              top: e.top,
              width: e.width,
              opacity: Math.min(1, t * 1.4),
              transform: `rotate(${e.rotate ?? 0}deg) scale(${0.7 + 0.3 * t})`,
              filter: 'drop-shadow(0 6px 10px rgba(40,24,12,0.35))',
            }}
          />
        );
      })}
      {dark > 0 ? <AbsoluteFill style={{background: '#000', opacity: dark}} /> : null}
    </WoodBackdrop>
  );
};
