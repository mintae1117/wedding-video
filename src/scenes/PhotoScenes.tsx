import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {PHOTOS} from '../plan';
import {fonts, theme} from '../theme';
import {Vignette} from './Backdrop';

const src = (key: string) => staticFile(`photos/${PHOTOS[key].file}`);
const pos = (key: string) => `${PHOTOS[key].focus[0] * 100}% ${PHOTOS[key].focus[1] * 100}%`;

/**
 * 전체화면 장면: 세로 사진을 잘라내지 않고 화면 높이에 꽉 채워 가운데 세우고,
 * 양옆은 같은 사진을 크게 확대해 흐리게 깐다. 켄 번스는 배경에만 걸고 사진은 느리게 떠다니기만 한다.
 * (16:9 로 크롭하면 세로의 37% 만 보여 얼굴 없이 몸만 나오는 순간이 생겼다 — 사용자 피드백)
 */
export const FullFit: React.FC<{photo: string; zoom?: [number, number]}> = ({photo, zoom = [1.15, 1.25]}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {easing: Easing.inOut(Easing.sin)});
  const bgScale = zoom[0] + (zoom[1] - zoom[0]) * p;
  const drift = interpolate(p, [0, 1], [8, -8]);
  const rise = spring({frame, fps, config: {damping: 200, stiffness: 80}});
  const w = Math.round(1080 * (2 / 3)); // 2:3 사진을 높이 1080 에 맞추면 720
  return (
    <AbsoluteFill style={{background: theme.brownDark, overflow: 'hidden'}}>
      <Img
        src={src(photo)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: pos(photo),
          filter: 'blur(42px) brightness(0.72) saturate(1.15)',
          transform: `scale(${bgScale})`,
          transformOrigin: pos(photo),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: (1920 - w) / 2,
          top: 0,
          width: w,
          height: 1080,
          boxShadow: '0 0 120px rgba(0,0,0,0.55)',
          opacity: rise,
          transform: `translateY(${drift + (1 - rise) * 20}px)`,
        }}
      >
        <Img src={src(photo)} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
      </div>
      <Vignette strength={0.22} />
    </AbsoluteFill>
  );
};

/** 사진 장면 하단의 작은 서명 — 빈 여백에 완성도를 준다 */
const Signature: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 30,
      textAlign: 'center',
      fontFamily: fonts.sans,
      fontWeight: 300,
      fontSize: 16,
      letterSpacing: '0.45em',
      color: theme.brown,
      opacity: 0.55,
    }}
  >
    MINTAE &amp; NAEUN · 2026. 10. 25
  </div>
);

/** 액자 반대편 빈 영역의 중앙에 문구를 놓는다 (align = 문구가 놓이는 쪽) */
const Caption: React.FC<{caption?: string; sub?: string; align: 'left' | 'right'; delay: number; region: [number, number]}> = ({
  caption,
  sub,
  align,
  delay,
  region,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!caption && !sub) return null;
  const t = spring({frame: frame - delay, fps, config: {damping: 200, stiffness: 60}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: region[0],
        width: region[1] - region[0],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
      }}
    >
      {sub ? (
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 300,
            fontSize: 22,
            letterSpacing: '0.5em',
            color: theme.brown,
            marginBottom: 22,
          }}
        >
          {sub.toUpperCase()}
        </div>
      ) : null}
      {caption ? (
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 400,
            fontSize: 50,
            lineHeight: 1.65,
            color: theme.brownDark,
            whiteSpace: 'pre-line',
            letterSpacing: '0.04em',
          }}
        >
          {caption}
        </div>
      ) : null}
      <div style={{width: 48, height: 2, background: theme.pink, marginTop: 32}} />
    </div>
  );
};

/** 세로 원본을 액자처럼 세우고, 같은 사진을 흐리게 깔아 크림·핑크 톤으로 덮는다 */
export const Gallery: React.FC<{photo: string; caption?: string; sub?: string; side?: 'left' | 'right'}> = ({
  photo,
  caption,
  sub,
  side = 'right',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const p = frame / durationInFrames;
  const bgScale = 1.18 + 0.08 * p;
  const rise = spring({frame, fps, config: {damping: 200, stiffness: 70}});
  // 안쪽(패딩 14 제외)이 정확히 2:3 이 되도록 — 사진이 조금도 잘리지 않는다
  const frameW = 640;
  const frameH = (frameW - 28) * 1.5 + 28; // 946
  const hasText = Boolean(caption || sub);
  // 문구가 있으면 액자를 한쪽(문구 반대편)에, 없으면 가운데
  const left = !hasText ? (1920 - frameW) / 2 : side === 'right' ? 280 : 1920 - 280 - frameW;
  const region: [number, number] = side === 'right' ? [left + frameW, 1920] : [0, left];
  return (
    <AbsoluteFill style={{background: theme.cream, overflow: 'hidden'}}>
      <Img
        src={src(photo)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: pos(photo),
          filter: 'blur(44px) saturate(0.8) brightness(1.05)',
          transform: `scale(${bgScale})`,
          opacity: 0.8,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${theme.cream}b3 0%, ${theme.pinkSoft}73 55%, ${theme.cream}a6 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left,
          top: (1080 - frameH) / 2,
          width: frameW,
          height: frameH,
          background: theme.white,
          padding: 14,
          boxSizing: 'border-box',
          boxShadow: '0 40px 90px rgba(63,49,40,0.28)',
          opacity: rise,
          transform: `translateY(${(1 - rise) * 36}px)`,
        }}
      >
        <Img src={src(photo)} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
      </div>
      <Caption caption={caption} sub={sub} align={side} delay={12} region={region} />
      <Signature />
    </AbsoluteFill>
  );
};

/** 같은 세트의 두 장을 나란히 — 두 번째 장은 반 박자 늦게 올라온다 */
export const Duo: React.FC<{photos: [string, string]; caption?: string}> = ({photos, caption}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const p = frame / durationInFrames;
  const w = 580;
  const h = (w - 24) * 1.5 + 24; // 안쪽 2:3 정확히 → 858
  const gap = 56;
  const left0 = (1920 - (w * 2 + gap)) / 2;
  const topBase = caption ? 70 : (1080 - h) / 2;
  return (
    <AbsoluteFill style={{background: theme.cream, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${theme.pinkSoft} 0%, ${theme.cream} 60%, ${theme.creamDeep} 100%)`,
        }}
      />
      {photos.map((key, i) => {
        const rise = spring({frame: frame - i * 9, fps, config: {damping: 200, stiffness: 70}});
        const drift = (i === 0 ? -1 : 1) * 10 * p;
        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: left0 + i * (w + gap),
              top: topBase,
              width: w,
              height: h,
              background: theme.white,
              padding: 12,
              boxSizing: 'border-box',
              boxShadow: '0 34px 80px rgba(63,49,40,0.24)',
              opacity: rise,
              transform: `translateY(${(1 - rise) * 40 + drift}px)`,
            }}
          >
            <Img src={src(key)} style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} />
          </div>
        );
      })}
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: topBase + h + 34,
            textAlign: 'center',
            fontFamily: fonts.serif,
            fontWeight: 400,
            fontSize: 34,
            letterSpacing: '0.08em',
            color: theme.brownDark,
            whiteSpace: 'pre-line',
            opacity: spring({frame: frame - 20, fps, config: {damping: 200}}),
          }}
        >
          {caption.replace('\n', ' ')}
        </div>
      ) : null}
      <Signature />
    </AbsoluteFill>
  );
};
