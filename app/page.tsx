"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ConveyorBeltLab from "./ConveyorBeltLab";
import ConveyorBeltQuiz from "./ConveyorBeltQuiz";
import EkmanCoastalDiagram from "./EkmanCoastalDiagram";
import EnsoUnit from "./EnsoUnit";
import TurtleFeedingScene from "./TurtleFeedingScene";
import SunlightSwimmer,{SunlightWaterSurface} from "./SunlightSwimmer";
import GreatWhiteSharkLesson from "./GreatWhiteSharkLesson";
import EcologyLesson from "./EcologyLesson";
import SharksLesson from "./SharksLesson";
import CoralsLesson from "./CoralsLesson";
import CnidarianLesson from "./CnidarianLesson";
import {sharksChapterTitle,polarChapterTitle,twilightChapterTitle,chapterForLesson,lessonChapterLabel} from "../shared/chapter-structure.mjs";
import CephalopodsLesson from "./CephalopodsLesson";
import CommonCuttlefishLesson from "./CommonCuttlefishLesson";
import LessonReading from "./LessonReading";
import { useAccount } from "./AccountGate";
import StudentAccounts from "./StudentAccounts";
import AccountSettings from "./AccountSettings";
import {MyLearning} from "./LearningProgress";
import LessonQuiz from "./LessonQuiz";
import TwilightUnits from "./TwilightUnits";
import PlanktonLesson from "./PlanktonLesson";
import CourseIntroduction from "./CourseIntroduction";
import OceanCurrentsIntroduction from "./OceanCurrentsIntroduction";
import {oceanCurrentsChapterTitle} from "../shared/ocean-currents-introduction.mjs";
import PolarUnits from "./PolarUnits";
import CourseLibrary,{type LibrarySelection} from "./CourseLibrary";
import SiteInformation from "./SiteInformation";
import {SiteHeader,SiteFooter} from "./SiteChrome";
import {navigateSite,useSiteNavigation} from "./siteNavigation";
import {findLibraryLesson,lessonQuery,libraryGroups,sunlightChapterTitle} from "../shared/library-content.mjs";
import SchoolsOfFishLesson from "./SchoolsOfFishLesson";

type Subject = {
  id: string;
  number: string;
  title: string;
  short: string;
  depth: string;
  animal: string;
  scientific: string;
  description: string;
  fact: string;
  tone: string;
  general?: boolean;
};

const subjects: Subject[] = [
  {id:"sharks",number:"07",title:sharksChapterTitle,short:"Compare shark diversity, then study the great white.",depth:"Ocean habitats",animal:"",scientific:"",description:"",fact:"",tone:"sunlight"},
  {id:"introduction",number:"00",title:"Introduction",short:"A course overview and two illustrated guides to quizzes and interactive models.",depth:"Start here",animal:"",scientific:"",description:"",fact:"",tone:"course-intro"},
  {
    id: "currents",
    number: "01",
    title: oceanCurrentsChapterTitle,
    short: "The moving pathways that connect every ocean basin.",
    depth: "Global circulation",
    animal: "Ocean Currents",
    scientific: "Chapter introduction and five connected topics",
    description: "ABCDE",
    fact: "ABCDE",
    tone: "current",
  },
  {
    id: "sunlight",
    number: "02",
    title: sunlightChapterTitle,
    short: "A bright, productive world powered by photosynthesis.",
    depth: "0–200 metres",
    animal: "Green sea turtle",
    scientific: "Chelonia mydas",
    description: "Green sea turtles spend much of their adult lives in shallow coastal waters. Unlike most sea turtles, adults are mainly herbivores, grazing on seagrass and algae. Their feeding helps keep seagrass meadows healthy and productive for many other species.",
    fact: "The sunlight zone contains most of the ocean’s visible life, even though it makes up only a thin layer of the water column.",
    tone: "sunlight",
  },
  {
    id: "twilight",
    number: "04",
    title: twilightChapterTitle,
    short: "Where sunlight fades and daily migrations begin.",
    depth: "200–1,000 metres",
    animal: "Vampire squid",
    scientific: "Vampyroteuthis infernalis",
    description: "Despite its dramatic name, the vampire squid is a gentle scavenger. It gathers drifting marine snow with two long, sticky filaments and wraps the particles in mucus before eating them. Its dark red body is nearly invisible in the twilight zone’s blue light.",
    fact: "Every night, animals from this zone rise toward the surface to feed—the largest migration on Earth by number of animals.",
    tone: "twilight",
  },
  {
    id: "midnight",
    number: "04",
    title: "Marine Life in Midnight",
    short: "A cold, pressurized realm illuminated by living light.",
    depth: "1,000–4,000 metres",
    animal: "Giant siphonophore",
    scientific: "Praya dubia",
    description: "A giant siphonophore looks like one animal, but it is actually a colony of specialized individuals called zooids. Some provide propulsion, others capture prey, and others digest food. Together they form a glowing, coordinated body that may stretch longer than a blue whale.",
    fact: "Bioluminescence is so common here that flashes of blue-green light may be the midnight zone’s main form of communication.",
    tone: "midnight",
  },
  {id:"polar",number:"03",title:polarChapterTitle,short:"Northern orcas and jellies, with an Antarctic penguin comparison.",depth:"Polar environments",animal:"",scientific:"",description:"",fact:"",tone:"polar"},
  {
    id: "general",
    number: "06",
    title: "The General Ocean",
    short: "See the complete water column from the surface to the deep.",
    depth: "0–4,000 metres",
    animal: "Moon jelly",
    scientific: "Aurelia aurita",
    description: "Moon jellies drift through coastal and open waters around the world. Their translucent bells are moved by gentle pulses, while four horseshoe-shaped gonads make them easy to identify. With no brain, heart, or bones, they rely on a simple nerve net to sense their surroundings.",
    fact: "The ocean is one connected system: energy begins near the bright surface and travels downward as food, waste, and marine snow.",
    tone: "general",
    general: true,
  },
];

const currentTopics = ["Upwelling", "Thermohaline Circulation", "Coriolis Effect", "Ekman transport", "El Niño & La Niña"];
const sunlightUnits=libraryGroups.find(group=>group.id==="sunlight")!.lessons.filter(unit=>'topic' in unit);

type AnatomyPart = { label: string; x: string; y: string };
type AnatomyEntry = { title: string; note: string; parts: AnatomyPart[] };

const sunlightAnatomy: Record<string, AnatomyEntry> = {
  phytoplankton: {
    title: "Diatom and phytoplankton structures",
    note: "Phytoplankton include many different microscopic organisms. Diatoms are protected by glass-like silica walls, while photosynthetic pigments inside their cells capture sunlight.",
    parts: [
      { label: "Silica cell wall", x: "31%", y: "38%" },
      { label: "Chloroplasts", x: "68%", y: "42%" },
      { label: "Cell contents", x: "53%", y: "70%" },
    ],
  },
  dolphin: {
    title: "Common dolphin external anatomy",
    note: "A dolphin breathes air through its blowhole. Its dorsal fin steadies the body, pectoral flippers steer, and powerful tail flukes drive it forward.",
    parts: [
      { label: "Tail flukes", x: "12%", y: "57%" },
      { label: "Dorsal fin", x: "47%", y: "24%" },
      { label: "Pectoral flipper", x: "63%", y: "72%" },
      { label: "Blowhole", x: "73%", y: "31%" },
      { label: "Rostrum", x: "89%", y: "48%" },
    ],
  },
  "green-turtle": {
    title: "Green sea turtle external anatomy",
    note: "The carapace protects the turtle's back. Large front flippers provide thrust, smaller rear flippers help steer, and a hard beak clips seagrass and algae.",
    parts: [
      { label: "Rear flipper", x: "18%", y: "60%" },
      { label: "Carapace", x: "48%", y: "29%" },
      { label: "Front flipper", x: "58%", y: "75%" },
      { label: "Eye", x: "81%", y: "35%" },
      { label: "Beak", x: "90%", y: "45%" },
    ],
  },
  "moon-jelly": {
    title: "Moon jelly external anatomy",
    note: "The bell contracts to create a gentle pulse. Fine tentacles detect food, oral arms move captured prey toward the mouth, and four visible gonads form a clover-like pattern.",
    parts: [
      { label: "Bell", x: "53%", y: "24%" },
      { label: "Gonads", x: "55%", y: "40%" },
      { label: "Oral arms", x: "51%", y: "65%" },
      { label: "Tentacles", x: "30%", y: "80%" },
    ],
  },
  bluefin: {
    title: "Pacific bluefin tuna external anatomy",
    note: "A streamlined body reduces drag. The tail fin supplies thrust, pectoral fins steer, the dorsal fin stabilizes the fish, and water passes over the gills for oxygen.",
    parts: [
      { label: "Tail fin", x: "10%", y: "50%" },
      { label: "Dorsal fin", x: "57%", y: "22%" },
      { label: "Pectoral fin", x: "67%", y: "65%" },
      { label: "Gills", x: "79%", y: "50%" },
      { label: "Eye", x: "88%", y: "42%" },
    ],
  },
};

const sunlightCreatures = [
  {
    id: "phytoplankton",
    name: "Phytoplankton",
    image: "/assets/sunlight-creatures/phytoplankton.png",
    direction: "ltr",
    speed: "slow",
    speedLabel: "Stationary in this model",
    count: 3,
    depth: 15,
    duration: "28s",
    delay: "-19s",
    description: "Microscopic photosynthesizers carried by tides and currents. They capture sunlight near the surface and support much of the marine food web.",
  },
  {
    id: "dolphin",
    name: "Common dolphin",
    image: "/assets/sunlight-creatures/common-dolphin.png",
    direction: "rtl",
    speed: "fast",
    speedLabel: "Fast swimmer",
    count: 3,
    depth: 30,
    duration: "10s",
    delay: "-4s",
    description: "An energetic social hunter that often feeds on schooling fish and squid. Common dolphins frequently work near the surface and typically dive to about 30 metres while feeding.",
  },
  {
    id: "green-turtle",
    name: "Green sea turtle",
    image: "/assets/sunlight-creatures/green-sea-turtle.png",
    direction: "ltr",
    speed: "slow",
    speedLabel: "Steady swimmer",
    count: 2,
    depth: 55,
    duration: "64s",
    delay: "-12s",
    description: "A surface-breathing reptile that often forages in shallow coastal water. Adults mainly graze on seagrasses and algae before surfacing again for air.",
  },
  {
    id: "moon-jelly",
    name: "Moon jelly",
    image: "/assets/sunlight-creatures/moon-jelly.png",
    direction: "rtl",
    speed: "slow",
    speedLabel: "Slow drifter",
    count: 3,
    depth: 95,
    duration: "42s",
    delay: "-7s",
    description: "A gelatinous drifter that moves with gentle bell pulses while currents carry it through the water. Its translucent body helps it blend into the bright open ocean.",
  },
  {
    id: "bluefin",
    name: "Pacific bluefin tuna",
    image: "/assets/sunlight-creatures/pacific-bluefin-tuna.png",
    direction: "ltr",
    speed: "fast",
    speedLabel: "Fast swimmer",
    count: 3,
    depth: 135,
    duration: "12s",
    delay: "-9s",
    description: "A powerful, streamlined predator built for endurance and speed. It can cross the Pacific and can also dive far beneath the sunlight zone during its migrations.",
  },
];

const upwellingData = [
  { wind: 5, shelf: 0.5, nutrients: 0.5, plankton: 1200 },
  { wind: 5, shelf: 1.5, nutrients: 1.2, plankton: 3500 },
  { wind: 5, shelf: 3.0, nutrients: 3.5, plankton: 8000 },
  { wind: 10, shelf: 0.5, nutrients: 2.1, plankton: 15000 },
  { wind: 10, shelf: 1.5, nutrients: 5.8, plankton: 120000 },
  { wind: 10, shelf: 3.0, nutrients: 14.2, plankton: 950000 },
  { wind: 15, shelf: 0.5, nutrients: 6.5, plankton: 210000 },
  { wind: 15, shelf: 1.5, nutrients: 15.0, plankton: 2400000 },
  { wind: 15, shelf: 3.0, nutrients: 28.5, plankton: 18000000 },
  { wind: 25, shelf: 0.5, nutrients: 14.0, plankton: 9100000 },
  { wind: 25, shelf: 1.5, nutrients: 29.8, plankton: 22000000 },
  { wind: 25, shelf: 3.0, nutrients: 42.0, plankton: 85000000 },
  { wind: 35, shelf: 1.5, nutrients: 45.0, plankton: 220000000 },
  { wind: 35, shelf: 3.0, nutrients: 58.0, plankton: 510000000 },
  { wind: 45, shelf: 1.5, nutrients: 52.5, plankton: 480000000 },
  { wind: 45, shelf: 3.0, nutrients: 75.0, plankton: 1000000000 },
];
const mineralParticles = Array.from({ length: 36 }, (_, index) => ({
  label: ["Fe", "NO₃⁻", "PO₄³⁻", "SiO₄⁴⁻"][index % 4],
  left: `${7 + ((index * 37) % 78)}%`,
  bottom: `${-7 + ((index * 19) % 43)}%`,
  delay: `${-((index * 0.63) % 6.5)}s`,
  duration: `${4.8 + ((index * 0.37) % 3.2)}s`,
  drift: `${-34 + ((index * 23) % 69)}px`,
  rise: `-${170 + ((index * 41) % 210)}px`,
}));

function CoriolisGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef({ longitude: 0.25, latitude: -0.12, dragging: false, lastX: 0, lastY: 0 });
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  const turnEarth = (amount: number) => {
    motionRef.current.longitude += amount;
  };

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const texture = new THREE.TextureLoader().load("/assets/earth-blue-marble.jpg");
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const earthGeometry = new THREE.SphereGeometry(2, 96, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.82, metalness: 0.02 });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.y = -Math.PI / 2;
    world.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(2.07, 64, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({ color: 0x58c9ff, transparent: true, opacity: 0.11, side: THREE.BackSide });
    world.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial));

    scene.add(new THREE.HemisphereLight(0xaedfff, 0x061525, 1.55));
    const sunlight = new THREE.DirectionalLight(0xffffff, 2.7);
    sunlight.position.set(-4, 3, 6);
    scene.add(sunlight);
    const rimLight = new THREE.DirectionalLight(0x39bff2, 1.25);
    rimLight.position.set(4, -2, -4);
    scene.add(rimLight);

    type WindArrow = { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; phase: number; speed: number };
    const windArrows: WindArrow[] = [];
    const windBands = [
      { startLatitude: 30, endLatitude: 7, longitudeTravel: -46, color: 0x78d8ff, speed: 0.72 },
      { startLatitude: -30, endLatitude: -7, longitudeTravel: -46, color: 0x78d8ff, speed: 0.72 },
      { startLatitude: 30, endLatitude: 58, longitudeTravel: 50, color: 0xffa07f, speed: 0.9 },
      { startLatitude: -30, endLatitude: -58, longitudeTravel: 50, color: 0xffa07f, speed: 0.9 },
      { startLatitude: 82, endLatitude: 61, longitudeTravel: -38, color: 0xb5e8ff, speed: 0.58 },
      { startLatitude: -82, endLatitude: -61, longitudeTravel: -38, color: 0xb5e8ff, speed: 0.58 },
    ];

    const sphericalPoint = (longitude: number, latitude: number, radius = 2.24) => {
      const lon = THREE.MathUtils.degToRad(longitude);
      const lat = THREE.MathUtils.degToRad(latitude);
      return new THREE.Vector3(
        radius * Math.cos(lat) * Math.cos(lon),
        radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.sin(lon),
      );
    };

    windBands.forEach((band, bandIndex) => {
      for (let segmentIndex = 0; segmentIndex < 6; segmentIndex += 1) {
        const startingLongitude = segmentIndex * 60 - 180 + (bandIndex % 2) * 8;
        const points = Array.from({ length: 25 }, (_, pointIndex) => {
          const progress = pointIndex / 24;
          const latitude = THREE.MathUtils.lerp(band.startLatitude, band.endLatitude, progress);
          const longitude = startingLongitude + band.longitudeTravel * progress;
          return sphericalPoint(longitude, latitude);
        });
        const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.35);
        const trackGeometry = new THREE.TubeGeometry(curve, 36, 0.022, 6, false);
        const trackMaterial = new THREE.MeshBasicMaterial({ color: band.color, transparent: true, opacity: 0.78 });
        world.add(new THREE.Mesh(trackGeometry, trackMaterial));

        for (let arrowIndex = 0; arrowIndex < 2; arrowIndex += 1) {
          const arrowGeometry = new THREE.ConeGeometry(0.082, 0.25, 10);
          const arrowMaterial = new THREE.MeshStandardMaterial({ color: band.color, emissive: band.color, emissiveIntensity: 0.75, roughness: 0.42 });
          const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
          world.add(arrow);
          windArrows.push({ mesh: arrow, curve, phase: arrowIndex * 0.5 + segmentIndex * 0.071, speed: band.speed });
        }
      }
    });

    const arrowUp = new THREE.Vector3(0, 1, 0);
    const tangent = new THREE.Vector3();
    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let frame = 0;
    let previousTime = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = (time: number) => {
      const elapsed = Math.min(40, time - previousTime);
      previousTime = time;
      if (!reduceMotion && !pausedRef.current && !motionRef.current.dragging) {
        motionRef.current.longitude += elapsed * 0.00013;
      }
      world.rotation.set(motionRef.current.latitude, motionRef.current.longitude, THREE.MathUtils.degToRad(23.4) * 0.18);
      windArrows.forEach((arrow) => {
        const progress = (arrow.phase + time * 0.000055 * arrow.speed) % 1;
        arrow.mesh.position.copy(arrow.curve.getPointAt(progress));
        tangent.copy(arrow.curve.getTangentAt(progress)).normalize();
        arrow.mesh.quaternion.setFromUnitVectors(arrowUp, tangent);
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      texture.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Line)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <section className="coriolis-globe-model" aria-labelledby="coriolis-globe-title">
      <div className="coriolis-globe-heading">
        <span>Interactive rotating model</span>
        <h2 id="coriolis-globe-title">Spin the Earth</h2>
        <p>Drag the globe to inspect the opposite side. The arrows show simplified surface wind belts crossing latitude as air moves between pressure zones.</p>
      </div>

      <div className="globe-stage">
        <div
          ref={mountRef}
          className="three-earth-mount"
          role="img"
          aria-label="A draggable Three.js Earth with diagonal trade winds, westerlies, and polar easterlies"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            motionRef.current.dragging = true;
            motionRef.current.lastX = event.clientX;
            motionRef.current.lastY = event.clientY;
          }}
          onPointerMove={(event) => {
            if (!motionRef.current.dragging) return;
            const deltaX = event.clientX - motionRef.current.lastX;
            const deltaY = event.clientY - motionRef.current.lastY;
            motionRef.current.longitude += deltaX * 0.007;
            motionRef.current.latitude = Math.max(-1.2, Math.min(1.2, motionRef.current.latitude + deltaY * 0.006));
            motionRef.current.lastX = event.clientX;
            motionRef.current.lastY = event.clientY;
          }}
          onPointerUp={(event) => {
            motionRef.current.dragging = false;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { motionRef.current.dragging = false; }}
          onLostPointerCapture={() => { motionRef.current.dragging = false; }}
        />
      </div>

      <div className="globe-controls">
        <button type="button" onClick={() => turnEarth(-0.55)} aria-label="Turn Earth west">← Turn west</button>
        <button type="button" className="globe-pause" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Resume rotation" : "Pause rotation"}</button>
        <button type="button" onClick={() => turnEarth(0.55)} aria-label="Turn Earth east">Turn east →</button>
      </div>
      <div className="wind-belt-key" aria-label="Wind belt direction key">
        <span><i className="cool" /> Trade winds: toward the equator + west</span>
        <span><i className="warm" /> Westerlies: toward the poles + east</span>
        <span><i className="polar" /> Polar easterlies: toward 60° + west</span>
      </div>
      <p className="globe-instruction">Drag in any direction to explore · Earth surface: NASA Blue Marble</p>
    </section>
  );
}

function CoriolisQuiz() {
  return <LessonQuiz lessonId="coriolis" title="Coriolis effect quiz" className="upwelling-quiz coriolis-quiz"/>;
}

function SunlightZoneLab() {
  const [paused, setPaused] = useState(false);
  const [selectedCreatureId, setSelectedCreatureId] = useState(sunlightCreatures[0].id);
  const selectedCreature = sunlightCreatures.find((creature) => creature.id === selectedCreatureId) ?? sunlightCreatures[0];
  const selectedAnatomy = sunlightAnatomy[selectedCreature.id];

  return (
    <>
      <section className="sunlight-lab" aria-labelledby="sunlight-lab-title">
        <div className="sunlight-lab-heading">
          <span>Interactive 2D ocean</span>
          <h2 id="sunlight-lab-title">Life from 0 to 200 metres</h2>
          <p>Watch the waves rise and fall. Select an animal to explore how it swims and lives.</p>
          <div className="swim-key" aria-label="Creature movement key">
            <span><i className="slow" /> Slow or drifting</span>
            <span><i className="fast" /> Fast swimmer</span>
            <button type="button" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?"Resume animation":"Pause animation"}</button>
          </div>
        </div>

        <div className={`sunlight-ocean ${paused?"is-paused":""}`} role="group" aria-label="A layered side view of the sunlight zone from the surface to 200 metres, with selectable marine animals">
          <div className="sunlight-sky"><i /></div>
          <SunlightWaterSurface/>
          <div className="sunlight-rays" aria-hidden="true"><i /><i /><i /></div>
          {[0, 50, 100, 150, 200].map((depth) => (
            <div className="depth-line" key={depth} style={{ "--depth-position": `${10 + (depth / 200) * 82}%` } as CSSProperties}>
              <span>{depth} m</span>
            </div>
          ))}
          <span className="layer-name layer-bright">Bright surface</span>
          <span className="layer-name layer-middle">Light fading</span>
          <span className="layer-name layer-edge">Sunlight-zone edge</span>

          {sunlightCreatures.map((creature) => Array.from({ length: creature.count }, (_, instance) => {
            const direction = instance % 2 === 0 ? creature.direction : creature.direction === "ltr" ? "rtl" : "ltr";
            const duration = Number.parseFloat(creature.duration);
            const delay = Number.parseFloat(creature.delay) - instance * (duration / creature.count);
            const depthOffset = creature.count === 2 ? (instance === 0 ? -6 : 7) : (instance - 1) * 8;
            const instanceDepth = Math.max(4, Math.min(185, creature.depth + depthOffset));
            const scale = 0.78 + (instance % 3) * 0.11;
            return (
              <button
                type="button"
                key={`${creature.id}-${instance}`}
                className={`ocean-creature ${creature.id} ${creature.speed} ${direction} ${selectedCreatureId === creature.id ? "selected" : ""}`}
                style={{ "--creature-y": `${12 + (instanceDepth / 200) * 74}%`, "--swim-duration": creature.duration, "--swim-delay": `${delay}s`, "--creature-scale": `${scale}`, "--rest-x": `${17+instance*26}%`, "--stroke-delay": `${-instance*1.7}s` } as CSSProperties}
                aria-label={`${creature.name}, ${creature.speedLabel}, example depth ${instanceDepth} metres`}
                aria-pressed={selectedCreatureId === creature.id}
                onClick={() => setSelectedCreatureId(creature.id)}
              >
                <span className="creature-art" aria-hidden="true"><SunlightSwimmer kind={creature.id}/></span>
                {instance === 0 && <small>{creature.name}</small>}
              </button>
            );
          }))}

          <div className="twilight-boundary">Twilight zone begins below 200 m</div>
        </div>
        <div className="creature-info" aria-live="polite">
          <span>{selectedCreature.speedLabel} · Example depth {selectedCreature.depth} m</span>
          <h3>{selectedCreature.name}</h3>
          <p>{selectedCreature.description}</p>
        </div>
        <p className="creature-credit">Swimming is shown with simplified, articulated 2D illustrations, not to scale or at measured speeds. Plankton stay fixed here for observation; real plankton are carried by currents. Anatomy atlas green sea turtle image: <a href="https://pngimg.com/image/24729" target="_blank" rel="noreferrer">PNGimg</a>, CC BY-NC 4.0. Other creature illustrations were created for this study guide.</p>
      </section>

      <section className="anatomy-atlas" aria-labelledby="anatomy-atlas-title">
        <div className="anatomy-heading">
          <span>Interactive anatomy atlas</span>
          <h2 id="anatomy-atlas-title">Body parts built for ocean life</h2>
          <p>Choose a creature, then study the names placed directly on its diagram.</p>
        </div>
        <div className="anatomy-tabs" role="group" aria-label="Choose an anatomy diagram">
          {sunlightCreatures.map((creature) => (
            <button
              type="button"
              key={creature.id}
              className={selectedCreatureId === creature.id ? "selected" : ""}
              aria-pressed={selectedCreatureId === creature.id}
              onClick={() => setSelectedCreatureId(creature.id)}
            >
              {creature.name}
            </button>
          ))}
        </div>
        <div className={`anatomy-board anatomy-${selectedCreature.id}`}>
          <div className="anatomy-title">
            <span>Selected specimen</span>
            <h3>{selectedAnatomy.title}</h3>
          </div>
          <div className="anatomy-stage">
            <img src={selectedCreature.image} alt={`${selectedCreature.name} with labeled external body parts`} />
            {selectedAnatomy.parts.map((part) => (
              <span
                className="anatomy-label"
                key={part.label}
                style={{ "--part-x": part.x, "--part-y": part.y } as CSSProperties}
              >
                <i aria-hidden="true" />{part.label}
              </span>
            ))}
          </div>
          <p className="anatomy-note">{selectedAnatomy.note}</p>
        </div>
      </section>

      <LessonQuiz lessonId="sunlight" title="Sunlight-zone quiz" className="upwelling-quiz sunlight-quiz"/>
    </>
  );
}

function TurtleQuiz() {
  return <LessonQuiz lessonId="turtle" title="Green sea turtle quiz" className="upwelling-quiz turtle-quiz"/>;
}

const turtleFoods = [
  {
    id: "turtle-grass",
    name: "Turtle grass",
    scientific: "Thalassia testudinum",
    meal: "Broad seagrass blades",
    method: "The turtle grips a blade with its beak, tears off the leafy end, and leaves the buried roots able to regrow.",
  },
  {
    id: "manatee-grass",
    name: "Manatee grass",
    scientific: "Syringodium filiforme",
    meal: "Thin, cylindrical seagrass leaves",
    method: "Repeated bites crop the flexible leaves into short pieces. Grazing can keep patches young and nutritious.",
  },
  {
    id: "shoal-grass",
    name: "Shoal grass",
    scientific: "Halodule wrightii",
    meal: "Narrow leaves in shallow coastal meadows",
    method: "The turtle crops the short leaves close to the sediment, creating repeatedly grazed feeding patches.",
  },
  {
    id: "eelgrass",
    name: "Eelgrass",
    scientific: "Zostera marina",
    meal: "Long seagrass blades in cooler coastal habitat",
    method: "Where their ranges overlap, green turtles can tear tender eelgrass leaves with repeated bites from the edge of the meadow.",
  },
  {
    id: "sea-lettuce",
    name: "Sea lettuce",
    scientific: "Ulva species",
    meal: "Thin sheets of bright green algae",
    method: "The turtle pinches soft algae between the cutting edges of its beak and pulls pieces away from the rock or sediment.",
  },
  {
    id: "red-algae",
    name: "Red algae",
    scientific: "Gracilaria species",
    meal: "Branching algae from reefs and lagoons",
    method: "The turtle clips the branching tips with its beak and swallows the soft pieces without chewing them like a mammal.",
  },
  {
    id: "juvenile-food",
    name: "Jellyfish and small animals",
    scientific: "Mostly eaten by young turtles",
    meal: "Jellyfish, small crustaceans, and other soft prey",
    method: "Young green turtles are more omnivorous than adults. They seize small drifting prey before many later shift toward plants and algae.",
  },
  {
    id: "bare-ground",
    name: "Bare sand",
    scientific: "No forage available",
    meal: "An empty patch between feeding areas",
    method: "There is nothing to bite here. The turtle must search for another seagrass meadow, algal patch, or suitable feeding ground.",
  },
];

const turtleSeasons = [
  { id: "spring", name: "Spring", note: "Fresh growth · 15–24°C", scene: "New seagrass blades and active regrowth", min: 15, max: 24, temperature: 20 },
  { id: "summer", name: "Summer", note: "Dense meadow · 24–32°C", scene: "Warm water and the fullest meadow cover", min: 24, max: 32, temperature: 27 },
  { id: "autumn", name: "Autumn", note: "Thinning meadow · 10–23°C", scene: "Older blades and more open feeding patches", min: 10, max: 23, temperature: 18 },
  { id: "winter", name: "Winter", note: "Sparse growth · 0–10°C", scene: "Cold water and reduced plant growth", min: 0, max: 10, temperature: 5 },
];

function TurtleFeedingLab() {
  const [temperature, setTemperature] = useState(27);
  const [foodId, setFoodId] = useState(turtleFoods[0].id);
  const [seasonId, setSeasonId] = useState("summer");
  const [statusPulse, setStatusPulse] = useState(0);
  const food = turtleFoods.find((item) => item.id === foodId) ?? turtleFoods[0];
  const season = turtleSeasons.find((item) => item.id === seasonId) ?? turtleSeasons[1];
  const activityLabel = temperature < 10 ? "Dangerously cold water" : temperature < 21 ? "Sluggish in cool water" : temperature < 24 ? "Warming up" : temperature <= 29 ? "Active grazer" : "Slowing in very warm water";
  const diveTime = temperature < 10 ? "Cold-stunning risk — feeding stops" : temperature < 21 ? "Long, low-energy rest" : temperature <= 29 ? "Regular feeding dive" : "More frequent recovery pauses";
  const noFood = food.id === "bare-ground";
  const status = temperature < 10 ? "Cold-stunning risk — inactive" : noFood ? "Resting — bare sand" : temperature < 21 ? "Cold — conserving energy" : temperature > 30 ? "Very warm — resting" : "Feeding — active";
  const statusTone = temperature < 10 ? "caution" : noFood ? "searching" : temperature < 21 || temperature > 30 ? "caution" : "feeding";

  const changeTemperature = (value: number) => { setTemperature(value); setStatusPulse((pulse) => pulse + 1); };
  const changeFood = (value: string) => { setFoodId(value); setStatusPulse((pulse) => pulse + 1); };
  const changeSeason = (value: string) => {
    const nextSeason = turtleSeasons.find((item) => item.id === value);
    if (!nextSeason) return;
    setSeasonId(value);
    setTemperature(nextSeason.temperature);
    setStatusPulse((pulse) => pulse + 1);
  };

  return (
    <section className="turtle-feeding-lab" aria-labelledby="turtle-feeding-title">
      <div className="feeding-lab-heading">
        <span>Interactive feeding event</span>
        <h2 id="turtle-feeding-title">Follow a green turtle&apos;s meal</h2>
        <p>Watch a 20-second feeding sequence: the turtle settles above the meadow, lowers its head, grips a blade with its beak, pulls it loose, and lifts away. Change the water temperature, season, and food to explore its habitat.</p>
      </div>

      <div className={`feeding-scene season-${season.id} food-${food.id}`} role="img" aria-label={`Green sea turtle in a ${season.name.toLowerCase()} ${food.name.toLowerCase()} habitat`}>
        <TurtleFeedingScene key={`${food.id}-${season.id}-${statusPulse}`} foodId={food.id} seasonId={season.id} temperature={temperature} noFood={noFood} />
        <div className="feeding-habitat-effect" aria-hidden="true" />
        <div className="feeding-specimen-card">
          <span>Species</span>
          <strong>Green sea turtle</strong>
          <em>Chelonia mydas</em>
        </div>
        <div key={statusPulse} className={`feeding-status-card ${statusTone}`}>
          <span>Live turtle status</span>
          <strong>{status}</strong>
          <small>{temperature}°C · {season.name}</small>
        </div>
      </div>

      <div className="feeding-controls">
        <label className="temperature-control">
          <span>Water temperature <output>{temperature}°C</output></span>
          <input type="range" aria-label="Water temperature" min={season.min} max={season.max} step="1" value={temperature} onChange={(event) => changeTemperature(Number(event.target.value))} />
          <small>Cooler {season.min}°C <b /> Warmer {season.max}°C</small>
        </label>
        <div className="season-control">
          <span>Choose a season</span>
          <div>
            {turtleSeasons.map((item) => (
              <button type="button" key={item.id} className={seasonId === item.id ? "selected" : ""} aria-pressed={seasonId === item.id} onClick={() => changeSeason(item.id)}><strong>{item.name}</strong><small>{item.note}</small></button>
            ))}
          </div>
        </div>
        <div className="food-control">
          <span>Choose what the turtle eats</span>
          <div>
            {turtleFoods.map((item) => (
              <button type="button" key={item.id} className={foodId === item.id ? "selected" : ""} aria-pressed={foodId === item.id} onClick={() => changeFood(item.id)}>{item.name}</button>
            ))}
          </div>
        </div>
      </div>

      <p className="feeding-season-note">Selecting a season sets its example water temperature; use the slider to explore that season&apos;s range. These illustrate a coast with strong seasonal cooling. Actual temperatures depend on location. Below 10°C, sea turtles can become dangerously weak and inactive through <a href="https://www.fisheries.noaa.gov/national/marine-life-distress/cold-stunning-and-sea-turtles-frequently-asked-questions" target="_blank" rel="noreferrer">cold-stunning</a>.</p>
      <div className="feeding-readout" aria-live="polite">
        <article><span>Food selected</span><strong>{food.name}</strong><em>{food.scientific}</em><p>{food.meal}</p></article>
        <article><span>How it eats</span><strong>{noFood ? "Search for a new patch" : "Beak, bite, and tear"}</strong><p>{food.method}</p></article>
        <article><span>Habitat conditions</span><strong>{season.scene}</strong><p>{activityLabel}. {diveTime}. Sea turtles are ectotherms, so the surrounding water affects their body temperature and activity.</p></article>
      </div>
    </section>
  );
}

export default function Home() {
  const account = useAccount();
  const [accountSettings,setAccountSettings]=useState(false);
  const [myLearning,setMyLearning]=useState(false);
  const [studentPanel, setStudentPanel] = useState(false);
  const {page,search}=useSiteNavigation();
  const [initialLesson]=useState(()=>findLibraryLesson(new URLSearchParams(window.location.search).get('lesson')));
  const [selected, setSelected] = useState<Subject | null>(()=>subjects.find(subject=>subject.id===initialLesson?.subjectId)||null);
  const [currentTopic, setCurrentTopic] = useState<number | null>(()=>initialLesson?.topic??null);
  const [libraryUnit,setLibraryUnit]=useState<number|null>(()=>initialLesson?.unit??null);
  const [windSpeed, setWindSpeed] = useState(10);
  const [shelfAngle, setShelfAngle] = useState(1.5);
  const [nutrients, setNutrients] = useState(5.8);
  const measurement = upwellingData.find((row) => row.wind === windSpeed && row.shelf === shelfAngle) ?? upwellingData.reduce((closest, row) => {
    const rowDistance = Math.abs(row.wind - windSpeed) / 40 + Math.abs(row.shelf - shelfAngle) / 2.5;
    const closestDistance = Math.abs(closest.wind - windSpeed) / 40 + Math.abs(closest.shelf - shelfAngle) / 2.5;
    return rowDistance < closestDistance ? row : closest;
  });
  const planktonCount = Math.round(measurement.plankton * (nutrients / measurement.nutrients));
  const planktonStep = Math.floor(planktonCount / 10000);
  const bloomScale = Math.min(1.08, 0.48 + Math.log1p(planktonStep) * 0.065);
  const visibleMinerals = Math.max(2, Math.round((nutrients / 75) * mineralParticles.length));
  const shelfVisualAngle = 10 + ((shelfAngle - 0.5) / 2.5) * 45;
  const hillShoulder = Math.max(40, 82 - shelfVisualAngle);
  const hillTop = Math.max(12, 38 - Math.round(shelfVisualAngle / 3));
  function openLibrary(selection:LibrarySelection){
    const subject=subjects.find(item=>item.id===selection.subjectId);
    if(!subject)return;
    setSelected(subject);setCurrentTopic(selection.topic??null);setLibraryUnit(selection.unit??null);
    navigateSite('/');
  }
  const returnToLibrary=useCallback(()=>{setSelected(null);setCurrentTopic(null);setLibraryUnit(null);navigateSite('/');},[]);
  useEffect(()=>{if(page==='sign-in'||page==='sign-up')navigateSite(`/${lessonQuery(search)}`,{replace:true});},[page,search]);

  useEffect(()=>{window.scrollTo({top:0,left:0,behavior:"instant"});},[selected?.id,currentTopic]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") returnToLibrary(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected,returnToLibrary]);

  const activeLesson=libraryGroups.flatMap(group=>group.lessons).find(lesson=>lesson.subjectId===selected?.id&&(!('topic' in lesson)||lesson.topic===currentTopic)&&(!('unit' in lesson)||lesson.unit===libraryUnit));
  const activeChapter=chapterForLesson(activeLesson?.id);
  return (
    myLearning ? <main className="site-shell"><MyLearning onClose={()=>setMyLearning(false)}/></main> : accountSettings ? <main className="site-shell"><AccountSettings onClose={()=>setAccountSettings(false)}/></main> : studentPanel && account?.user.role === 'owner' ? <StudentAccounts onClose={()=>setStudentPanel(false)} /> : <main className="site-shell library-site">
      <SiteHeader page={page} onLearn={returnToLibrary} accountTools={account&&<div className="account-header-tools"><span>{account.user.username}</span>{account.user.role==='owner'&&<><span className="owner-badge">Owner</span><button type="button" onClick={()=>setStudentPanel(true)}>Student accounts</button></>}<button type="button" onClick={()=>setMyLearning(true)}>My progress</button><button type="button" onClick={()=>setAccountSettings(true)}>Account settings</button><button type="button" onClick={account.signOut}>Sign out</button></div>}/>


      {page==='about'||page==='contact' ? (
        <SiteInformation page={page} onLearn={returnToLibrary}/>
      ) : !selected ? (
        <CourseLibrary onOpen={openLibrary} signedIn/>
      ) : selected.id === "introduction" ? (
        <CourseIntroduction onBack={returnToLibrary} onCurrents={()=>openLibrary({subjectId:"currents",topic:-1})} onQuiz={()=>{setSelected(subjects.find(s=>s.id==="sunlight")!);setCurrentTopic(5);}} onTank={()=>{setSelected(subjects.find(s=>s.id==="sunlight")!);setCurrentTopic(4);}}/>
      ) : selected.id === "polar" ? (
        <PolarUnits key={`polar-${libraryUnit}`} initialUnit={libraryUnit} onBack={returnToLibrary}/>
      ) : selected.id === "twilight" ? (
        <TwilightUnits key={`twilight-${libraryUnit}`} initialUnit={libraryUnit} onBack={returnToLibrary}/>
      ) : selected.id === "currents" && currentTopic === -1 ? (
        <OceanCurrentsIntroduction onBack={returnToLibrary}/>
      ) : selected.id === "currents" && currentTopic === 4 ? (
        <EnsoUnit onBack={returnToLibrary} />
      ) : selected.id === "currents" && currentTopic === null ? (
        <section className="currents-index" aria-labelledby="currents-title">
          <button className="back-button" onClick={returnToLibrary}><span>←</span> Main page</button>
          <div className="currents-heading">
            <p className="eyebrow">Chapter introduction · Five connected topics</p>
            <h1 id="currents-title">{oceanCurrentsChapterTitle}</h1>
          </div>
          <figure className="field-guide-overview currents-overview">
            <img src="/assets/field-guide-v2/ocean-surface-currents.webp" width="1536" height="1024" alt="Illustrated world map of surface currents, with clockwise northern subtropical gyres, counterclockwise southern subtropical gyres, and an eastward current around Antarctica." decoding="async"/>
            <figcaption><span>Surface circulation · Illustrated atlas</span><h2>Water on the move.</h2><p>Coral and teal trace warmer and cooler surface pathways. These broad loops are simplified; explore each lesson below to learn what drives them.</p></figcaption>
          </figure>
          <div className="current-card-grid">
            <button className="current-subject-card" onClick={()=>setCurrentTopic(-1)}>
              <span className="card-number">Start here</span>
              <div className="current-card-art has-topic-image" aria-hidden="true"><img src="/assets/field-guide-v2/ocean-surface-currents.webp" alt=""/></div>
              <div className="card-copy"><span>Chapter introduction</span><h2>Introduction to ocean currents</h2><p>Discover how currents support life and how warming changes their connections.</p></div>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </button>
            {currentTopics.map((topic, index) => (
              <button className={`current-subject-card topic-${index + 1}`} key={topic} onClick={() => setCurrentTopic(index)}>
                <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="current-card-art has-topic-image" aria-hidden="true">
                  {index === 0 ? (
                    <img src="/assets/upwelling-side-view.png" alt="" />
                  ) : index === 1 ? (
                    <img src="/assets/field-guide-v2/global-conveyor-belt.webp" alt="" />
                  ) : index === 2 ? (
                    <img src="/assets/coriolis-effect-illustration.png" alt="" />
                  ) : index === 4 ? (
                    <img src="/assets/field-guide-v2/el-nino-pacific.webp" alt="" />
                  ) : (
                    <img src="/assets/ekman-transport-illustration.png" alt="" />
                  )}
                </div>
                <div className="card-copy"><span>{oceanCurrentsChapterTitle}</span><h2>{topic}</h2><p>Click to reveal this topic.</p></div>
                <span className="card-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
      ) : selected.id === "sunlight" && currentTopic === null ? (
        <section className="currents-index sunlight-index" aria-labelledby="sunlight-title">
          <button className="back-button" onClick={returnToLibrary}><span>←</span> Main page</button>
          <div className="currents-heading">
            <p className="eyebrow">{sunlightChapterTitle} · Choose a unit</p>
            <h1 id="sunlight-title">{sunlightChapterTitle}</h1>
          </div>
          <div className="current-card-grid sunlight-card-grid">
            {sunlightUnits.map((unit, index) => (
              <button className={`current-subject-card sunlight-topic-${Number(unit.topic) + 1}`} key={unit.id} onClick={() => setCurrentTopic(unit.topic!)}>
                <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="current-card-art sunlight-topic-art has-topic-image" aria-hidden="true">
                  <img src={unit.image} alt=""/>
                </div>
                <div className="card-copy"><span>{unit.tag}</span><h2>{unit.title}</h2><p>Click to reveal this topic.</p></div>
                <span className="card-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className={`subject-detail ${selected.tone} ${selected.id === "currents" && currentTopic === 0 ? "upwelling-layout" : ""} ${selected.id === "currents" && currentTopic === 1 ? "conveyor-layout" : ""} ${selected.id === "currents" && currentTopic === 2 ? "coriolis-layout" : ""} ${selected.id === "currents" && currentTopic === 3 ? "ekman-layout" : ""} ${(selected.id === "sunlight" || selected.id === "sharks") ? "sunlight-topic-layout" : ""}`} aria-labelledby="detail-title">
          <button className="back-button" onClick={returnToLibrary}><span>←</span> Main page</button>
          <div className={`detail-copy ${selected.id === "currents" ? "currents-copy" : ""}`}>
            <div className="detail-meta"><span>{String(activeChapter?.number??selected.number).padStart(2,"0")} · Ocean subject</span><span>{selected.depth}</span></div>
            {selected.id === "currents" ? (
              <>
                <p className="eyebrow">{lessonChapterLabel(activeLesson?.id)}</p>
                <h1 id="detail-title">{currentTopics[currentTopic as number]}</h1>
                {currentTopic === 0 ? (
                  <LessonReading key="upwelling" lessonId="upwelling" />
                ) : currentTopic === 1 ? (
                  <LessonReading key="conveyor" lessonId="conveyor" />
                ) : currentTopic === 2 ? (
                  <LessonReading key="coriolis" lessonId="coriolis" />
                ) : (
                  <LessonReading key="ekman" lessonId="ekman" />
                )}
              </>
            ) : selected.id === "sunlight" ? (
              <>
                <p className="eyebrow">{lessonChapterLabel(activeLesson?.id)}</p>
                <h1 id="detail-title">{activeLesson?.title}</h1>
                {currentTopic === 10 ? <EcologyLesson lessonId="kelp" /> : currentTopic === 9 ? <CoralsLesson /> : currentTopic === 7 ? <CnidarianLesson lessonId="cnidaria" /> : currentTopic === 8 ? <CnidarianLesson lessonId="anemones" /> : currentTopic === 6 ? <CephalopodsLesson /> : currentTopic === 5 ? <SchoolsOfFishLesson /> : currentTopic === 4 ? <PlanktonLesson /> : currentTopic === 3 ? <CommonCuttlefishLesson /> : currentTopic === 2 ? <GreatWhiteSharkLesson /> : currentTopic === 0 ? (
                  <>
                  <section className="sunlight-reef-hero" aria-label="Breaking waves above a shallow coral reef in the sunlight zone">
                    <div>
                      <span>Sunlight-zone habitat</span>
                      <h2>Where sunlight meets the living ocean</h2>
                      <p>Light, waves, and warm shallow water power a reef community filled with producers, grazers, and predators.</p>
                    </div>
                  </section>
                  <LessonReading key="sunlight" lessonId="sunlight" />
                  <SunlightZoneLab />
                  </>
                ) : (
                  <>
                  <section className="turtle-feeding-hero" aria-label="Green sea turtle grazing in a sunlit seagrass meadow">
                    <div>
                      <span>Feeding habitat</span>
                      <h2>A living lawn beneath the sea</h2>
                      <p>Adult green turtles graze through shallow seagrass meadows, clipping blades with their strong beaks and encouraging tender new growth.</p>
                    </div>
                  </section>
                  <LessonReading key="turtle" lessonId="turtle" />
                  <TurtleFeedingLab />
                  <TurtleQuiz />
                  </>
                )}
              </>
            ) : selected.id === "sharks" ? (
              <>
                <p className="eyebrow">{lessonChapterLabel("sharks")}</p>
                <h1 id="detail-title">Introduction to sharks</h1>
                <SharksLesson />
              </>
            ) : (
              <>
                <p className="eyebrow">{lessonChapterLabel(activeLesson?.id)}</p>
                <h1 id="detail-title">{selected.animal}</h1>
                <p className="scientific">{selected.scientific}</p>
                <LessonReading key={selected.id} lessonId={selected.id as "twilight" | "midnight" | "general"} />
              </>
            )}
          </div>
          <div className={`detail-visual ${selected.general ? "has-image" : ""} ${selected.id === "currents" && currentTopic === 1 ? "has-topic-map" : ""}`}>
            {selected.general ? (
              <img src="/assets/ocean-depths-slide.png" alt="Complete scientific illustration of ocean depth zones" />
            ) : selected.id === "currents" && currentTopic === 1 ? (
              <>
                <figure className="field-guide-overview conveyor-overview">
                  <img src="/assets/field-guide-v2/global-conveyor-belt.webp" width="1536" height="1024" alt="Conceptual world map of overturning circulation: coral upper-ocean water flows toward the North Atlantic, while blue deep water moves south and branches into the Indian and Pacific oceans." loading="lazy" decoding="async"/>
                  <figcaption><span>Surface to deep sea · Illustrated atlas</span><h2>One ocean, connected at depth.</h2><p>Coral shows the upper-ocean return; blue shows deeper pathways. This simplified illustration introduces the circulation. Use the moving map below to follow its stages.</p></figcaption>
                </figure>
                <ConveyorBeltLab /><ConveyorBeltQuiz />
              </>
            ) : selected.id === "currents" && currentTopic === 0 ? (
              <>
              <section className="upwelling-simulator" aria-labelledby="simulator-title">
                <div className="simulator-heading">
                  <span>Interactive field model</span>
                  <h2 id="simulator-title">Build an upwelling event</h2>
                  <p>Adjust the conditions and watch the estimated phytoplankton population respond.</p>
                </div>

                <div className="ocean-model" aria-hidden="true">
                  <div className="sun-disc" />
                  <div className="horizon-line" />
                  <div className="wind-stream"><span>→</span><span>→</span><span>→</span></div>
                  <div className="surface-flow-arrow"><span>←</span><small>warm surface water</small></div>
                  <div className="plankton-bloom" style={{ transform: `scale(${bloomScale})` }}>
                    <strong>Plankton bloom</strong>
                  </div>
                  <div className="deep-current-arrow"><span>Upwelling</span></div>
                  <div className="mineral-stream">
                    {mineralParticles.slice(0, visibleMinerals).map((particle, index) => (
                      <span key={`${particle.label}-${index}`} style={{ left: particle.left, bottom: particle.bottom, animationDelay: particle.delay, animationDuration: particle.duration, "--drift": particle.drift, "--rise": particle.rise } as CSSProperties}>{particle.label}</span>
                    ))}
                  </div>
                  <div className="coastal-hill" style={{ clipPath: `polygon(26% 100%, 43% 91%, 61% ${hillShoulder}%, 78% 34%, 100% ${hillTop}%, 100% 100%)` }} />
                </div>

                <div className="simulator-bottom">
                  <div className="simulator-controls">
                    <label>
                      <span>Ocean wind speed <output>{windSpeed} knots</output></span>
                      <input type="range" min="5" max="45" step="5" value={windSpeed} onChange={(event) => setWindSpeed(Number(event.target.value))} />
                    </label>
                    <label>
                      <span>Continental shelf angle <output>{shelfAngle}°</output></span>
                      <input type="range" min="0.5" max="3" step="0.5" value={shelfAngle} onChange={(event) => setShelfAngle(Number(event.target.value))} />
                    </label>
                    <label>
                      <span>Nutrient level <output>{nutrients} µmol/L</output></span>
                      <input type="range" min="0.5" max="75" step="0.5" value={nutrients} onChange={(event) => setNutrients(Number(event.target.value))} />
                    </label>
                  </div>
                  <div className="plankton-result" aria-live="polite">
                    <span>Estimated phytoplankton</span>
                    <strong>{planktonCount.toLocaleString()}</strong>
                    <small>cells / mL</small>
                  </div>
                </div>
              </section>
              <LessonQuiz lessonId="upwelling" title="Upwelling quiz"/>
              </>
            ) : selected.id === "currents" && currentTopic === 2 ? (
              <>
                <figure className="topic-illustration">
                  <img src="/assets/coriolis-effect-illustration.png" alt="Scientific illustration of Earth's rotation and curving ocean currents in the Northern and Southern Hemispheres" />
                  <figcaption><span>Illustrated field guide</span><h2>Rotation bends the path</h2><p>Moving water deflects to the right of its direction of travel in the Northern Hemisphere and to the left in the Southern Hemisphere.</p></figcaption>
                </figure>
                <CoriolisGlobe />
                <CoriolisQuiz />
              </>
            ) : selected.id === "currents" ? (
              <>
              <EkmanCoastalDiagram />
              <figure className="topic-illustration">
                <img src="/assets/ekman-transport-illustration.png" alt="Cutaway illustration of wind over the ocean and current directions turning with depth in an Ekman spiral" />
                <figcaption><span>Northern Hemisphere · idealized model</span><h2>Wind above. Turning water below.</h2><p>Each deeper layer moves more slowly and turns farther to the right. The combined Ekman transport is 90° to the right of the wind in the Northern Hemisphere.</p></figcaption>
              </figure>
              </>
            ) : (
              <div className="large-placeholder"><span>{selected.tone === "current" ? "↝" : selected.tone === "sunlight" ? "☼" : selected.tone === "twilight" ? "◐" : "✦"}</span><p>Animal image placeholder</p><small>{selected.animal}</small></div>
            )}
            <div className="visual-label"><span>Subject {selected.number}</span><p>{selected.title}</p></div>
          </div>
        </section>
      )}

      <SiteFooter onLearn={returnToLibrary}/>
    </main>
  );
}
