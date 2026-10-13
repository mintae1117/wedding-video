import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLIPS, DAILY, PHOTOS, type Extra, type Item, type Tone} from '../plan';
import {theme} from '../theme';
import {EmptyCard, Hairline, Lights, Vignette} from './Backdrop';

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

/** 매트 바깥 높이(패딩 포함) 상한 — l 930 · m 860. 어두운 장면의 단독 사진은 매트 없이 화면 높이 1080 을 꽉 채운다 */
export const SIZE = {xl: 1020, l: 930, m: 860} as const;
const MARGIN = 90;

/** 사진이든 영상이든 같은 스타일로 그린다 */
const Media: React.FC<{r: Resolved; style: React.CSSProperties; fps: number}> = ({r, style, fps}) =>
  r.videoFrom !== undefined ? (
    <OffthreadVideo src={r.src} startFrom={Math.round(r.videoFrom * fps)} playbackRate={r.rate} muted style={style} />
  ) : (
    <Img src={r.src} style={style} />
  );

/**
 * 장면 하나 = 미디어 0~3개를 같은 높이로 나란히. 사진·영상·4컷 공용, 어떤 것도 잘라내지 않는다.
 * light: 크림 카드 — 첫 미디어의 밝은 블러 워시 + 크림·핑크 그라데이션 + 핑크 빛 + 헤어라인 테두리, 흰 매트.
 * dark : 첫 미디어의 어두운 블러 배경 — 단독이면 매트 없이 높이 1080(원래 FullFit), 여럿이면 흰 매트.
 * 켄 번스는 블러 배경에만 건다(사진은 잘리지 않게).
 */
export const Table: React.FC<{
  tone: Tone;
  items: Item[];
  size?: keyof typeof SIZE;
  gap?: number;
  extras?: Extra[];
  fadeIn?: number;
}> = ({tone, items, size = 'l', gap = 56, extras = [], fadeIn}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {extrapolateRight: 'clamp'});
  const rs = items.map(resolve);
  const light = tone === 'light';
  const matted = light || items.length > 1;
  const pad = matted ? 14 : 0;
  const availW = 1920 - MARGIN * 2 - gap * (items.length - 1) - pad * 2 * items.length;
  const availH = matted ? SIZE[size] - pad * 2 : 1080;
  const sumAspect = rs.reduce((a, r) => a + r.aspect, 0);
  const h = Math.round(sumAspect > 0 ? Math.min(availH, availW / sumAspect) : availH);
  const ws = rs.map((r) => Math.round(h * r.aspect));
  const totalW = ws.reduce((a, w) => a + w + pad * 2, 0) + gap * (items.length - 1);
  const top = (1080 - (h + pad * 2)) / 2;
  const veil = fadeIn
    ? interpolate(frame, [0, fadeIn * fps], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  if (rs.length === 0) return <EmptyCard />;

  const first = rs[0];
  const bgScale = light ? 1.18 + 0.08 * p : 1.0 + 0.1 * p;
  const bgStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: light ? 'blur(44px) saturate(0.8) brightness(1.05)' : 'blur(42px) brightness(0.72) saturate(1.15)',
    opacity: light ? 0.8 : 1,
    transform: `scale(${bgScale})`,
  };
  let x = (1920 - totalW) / 2;
  return (
    <AbsoluteFill style={{background: light ? theme.cream : theme.brownDark, overflow: 'hidden'}}>
      <Media r={first} style={bgStyle} fps={fps} />
      {light ? (
        <>
          <AbsoluteFill
            style={{
              background: `linear-gradient(135deg, ${theme.cream}b3 0%, ${theme.pinkSoft}73 55%, ${theme.cream}a6 100%)`,
            }}
          />
          <Lights />
          <Hairline />
        </>
      ) : null}
      {rs.map((r, i) => {
        const left = x;
        x += ws[i] + pad * 2 + gap;
        // 두 번째부터 9프레임씩 늦게 올라온다 — 한 장씩 내려놓는 느낌
        const rise = spring({frame: frame - i * 9, fps, config: {damping: 200, stiffness: 70}});
        const drift = (i % 2 === 0 ? -1 : 1) * 8 * p;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left,
              top,
              width: ws[i] + pad * 2,
              height: h + pad * 2,
              padding: pad,
              boxSizing: 'border-box',
              background: matted ? theme.white : 'transparent',
              boxShadow: matted ? '0 40px 90px rgba(63,49,40,0.28)' : '0 0 120px rgba(0,0,0,0.55)',
              opacity: rise,
              transform: `translateY(${(1 - rise) * 30 + drift}px) rotate(${r.rotate}deg)`,
            }}
          >
            <Media r={r} style={{width: '100%', height: '100%', objectFit: r.videoFrom !== undefined ? 'cover' : 'contain', display: 'block'}} fps={fps} />
            {matted ? (
              // 인화지 안쪽의 가는 선 — 매트 폭 한가운데
              <div style={{position: 'absolute', inset: 7, border: `1px solid ${theme.brownSoft}`, opacity: 0.22, pointerEvents: 'none'}} />
            ) : null}
          </div>
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
              filter: 'drop-shadow(0 6px 10px rgba(63,49,40,0.3))',
            }}
          />
        );
      })}
      {light ? null : <Vignette strength={0.22} />}
      {veil > 0 ? (
        <AbsoluteFill style={{opacity: veil}}>
          <EmptyCard />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
