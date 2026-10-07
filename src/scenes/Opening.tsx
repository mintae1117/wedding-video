import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from './Backdrop';
import {COUPLE, fonts, theme} from '../theme';

const fadeUp = (frame: number, start: number, len = 28) => {
  const t = interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return {opacity: t, transform: `translateY(${(1 - t) * 26}px)`};
};

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = interpolate(frame, [2.1 * fps, 3.0 * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <Backdrop>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', color: theme.brownDark}}>
        <div
          style={{
            ...fadeUp(frame, 0.4 * fps),
            fontFamily: fonts.sans,
            fontWeight: 300,
            fontSize: 26,
            letterSpacing: '0.55em',
            marginLeft: '0.55em',
            color: theme.brown,
          }}
        >
          WEDDING INVITATION
        </div>
        <div
          style={{
            ...fadeUp(frame, 1.0 * fps, 34),
            fontFamily: fonts.serif,
            fontWeight: 500,
            fontSize: 118,
            letterSpacing: '0.06em',
            marginTop: 34,
            display: 'flex',
            alignItems: 'center',
            gap: 44,
          }}
        >
          <span>{COUPLE.groom}</span>
          <span style={{color: theme.pink, fontSize: 64, fontWeight: 300, transform: 'translateY(-6px)'}}>&amp;</span>
          <span>{COUPLE.bride}</span>
        </div>
        <div
          style={{
            width: 360 * line,
            height: 1,
            background: theme.brown,
            opacity: 0.7,
            marginTop: 44,
            marginBottom: 40,
          }}
        />
        <div
          style={{
            ...fadeUp(frame, 2.6 * fps),
            fontFamily: fonts.serif,
            fontWeight: 400,
            fontSize: 34,
            letterSpacing: '0.12em',
            color: theme.brownDark,
          }}
        >
          {COUPLE.dateLine}
        </div>
        <div
          style={{
            ...fadeUp(frame, 3.0 * fps),
            fontFamily: fonts.sans,
            fontWeight: 400,
            fontSize: 26,
            letterSpacing: '0.2em',
            color: theme.brown,
            marginTop: 18,
          }}
        >
          {COUPLE.venue}
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
