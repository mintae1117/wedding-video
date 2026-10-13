import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';

/** 천천히 흐르는 핑크 빛과 브라운 그늘 — 밝은 장면 공용 */
export const Lights: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 600], [0, 80]);
  return (
    <>
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
    </>
  );
};

/** 청첩장 카드처럼 안쪽으로 36px 들어온 가는 브라운 테두리 — 밝은 장면 공용 */
export const Hairline: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 36,
      border: `1px solid ${theme.brown}`,
      opacity: 0.28,
      pointerEvents: 'none',
    }}
  />
);

/** 크림 바탕 + 빛 + 카드 테두리 — 빈 카드. 엔딩과, 오프닝 페이드인의 출발점(반복 재생 이음새)으로 같은 모습을 쓴다 */
export const EmptyCard: React.FC = () => (
  <AbsoluteFill style={{background: theme.cream, overflow: 'hidden'}}>
    <Lights />
    <Hairline />
  </AbsoluteFill>
);

/** 화면 가장자리를 살짝 어둡게 — 어두운 사진 장면의 집중감 */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.35}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(30,20,15,${strength}) 100%)`,
    }}
  />
);
