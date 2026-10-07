# CLAUDE.md — wedding-video (식전영상)

김민태 ♥ 김나은 결혼식(2026-10-25 일 14:00, 채플웨딩홀 아벤티움) 식전영상을 **Remotion**(React로 영상을 그려 Chrome이 프레임을 렌더)으로 만든다.
사용자는 React 개발자이며 응답·주석·커밋 메시지는 **한국어**로 쓴다.

## 환경 준비 (새 맥에서 clone 직후)

```bash
node -v                     # 22.x 필요 (nvm 권장). 20 이상이면 동작
npm install                 # remotion 4.0.533 + react 19 — package-lock 그대로 (버전 올리지 말 것: @remotion/* 는 전부 같은 버전이어야 한다)
npx remotion browser ensure # 렌더용 헤드리스 Chrome 다운로드(~150MB, 최초 1회)
npx tsc --noEmit            # 타입 체크
npx remotion compositions src/index.ts   # "Wedding 30 1920x1080 3060 (102.00 sec)" 가 나오면 정상
```

검토용 시트 스크립트는 Python + Pillow 를 쓴다: `python3 -m venv .venv && .venv/bin/pip install pillow`.
사진이 비어 있으면 `bash scripts/fetch-photos.sh` (청첩장 R2 공개 버킷에서 재다운로드).

## 명령

| 할 일 | 명령 |
|---|---|
| 브라우저 미리보기 | `npm run studio` |
| 특정 프레임 스틸 | `npx remotion still src/index.ts Wedding out/f.png --frame=500` |
| 최종 렌더 | `npx remotion render src/index.ts Wedding out/wedding.mp4 --codec h264 --crf 16 --jpeg-quality 95 --color-space bt709 --pixel-format yuv420p` |
| 렌더 결과 프레임 추출 | `npx remotion ffmpeg -y -ss 64 -i out/wedding.mp4 -frames:v 1 out/t64.png` |
| 메타 확인 | `npx remotion ffprobe -v error -show_entries stream=pix_fmt,color_range,color_space -show_entries format=duration -of default=nw=1 out/wedding.mp4` |
| 시트 합성 | `.venv/bin/python scripts/sheet.py out/review.jpg "라벨=out/f.png" ...` |

렌더 시간: M3 기준 102초 영상이 약 4분(동시성 기본값). `out/` 은 깃에 올리지 않는다.

## 구조

| 파일 | 역할 |
|---|---|
| `src/plan.ts` | **편집의 전부** — 장면 순서·길이(`seconds`)·사진 포커스·문구. 대부분의 수정은 여기서 끝난다 |
| `src/theme.ts` | 팔레트·폰트 스택·이름/날짜/장소 문자열 |
| `src/Wedding.tsx` | `SCENES` 를 `TransitionSeries`(1초 `fade`)로 이어 붙임. 폰트 로딩(`useFonts`) 호출 |
| `src/scenes/Opening.tsx` · `Ending.tsx` | 타이틀·엔딩 카드 (`Backdrop` 위 타이포) |
| `src/scenes/PhotoScenes.tsx` | 사진 장면 3종 — `FullFit`·`Gallery`·`Duo` (아래 규칙) + 하단 `Signature` |
| `src/scenes/Backdrop.tsx` | 크림 바탕+핑크 빛(오프닝·엔딩), `Vignette` |
| `src/fonts.ts` | `public/fonts/*.otf` 를 `FontFace` 로 로드하고 `delayRender` 로 대기 |
| `public/photos/` | hero.jpg + 01~20.jpg — 전부 **세로 1707×2560(2:3)** |
| `public/fonts/` | Pretendard(본문, jsDelivr npm `pretendard@1.3.9/dist/public/static/`) · Noto Serif KR(제목, noto-cjk SubsetOTF). 둘 다 OFL |
| `scripts/` | `fetch-photos.sh`, `sheet.py` |

## 디자인 규칙 (사용자 확인 완료 — 바꾸기 전에 물어볼 것)

- **팔레트는 청첩장과 동일**: 크림 `#fbf6f1`, 브라운 `#8b7355` / 진브라운 `#3f3128`, 핑크 `#fdadbc`. 사용자는 청첩장 사이트에서 색을 바꾼 시안을 전부 되돌린 전력이 있다 — 새 색을 쓰려면 먼저 스틸 1~2장으로 보여주고 확인받는다.
- **사진은 절대 잘라내지 않는다.** 처음 전체화면을 얼굴 중심 16:9 크롭으로 만들었더니 세로의 37%만 보여 "얼굴 없이 몸만 나온다"는 피드백을 받았다. 지금은 모든 장면이 `object-fit: contain` 이고 액자 안쪽은 정확히 2:3(갤러리 640×946, 듀오 580×858, 패딩 포함). 켄 번스는 **배경(블러)에만** 건다.
  - `FullFit`: 사진을 높이 1080 에 맞춰 가운데(폭 720), 양옆은 같은 사진을 `blur(42px) brightness(0.72)` 로 깐다.
  - `Gallery`: 흰 액자 + 같은 사진 밝은 블러 배경(크림·핑크 그라데이션 덮개) + 반대편 빈 영역 중앙에 문구. 문구가 없으면 액자를 가운데.
  - `Duo`: 같은 세트 두 장, 두 번째가 9프레임 늦게 올라온다.
- 문구는 Noto Serif KR, 보조 텍스트는 Pretendard Light + 넓은 자간. 문구는 짧게(두 줄 이내), 챕터당 1개 정도만.
- 전환은 1초 페이드 고정(`TRANSITION_SEC`). 장면 길이: 전체화면 5.5~7초, 갤러리 5.5초, 듀오 6초.
- 챕터 순서: 스튜디오 흰 드레스(hero·01·02·03·15·16·17) → 벽돌집(04·05·06·20) → 베이지·핑크 실내(07·08·09·10) → 블랙 캐주얼 거리(11·12·13·14) → 저녁(18·19) → 엔딩.

## 검증 방법 (렌더 전·후 반드시)

1. `npx tsc --noEmit` → `npx remotion compositions` 로 총 프레임 확인.
2. 장면 유형별 대표 프레임을 `remotion still` 로 뽑아 `scripts/sheet.py` 로 한 장에 모은 뒤 **Read 로 직접 본다**(폰트 폴백·레이아웃 깨짐·문구 잘림 확인). 전체 렌더는 그 다음.
3. 렌더 후엔 `remotion ffmpeg` 로 전환 중간 지점(두 장면이 50% 섞인 프레임)과 장면 중간을 뽑아 다시 본다. 페이드가 검게 빠지면 `TransitionSeries` 의 `durationInFrames` 합 오류다.
4. 색 태그는 `pix_fmt=yuv420p, color_range=tv, color_space=bt709` 여야 한다. `--pixel-format yuv420p` 만 주면 여전히 `yuvj420p/pc` 로 나온다 — **`--color-space bt709` 를 함께** 줘야 한다.
5. 동영상 자체는 사용자가 본다. 모션 속도·리듬 피드백은 사용자 몫임을 전제로 보고한다.

## 함정

- 자동 얼굴 인식(OpenCV Haar)은 이 사진들에서 hero·10·18·19 를 틀렸다. `PHOTOS[*].focus` 는 콘택트 시트를 보고 손으로 정한 값이며 지금은 블러 배경의 줌 중심에만 쓰인다.
- `useVideoConfig().durationInFrames` 는 `TransitionSeries.Sequence` 안에서 그 장면의 길이다(컴포지션 전체가 아님). 장면 내 진행도 계산은 이 값을 기준으로 한다.
- Remotion 패키지(`remotion`, `@remotion/cli`, `@remotion/transitions`)는 **버전이 완전히 같아야** 한다. 올릴 때는 셋을 함께.
- TS: `document.fonts.add` 는 lib.dom 타입에 없어 캐스팅해 둔 상태. 스타일 객체에서 `...spread` 뒤에 같은 키를 또 쓰면 TS2783.

## 상태 / 남은 일

- v2 = 사진 전체 보기 + bt709, 102초, 무음. 사용자가 시청 피드백 예정.
- **음악 미정**: 곡을 받으면 `<Audio src={staticFile('music.mp3')} />` 를 `Wedding.tsx` 에 넣고, 비트 길이에 맞춰 `plan.ts` 의 `seconds` 를 재배치한다(비트 분석은 numpy/scipy 로 가능).
- **식장 상영 규격 미확인**(해상도·형식·최대 길이). 1080p/mp4 가 아니면 `Root.tsx` 의 `width/height/fps` 조정 — 레이아웃이 1920×1080 절대값이라 4K 는 전체를 `scale(2)` 로 감싼다.
- 산출물은 `~/Downloads/식전영상_v2.mp4` 로 전달했다(깃 밖).

## 커밋 규칙

`<type>: <한국어 요약>` (feat / fix / style / docs / chore). 본문에 왜 바꿨는지 한두 줄. 렌더 산출물(`out/`)은 커밋하지 않는다.
