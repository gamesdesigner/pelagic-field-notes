import LessonReading from "./LessonReading";
import { useId } from "react";
import SharkAnatomy from "./SharkAnatomy";
import SharkQuiz from "./SharkQuiz";

export function GreatWhiteSharkArt() {
  const id = useId();
  return <svg className="great-white-art" viewBox="0 0 800 450" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#4dabbc" /><stop offset="1" stopColor="#082e49" /></linearGradient>
      <linearGradient id={`${id}-skin`} x2="0" y2="1"><stop stopColor="#344e5e" /><stop offset=".55" stopColor="#708f9a" /><stop offset="1" stopColor="#dce4dd" /></linearGradient>
    </defs>
    <rect width="800" height="450" fill={`url(#${id}-water)`} />
    <g fill="#d4f4e9" opacity=".1"><path d="M80 0 H135 L300 450 H170Z" /><path d="M275 0 H315 L530 450 H440Z" /><path d="M550 0 H585 L790 450 H720Z" /></g>
    <g fill="#16495a" opacity=".6"><path d="M85 350 Q110 338 132 350 L144 340 V360 L132 350 Q110 362 85 350Z" /><path d="M634 96 Q650 87 670 96 L680 88 V104 L670 96 Q650 105 634 96Z" /></g>
    <path d="M214 222 Q157 177 126 99 Q148 209 168 239 Q143 271 135 331 Q173 285 219 255Z" fill="#557987" stroke="#284b5d" strokeWidth="3" />
    <path d="M350 208 Q381 147 427 108 Q419 177 454 201Z" fill="#3b596b" />
    <path d="M463 268 Q438 322 403 346 Q426 291 423 266Z" fill="#365567" />
    <path d="M224 218 Q341 177 476 202 Q575 207 662 235 Q689 243 718 261 Q690 278 658 284 Q559 300 447 284 Q320 288 216 257 L179 243Z" fill={`url(#${id}-skin)`} stroke="#355565" strokeWidth="3" />
    <path d="M224 250 Q353 263 475 255 Q592 266 706 264 Q681 279 658 284 Q559 300 447 284 Q320 288 216 257Z" fill="#e3e7dd" />
    <path d="M514 254 Q456 313 385 347 Q427 285 455 250Z" fill="#547581" stroke="#355565" strokeWidth="2" />
    <path d="M291 213 L278 185 L321 204 M299 266 L286 295 L330 280" fill="#557987" />
    <g fill="none" stroke="#34515f" strokeWidth="4" strokeLinecap="round"><path d="M561 232 Q548 250 551 268 M548 230 Q535 249 538 266 M535 228 Q522 247 525 264 M522 226 Q509 245 512 262 M509 224 Q496 243 499 260" /></g>
    <circle cx="657" cy="246" r="7" fill="#102833" /><circle cx="659" cy="244" r="2" fill="#c8e7e7" />
    <path d="M641 271 Q670 281 695 267" fill="none" stroke="#3a5260" strokeWidth="3" />
    <path d="M691 254 L698 253" stroke="#34515f" strokeWidth="3" strokeLinecap="round" />
    <g fill="#d7f0e9" opacity=".3"><circle cx="65" cy="78" r="2" /><circle cx="722" cy="150" r="3" /><circle cx="530" cy="366" r="2" /><circle cx="281" cy="112" r="2" /></g>
  </svg>;
}

export default function GreatWhiteSharkLesson() {
  return <>
    <figure className="great-white-hero shark-specimen-hero" aria-label="Realistic scientific illustration of a great white shark">
      <img className="sunlight-animal-hero-image" src="/assets/shark/great-white-anatomy-realistic.webp" alt="Full side profile of a great white shark with textured gray skin, a white underside, five gill slits, paired fins and a crescent tail" />
      <figcaption><span>Featured predator</span><strong>Great White Shark</strong><em>Carcharodon carcharias</em></figcaption>
    </figure>
    <LessonReading lessonId="shark" />
    <SharkAnatomy />
    <SharkQuiz />
  </>;
}
