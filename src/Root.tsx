import React from 'react';
import {Composition} from 'remotion';
import {Wedding} from './Wedding';
import {FPS, totalFrames} from './plan';

export const Root: React.FC = () => (
  <Composition
    id="Wedding"
    component={Wedding}
    durationInFrames={totalFrames()}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
