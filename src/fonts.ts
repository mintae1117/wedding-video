import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FONT_FILES: Array<{family: string; file: string; weight: string}> = [
  {family: 'NotoSerifKR', file: 'fonts/NotoSerifKR-Light.otf', weight: '300'},
  {family: 'NotoSerifKR', file: 'fonts/NotoSerifKR-Regular.otf', weight: '400'},
  {family: 'NotoSerifKR', file: 'fonts/NotoSerifKR-Medium.otf', weight: '500'},
  {family: 'NotoSerifKR', file: 'fonts/NotoSerifKR-SemiBold.otf', weight: '600'},
  {family: 'Pretendard', file: 'fonts/Pretendard-Light.otf', weight: '300'},
  {family: 'Pretendard', file: 'fonts/Pretendard-Regular.otf', weight: '400'},
  {family: 'Pretendard', file: 'fonts/Pretendard-Medium.otf', weight: '500'},
  {family: 'Pretendard', file: 'fonts/Pretendard-SemiBold.otf', weight: '600'},
];

let loadPromise: Promise<void> | null = null;

const loadAll = () => {
  if (!loadPromise) {
    loadPromise = Promise.all(
      FONT_FILES.map(async (f) => {
        const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {weight: f.weight});
        const loaded = await face.load();
        // TS 의 FontFaceSet 타입에 add 가 없지만 브라우저에는 있다
        (document.fonts as unknown as {add: (f: FontFace) => void}).add(loaded);
      }),
    ).then(() => undefined);
  }
  return loadPromise;
};

/** 폰트가 전부 로드될 때까지 렌더를 지연한다 — 첫 프레임에 폴백 폰트가 찍히는 것을 막는다 */
export const useFonts = () => {
  const [handle] = useState(() => delayRender('load fonts'));
  useEffect(() => {
    loadAll()
      .catch((e) => console.error('font load failed', e))
      .finally(() => continueRender(handle));
  }, [handle]);
};
