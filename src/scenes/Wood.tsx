import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {wood} from '../theme';

export type Tone = 'walnut' | 'oak';

/** 우드 테이블 배경 — 월넛(어둡게, 집중)·오크(밝게, 가볍게). 결은 장면 동안 아주 천천히 옆으로 흐른다 */
export const WoodBackdrop: React.FC<{tone?: Tone; children?: React.ReactNode}> = ({tone = 'walnut', children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {extrapolateRight: 'clamp'});
  const dx = -16 + 32 * p;
  const dark = tone === 'walnut';
  return (
    <AbsoluteFill style={{background: dark ? wood.walnutDeep : wood.oak, overflow: 'hidden'}}>
      <Img
        src={staticFile(`textures/${tone}.jpg`)}
        style={{position: 'absolute', left: -40, top: -24, width: 2000, height: 1128, transform: `translateX(${dx}px)`}}
      />
      {/* 위에서 비치는 따뜻한 조명 */}
      <AbsoluteFill
        style={{
          background: dark
            ? 'radial-gradient(ellipse 72% 62% at 50% 30%, rgba(255,214,160,0.22) 0%, rgba(255,214,160,0) 100%)'
            : 'radial-gradient(ellipse 72% 62% at 50% 30%, rgba(255,250,240,0.42) 0%, rgba(255,250,240,0) 100%)',
        }}
      />
      {/* 가장자리 비네트 */}
      <AbsoluteFill
        style={{
          background: dark
            ? 'radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, rgba(18,10,6,0.6) 100%)'
            : 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(90,64,48,0.2) 100%)',
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** 아이보리 매트(인화지) — 안쪽 크기는 호출 쪽에서 미디어 비율에 정확히 맞춰 준다(잘림 없음) */
export const Mat: React.FC<{
  left: number;
  top: number;
  innerW: number;
  innerH: number;
  pad?: number;
  rotate?: number;
  rise?: number;
  drift?: number;
  soft?: boolean;
  children?: React.ReactNode;
}> = ({left, top, innerW, innerH, pad = 14, rotate = 0, rise = 1, drift = 0, soft = false, children}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: innerW + pad * 2,
      height: innerH + pad * 2,
      padding: pad,
      boxSizing: 'border-box',
      background: wood.ivory,
      boxShadow: soft
        ? '0 22px 50px rgba(60,40,24,0.30), 0 2px 8px rgba(60,40,24,0.18)'
        : '0 28px 60px rgba(10,6,3,0.55), 0 3px 10px rgba(10,6,3,0.35)',
      opacity: rise,
      transform: `translateY(${(1 - rise) * 36 + drift}px) rotate(${rotate}deg)`,
    }}
  >
    {children}
  </div>
);
