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
    <figure className="great-white-hero" aria-label="Illustration of a great white shark swimming through sunlit water">
      <img className="sunlight-animal-hero-image" src="/assets/sunlight/great-white-shark.png" alt="Great white shark with a gray back and white underside swimming beneath sunbeams in blue coastal water" />
      <figcaption><span>Featured predator</span><strong>Great White Shark</strong><em>Carcharodon carcharias</em></figcaption>
    </figure>
    <LessonReading lessonId="shark">
    <article className="current-article shark-article" aria-label="Great White Shark lesson">
      <p>The great white shark (<em>Carcharodon carcharias</em>) is one of the largest predatory fish in the ocean. It can grow more than 6 meters (20 feet) long, although most are smaller. Great white sharks live in coastal and offshore waters around the world, especially in cool and temperate regions.</p>
      <p>Great white sharks are powerful hunters. Their bodies are shaped for fast swimming, with strong tails and large fins that help them move efficiently through the water. They also have several rows of sharp, triangular teeth designed for gripping and cutting prey.</p>
      <h2>What Do Great White Sharks Eat?</h2>
      <p>A great white shark’s diet changes as it grows. Young sharks mainly eat fish, squid, rays, and smaller sharks. As they become larger, they are able to hunt bigger prey such as seals and sea lions. They may also feed on dolphins, small whales, sea turtles, and dead whales.</p>
      <p>Great whites often use surprise when hunting. For example, they may swim upward quickly from deeper water to attack a seal near the surface. Their strong jaws and serrated teeth allow them to tear pieces from large prey.</p>
      <h2>Travel and Migration Patterns</h2>
      <p>Great white sharks can travel very long distances. Scientists track them using electronic tags attached to their bodies or fins. These studies have shown that some great whites migrate thousands of kilometers each year.</p>
      <p>Sharks often move between coastal feeding areas and deeper parts of the open ocean. For example, great white sharks found along the coast of California may spend part of the year near areas where seals and sea lions are common. At other times, they may travel far offshore into the Pacific Ocean.</p>
      <p>Some sharks return to the same feeding areas year after year. Scientists believe their movements may be influenced by food availability, water temperature, reproduction, and ocean conditions.</p>
      <p>Great whites are also capable of diving hundreds of meters below the surface. During long migrations, they may repeatedly move between deep and shallow water, possibly while searching for food or navigating through the ocean.</p>
      <h2>Special Senses</h2>
      <p>Like other sharks, great whites have highly developed senses. They can detect smells in the water and sense vibrations made by nearby animals. They also have special organs called <strong>ampullae of Lorenzini</strong>, which allow them to detect the weak electrical signals produced by the muscles and nerves of other animals.</p>
      <p>These senses help great white sharks find prey even when the water is dark or cloudy.</p>
      <h2>Role in the Marine Ecosystem</h2>
      <p>Great white sharks are top predators. They help control populations of other marine animals and can influence the behavior of seals, sea lions, and other predators. Because of this, they play an important role in keeping marine food webs balanced.</p>
      <p>Despite their reputation, great white sharks do not normally hunt humans for food. Shark attacks on people are rare. Some bites may happen when a shark is investigating an unfamiliar object or mistakes a swimmer or surfer for its normal prey.</p>
      <p>Great white sharks face threats from accidental capture in fishing gear, illegal hunting, pollution, and declining prey populations. Because they reproduce slowly and produce relatively few young, their populations can take many years to recover.</p>
      <p>Studying great white sharks helps marine biologists understand migration, predator behavior, ocean food webs, and the overall health of marine ecosystems.</p>
    </article>
    </LessonReading>
    <SharkAnatomy />
    <SharkQuiz />
  </>;
}
