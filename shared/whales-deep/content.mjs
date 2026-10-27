import {whalesLesson} from './whales.mjs';
import {blueWhaleLesson} from './blue.mjs';
import {spermWhaleLesson} from './sperm.mjs';
import {oarfishLesson} from './oarfish.mjs';
import {giantTubewormLesson} from './tubeworm.mjs';
import {yetiCrabLesson} from './yeti.mjs';
import {hydrothermalVentsLesson} from './vents.mjs';
import {anglerfishLesson} from './anglerfish.mjs';
import {coelacanthLesson} from './coelacanth.mjs';
// Explicit keys preserve the literal lesson union used by the typed readers.
export const whaleDeepLessons={whales:whalesLesson,blueWhale:blueWhaleLesson,spermWhale:spermWhaleLesson,oarfish:oarfishLesson,giantTubeworm:giantTubewormLesson,yetiCrab:yetiCrabLesson,hydrothermalVents:hydrothermalVentsLesson,anglerfish:anglerfishLesson,coelacanth:coelacanthLesson};
export const whaleDeepIntros={whales:whalesLesson.intro,blueWhale:blueWhaleLesson.intro,spermWhale:spermWhaleLesson.intro,oarfish:oarfishLesson.intro,giantTubeworm:giantTubewormLesson.intro,yetiCrab:yetiCrabLesson.intro,hydrothermalVents:hydrothermalVentsLesson.intro,anglerfish:anglerfishLesson.intro,coelacanth:coelacanthLesson.intro};
export const whaleDeepDives={whales:whalesLesson.dive,blueWhale:blueWhaleLesson.dive,spermWhale:spermWhaleLesson.dive,oarfish:oarfishLesson.dive,giantTubeworm:giantTubewormLesson.dive,yetiCrab:yetiCrabLesson.dive,hydrothermalVents:hydrothermalVentsLesson.dive,anglerfish:anglerfishLesson.dive,coelacanth:coelacanthLesson.dive};
export const whaleDeepGuides={whales:whalesLesson.guide,blueWhale:blueWhaleLesson.guide,spermWhale:spermWhaleLesson.guide,oarfish:oarfishLesson.guide,giantTubeworm:giantTubewormLesson.guide,yetiCrab:yetiCrabLesson.guide,hydrothermalVents:hydrothermalVentsLesson.guide,anglerfish:anglerfishLesson.guide,coelacanth:coelacanthLesson.guide};
export const whaleDeepQuizzes={whales:whalesLesson.questions,blueWhale:blueWhaleLesson.questions,spermWhale:spermWhaleLesson.questions,oarfish:oarfishLesson.questions,giantTubeworm:giantTubewormLesson.questions,yetiCrab:yetiCrabLesson.questions,hydrothermalVents:hydrothermalVentsLesson.questions,anglerfish:anglerfishLesson.questions,coelacanth:coelacanthLesson.questions};
