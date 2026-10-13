# wedding-video — 식전영상 (Remotion)

김민태 ♥ 김나은 결혼식 식전영상. 우드톤 식장에 맞춰 **"우드 테이블 위에 놓인 인화 사진"** 컨셉으로, 웨딩 사진 21장 사이사이에 일상 사진·4컷·영상을 끼워 넣는다. 글자는 없다.

## 명령

```bash
npm run studio                       # 브라우저 미리보기 (장면 스크럽 가능)
npx remotion render src/index.ts Wedding out/wedding.mp4 --codec h264 --crf 16 --jpeg-quality 95 --color-space bt709 --pixel-format yuv420p
npx remotion still src/index.ts Wedding out/f.png --frame=500   # 특정 프레임만 확인
```

## 구조

| 파일 | 역할 |
|---|---|
| `src/plan.ts` | **편집의 전부.** 소재 표(`PHOTOS`·`DAILY`·`CLIPS`)와 `SCENES`(장면 순서·톤·길이). 여기만 고치면 된다 |
| `src/theme.ts` | `wood` 팔레트 |
| `src/scenes/Wood.tsx` | 월넛/오크 텍스처 배경 + 조명 + 비네트, 아이보리 매트 |
| `src/scenes/Table.tsx` | 장면 하나 = 테이블 위 미디어 0~3개를 같은 높이로 나란히(사진·영상·4컷 공용) |
| `src/Wedding.tsx` | `SCENES` 를 `TransitionSeries`(1초 페이드)로 이어 붙임 |
| `public/photos/` `public/daily/` `public/clips/` `public/textures/` | 웨딩 사진 · 일상 사진/4컷/스티커 · 일상 영상(H.264) · 나뭇결 텍스처 |
| `scripts/` | 사진 재다운로드, 시트 합성, 텍스처 생성, 일상 소재 스테이징 |

## 규칙

- **어떤 장면에서도 사진을 잘라내지 않는다.** 매트 안쪽이 미디어 비율 그대로라서 세로·가로·정사각이 섞여도 같은 높이로 놓인다.
- 장면 길이는 `seconds`, 전환은 `TRANSITION_SEC`(1초). 총 길이 = 장면 합 − 전환 × (장면 수 − 1). 클립보다 긴 장면은 `validate()` 가 막는다.
- 음악을 넣을 때는 `<Audio src={staticFile('music.mp3')} />`를 `Wedding.tsx`에 추가하고, 장면 `seconds`를 비트 길이의 배수로 맞춘다.
- 식장 규격이 다르면 `Root.tsx`의 `width/height/fps`만 바꾼다(레이아웃은 1920×1080 기준 절대값이라 4K는 `scale` 래퍼 필요).
