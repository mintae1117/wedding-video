import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {SCENES, sceneFrames, transitionFrames} from './plan';
import {Table} from './scenes/Table';
import {theme} from './theme';

/** plan.ts 의 SCENES 를 1.5초 페이드로 이어 붙인다 — 장면은 전부 Table(크림 카드 / 어두운 블러) */
export const Wedding: React.FC = () => (
  <AbsoluteFill style={{background: theme.cream}}>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneFrames(s)}>
            <Table tone={s.tone} items={s.items} size={s.size} extras={s.extras} fadeIn={s.fadeIn} />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        return [
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={fade()}
            timing={linearTiming({durationInFrames: transitionFrames})}
          />,
          seq,
        ];
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
