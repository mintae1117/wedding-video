# CLAUDE.md — wedding-video (식전영상)

김민태 ♥ 김나은 결혼식(2026-10-25 일 14:00, 채플웨딩홀 아벤티움) 식전영상을 **Remotion**(React로 영상을 그려 Chrome이 프레임을 렌더)으로 만든다.
사용자는 React 개발자이며 응답·주석·커밋 메시지는 **한국어**로 쓴다.

## 환경 준비 (새 맥에서 clone 직후)

```bash
node -v                     # 22.x 필요 (nvm 권장). 20 이상이면 동작
npm install                 # remotion 4.0.533 + react 19 — package-lock 그대로 (버전 올리지 말 것: @remotion/* 는 전부 같은 버전이어야 한다)
npx remotion browser ensure # 렌더용 헤드리스 Chrome 다운로드(~150MB, 최초 1회)
npx tsc --noEmit            # 타입 체크
npx remotion compositions src/index.ts   # "Wedding 30 1920x1080 6570 (219.00 sec)" 가 나오면 정상
```

검토용 시트·스테이징 스크립트는 시스템 python3(3.10, Pillow·numpy 있음)로 `python3 -I scripts/...` 로 돌린다.
시스템에 ffmpeg 는 없다 — `npx remotion ffmpeg` / `npx remotion ffprobe` 를 쓰거나 `pip3 install imageio-ffmpeg` 의 바이너리를 쓴다.
사진이 비어 있으면 `bash scripts/fetch-photos.sh` (청첩장 R2 공개 버킷에서 재다운로드). 일상 소재(`public/daily`·`public/clips`)는 리포가 public 이라 깃에 없다 — 원본 폴더(`~/Downloads/wedding_video_v4`)에서 `scripts/stage-media.py`·`scripts/stage-clips.sh` 로 다시 만든다.

## 명령

| 할 일 | 명령 |
|---|---|
| 브라우저 미리보기 | `npm run studio` |
| 특정 프레임 스틸 | `npx remotion still src/index.ts Wedding out/f.png --frame=500` |
| 최종 렌더 | `npx remotion render src/index.ts Wedding out/wedding.mp4 --codec h264 --crf 16 --jpeg-quality 95 --color-space bt709 --pixel-format yuv420p` |
| 렌더 결과 프레임 추출 | `npx remotion ffmpeg -y -ss 64 -i out/wedding.mp4 -frames:v 1 out/t64.png` |
| 메타 확인 | `npx remotion ffprobe -v error -show_entries stream=pix_fmt,color_range,color_space -show_entries format=duration -of default=nw=1 out/wedding.mp4` |
| 시트 합성 | `python3 -I scripts/sheet.py out/review.jpg "라벨=out/f.png" ...` |
| 일상 사진·스티커 스테이징 | `python3 -I scripts/stage-media.py <원본 폴더>` |
| 일상 영상 스테이징 | `bash scripts/stage-clips.sh <원본 폴더>` |

렌더 시간: M3 기준 188초 영상이 약 8분(동시성 기본값), 219초는 약 10분. `out/` 은 깃에 올리지 않는다.
스틸을 여러 장 병렬로 뽑으면 webpack 캐시 경고(`PackFileCacheStrategy ... ENOENT`)가 뜨는데 무해하다.

## 구조

| 파일 | 역할 |
|---|---|
| `src/plan.ts` | **편집의 전부** — 소재 표(`PHOTOS`·`DAILY`·`CLIPS`)와 `SCENES`(장면 순서·톤·길이·놓이는 것). 끝의 `validate()` 가 키 오타와 클립보다 긴 장면을 번들 시점에 던진다 |
| `src/theme.ts` | 청첩장 팔레트 `theme`(크림·브라운·핑크·흰 매트). 글자가 없으니 폰트 스택은 없다 |
| `src/Wedding.tsx` | `SCENES` 를 `TransitionSeries`(1.5초 `fade`)로 이어 붙임 |
| `src/scenes/Backdrop.tsx` | `Lights`(떠다니는 핑크 빛·브라운 그늘) · `Hairline`(36px 안쪽 카드 테두리) · `EmptyCard`(빈 크림 카드 — 엔딩과 오프닝 페이드인 출발점) · `Vignette` |
| `src/scenes/Table.tsx` | 장면 하나 = 미디어 0~3개를 **같은 높이로 나란히**. 사진·일상·영상(`OffthreadVideo`) 공용. `light` = 크림 카드(첫 미디어 밝은 블러 워시 + 크림·핑크 그라데이션 + 빛 + 헤어라인, 흰 매트), `dark` = 첫 미디어 어두운 블러 배경(단독이면 매트 없이 높이 1080, 여럿이면 흰 매트). `extras` 스티커, `fadeIn` |
| `public/photos/` | 웨딩 사진 hero + 01~20 — 전부 세로 1707×2560(2:3) |
| `public/daily/` | 일상 사진 16·4컷 7·스티커 2. 원본은 `~/Downloads/wedding_video_v4`(사용자가 정리한 폴더, 2026-10-14), 긴 변 2560 축소. **깃에 안 올림**(리포가 public) — `stage-media.py` 로 재생성 |
| `public/clips/` | 일상 영상 11개 — H.264·무음·30fps. 원본 같은 폴더. 세로 폰 영상 일부는 회전 메타만 있던 것을 픽셀 회전으로 구움. **깃에 안 올림** — `stage-clips.sh` 로 재생성 |
| `public/fonts/` | 지금은 안 씀(글자 없음). 문구를 되살릴 때를 위해 남겨 둠 |
| `scripts/` | `fetch-photos.sh`, `sheet.py`, `stage-media.py`, `stage-clips.sh` |

## 디자인 규칙 (2026-10-13 사용자 확정 — 바꾸기 전에 스틸로 보여주고 물어볼 것)

- **팔레트는 청첩장과 동일하게 고정**: 크림 `#fbf6f1`, 브라운 `#8b7355` / 진브라운 `#3f3128`, 핑크 `#fdadbc`, 흰 매트. 2026-10-13 우드톤(월넛·오크 나뭇결) 시안을 승인 후 전체 적용했다가 **사용자가 당일 원래 디자인으로 되돌렸다**(청첩장 사이트에서도 색 시안을 되돌린 전력 있음). 색 변경 제안은 하지 않는다 — 다듬기만.
- **컨셉: 청첩장 카드 안의 인화 사진.** `light` 장면은 크림 카드(같은 사진의 밝은 블러 워시 + 크림·핑크 그라데이션 + 떠다니는 핑크 빛 + 36px 안쪽 브라운 헤어라인 테두리)에 흰 매트(14px, 매트 한가운데 가는 선). `dark` 장면은 원래 FullFit — 사진을 높이 1080 에 꽉 채우고 양옆은 같은 사진 `blur(42px) brightness(0.72)`, 매트 없음, 비네트 0.22. 힘은 이 밝음·어두움 대비에만 쓰고 나머지는 조용하게.
- **글자는 어디에도 없다.** 오프닝·엔딩 카드·문구·하단 서명 전부 제거(사용자 요청). 되살리려면 커밋 `befddab` 에 Opening/Ending/Caption 구현과 폰트 로더가 있다(`public/fonts/` 는 남겨 둠).
- **사진은 절대 잘라내지 않는다.** `Table` 이 매트 안쪽을 각 미디어 비율 그대로 계산하므로 세로·가로·정사각이 섞여도 같은 높이로 놓이고 잘리지 않는다. 높이 상한은 `size`(l 930 · m 860, 매트 포함), 폭이 모자라면 자동으로 줄어든다. 켄 번스는 **블러 배경에만**(light 1.18→1.26, dark 1.0→1.1), 매트는 스프링으로 올라온 뒤 ±8px 드리프트만.
- 가로 영상 둘을 나란히 두면 높이 490 으로 작아진다 → 가로 영상은 단독으로. 세로+가로 혼합은 괜찮다.
- 4컷·일상 사진은 `rotate` ±1~2.5° 로 툭 놓인 느낌, 웨딩 사진은 반듯하게. 스티커(고양이 캐릭터 시트에서 한 마리씩 오려냄)는 고양이 사진 장면에만 두 마리 — 각자 자기 사진 아래(회색 왼쪽, 갈색 오른쪽). 4컷 장면엔 없음(사용자 요청으로 옮김).
- **반복 재생 전제라 천천히**: 장면 7.5~9초, 전환 1.5초 페이드, 총 219초(v5). 사용자가 "사진 바뀌는 시간은 지금이 딱 적당"이라 했으니 장면 길이는 바꾸지 않는다. 영상 장면은 `CLIPS` 의 `from`·`rate`(0.7~0.8x, 그 아래는 프레임 중복이 눈에 띔)로 늘리고, **클립 끝을 지나면 OffthreadVideo 가 마지막 프레임을 유지**(검증 완료)하므로 페이드아웃 1.5초 안에서는 클립보다 길어도 된다(`validate` 허용치).
- **이음새**: 마지막 장면은 빈 크림 카드(`EmptyCard`, 4.5초), 첫 장면은 같은 빈 카드가 1.5초 걷히며(`fadeIn`) 시작 → 반복 재생 시 끊김 없음. 검정 페이드는 쓰지 않는다.
- 챕터 순서(v5, 35장면): 비하인드 클립 → 스튜디오(hero·01·03·15+17·02·16) → **간주1 처음**(2024 야경+포토이즘 거울 / 아쿠아리움·포토이즘 네컷·노란 거울 dark 트리오 / 네컷 2장) → 벽돌집(04+05·벽돌담 클립·06·20) → **간주2 2025 가을**(네컷+그 네컷 든 거울셀카+네컷 / 그림자 3연작 dark / 마라톤+공원 / 은행잎 폰) → 베이지·핑크 실내(07·08+09·10) → **간주3 겨울·500일**(크리스마스 네컷+겨울 거울 클립+500일 케이크 / 판다 네컷+물속 하트) → 블랙 캐주얼 거리(11+12·13·14) → **간주4 고양이**(회색 안고+손하트 / 문 앞 클립 / 갈색 안고+창가 가로 / 영상 3개 dark / 무릎 클립 / 고양이 사진+스티커) → 저녁(19·18) → 빈 카드. 간주는 **시기·주제·같은 날 소재로 묶는다**(예: 네컷 옆에 그 네컷을 든 셀카, 같은 날 그림자 클립 셋).

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

- v5(2026-10-14) = v4 디자인·템포 그대로, 소재 교체: 삭제 3(바다 셀피·카페 클립·이불 고양이 클립), 추가 15(사진 13·영상 2) → 35장면 219초, 무음. 산출물 `~/Downloads/식전영상_v5.mp4`(깃 밖). 사용자가 시청 피드백 예정.
- v4 = 청첩장 팔레트 복귀 + 일상 소재 혼합 + 글자 없음 + 느린 템포(반복 재생), 187.8초 — 커밋 `0e0017c`.
- v3(우드톤, 146.7초)는 커밋 `9ae0804` — 사용자가 되돌림. v2(청첩장 팔레트·문구 있음, 102초)는 커밋 `befddab`.
- **음악 미정**: 곡을 받으면 `<Audio src={staticFile('music.mp3')} />` 를 `Wedding.tsx` 에 넣고, 비트 길이에 맞춰 `plan.ts` 의 `seconds` 를 재배치한다(비트 분석은 numpy/scipy 로 가능).
- **식장 상영 규격 미확인**(해상도·형식·최대 길이). 1080p/mp4 가 아니면 `Root.tsx` 의 `width/height/fps` 조정 — 레이아웃이 1920×1080 절대값이라 4K 는 전체를 `scale(2)` 로 감싼다.

## 커밋 규칙

`<type>: <한국어 요약>` (feat / fix / style / docs / chore). 본문에 왜 바꿨는지 한두 줄. 렌더 산출물(`out/`)은 커밋하지 않는다.
