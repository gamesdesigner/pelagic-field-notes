import CuttlefishLab from "./CuttlefishLab";
import CuttlefishQuiz from "./CuttlefishQuiz";
import LessonReading from "./LessonReading";
import { useId } from "react";

export function CommonCuttlefishArt() {
  const id = useId();
  return <svg className="cuttlefish-art" viewBox="0 0 800 450" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#8ebdc1" /><stop offset="1" stopColor="#285765" /></linearGradient>
      <linearGradient id={`${id}-mantle`} x2="0" y2="1"><stop stopColor="#ab8b5d" /><stop offset=".5" stopColor="#d8bf91" /><stop offset="1" stopColor="#8e7452" /></linearGradient>
      <pattern id={`${id}-spots`} width="34" height="27" patternUnits="userSpaceOnUse"><ellipse cx="10" cy="9" rx="5" ry="3" fill="#70593c" opacity=".55" /><circle cx="26" cy="22" r="3" fill="#f4e1b5" opacity=".6" /></pattern>
      <clipPath id={`${id}-body`}><path d="M319 202 Q394 134 530 149 Q624 162 675 229 Q606 303 476 287 Q375 280 319 245Z" /></clipPath>
    </defs>
    <rect width="800" height="450" fill={`url(#${id}-water)`} />
    <g fill="#e7f4de" opacity=".13"><path d="M70 0 H115 L295 450 H205Z" /><path d="M330 0 H360 L535 450 H465Z" /><path d="M580 0 H615 L785 450 H715Z" /></g>
    <path d="M0 354 Q155 320 345 363 T800 345 V450 H0Z" fill="#a3aa8f" />
    <g fill="#ddd4b8" opacity=".75"><ellipse cx="134" cy="398" rx="12" ry="4" /><ellipse cx="705" cy="379" rx="9" ry="3" /><ellipse cx="574" cy="415" rx="14" ry="4" /></g>
    <g stroke="#426b5d" strokeWidth="7" fill="none" strokeLinecap="round"><path d="M70 382 Q55 322 81 287 M87 379 Q104 327 91 298 M742 375 Q717 319 736 285" /></g>
    <ellipse cx="455" cy="362" rx="191" ry="15" fill="#1c4350" opacity=".2" />
    <g fill="none" strokeLinecap="round">
      <g stroke="#b6976c" strokeWidth="17"><path d="M283 215 Q227 167 181 186 Q154 197 177 214" /><path d="M275 218 Q220 184 145 228 Q123 243 149 250" /><path d="M274 227 Q217 216 155 259 Q133 277 153 281" /><path d="M273 236 Q221 239 190 291 Q179 310 158 299" /><path d="M284 247 Q242 267 229 310 Q220 327 205 311" /><path d="M292 251 Q279 285 291 308 Q307 325 318 303" /><path d="M290 208 Q263 169 229 161 Q205 159 214 179" /><path d="M300 206 Q292 166 269 152 Q253 145 250 165" /></g>
      <g stroke="#d1b58b" strokeWidth="8"><path d="M284 224 Q174 174 104 200 Q84 207 105 211" /><path d="M284 235 Q190 299 104 293 Q84 287 107 281" /></g>
    </g>
    <path d="M313 197 Q386 125 530 136 Q570 150 594 142 Q623 155 627 171 Q658 175 664 202 Q692 220 676 243 Q667 265 641 265 Q625 293 595 285 Q570 309 534 298 Q463 315 390 282 L315 254Z" fill="#cbb48c" stroke="#8e7958" strokeWidth="2" />
    <path d="M319 202 Q394 134 530 149 Q624 162 675 229 Q606 303 476 287 Q375 280 319 245Z" fill={`url(#${id}-mantle)`} stroke="#8c7251" strokeWidth="3" />
    <g clipPath={`url(#${id}-body)`}><rect x="315" y="130" width="365" height="180" fill={`url(#${id}-spots)`} /><g stroke="#765e41" strokeWidth="7" fill="none" opacity=".6"><path d="M365 146 Q382 200 366 265 M413 139 Q436 220 415 290 M469 143 Q494 221 467 299 M523 146 Q549 218 527 292 M578 160 Q599 225 578 288 M625 182 Q642 225 626 269" /></g></g>
    <path d="M269 195 Q305 176 343 202 L342 254 Q303 277 271 250Z" fill="#cbb18a" stroke="#8c7251" strokeWidth="3" />
    <ellipse cx="295" cy="216" rx="22" ry="19" fill="#ecdfb8" stroke="#8f7857" strokeWidth="3" />
    <path d="M280 209 Q283 225 290 213 Q296 207 301 218 Q309 226 310 209" stroke="#173a42" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M337 201 Q364 223 338 250" fill="none" stroke="#f1deb6" strokeWidth="4" opacity=".8" />
  </svg>;
}

export default function CommonCuttlefishLesson() {
  return <>
    <figure className="great-white-hero cuttlefish-hero" aria-label="Illustration of a common cuttlefish above a sandy sea floor">
      <img className="sunlight-animal-hero-image" src="/assets/sunlight/common-cuttlefish.png" alt="Common cuttlefish with mottled brown camouflage and a W-shaped pupil hovering above a sandy seabed" />
      <figcaption><span>Featured cephalopod</span><strong>Common Cuttlefish</strong><em>Sepia officinalis</em></figcaption>
    </figure>
    <LessonReading lessonId="cuttlefish">
    <article className="current-article cuttlefish-article" aria-label="Common Cuttlefish lesson">
      <p>The common cuttlefish (<em>Sepia officinalis</em>) is a marine animal related to squids and octopuses. It belongs to a group of animals called <strong>cephalopods</strong>, which are known for their intelligence, complex behavior, and ability to change color. Common cuttlefish are found mainly in the eastern Atlantic Ocean and the Mediterranean Sea, where they live in coastal waters and on sandy or muddy sea floors.</p>
      <p>Cuttlefish have eight arms and two longer feeding tentacles. Inside their bodies is a hard, lightweight structure called a <strong>cuttlebone</strong>. The cuttlebone contains many tiny chambers filled with gas and liquid. By adjusting these chambers, the cuttlefish can control its buoyancy and move up or down in the water.</p>
      <h2>What Do Common Cuttlefish Eat?</h2>
      <p>Common cuttlefish are active predators. They mainly eat <strong>crabs, shrimp, small fish, and other mollusks</strong>. Young cuttlefish often begin by eating small crustaceans such as shrimp.</p>
      <p>When hunting, a cuttlefish may slowly approach its prey while using camouflage to avoid being noticed. Once it is close enough, it rapidly shoots out its two long feeding tentacles. These tentacles grab the prey and pull it toward the cuttlefish&apos;s arms and mouth.</p>
      <p>Cuttlefish have a strong, parrot-like <strong>beak</strong> that they use to bite and break apart their food.</p>
      <h2>Color Change and Camouflage</h2>
      <p>One of the most remarkable abilities of the cuttlefish is its ability to change its appearance extremely quickly. Its skin contains specialized structures, including pigment cells called <strong>chromatophores</strong>.</p>
      <p>By controlling these cells, a cuttlefish can change its colors and patterns in less than a second. It can appear striped, spotted, dark, pale, or almost completely blended into its surroundings.</p>
      <p>Cuttlefish use these color changes for several purposes. Camouflage helps them hide from predators and sneak up on prey. They also use patterns and colors to communicate with other cuttlefish, especially during courtship and competition.</p>
      <h2>Travel and Seasonal Movement</h2>
      <p>Common cuttlefish do not usually make extremely long ocean migrations like great white sharks, but they do make important <strong>seasonal movements</strong>.</p>
      <p>During colder months, many common cuttlefish move into deeper offshore waters. As the water becomes warmer in spring and summer, adults often travel toward shallow coastal areas.</p>
      <p>These shallow waters provide important places for mating and egg-laying. Females attach clusters of dark eggs to seaweed, rocks, shells, and other underwater surfaces. After reproduction, many adult common cuttlefish die, giving them a relatively short life cycle of about one to two years.</p>
      <h2>Intelligence and Senses</h2>
      <p>Cuttlefish have large brains compared with many other invertebrates and have excellent eyesight. Their unusual W-shaped pupils help them detect contrast and movement underwater.</p>
      <p>Scientists have found that cuttlefish can learn from experience, remember information, solve simple problems, and change their hunting strategies. Their sophisticated nervous systems make them important animals for scientists studying learning and animal behavior.</p>
      <p>Interestingly, cuttlefish are thought to have limited color vision, yet they are still remarkably good at matching the colors and patterns of their surroundings.</p>
      <h2>Role in the Marine Ecosystem</h2>
      <p>Common cuttlefish are both <strong>predators and prey</strong>, making them important members of marine food webs. They help control populations of shrimp, crabs, fish, and other small animals.</p>
      <p>At the same time, cuttlefish are eaten by larger fish, sharks, dolphins, seals, and seabirds. Their camouflage, speed, and ability to release a cloud of ink help them escape predators.</p>
      <p>Studying common cuttlefish helps marine biologists understand animal intelligence, camouflage, predator-prey relationships, communication, and adaptation to life in the ocean.</p>
    </article>
    </LessonReading>
    <CuttlefishLab />
    <CuttlefishQuiz />
  </>;
}
