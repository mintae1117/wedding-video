// 사진별 포커스(얼굴 위치, 0~1 비율)는 콘택트 시트를 직접 보고 정했다 — Haar 자동 검출이 hero·10·18·19 에서 틀렸음.
export type Photo = {file: string; focus: [number, number]};

export const PHOTOS: Record<string, Photo> = {
  hero: {file: 'hero.jpg', focus: [0.5, 0.3]},
  p01: {file: '01.jpg', focus: [0.52, 0.5]},
  p02: {file: '02.jpg', focus: [0.6, 0.4]},
  p03: {file: '03.jpg', focus: [0.5, 0.33]},
  p04: {file: '04.jpg', focus: [0.5, 0.6]},
  p05: {file: '05.jpg', focus: [0.55, 0.5]},
  p06: {file: '06.jpg', focus: [0.57, 0.57]},
  p07: {file: '07.jpg', focus: [0.55, 0.5]},
  p08: {file: '08.jpg', focus: [0.42, 0.5]},
  p09: {file: '09.jpg', focus: [0.5, 0.4]},
  p10: {file: '10.jpg', focus: [0.5, 0.35]},
  p11: {file: '11.jpg', focus: [0.55, 0.5]},
  p12: {file: '12.jpg', focus: [0.52, 0.5]},
  p13: {file: '13.jpg', focus: [0.75, 0.55]},
  p14: {file: '14.jpg', focus: [0.42, 0.6]},
  p15: {file: '15.jpg', focus: [0.5, 0.5]},
  p16: {file: '16.jpg', focus: [0.47, 0.35]},
  p17: {file: '17.jpg', focus: [0.5, 0.45]},
  p18: {file: '18.jpg', focus: [0.47, 0.4]},
  p19: {file: '19.jpg', focus: [0.6, 0.45]},
  p20: {file: '20.jpg', focus: [0.45, 0.42]},
};

export type Scene =
  | {kind: 'opening'; seconds: number}
  | {kind: 'ending'; seconds: number}
  | {kind: 'full'; photo: string; seconds: number; zoom?: [number, number]}
  | {kind: 'gallery'; photo: string; seconds: number; caption?: string; sub?: string; side?: 'left' | 'right'}
  | {kind: 'duo'; photos: [string, string]; seconds: number; caption?: string};

export const FPS = 30;
export const TRANSITION_SEC = 1.0;

// 챕터: 스튜디오 → 벽돌집 → 베이지·핑크 실내 → 블랙 캐주얼 거리 → 저녁 → 엔딩
export const SCENES: Scene[] = [
  {kind: 'opening', seconds: 9},
  {kind: 'full', photo: 'hero', seconds: 6.5, zoom: [1.0, 1.1]},
  {kind: 'gallery', photo: 'p01', seconds: 5.5, caption: '서로에게\n가장 좋은 친구가 되어', sub: 'Studio', side: 'right'},
  {kind: 'full', photo: 'p03', seconds: 6, zoom: [1.12, 1.0]},
  {kind: 'duo', photos: ['p15', 'p17'], seconds: 6, caption: '같은 곳을 바라보며'},
  {kind: 'full', photo: 'p02', seconds: 5.5, zoom: [1.0, 1.08]},
  {kind: 'full', photo: 'p16', seconds: 6, zoom: [1.1, 1.0]},
  {kind: 'duo', photos: ['p04', 'p05'], seconds: 6, caption: '햇살 좋은 날'},
  {kind: 'gallery', photo: 'p06', seconds: 5.5, side: 'left'},
  {kind: 'gallery', photo: 'p20', seconds: 5.5, caption: '함께 걸어갈\n모든 계절', side: 'right'},
  {kind: 'gallery', photo: 'p07', seconds: 5.5, caption: '오래된 노래처럼\n편안한 사람', side: 'right'},
  {kind: 'duo', photos: ['p08', 'p09'], seconds: 6},
  {kind: 'full', photo: 'p10', seconds: 6.5, zoom: [1.0, 1.1]},
  {kind: 'duo', photos: ['p11', 'p12'], seconds: 6, caption: '평범한 하루도\n특별하게'},
  {kind: 'gallery', photo: 'p13', seconds: 5.5, side: 'left'},
  {kind: 'gallery', photo: 'p14', seconds: 5.5, side: 'right'},
  {kind: 'gallery', photo: 'p19', seconds: 5.5, caption: '따뜻한 저녁의\n약속', side: 'left'},
  {kind: 'full', photo: 'p18', seconds: 7, zoom: [1.0, 1.1]},
  {kind: 'ending', seconds: 11},
];

export const sceneFrames = (s: Scene) => Math.round(s.seconds * FPS);
export const transitionFrames = Math.round(TRANSITION_SEC * FPS);
export const totalFrames = () =>
  SCENES.reduce((acc, s) => acc + sceneFrames(s), 0) - transitionFrames * (SCENES.length - 1);
