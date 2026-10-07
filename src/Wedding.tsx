import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {useFonts} from './fonts';
import {SCENES, sceneFrames, transitionFrames} from './plan';
import {Opening} from './scenes/Opening';
import {Ending} from './scenes/Ending';
import {Duo, FullFit, Gallery} from './scenes/PhotoScenes';
import {theme} from './theme';

const renderScene = (s: (typeof SCENES)[number]) => {
  switch (s.kind) {
    case 'opening':
      return <Opening />;
    case 'ending':
      return <Ending />;
    case 'full':
      return <FullFit photo={s.photo} />;
    case 'gallery':
      return <Gallery photo={s.photo} caption={s.caption} sub={s.sub} side={s.side} />;
    case 'duo':
      return <Duo photos={s.photos} caption={s.caption} />;
  }
};

export const Wedding: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      <TransitionSeries>
        {SCENES.flatMap((s, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneFrames(s)}>
              {renderScene(s)}
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
};
