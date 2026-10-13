# CLAUDE.md — wedding-video (식전영상)

김민태 ♥ 김나은 결혼식(2026-10-25 일 14:00, 채플웨딩홀 아벤티움) 식전영상을 **Remotion**(React로 영상을 그려 Chrome이 프레임을 렌더)으로 만든다.
사용자는 React 개발자이며 응답·주석·커밋 메시지는 **한국어**로 쓴다.

## 환경 준비 (새 맥에서 clone 직후)

```bash
node -v                     # 22.x 필요 (nvm 권장). 20 이상이면 동작
npm install                 # remotion 4.0.533 + react 19 — package-lock 그대로 (버전 올리지 말 것: @remotion/* 는 전부 같은 버전이어야 한다)
npx remotion browser ensure # 렌더용 헤드리스 Chrome 다운로드(~150MB, 최초 1회)
npx tsc --noEmit            # 타입 체크
npx remotion compositions src/index.ts   # "Wedding 30 1920x1080 4401 (146.70 sec)" 가 나오면 정상
```

검토용 시트·텍스처·스테이징 스크립트는 시스템 python3(3.10, Pillow·numpy 있음)로 `python3 -I scripts/...` 로 돌린다.
시스템에 ffmpeg 는 없다 — `npx remotion ffmpeg` / `npx remotion ffprobe` 를 쓰거나 `pip3 install imageio-ffmpeg` 의 바이너리를 쓴다.
사진이 비어 있으면 `bash scripts/fetch-photos.sh` (청첩장 R2 공개 버킷에서 재다운로드). 일상 소재(`public/daily`·`public/clips`)는 리포가 public 이라 깃에 없다 — 원본 폴더에서 `scripts/stage-media.py`·`scripts/stage-clips.sh` 로 다시 만든다.

## 명령

| 할 일 | 명령 |
|---|---|
| 브라우저 미리보기 | `npm run studio` |
| 특정 프레임 스틸 | `npx remotion still src/index.ts Wedding out/f.png --frame=500` |
| 최종 렌더 | `npx remotion render src/index.ts Wedding out/wedding.mp4 --codec h264 --crf 16 --jpeg-quality 95 --color-space bt709 --pixel-format yuv420p` |
| 렌더 결과 프레임 추출 | `npx remotion ffmpeg -y -ss 64 -i out/wedding.mp4 -frames:v 1 out/t64.png` |
| 메타 확인 | `npx remotion ffprobe -v error -show_entries stream=pix_fmt,color_range,color_space -show_entries format=duration -of default=nw=1 out/wedding.mp4` |
| 시트 합성 | `python3 -I scripts/sheet.py out/review.jpg "라벨=out/f.png" ...` |
| 텍스처 재생성 | `python3 -I scripts/textures.py` |
| 일상 사진·스티커 스테이징 | `python3 -I scripts/stage-media.py <원본 폴더>` |
| 일상 영상 스테이징 | `bash scripts/stage-clips.sh <원본 폴더>` |

렌더 시간: M3 기준 147초 영상이 약 6분(동시성 기본값). `out/` 은 깃에 올리지 않는다.
스틸을 여러 장 병렬로 뽑으면 webpack 캐시 경고(`PackFileCacheStrategy ... ENOENT`)가 뜨는데 무해하다.

## 구조

| 파일 | 역할 |
|---|---|
| `src/plan.ts` | **편집의 전부** — 소재 표(`PHOTOS`·`DAILY`·`CLIPS`)와 `SCENES`(장면 순서·톤·길이·놓이는 것). 끝의 `validate()` 가 키 오타와 클립보다 긴 장면을 번들 시점에 던진다 |
| `src/theme.ts` | `wood` 팔레트(월넛·오크·아이보리·브라스). 글자가 없으니 폰트 스택은 없다 |
| `src/Wedding.tsx` | `SCENES` 를 `TransitionSeries`(1초 `fade`)로 이어 붙임 |
| `src/scenes/Wood.tsx` | `WoodBackdrop`(텍스처 + 위에서 비치는 조명 + 비네트, 결이 장면 동안 ±16px 흐름) · `Mat`(아이보리 매트 + 그림자) |
| `src/scenes/Table.tsx` | 장면 하나 = 테이블 위 미디어 0~3개를 **같은 높이로 나란히**. 사진·일상·영상(`OffthreadVideo`) 공용, `extras` 스티커, `fadeOut` |
| `public/photos/` | 웨딩 사진 hero + 01~20 — 전부 세로 1707×2560(2:3) |
| `public/daily/` | 일상 사진 4·4컷 7·스티커 2. 원본은 `~/Downloads/drive-download-20261012T235632Z-1-001`(구글 드라이브), 긴 변 2560 축소. **깃에 안 올림**(리포가 public) — `stage-media.py` 로 재생성 |
| `public/clips/` | 일상 영상 11개 — H.264·무음·30fps. 원본 같은 폴더. 세로 폰 영상 4개는 회전 메타만 있던 것을 픽셀 회전으로 구움. **깃에 안 올림** — `stage-clips.sh` 로 재생성 |
| `public/textures/` | `walnut.jpg`·`oak.jpg` — `scripts/textures.py` 로 numpy 생성(시드 고정, 재생성 결과 동일) |
| `public/fonts/` | 지금은 안 씀(글자 없음). 문구를 되살릴 때를 위해 남겨 둠 |
| `scripts/` | `fetch-photos.sh`, `sheet.py`, `textures.py`, `stage-media.py`, `stage-clips.sh` |

## 디자인 규칙 (2026-10-13 사용자 승인 — 바꾸기 전에 스틸로 보여주고 물어볼 것)

- **컨셉: 우드 테이블 위에 놓인 인화 사진.** 식장(아벤티움)이 우드톤이라 배경을 월넛(어두운 원목, 집중)·오크(밝은 원목, 가벼움) 두 가지로 번갈아 쓴다. 청첩장 팔레트(크림·브라운·핑크)는 2026-10-13 사용자 요청으로 뺐다. 사용자는 색 시안을 되돌린 전력이 있다 — 새 색·새 결은 먼저 스틸 1~2장으로 보여주고 확인받는다.
- **글자는 어디에도 없다.** 오프닝·엔딩 카드·문구·하단 서명 전부 제거(사용자 요청). 되살리려면 커밋 `befddab` 에 Opening/Ending/Caption 구현과 폰트 로더가 있다.
- **사진은 절대 잘라내지 않는다.** `Table` 이 매트 안쪽을 각 미디어 비율 그대로 계산하므로 세로·가로·정사각이 섞여도 같은 높이로 놓이고 잘리지 않는다. 높이 상한은 `size`(xl 1020 · l 930 · m 860, 매트 포함), 폭이 모자라면 자동으로 줄어든다. 켄 번스 없음 — 매트가 올라오는 스프링 + ±8px 드리프트만.
- 가로 영상 둘을 나란히 두면 높이 490 으로 작아진다 → 가로 영상은 단독(1603×902)으로, 세로+가로 혼합은 괜찮다.
- 4컷·일상 사진은 `rotate` ±1~2.5° 로 툭 놓인 느낌, 웨딩 사진은 반듯하게. 스티커(고양이 캐릭터 시트에서 한 마리씩 오려냄)는 4컷 장면·고양이 사진 장면에 하나씩만.
- 영상은 `CLIPS` 의 `from`(시작 초)·`rate`(배속) 로 트리밍. 비하인드 0.8x, 다리 그림자·이불 고양이 0.9x, 무릎 고양이 0.8x.
- 전환은 1초 페이드 고정. 장면 길이 5.4~7초. 엔딩은 빈 월넛 테이블 4초, 마지막 2초 검정으로.
- 챕터 순서: 비하인드 클립 → 스튜디오(hero·01·03·15+17·02·16) → 간주1(카페+피아노 고양이, 4컷 3장) → 벽돌집(04+05·벽돌담 클립·06·20) → 간주2(가을 그림자 2개, 마라톤+공원 영상, 4컷 2장) → 베이지·핑크 실내(07·08+09·10) → 간주3(고양이 영상 3장면, 고양이 사진) → 블랙 캐주얼 거리(11+12·13·14) → 간주4(크리스마스+판다 4컷, 바다 셀피) → 저녁(19·18) → 엔딩.

## 검증 방법 (렌더 전·후 반드시)

1. `npx tsc --noEmit` → `npx remotion compositions` 로 총 프레임 확인(validate 가 여기서 던진다).
2. 장면 유형별 대표 프레임을 `remotion still` 로 뽑아 `scripts/sheet.py` 로 한 장에 모은 뒤 **Read 로 직접 본다**(매트 크기·잘림·스티커 위치·영상 프레임). 전체 렌더는 그 다음.
3. 렌더 후엔 `remotion ffmpeg` 로 전환 중간 지점(두 장면이 50% 섞인 프레임)과 장면 중간을 뽑아 다시 본다. 페이드가 검게 빠지면 `TransitionSeries` 의 `durationInFrames` 합 오류다.
4. 색 태그는 `pix_fmt=yuv420p, color_range=tv, color_space=bt709` 여야 한다. `--pixel-format yuv420p` 만 주면 여전히 `yuvj420p/pc` 로 나온다 — **`--color-space bt709` 를 함께** 줘야 한다.
5. 동영상 자체는 사용자가 본다. 모션 속도·리듬 피드백은 사용자 몫임을 전제로 보고한다.

## 함정

- `useVideoConfig().durationInFrames` 는 `TransitionSeries.Sequence` 안에서 그 장면의 길이다(컴포지션 전체가 아님). 장면 내 진행도 계산은 이 값을 기준으로 한다.
- Remotion 패키지(`remotion`, `@remotion/cli`, `@remotion/transitions`)는 **버전이 완전히 같아야** 한다. 올릴 때는 셋을 함께.
- 삼성 폰 사진은 EXIF 로 세로를 표시한다. PIL 은 `exif_transpose` 로 맞지만 **ffmpeg 콘택트 시트는 EXIF 를 무시**해 가로로 보인다 — 방향은 PIL/브라우저 기준이 맞다.
- 세로 폰 영상도 픽셀은 가로 + 회전 메타다. 스테이징(`stage-clips.sh`)이 autorotate 로 구워 두므로 `CLIPS.aspect` 는 구운 뒤 크기(720/1280) 기준.
- zsh 에서 `rm out/x/*.png` 는 빈 폴더면 "no matches found" 로 명령 전체가 끊긴다 — `rm -f` 로도 안 되니 `find ... -delete` 를 쓴다.
- TS: 스타일 객체에서 `...spread` 뒤에 같은 키를 또 쓰면 TS2783.

## 상태 / 남은 일

- v3 = 우드톤 + 일상 소재 혼합 + 글자 없음, 146.7초, 무음. 산출물 `~/Downloads/식전영상_v3_우드톤.mp4`(깃 밖). 사용자가 시청 피드백 예정.
- v2(청첩장 팔레트·문구 있음, 102초)는 커밋 `befddab`.
- **음악 미정**: 곡을 받으면 `<Audio src={staticFile('music.mp3')} />` 를 `Wedding.tsx` 에 넣고, 비트 길이에 맞춰 `plan.ts` 의 `seconds` 를 재배치한다(비트 분석은 numpy/scipy 로 가능).
- **식장 상영 규격 미확인**(해상도·형식·최대 길이). 1080p/mp4 가 아니면 `Root.tsx` 의 `width/height/fps` 조정 — 레이아웃이 1920×1080 절대값이라 4K 는 전체를 `scale(2)` 로 감싼다.

## 커밋 규칙

`<type>: <한국어 요약>` (feat / fix / style / docs / chore). 본문에 왜 바꿨는지 한두 줄. 렌더 산출물(`out/`)은 커밋하지 않는다.
