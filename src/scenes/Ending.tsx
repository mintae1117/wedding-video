import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from './Backdrop';
import {COUPLE, fonts, theme} from '../theme';

const fadeUp = (frame: number, start: number, len = 30) => {
  const t = interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return {opacity: t, transform: `translateY(${(1 - t) * 24}px)`};
};

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  // 마지막 1.5초는 크림색으로 잦아든다
  const out = interpolate(frame, [durationInFrames - 1.5 * fps, durationInFrames - 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Backdrop>
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'center', color: theme.brownDark, opacity: out}}
      >
        <div
          style={{
            ...fadeUp(frame, 0.5 * fps),
            fontFamily: fonts.serif,
            fontWeight: 400,
            fontSize: 44,
            lineHeight: 1.75,
            textAlign: 'center',
            letterSpacing: '0.04em',
          }}
        >
          서로의 손을 잡고 걸어갈 첫걸음에
          <br />
          함께해 주셔서 감사합니다
        </div>
        <div
          style={{
            ...fadeUp(frame, 1.6 * fps),
            width: 1,
            height: 54,
            background: `${theme.brown}99`,
            margin: '42px 0 36px',
          }}
        />
        <div
          style={{
            ...fadeUp(frame, 2.0 * fps),
            fontFamily: fonts.serif,
            fontWeight: 500,
            fontSize: 64,
            letterSpacing: '0.1em',
            display: 'flex',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <span>{COUPLE.groom}</span>
          <span style={{color: theme.pink, fontWeight: 300, fontSize: 40}}>&amp;</span>
          <span>{COUPLE.bride}</span>
        </div>
        <div
          style={{
            ...fadeUp(frame, 2.5 * fps),
            fontFamily: fonts.sans,
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: '0.22em',
            color: theme.brown,
            marginTop: 26,
          }}
        >
          {COUPLE.dateKo} · {COUPLE.venue}
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
