// 편집의 전부 — 장면 순서·길이·놓이는 것. 글자는 어디에도 없다. 반복 재생을 전제로 장면 7.5~9초, 페이드 1.5초.
export const FPS = 30;
export const TRANSITION_SEC = 1.5; // 반복 재생용으로 천천히

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
  catA: {file: 'daily/d_cat_a.jpg', aspect: 1920 / 2560}, // 2026-07 회색 고양이
  catB: {file: 'daily/d_cat_b.jpg', aspect: 1920 / 2560}, // 2026-07 갈색 고양이
  s01: {file: 'daily/s01_pola_2502.jpg', aspect: 1719 / 2560}, // 4컷 2025-02 POLA
  s02: {file: 'daily/s02_planb_2505.jpg', aspect: 1719 / 2560}, // 4컷 2025-05 PLAN.B
  s03: {file: 'daily/s03_planb_2509.jpg', aspect: 1719 / 2560}, // 4컷 2025-09 PLAN.B
  s04: {file: 'daily/s04_life4_2510.jpg', aspect: 1200 / 1800}, // 4컷 2025-10-10 인생네컷
  s05: {file: 'daily/s05_pola_2512.jpg', aspect: 1719 / 2560}, // 4컷 2025-12-24 POLA(크리스마스)
  s06: {file: 'daily/s06_life4_panda_2602.jpg', aspect: 1800 / 1200}, // 4컷 2026-02-20 판다(가로)
  s07: {file: 'daily/s07_photoism.jpg', aspect: 1719 / 2560}, // 4컷 2024-12-02 photoism(회색 후드)
  // 2026-10-14 추가분 (wedding_video_v4 폴더)
  night: {file: 'daily/n01_night_window_2409.jpg', aspect: 1920 / 2560}, // 2024-09-15 야경 창가 반영
  photoismMirror: {file: 'daily/n02_photoism_mirror_2412.jpg', aspect: 1920 / 2560}, // 2024-12-02 포토이즘 거울 셀카
  aquarium: {file: 'daily/n03_aquarium_heart_2412.jpg', aspect: 1920 / 2560}, // 2024-12-02 코엑스 아쿠아리움 하트 거울
  yellowMirror: {file: 'daily/n04_yellow_mirror_2412.jpg', aspect: 1920 / 2560}, // 2024-12-02 노란 거울
  catHeartHands: {file: 'daily/n05_cat_heart_hands_2509.jpg', aspect: 1920 / 2560}, // 2025-09-10 고양이 위 손하트
  shadowHands: {file: 'daily/n06_shadow_hands_2509.jpg', aspect: 1920 / 2560}, // 2025-09-13 손잡은 그림자
  groomGrayCat: {file: 'daily/n07_groom_graycat_2509.jpg', aspect: 1920 / 2560}, // 2025-09-18 회색 고양이 안고
  stripMirror: {file: 'daily/n08_strip_mirror_2510.jpg', aspect: 1920 / 2560}, // 2025-10-10 네컷 들고 거울 셀카
  groomBrownCat: {file: 'daily/n09_groom_browncat_2510.jpg', aspect: 1920 / 2560}, // 2025-10-18 갈색 고양이 안고
  phoneLeaves: {file: 'daily/n10_phone_leaves_2511.jpg', aspect: 1920 / 2560}, // 2025-11-12 은행잎 위 폰 셀카
  catWindow: {file: 'daily/n11_cat_window_2511.jpg', aspect: 2560 / 1920}, // 2025-11-29 창가 노을 고양이(가로)
  cake500: {file: 'daily/n12_cake500_2601.jpg', aspect: 1920 / 2560}, // 2026-01-24 500일 케이크
  heartWater: {file: 'daily/n13_heart_water_2602.jpg', aspect: 1920 / 2560}, // 2026-02-20 물속 손하트
};

/**
 * 영상 (public/clips, H.264·무음·30fps 로 변환해 둔 것).
 * from = 클립 안에서 시작할 초, length = 클립 전체 길이(초), rate = 재생 속도(1 이 원속).
 * 클립 끝을 지나면 OffthreadVideo 가 마지막 프레임을 유지한다(검증 완료). 장면 seconds 는 (length - from) / rate + 1.5초(페이드아웃 안)까지 허용 — validate 가 막는다.
 */
export type Clip = {file: string; aspect: number; from?: number; length: number; rate?: number};
export const CLIPS: Record<string, Clip> = {
  catPiano: {file: 'clips/c02_cat_piano.mp4', aspect: 720 / 1280, from: 0.5, length: 18.9}, // 2025-03 피아노 앞 고양이
  shadowHeart: {file: 'clips/c03_shadow_heart.mp4', aspect: 720 / 1280, from: 1.0, length: 9.3}, // 2025-11 은행잎 하트 그림자
  shadowBridge: {file: 'clips/c04_shadow_bridge.mp4', aspect: 720 / 1280, from: 0.6, length: 5.7, rate: 0.8}, // 2025-11 다리 그림자
  parkRun: {file: 'clips/c05_park_run.mp4', aspect: 720 / 1280, from: 0, length: 9.7}, // 2025-11 공원 달리기
  catDoor: {file: 'clips/c06_cat_door.mp4', aspect: 1280 / 720, from: 0.5, length: 13.0}, // 2026-02 문 앞 고양이(가로)
  catLap: {file: 'clips/c07_cat_lap.mp4', aspect: 1280 / 720, from: 0, length: 4.7, rate: 0.75}, // 2026-03 무릎 위 고양이(가로)
  catPet: {file: 'clips/c08_cat_pet.mp4', aspect: 712 / 862, from: 0, length: 7.7}, // 2026-04 쓰다듬기(정사각에 가까움)
  brickWall: {file: 'clips/c10_brick_wall.mp4', aspect: 720 / 1280, from: 0, length: 5.4, rate: 0.8}, // 2026-05-22 벽돌담 위로 올라오는 두 사람
  studioBts: {file: 'clips/c11_studio_bts.mp4', aspect: 1080 / 1920, from: 0, length: 3.9, rate: 0.7}, // 2026-05-22 스튜디오 비하인드
  catPetNY: {file: 'clips/c12_cat_pet_ny.mp4', aspect: 720 / 1280, from: 0, length: 5.2, rate: 0.7}, // 2025-12-31 갈색 고양이 쓰다듬기
  winterMirror: {file: 'clips/c13_winter_mirror.mp4', aspect: 720 / 1280, from: 0, length: 4.4, rate: 0.7}, // 2026-01-04 겨울 정원 둥근 거울
};

/** 테이블 위에 놓이는 것 하나 — 웨딩 사진 / 일상 사진·4컷 / 영상. rotate 는 도(°), 4컷처럼 툭 놓인 느낌용 */
export type Item =
  | {kind: 'photo'; key: string; rotate?: number}
  | {kind: 'daily'; key: string; rotate?: number}
  | {kind: 'clip'; key: string; rotate?: number};

/** 테이블 위 소품(고양이 캐릭터 스티커) — 화면 절대 좌표 */
export type Extra = {file: string; left: number; top: number; width: number; rotate?: number; delay?: number};

export type Tone = 'dark' | 'light';

export type Scene = {
  tone: Tone;
  items: Item[];
  seconds: number;
  /** 매트 바깥 높이 상한 — l 930 · m 860. dark 단독 사진은 매트 없이 1080 꽉 채움(size 무시) */
  size?: 'xl' | 'l' | 'm';
  extras?: Extra[];
  /** 진행도(배경 줌·드리프트) 계산에 쓸 길이(초). 루프 꼬리가 원본 첫 장면과 같은 움직임을 내도록 할 때만 지정 */
  motionSeconds?: number;
};

const photo = (key: string): Item => ({kind: 'photo', key});
const clip = (key: string): Item => ({kind: 'clip', key});
const daily = (key: string, rotate = 0): Item => ({kind: 'daily', key, rotate});
// 고양이 사진 장면에서 각자 자기 사진 아래에 — 회색은 왼쪽(catA), 갈색은 오른쪽(catB)
const STICKER_GRAY: Extra = {file: 'daily/sticker_cat_gray.png', left: 150, top: 880, width: 160, rotate: -7, delay: 30};
const STICKER_BROWN: Extra = {file: 'daily/sticker_cat_brown.png', left: 1630, top: 850, width: 180, rotate: 8, delay: 42};

// 챕터(웨딩 사진) 사이사이에 일상 간주를 끼운다. dark(어두운 블러 배경)·light(크림 카드)를 번갈아 리듬을 만든다.
// 간주는 시기·주제로 묶는다: 처음(2024) → 가을(2025) → 겨울·500일 → 고양이. 장면 길이는 v4 와 같은 7.5~9초.
export const SCENES: Scene[] = [
  // 오프닝 — 촬영 비하인드 클립(0.7배속)에서 hero 로. 첫 51프레임은 아래 LOOP_OFFSET 으로 잘린다(반복 재생 이음새)
  {tone: 'dark', items: [clip('studioBts')], seconds: 6},
  {tone: 'dark', items: [photo('hero')], seconds: 8.5},
  // 스튜디오 흰 드레스
  {tone: 'light', items: [photo('p01')], size: 'l', seconds: 7.5},
  {tone: 'dark', items: [photo('p03')], seconds: 8},
  {tone: 'light', items: [photo('p15'), photo('p17')], size: 'l', seconds: 8},
  {tone: 'dark', items: [photo('p02')], seconds: 7.5},
  {tone: 'light', items: [photo('p16')], size: 'l', seconds: 7.5},
  // 간주 1 — 처음: 2024 가을 야경·겨울 거울 셀카(같은 날 포토이즘 네컷과 함께)·2025 봄 네컷
  {tone: 'light', items: [daily('night', 1.2), daily('photoismMirror', -1.5)], size: 'm', seconds: 8},
  {tone: 'dark', items: [daily('aquarium', -1.5), daily('s07', 1.2), daily('yellowMirror', -1)], size: 'l', seconds: 8.5},
  {tone: 'light', items: [daily('s01', -2.5), daily('s02', 1.5)], size: 'm', seconds: 8},
  // 벽돌집 (+ 같은 날 찍은 벽돌담 클립)
  {tone: 'light', items: [photo('p04'), photo('p05')], size: 'l', seconds: 8},
  {tone: 'dark', items: [clip('brickWall')], seconds: 7.5},
  {tone: 'light', items: [photo('p06')], size: 'l', seconds: 7.5},
  {tone: 'dark', items: [photo('p20')], seconds: 8},
  // 간주 2 — 2025 가을: 네컷(가운데는 그 네컷을 든 거울 셀카), 그림자 3연작, 마라톤+공원, 은행잎 위 폰
  {tone: 'light', items: [daily('s03', 1.5), daily('stripMirror', -1.2), daily('s04', 2)], size: 'm', seconds: 8.5},
  {tone: 'dark', items: [clip('shadowHeart'), daily('shadowHands'), clip('shadowBridge')], size: 'l', seconds: 7.5},
  {tone: 'light', items: [daily('marathon', -1.5), clip('parkRun')], size: 'l', seconds: 8},
  {tone: 'light', items: [daily('phoneLeaves', 1)], size: 'l', seconds: 7.5},
  // 베이지·핑크 실내
  {tone: 'light', items: [photo('p07')], size: 'l', seconds: 7.5},
  {tone: 'light', items: [photo('p08'), photo('p09')], size: 'l', seconds: 8},
  {tone: 'dark', items: [photo('p10')], seconds: 8.5},
  // 간주 3 — 겨울·500일: 크리스마스 네컷 + 겨울 정원 거울 클립 + 500일 케이크, 판다 네컷 + 같은 날 물속 손하트
  {tone: 'light', items: [daily('s05', -2), clip('winterMirror'), daily('cake500', 1.5)], size: 'm', seconds: 7.5},
  {tone: 'light', items: [daily('s06', 1.5), daily('heartWater', -1.2)], size: 'm', seconds: 7.5},
  // 블랙 캐주얼 거리
  {tone: 'light', items: [photo('p11'), photo('p12')], size: 'l', seconds: 8},
  {tone: 'dark', items: [photo('p13')], seconds: 8},
  {tone: 'light', items: [photo('p14')], size: 'l', seconds: 7.5},
  // 간주 4 — 고양이 가족 (가로 영상은 단독으로, 영상 셋은 "쓰다듬는 손"으로 묶음)
  {tone: 'light', items: [daily('groomGrayCat', -1.2), daily('catHeartHands', 1.5)], size: 'm', seconds: 8},
  {tone: 'dark', items: [clip('catDoor')], size: 'l', seconds: 8},
  {tone: 'light', items: [daily('groomBrownCat', -1.5), daily('catWindow', 1.2)], size: 'm', seconds: 8},
  {tone: 'dark', items: [clip('catPiano'), clip('catPet'), clip('catPetNY')], size: 'l', seconds: 7.5},
  {tone: 'light', items: [clip('catLap')], size: 'l', seconds: 7.5},
  {tone: 'light', items: [daily('catA', -1.5), daily('catB', 1.2)], size: 'm', seconds: 7.5, extras: [STICKER_GRAY, STICKER_BROWN]},
  // 저녁 — 마지막 사진. 그 뒤에 첫 장면 사본(LOOP_TAIL)이 붙어 p18 → 비하인드 페이드가 영상 안에 들어간다
  {tone: 'light', items: [photo('p19')], size: 'l', seconds: 7.5},
  {tone: 'dark', items: [photo('p18')], seconds: 9},
];

export const sceneFrames = (s: Scene) => Math.round(s.seconds * FPS);
export const transitionFrames = Math.round(TRANSITION_SEC * FPS);

/**
 * 반복 재생 이음새(식장에서 루프): 빈 카드·검정 페이드 없이 마지막 사진에서 첫 장면으로 바로 페이드된다.
 * 시리즈 끝에 첫 장면의 사본(꼬리, 전환 45프레임 + 6프레임)을 붙이고, 영상은 시리즈의 51번째 프레임부터 시작한다.
 * → 영상의 마지막 프레임 = 꼬리의 50번째 프레임, 첫 프레임 = 원본 첫 장면의 51번째 프레임이라 한 프레임 차이로 이어진다.
 */
export const LOOP_OFFSET = transitionFrames + 6;
export const SERIES: Scene[] = [...SCENES, {...SCENES[0], seconds: LOOP_OFFSET / FPS, motionSeconds: SCENES[0].seconds}];
const seriesFrames = () => SERIES.reduce((acc, s) => acc + sceneFrames(s), 0) - transitionFrames * (SERIES.length - 1);
/** 실제 영상 길이(프레임) */
export const totalFrames = () => seriesFrames() - LOOP_OFFSET;

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
        // 끝을 지나면 마지막 프레임이 유지되므로 페이드아웃(1.5초) 안에서만 넘치도록
        if (s.seconds > avail + TRANSITION_SEC + 0.01) throw new Error(`scene ${i}: 클립 ${it.key} 는 ${avail.toFixed(1)}초뿐인데 장면이 ${s.seconds}초`);
      }
    }
  });
};
validate();
