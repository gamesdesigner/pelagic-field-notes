// Timing is authored for this AI reconstruction; these are not measured kinematics.
export const REALISTIC_FRAME_COUNT=32;
export const REALISTIC_SOURCE_FPS=8;
export const REALISTIC_VIDEO_FPS=24;
export const REALISTIC_DURATION=REALISTIC_FRAME_COUNT/REALISTIC_SOURCE_FPS;
export const realisticFramePath=index=>`/assets/swordfish/realistic-v2/frame-${String(Math.min(REALISTIC_FRAME_COUNT-1,Math.max(0,Math.round(index)))).padStart(2,'0')}.webp`;
export function realisticStage(index){
 if(index<8)return 'Approach';
 if(index<16)return 'Bill sweep';
 if(index<24)return 'Move toward slowed prey';
 if(index<28)return 'Mouth capture';
 return 'Continue swimming';
}
