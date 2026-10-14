import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {LOOP_OFFSET, SERIES, sceneFrames, transitionFrames} from './plan';
import {Table} from './scenes/Table';
import {theme} from './theme';

/** plan.ts 의 SERIES(SCENES + 첫 장면 꼬리)를 1.5초 페이드로 이어 붙이고, 앞 LOOP_OFFSET 프레임을 잘라 반복 재생이 이어지게 한다 */
export const Wedding: React.FC = () => (
  <AbsoluteFill style={{background: theme.cream}}>
    <Sequence from={-LOOP_OFFSET}>
      <TransitionSeries>
        {SERIES.flatMap((s, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneFrames(s)}>
              <Table tone={s.tone} items={s.items} size={s.size} extras={s.extras} motionSeconds={s.motionSeconds} />
            </TransitionSeries.Sequence>
          );
          if (i === 0) return [seq];
          return [
            <TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({durationInFrames: transitionFrames})} />,
            seq,
          ];
        })}
      </TransitionSeries>
    </Sequence>
  </AbsoluteFill>
);
