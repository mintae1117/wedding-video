import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';

/** 크림 바탕 + 천천히 흐르는 핑크 빛 — 오프닝·엔딩 공용 배경 */
export const Backdrop: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 600], [0, 80]);
  return (
    <AbsoluteFill style={{background: theme.cream, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          borderRadius: '50%',
          left: -300 + drift,
          top: -500,
          background: `radial-gradient(circle, ${theme.pink}66 0%, ${theme.pink}00 65%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          right: -500 - drift * 0.6,
          bottom: -700,
          background: `radial-gradient(circle, ${theme.brown}33 0%, ${theme.brown}00 65%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** 화면 가장자리를 살짝 어둡게 — 사진 장면의 집중감 */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.35}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(30,20,15,${strength}) 100%)`,
    }}
  />
);
