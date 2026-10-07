# wedding-video — 식전영상 (Remotion)

김민태 ♥ 김나은 결혼식 식전영상. 청첩장(naeun-mintae-wedding) 팔레트(크림 바탕 · 브라운 세리프 · 핑크 포인트)를 그대로 쓴다.
사진 21장은 청첩장 R2 버킷(`my_wedding/hero_final`, `my_wedding/gal_grid_final`)에서 받아 `public/photos/`에 두었다.

## 명령

```bash
npm run studio                       # 브라우저 미리보기 (장면 스크럽 가능)
npx remotion render src/index.ts Wedding out/wedding.mp4 --codec h264 --crf 16 --jpeg-quality 95
npx remotion still src/index.ts Wedding out/f.png --frame=500   # 특정 프레임만 확인
```

## 구조

| 파일 | 역할 |
|---|---|
| `src/plan.ts` | **편집의 전부.** 장면 순서·길이·사진 포커스·문구. 여기만 고치면 된다 |
| `src/theme.ts` | 색·폰트·이름·날짜·장소 문자열 |
| `src/scenes/Opening.tsx` / `Ending.tsx` | 타이틀·엔딩 카드 |
| `src/scenes/PhotoScenes.tsx` | 사진 장면 3종: `FullFit`(사진 전체를 화면 높이에 맞춰 세우고 양옆은 어두운 블러 배경) · `Gallery`(세로 액자+밝은 블러 배경+문구) · `Duo`(두 장 나란히) |
| `src/Wedding.tsx` | `plan.ts`를 `TransitionSeries`(1초 페이드)로 이어 붙임 |
| `public/fonts/` | Pretendard(본문) · Noto Serif KR(제목) — OFL 무료 |

## 규칙

- 사진은 전부 세로(1707×2560, 2:3). **어떤 장면에서도 사진을 잘라내지 않는다**(`object-fit: contain`, 액자 안쪽은 정확히 2:3). 처음엔 전체화면을 얼굴 중심 16:9 크롭으로 만들었는데 세로의 37%만 보여 몸만 나오는 순간이 생겨 사용자 요청으로 전체 보기로 바꿨다. `PHOTOS[*].focus`는 이제 블러 배경의 줌 중심에만 쓰인다.
- 장면 길이는 `seconds`, 전환은 `TRANSITION_SEC`(1초). 총 길이 = 장면 합 − 전환 × (장면 수 − 1).
- 음악을 넣을 때는 `<Audio src={staticFile('music.mp3')} />`를 `Wedding.tsx`에 추가하고, 장면 `seconds`를 비트 길이의 배수로 맞춘다.
- 식장 규격이 다르면 `Root.tsx`의 `width/height/fps`만 바꾼다(레이아웃은 1920×1080 기준 절대값이라 4K는 `scale` 래퍼 필요).
