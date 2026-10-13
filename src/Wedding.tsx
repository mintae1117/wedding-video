import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {SCENES, sceneFrames, transitionFrames} from './plan';
import {Table} from './scenes/Table';
import {wood} from './theme';

/** plan.ts 의 SCENES 를 1초 페이드로 이어 붙인다 — 장면은 전부 우드 테이블(Table) */
export const Wedding: React.FC = () => (
  <AbsoluteFill style={{background: wood.walnutDeep}}>
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneFrames(s)}>
            <Table tone={s.tone} items={s.items} size={s.size} extras={s.extras} fadeOut={s.fadeOut} />
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
