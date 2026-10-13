// 편집의 전부 — 장면 순서·길이·테이블 위에 놓이는 것. 글자는 어디에도 없다.
export const FPS = 30;
export const TRANSITION_SEC = 1.0;

/** 웨딩 사진 21장 — 전부 세로 1707×2560(2:3). 어떤 장면에서도 잘라내지 않는다 */
export const PHOTOS: Record<string, string> = {
  hero: 'hero.jpg',
  p01: '01.jpg', p02: '02.jpg', p03: '03.jpg', p04: '04.jpg', p05: '05.jpg',
  p06: '06.jpg', p07: '07.jpg', p08: '08.jpg', p09: '09.jpg', p10: '10.jpg',
  p11: '11.jpg', p12: '12.jpg', p13: '13.jpg', p14: '14.jpg', p15: '15.jpg',
  p16: '16.jpg', p17: '17.jpg', p18: '18.jpg', p19: '19.jpg', p20: '20.jpg',
};

/** 일상 사진·4컷 (public/daily, 긴 변 2560 으로 축소해 둔 것). aspect = 가로/세로 */
export type Daily = {file: string; aspect: number};
export const DAILY: Record<string, Daily> = {
  marathon: {file: 'daily/d_marathon.jpg', aspect: 1809 / 2560}, // 2025 YTN 서울투어 마라톤 배번
  sea: {file: 'daily/d_sea_selfie.jpg', aspect: 2560 / 1920}, // 2026-09 바다 셀피
  catA: {file: 'daily/d_cat_a.jpg', aspect: 1920 / 2560}, // 2026-07 회색 고양이
  catB: {file: 'daily/d_cat_b.jpg', aspect: 1920 / 2560}, // 2026-07 갈색 고양이
  s01: {file: 'daily/s01_pola_2502.jpg', aspect: 1719 / 2560}, // 4컷 2025-02 POLA
  s02: {file: 'daily/s02_planb_2505.jpg', aspect: 1719 / 2560}, // 4컷 2025-05 PLAN.B
  s03: {file: 'daily/s03_planb_2509.jpg', aspect: 1719 / 2560}, // 4컷 2025-09 PLAN.B
  s04: {file: 'daily/s04_life4_2510.jpg', aspect: 1200 / 1800}, // 4컷 2025-10 인생네컷
  s05: {file: 'daily/s05_pola_2512.jpg', aspect: 1719 / 2560}, // 4컷 2025-12 POLA(크리스마스)
  s06: {file: 'daily/s06_life4_panda_2602.jpg', aspect: 1800 / 1200}, // 4컷 2026-02 판다(가로)
  s07: {file: 'daily/s07_photoism.jpg', aspect: 1719 / 2560}, // 4컷 photoism
};

/**
 * 영상 (public/clips, H.264·무음·30fps 로 변환해 둔 것).
 * from = 클립 안에서 시작할 초, length = 클립 전체 길이(초), rate = 재생 속도(1 이 원속).
 * 장면 seconds 는 (length - from) / rate 를 넘지 못한다 — 아래 validate 가 막는다.
 */
export type Clip = {file: string; aspect: number; from?: number; length: number; rate?: number};
export const CLIPS: Record<string, Clip> = {
  cafe: {file: 'clips/c01_cafe.mp4', aspect: 720 / 1280, from: 1.0, length: 10.0}, // 2025-01 카페
  catPiano: {file: 'clips/c02_cat_piano.mp4', aspect: 720 / 1280, from: 0.5, length: 18.9}, // 2025-03 피아노 앞 고양이
  shadowHeart: {file: 'clips/c03_shadow_heart.mp4', aspect: 720 / 1280, from: 1.0, length: 9.3}, // 2025-11 은행잎 하트 그림자
  shadowBridge: {file: 'clips/c04_shadow_bridge.mp4', aspect: 720 / 1280, from: 0.6, length: 5.7, rate: 0.9}, // 2025-11 다리 그림자
  parkRun: {file: 'clips/c05_park_run.mp4', aspect: 720 / 1280, from: 0, length: 9.7}, // 2025-11 공원 달리기
  catDoor: {file: 'clips/c06_cat_door.mp4', aspect: 1280 / 720, from: 0.5, length: 13.0}, // 2026-02 문 앞 고양이(가로)
  catLap: {file: 'clips/c07_cat_lap.mp4', aspect: 1280 / 720, from: 0, length: 4.7, rate: 0.8}, // 2026-03 무릎 위 고양이(가로)
  catPet: {file: 'clips/c08_cat_pet.mp4', aspect: 712 / 862, from: 0, length: 7.7}, // 2026-04 쓰다듬기(정사각에 가까움)
  catBlanket: {file: 'clips/c09_cat_blanket.mp4', aspect: 720 / 1280, from: 0, length: 5.5, rate: 0.9}, // 2026-04 분홍 이불 고양이
  brickWall: {file: 'clips/c10_brick_wall.mp4', aspect: 720 / 1280, from: 0, length: 5.4}, // 2026-05-22 벽돌담 위로 올라오는 두 사람
  studioBts: {file: 'clips/c11_studio_bts.mp4', aspect: 1080 / 1920, from: 0, length: 3.9, rate: 0.8}, // 2026-05-22 스튜디오 비하인드
};

/** 테이블 위에 놓이는 것 하나 — 웨딩 사진 / 일상 사진·4컷 / 영상. rotate 는 도(°), 4컷처럼 툭 놓인 느낌용 */
export type Item =
  | {kind: 'photo'; key: string; rotate?: number}
  | {kind: 'daily'; key: string; rotate?: number}
  | {kind: 'clip'; key: string; rotate?: number};

/** 테이블 위 소품(고양이 캐릭터 스티커) — 화면 절대 좌표 */
export type Extra = {file: string; left: number; top: number; width: number; rotate?: number; delay?: number};

export type Scene = {
  tone: 'walnut' | 'oak';
  items: Item[];
  seconds: number;
  /** 매트 바깥 높이 — xl 1020(전체화면급) · l 930 · m 860(여러 장) */
  size?: 'xl' | 'l' | 'm';
  extras?: Extra[];
  /** 장면 끝에서 검정으로 잦아드는 초 (엔딩 전용) */
  fadeOut?: number;
};

const photo = (key: string): Item => ({kind: 'photo', key});
const clip = (key: string): Item => ({kind: 'clip', key});
const daily = (key: string, rotate = 0): Item => ({kind: 'daily', key, rotate});
const STICKER_GRAY: Extra = {file: 'daily/sticker_cat_gray.png', left: 1655, top: 870, width: 150, rotate: 6, delay: 30};
const STICKER_BROWN: Extra = {file: 'daily/sticker_cat_brown.png', left: 1630, top: 850, width: 180, rotate: -8, delay: 30};

// 챕터(웨딩 사진) 사이사이에 일상 간주를 끼운다. 월넛(어둡게)·오크(밝게)를 번갈아 리듬을 만든다.
export const SCENES: Scene[] = [
  // 오프닝 — 촬영 비하인드 클립(0.8배속)에서 hero 로
  {tone: 'walnut', items: [clip('studioBts')], size: 'xl', seconds: 4.8},
  {tone: 'walnut', items: [photo('hero')], size: 'xl', seconds: 6.5},
  // 스튜디오 흰 드레스
  {tone: 'oak', items: [photo('p01')], size: 'l', seconds: 5.5},
  {tone: 'walnut', items: [photo('p03')], size: 'xl', seconds: 6},
  {tone: 'oak', items: [photo('p15'), photo('p17')], size: 'l', seconds: 6},
  {tone: 'walnut', items: [photo('p02')], size: 'xl', seconds: 5.5},
  {tone: 'oak', items: [photo('p16')], size: 'l', seconds: 5.5},
  // 간주 1 — 2025 겨울·봄: 카페, 피아노 고양이, 4컷
  {tone: 'walnut', items: [clip('cafe'), clip('catPiano')], size: 'l', seconds: 6},
  {tone: 'oak', items: [daily('s01', -2.5), daily('s02', 1.5), daily('s07', -1.2)], size: 'm', seconds: 6, extras: [STICKER_GRAY]},
  // 벽돌집 (+ 같은 날 찍은 벽돌담 클립)
  {tone: 'oak', items: [photo('p04'), photo('p05')], size: 'l', seconds: 6},
  {tone: 'walnut', items: [clip('brickWall')], size: 'xl', seconds: 5.4},
  {tone: 'oak', items: [photo('p06')], size: 'l', seconds: 5.5},
  {tone: 'walnut', items: [photo('p20')], size: 'xl', seconds: 6},
  // 간주 2 — 2025 가을: 그림자, 마라톤 + 공원, 4컷
  {tone: 'walnut', items: [clip('shadowHeart'), clip('shadowBridge')], size: 'l', seconds: 5.5},
  {tone: 'oak', items: [daily('marathon', -1.5), clip('parkRun')], size: 'l', seconds: 6},
  {tone: 'oak', items: [daily('s03', 1.5), daily('s04', -2)], size: 'm', seconds: 5.5},
  // 베이지·핑크 실내
  {tone: 'oak', items: [photo('p07')], size: 'l', seconds: 5.5},
  {tone: 'oak', items: [photo('p08'), photo('p09')], size: 'l', seconds: 6},
  {tone: 'walnut', items: [photo('p10')], size: 'xl', seconds: 6.5},
  // 간주 3 — 고양이
  // 가로 영상 둘을 나란히 두면 높이 490 으로 작아져서 각각 단독으로(1603×902)
  {tone: 'walnut', items: [clip('catDoor')], size: 'l', seconds: 5.5},
  {tone: 'oak', items: [clip('catLap')], size: 'l', seconds: 5.5},
  {tone: 'walnut', items: [clip('catPet'), clip('catBlanket')], size: 'l', seconds: 5.5},
  {tone: 'oak', items: [daily('catA', -1.5), daily('catB', 1.2)], size: 'm', seconds: 5.5, extras: [STICKER_BROWN]},
  // 블랙 캐주얼 거리
  {tone: 'oak', items: [photo('p11'), photo('p12')], size: 'l', seconds: 6},
  {tone: 'walnut', items: [photo('p13')], size: 'xl', seconds: 6},
  {tone: 'oak', items: [photo('p14')], size: 'l', seconds: 5.5},
  // 간주 4 — 최근: 크리스마스·판다 4컷, 바다 셀피
  {tone: 'oak', items: [daily('s05', -2), daily('s06', 1.5)], size: 'm', seconds: 5.5},
  {tone: 'oak', items: [daily('sea', 1)], size: 'l', seconds: 5.5},
  // 저녁 → 엔딩(월넛 빈 테이블에서 검정으로)
  {tone: 'oak', items: [photo('p19')], size: 'l', seconds: 5.5},
  {tone: 'walnut', items: [photo('p18')], size: 'xl', seconds: 7},
  {tone: 'walnut', items: [], seconds: 4, fadeOut: 2},
];

export const sceneFrames = (s: Scene) => Math.round(s.seconds * FPS);
export const transitionFrames = Math.round(TRANSITION_SEC * FPS);
export const totalFrames = () =>
  SCENES.reduce((acc, s) => acc + sceneFrames(s), 0) - transitionFrames * (SCENES.length - 1);

/** 키 오타·클립보다 긴 장면을 번들 시점에 잡는다 */
const validate = () => {
  SCENES.forEach((s, i) => {
    for (const it of s.items) {
      if (it.kind === 'photo' && !PHOTOS[it.key]) throw new Error(`scene ${i}: 없는 사진 ${it.key}`);
      if (it.kind === 'daily' && !DAILY[it.key]) throw new Error(`scene ${i}: 없는 일상 사진 ${it.key}`);
      if (it.kind === 'clip') {
        const c = CLIPS[it.key];
        if (!c) throw new Error(`scene ${i}: 없는 클립 ${it.key}`);
        const avail = (c.length - (c.from ?? 0)) / (c.rate ?? 1);
        if (s.seconds > avail + 0.01) throw new Error(`scene ${i}: 클립 ${it.key} 는 ${avail.toFixed(1)}초뿐인데 장면이 ${s.seconds}초`);
      }
    }
  });
};
validate();
