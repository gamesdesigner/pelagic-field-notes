"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import * as THREE from "three";

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

type QuizQuestion = {
  prompt: string;
  answer: string;
  options?: string[];
};

const subjects: Subject[] = [
  {
    id: "currents",
    number: "01",
    title: "Ocean Currents",
    short: "The moving pathways that connect every ocean basin.",
    depth: "Global circulation",
    animal: "Ocean Currents",
    scientific: "Three connected systems",
    description: "ABCDE",
    fact: "ABCDE",
    tone: "current",
  },
  {
    id: "sunlight",
    number: "02",
    title: "Marine Life in Sunlight",
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
    number: "03",
    title: "Marine Life in Twilight",
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
  {
    id: "general",
    number: "05",
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

const currentTopics = ["Upwelling", "Global Conveyor Belt", "Coriolis Effect", "Wind, Rotation, and the Moving Ocean"];
const sunlightTopics = ["General Marine Life in the Sun", "Green Sea Turtle"];

const upwellingQuiz: QuizQuestion[] = [
  { prompt: "What causes moving ocean water to deflect as Earth rotates?", answer: "The Coriolis Effect", options: ["The Coriolis Effect", "Marine snow", "Brine rejection", "The thermocline"] },
  { prompt: "In which direction is moving water deflected in the Northern Hemisphere?", answer: "To the right", options: ["To the right", "To the left", "Straight downward", "Toward the equator"] },
  { prompt: "What is the net movement of surface water at a 90-degree angle to the wind called?", answer: "Ekman Transport", options: ["Ekman Transport", "Tidal mixing", "Brine rejection", "Downwelling"] },
  { prompt: "During coastal upwelling, where does warm surface water move?", answer: "Away from the coast", options: ["Away from the coast", "Down the continental shelf", "Toward the seafloor", "Into a river"] },
  { prompt: "What rises to replace the surface water pushed offshore?", answer: "Cold, nutrient-rich deep water", options: ["Cold, nutrient-rich deep water", "Warm, nutrient-poor water", "Fresh river water", "Melting sea ice"] },
  { prompt: "What is the sunlit upper layer of the ocean called?", answer: "The photic zone", options: ["The photic zone", "The abyssal zone", "The benthic zone", "The trench zone"] },
  { prompt: "What name is given to organic material that sinks through the ocean?", answer: "Marine snow", options: ["Marine snow", "Sea foam", "Brine", "Coastal fog"] },
  { prompt: "What breaks down dead organisms and waste in the deep ocean?", answer: "Deep-sea bacteria", options: ["Deep-sea bacteria", "Ocean winds", "Sunlight", "Coral reefs"] },
  { prompt: "Nitrates are especially important for making which materials in marine plants?", answer: "Proteins and nucleic acids", options: ["Proteins and nucleic acids", "Salt and sand", "Calcium and shells", "Oxygen bubbles"] },
  { prompt: "Phosphates are important for which cellular job?", answer: "Energy transfer", options: ["Energy transfer", "Changing tides", "Producing salt", "Deflecting currents"] },
  { prompt: "Which microscopic organisms use silicates to build glass-like shells?", answer: "Diatoms", options: ["Diatoms", "Jellyfish", "Whales", "Sea turtles"] },
  { prompt: "What is a rapid increase in phytoplankton called?", answer: "An algal bloom", options: ["An algal bloom", "A spring tide", "A rain shadow", "A brine pool"] },
  { prompt: "Which organisms form the foundational base of the marine food web?", answer: "Phytoplankton", options: ["Phytoplankton", "Sharks", "Whales", "Seabirds"] },
  { prompt: "Spell the process in which deep ocean water rises toward the surface.", answer: "upwelling" },
  { prompt: "Spell the general name for tiny organisms that drift in ocean currents.", answer: "plankton" },
];

const coriolisQuiz: QuizQuestion[] = [
  { prompt: "What causes the Coriolis effect?", answer: "Earth's rotation", options: ["Earth's rotation", "The Moon's gravity", "Ocean salinity", "Solar heating"] },
  { prompt: "Which way are moving objects deflected in the Northern Hemisphere?", answer: "To the right", options: ["To the right", "To the left", "Straight upward", "Toward the equator"] },
  { prompt: "Which way are moving objects deflected in the Southern Hemisphere?", answer: "To the left", options: ["To the left", "To the right", "Toward the North Pole", "They are not deflected"] },
  { prompt: "Where is the Coriolis effect weakest?", answer: "At the equator", options: ["At the equator", "At the poles", "At 60° latitude", "It is equally strong everywhere"] },
  { prompt: "How do Northern Hemisphere hurricanes usually rotate?", answer: "Counterclockwise", options: ["Counterclockwise", "Clockwise", "East to west only", "They do not rotate"] },
  { prompt: "Spell the name of the apparent deflection caused by Earth's rotation.", answer: "coriolis" },
];

const sunlightQuiz: QuizQuestion[] = [
  { prompt: "Which body part lets a dolphin breathe at the ocean surface?", answer: "Blowhole", options: ["Blowhole", "Dorsal fin", "Gill cover", "Tail fluke"] },
  { prompt: "What is the hard upper shell of a green sea turtle called?", answer: "Carapace", options: ["Carapace", "Bell", "Rostrum", "Operculum"] },
  { prompt: "Which part forms the rounded top of a moon jelly?", answer: "Bell", options: ["Bell", "Oral arm", "Tentacle", "Gonad"] },
  { prompt: "Which fin helps stabilize a bluefin tuna along the top of its body?", answer: "Dorsal fin", options: ["Dorsal fin", "Pectoral fin", "Tail fin", "Gill cover"] },
  { prompt: "Which organisms use sunlight to form the base of many ocean food webs?", answer: "Phytoplankton", options: ["Phytoplankton", "Dolphins", "Sea turtles", "Tuna"] },
  { prompt: "Spell the word for a turtle's hard upper shell.", answer: "carapace" },
];

const turtleQuiz: QuizQuestion[] = [
  { prompt: "What do most adult green sea turtles mainly eat?", answer: "Seagrasses and algae", options: ["Seagrasses and algae", "Tuna and squid", "Coral skeletons", "Deep-sea bacteria"] },
  { prompt: "How does a green sea turtle get oxygen?", answer: "It breathes air with lungs", options: ["It breathes air with lungs", "It uses gills", "It absorbs oxygen through its shell", "It gets oxygen from seagrass"] },
  { prompt: "Which body parts provide most of a green turtle's swimming power?", answer: "Front flippers", options: ["Front flippers", "Carapace scutes", "Rear claws", "Beak"] },
  { prompt: "Where do female green sea turtles lay their eggs?", answer: "On sandy beaches", options: ["On sandy beaches", "Inside seagrass beds", "On coral reefs", "In the open ocean"] },
  { prompt: "How can green turtle grazing help a seagrass meadow?", answer: "It encourages fresh growth", options: ["It encourages fresh growth", "It removes all sunlight", "It turns grass into coral", "It makes the water saltier"] },
  { prompt: "Spell the name of the underwater plant meadow where adult green turtles often feed.", answer: "seagrass" },
];

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
    speedLabel: "Slow drifter",
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
    duration: "22s",
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

const normalizeQuizAnswer = (answer: string) => answer.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

const rotateQuizOptions = (options: string[], questionIndex: number) => {
  const shift = (questionIndex * 3 + 1) % options.length;
  return [...options.slice(shift), ...options.slice(0, shift)];
};

const spellingDistance = (entered: string, expected: string) => {
  const rows = Array.from({ length: expected.length + 1 }, (_, index) => index);
  for (let enteredIndex = 1; enteredIndex <= entered.length; enteredIndex += 1) {
    let diagonal = rows[0];
    rows[0] = enteredIndex;
    for (let expectedIndex = 1; expectedIndex <= expected.length; expectedIndex += 1) {
      const previousRow = rows[expectedIndex];
      rows[expectedIndex] = Math.min(
        rows[expectedIndex] + 1,
        rows[expectedIndex - 1] + 1,
        diagonal + (entered[enteredIndex - 1] === expected[expectedIndex - 1] ? 0 : 1),
      );
      diagonal = previousRow;
    }
  }
  return rows[expected.length];
};

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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const complete = questionIndex >= coriolisQuiz.length;
  const question = coriolisQuiz[Math.min(questionIndex, coriolisQuiz.length - 1)];

  const submitAnswer = () => {
    if (!answer || submitted || complete) return;
    const enteredAnswer = normalizeQuizAnswer(answer);
    const expectedAnswer = normalizeQuizAnswer(question.answer);
    const isCorrect = question.options
      ? enteredAnswer === expectedAnswer
      : spellingDistance(enteredAnswer, expectedAnswer) <= 2;
    setWasCorrect(isCorrect);
    setSubmitted(true);
    if (isCorrect) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => value + 1);
    setAnswer("");
    setSubmitted(false);
    setWasCorrect(false);
  };

  const restart = () => {
    setQuestionIndex(0);
    setAnswer("");
    setSubmitted(false);
    setWasCorrect(false);
    setScore(0);
  };

  return (
    <section className="upwelling-quiz coriolis-quiz" aria-labelledby="coriolis-quiz-title">
      <div className="quiz-shell">
        <div className="quiz-header">
          <div>
            <span>Knowledge check</span>
            <h2 id="coriolis-quiz-title">Coriolis effect quiz</h2>
          </div>
          <strong>{complete ? "Complete" : `Question ${questionIndex + 1} of ${coriolisQuiz.length}`}</strong>
        </div>
        <div className="quiz-progress" aria-hidden="true">
          <i style={{ width: `${(Math.min(questionIndex + (submitted ? 1 : 0), coriolisQuiz.length) / coriolisQuiz.length) * 100}%` }} />
        </div>

        {complete ? (
          <div className="quiz-finish" aria-live="polite">
            <span>Quiz complete</span>
            <strong>{score} / {coriolisQuiz.length}</strong>
            <p>{score === coriolisQuiz.length ? "Perfect score—you understand how Earth's rotation changes motion." : "Nice work. Try it again to strengthen the parts you missed."}</p>
            <button type="button" onClick={restart}>Try the quiz again</button>
          </div>
        ) : (
          <div className="quiz-question">
            <p className="quiz-kind">{question.options ? "Four-choice question" : "Spell the word"}</p>
            <h3>{question.prompt}</h3>

            {question.options ? (
              <div className="quiz-options">
                {rotateQuizOptions(question.options, questionIndex).map((option, index) => (
                  <button
                    type="button"
                    key={option}
                    disabled={submitted}
                    onClick={() => setAnswer(option)}
                    className={`quiz-option ${answer === option ? "selected" : ""} ${submitted && option === question.answer ? "correct" : ""} ${submitted && answer === option && option !== question.answer ? "incorrect" : ""}`}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <label className="spelling-answer">
                <span>Your spelling (capitalization does not matter)</span>
                <input
                  type="text"
                  value={answer}
                  disabled={submitted}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Type your answer"
                  onChange={(event) => setAnswer(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") submitAnswer(); }}
                />
              </label>
            )}

            {submitted && (
              <p className={`quiz-feedback ${wasCorrect ? "correct" : "incorrect"}`} aria-live="polite">
                {wasCorrect ? "Correct!" : <>Not quite. The correct answer is <strong>{question.answer}</strong>.</>}
              </p>
            )}

            <div className="quiz-actions">
              <span>Score: {score} / {questionIndex + (submitted ? 1 : 0)}</span>
              {!submitted ? (
                <button type="button" disabled={!answer} onClick={submitAnswer}>Check answer</button>
              ) : (
                <button type="button" onClick={nextQuestion}>{questionIndex === coriolisQuiz.length - 1 ? "See results" : "Next question →"}</button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SunlightZoneLab() {
  const [selectedCreatureId, setSelectedCreatureId] = useState(sunlightCreatures[0].id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const selectedCreature = sunlightCreatures.find((creature) => creature.id === selectedCreatureId) ?? sunlightCreatures[0];
  const selectedAnatomy = sunlightAnatomy[selectedCreature.id];
  const complete = questionIndex >= sunlightQuiz.length;
  const question = sunlightQuiz[Math.min(questionIndex, sunlightQuiz.length - 1)];

  const submitAnswer = () => {
    if (!answer || submitted || complete) return;
    const enteredAnswer = normalizeQuizAnswer(answer);
    const expectedAnswer = normalizeQuizAnswer(question.answer);
    const isCorrect = question.options
      ? enteredAnswer === expectedAnswer
      : spellingDistance(enteredAnswer, expectedAnswer) <= 2;
    setWasCorrect(isCorrect);
    setSubmitted(true);
    if (isCorrect) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => value + 1);
    setAnswer("");
    setSubmitted(false);
    setWasCorrect(false);
  };

  const restart = () => {
    setQuestionIndex(0);
    setAnswer("");
    setSubmitted(false);
    setWasCorrect(false);
    setScore(0);
  };

  return (
    <>
      <section className="sunlight-lab" aria-labelledby="sunlight-lab-title">
        <div className="sunlight-lab-heading">
          <span>Interactive 2D ocean</span>
          <h2 id="sunlight-lab-title">Life from 0 to 200 metres</h2>
          <p>Select a moving creature to learn how it lives in the sunlight zone.</p>
          <div className="swim-key" aria-label="Creature movement key">
            <span><i className="slow" /> Slow or drifting</span>
            <span><i className="fast" /> Fast swimmer</span>
          </div>
        </div>

        <div className="sunlight-ocean" role="group" aria-label="A layered side view of the sunlight zone from the surface to 200 metres, with selectable marine animals">
          <div className="sunlight-sky"><i /></div>
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
                style={{ "--creature-y": `${12 + (instanceDepth / 200) * 74}%`, "--swim-duration": creature.duration, "--swim-delay": `${delay}s`, "--creature-scale": `${scale}` } as CSSProperties}
                aria-label={`${creature.name}, ${creature.speedLabel}, example depth ${instanceDepth} metres`}
                aria-pressed={selectedCreatureId === creature.id}
                onClick={() => setSelectedCreatureId(creature.id)}
              >
                <span className="creature-art" aria-hidden="true"><img className="creature-image" src={creature.image} alt="" /></span>
                {instance === 0 && <small>{creature.name}</small>}
              </button>
            );
          }))}

          <div className="creature-info" aria-live="polite">
            <span>{selectedCreature.speedLabel} · Example depth {selectedCreature.depth} m</span>
            <h3>{selectedCreature.name}</h3>
            <p>{selectedCreature.description}</p>
          </div>
          <div className="twilight-boundary">Twilight zone begins below 200 m</div>
        </div>
        <p className="creature-credit">Green sea turtle image: <a href="https://pngimg.com/image/24729" target="_blank" rel="noreferrer">PNGimg</a>, CC BY-NC 4.0. Other creature illustrations were created for this study guide.</p>
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

      <section className="upwelling-quiz sunlight-quiz" aria-labelledby="sunlight-quiz-title">
        <div className="quiz-shell">
          <div className="quiz-header">
            <div>
              <span>Knowledge check</span>
              <h2 id="sunlight-quiz-title">Sunlight-zone quiz</h2>
            </div>
            <strong>{complete ? "Complete" : `Question ${questionIndex + 1} of ${sunlightQuiz.length}`}</strong>
          </div>
          <div className="quiz-progress" aria-hidden="true">
            <i style={{ width: `${(Math.min(questionIndex + (submitted ? 1 : 0), sunlightQuiz.length) / sunlightQuiz.length) * 100}%` }} />
          </div>

          {complete ? (
            <div className="quiz-finish" aria-live="polite">
              <span>Quiz complete</span>
              <strong>{score} / {sunlightQuiz.length}</strong>
              <p>{score === sunlightQuiz.length ? "Perfect score—you know the sunlight zone." : "Nice work. Explore the creatures and try again to improve your score."}</p>
              <button type="button" onClick={restart}>Try the quiz again</button>
            </div>
          ) : (
            <div className="quiz-question">
              <p className="quiz-kind">{question.options ? "Four-choice question" : "Spell the word"}</p>
              <h3>{question.prompt}</h3>
              {question.options ? (
                <div className="quiz-options">
                  {rotateQuizOptions(question.options, questionIndex).map((option, index) => (
                    <button
                      type="button"
                      key={option}
                      disabled={submitted}
                      onClick={() => setAnswer(option)}
                      className={`quiz-option ${answer === option ? "selected" : ""} ${submitted && option === question.answer ? "correct" : ""} ${submitted && answer === option && option !== question.answer ? "incorrect" : ""}`}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <label className="spelling-answer">
                  <span>Your spelling (capitalization does not matter)</span>
                  <input
                    type="text"
                    value={answer}
                    disabled={submitted}
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Type your answer"
                    onChange={(event) => setAnswer(event.target.value)}
                    onKeyDown={(event) => { if (event.key === "Enter") submitAnswer(); }}
                  />
                </label>
              )}
              {submitted && (
                <p className={`quiz-feedback ${wasCorrect ? "correct" : "incorrect"}`} aria-live="polite">
                  {wasCorrect ? "Correct!" : <>Not quite. The correct answer is <strong>{question.answer}</strong>.</>}
                </p>
              )}
              <div className="quiz-actions">
                <span>Score: {score} / {questionIndex + (submitted ? 1 : 0)}</span>
                {!submitted ? (
                  <button type="button" disabled={!answer} onClick={submitAnswer}>Check answer</button>
                ) : (
                  <button type="button" onClick={nextQuestion}>{questionIndex === sunlightQuiz.length - 1 ? "See results" : "Next question →"}</button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function TurtleQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const complete = questionIndex >= turtleQuiz.length;
  const question = turtleQuiz[Math.min(questionIndex, turtleQuiz.length - 1)];

  const submitAnswer = () => {
    if (!answer || submitted || complete) return;
    const enteredAnswer = normalizeQuizAnswer(answer);
    const expectedAnswer = normalizeQuizAnswer(question.answer);
    const isCorrect = question.options
      ? enteredAnswer === expectedAnswer
      : spellingDistance(enteredAnswer, expectedAnswer) <= 2;
    setWasCorrect(isCorrect);
    setSubmitted(true);
    if (isCorrect) setScore((value) => value + 1);
  };

  const nextQuestion = () => {
    setQuestionIndex((value) => value + 1);
    setAnswer("");
    setSubmitted(false);
    setWasCorrect(false);
  };

  const restart = () => {
    setQuestionIndex(0);
    setAnswer("");
    setSubmitted(false);
    setWasCorrect(false);
    setScore(0);
  };

  return (
    <section className="upwelling-quiz turtle-quiz" aria-labelledby="turtle-quiz-title">
      <div className="quiz-shell">
        <div className="quiz-header">
          <div>
            <span>Knowledge check</span>
            <h2 id="turtle-quiz-title">Green sea turtle quiz</h2>
          </div>
          <strong>{complete ? "Complete" : `Question ${questionIndex + 1} of ${turtleQuiz.length}`}</strong>
        </div>
        <div className="quiz-progress" aria-hidden="true">
          <i style={{ width: `${(Math.min(questionIndex + (submitted ? 1 : 0), turtleQuiz.length) / turtleQuiz.length) * 100}%` }} />
        </div>
        {complete ? (
          <div className="quiz-finish" aria-live="polite">
            <span>Quiz complete</span>
            <strong>{score} / {turtleQuiz.length}</strong>
            <p>{score === turtleQuiz.length ? "Perfect score—you know the green sea turtle." : "Nice work. Review the feeding meadow and try again to improve your score."}</p>
            <button type="button" onClick={restart}>Try the quiz again</button>
          </div>
        ) : (
          <div className="quiz-question">
            <p className="quiz-kind">{question.options ? "Four-choice question" : "Spell the word"}</p>
            <h3>{question.prompt}</h3>
            {question.options ? (
              <div className="quiz-options">
                {rotateQuizOptions(question.options, questionIndex).map((option, index) => (
                  <button
                    type="button"
                    key={option}
                    disabled={submitted}
                    onClick={() => setAnswer(option)}
                    className={`quiz-option ${answer === option ? "selected" : ""} ${submitted && option === question.answer ? "correct" : ""} ${submitted && answer === option && option !== question.answer ? "incorrect" : ""}`}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <label className="spelling-answer">
                <span>Your spelling (capitalization does not matter)</span>
                <input
                  type="text"
                  value={answer}
                  disabled={submitted}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Type your answer"
                  onChange={(event) => setAnswer(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") submitAnswer(); }}
                />
              </label>
            )}
            {submitted && (
              <p className={`quiz-feedback ${wasCorrect ? "correct" : "incorrect"}`} aria-live="polite">
                {wasCorrect ? "Correct!" : <>Not quite. The correct answer is <strong>{question.answer}</strong>.</>}
              </p>
            )}
            <div className="quiz-actions">
              <span>Score: {score} / {questionIndex + (submitted ? 1 : 0)}</span>
              {!submitted ? (
                <button type="button" disabled={!answer} onClick={submitAnswer}>Check answer</button>
              ) : (
                <button type="button" onClick={nextQuestion}>{questionIndex === turtleQuiz.length - 1 ? "See results" : "Next question →"}</button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
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
    id: "algae",
    name: "Marine algae",
    scientific: "Multiple algal species",
    meal: "Soft algae growing on rocks and reefs",
    method: "The turtle uses the sharp edge of its toothless beak to scrape and clip algae from a firm surface.",
  },
];

function TurtleFeedingLab() {
  const [temperature, setTemperature] = useState(27);
  const [foodId, setFoodId] = useState(turtleFoods[0].id);
  const food = turtleFoods.find((item) => item.id === foodId) ?? turtleFoods[0];
  const activity = temperature < 21 ? 0.42 : temperature < 24 ? 0.68 : temperature <= 29 ? 1 : 0.76;
  const activityLabel = temperature < 21 ? "Sluggish in cool water" : temperature < 24 ? "Warming up" : temperature <= 29 ? "Active grazer" : "Slowing in very warm water";
  const diveTime = temperature < 21 ? "Long, low-energy rest" : temperature <= 29 ? "Regular feeding dive" : "More frequent recovery pauses";

  return (
    <section className="turtle-feeding-lab" aria-labelledby="turtle-feeding-title">
      <div className="feeding-lab-heading">
        <span>Interactive feeding event</span>
        <h2 id="turtle-feeding-title">Follow a green turtle&apos;s meal</h2>
        <p>Change the water temperature and choose its food. The turtle&apos;s movement and field notes respond to your choices.</p>
      </div>

      <div className="feeding-scene" role="img" aria-label="Green sea turtle grazing on a sunlit seagrass meadow">
        <div className="feeding-specimen-card">
          <span>Species</span>
          <strong>Green sea turtle</strong>
          <em>Chelonia mydas</em>
        </div>
        <div className="feeding-temperature-card">
          <span>Water temperature</span>
          <strong>{temperature}°C</strong>
          <small>{activityLabel}</small>
        </div>
      </div>

      <div className="feeding-controls">
        <label className="temperature-control">
          <span>Water temperature <output>{temperature}°C</output></span>
          <input type="range" min="18" max="32" step="1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
          <small>Cooler 18°C <b /> Warmer 32°C</small>
        </label>
        <div className="food-control">
          <span>Choose what the turtle eats</span>
          <div>
            {turtleFoods.map((item) => (
              <button type="button" key={item.id} className={foodId === item.id ? "selected" : ""} aria-pressed={foodId === item.id} onClick={() => setFoodId(item.id)}>{item.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="feeding-readout" aria-live="polite">
        <article><span>Food selected</span><strong>{food.name}</strong><em>{food.scientific}</em><p>{food.meal}</p></article>
        <article><span>How it eats</span><strong>Beak, bite, and tear</strong><p>{food.method}</p></article>
        <article><span>Current behavior</span><strong>{activityLabel}</strong><p>{diveTime}. Sea turtles are ectotherms, so the surrounding water affects their body temperature and activity.</p></article>
      </div>
    </section>
  );
}

export default function Home() {
  const [selected, setSelected] = useState<Subject | null>(null);
  const [currentTopic, setCurrentTopic] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState(10);
  const [shelfAngle, setShelfAngle] = useState(1.5);
  const [nutrients, setNutrients] = useState(5.8);
  const [warmWaterTemp, setWarmWaterTemp] = useState(27);
  const [northAtlanticTemp, setNorthAtlanticTemp] = useState(3);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizWasCorrect, setQuizWasCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

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
  const conveyorTemperatureDifference = warmWaterTemp - northAtlanticTemp;
  const conveyorSpeed = Math.max(8, Math.min(100, Math.round(((conveyorTemperatureDifference - 8) / 26) * 100)));
  const conveyorStatus = conveyorSpeed >= 70 ? "Fast" : conveyorSpeed >= 40 ? "Steady" : "Slow";
  const conveyorNeedle = -120 + conveyorSpeed * 2.4;
  const quizComplete = quizIndex >= upwellingQuiz.length;
  const currentQuizQuestion = upwellingQuiz[Math.min(quizIndex, upwellingQuiz.length - 1)];

  const submitQuizAnswer = () => {
    if (!quizAnswer || quizSubmitted || quizComplete) return;
    const enteredAnswer = normalizeQuizAnswer(quizAnswer);
    const expectedAnswer = normalizeQuizAnswer(currentQuizQuestion.answer);
    const isCorrect = currentQuizQuestion.options
      ? enteredAnswer === expectedAnswer
      : spellingDistance(enteredAnswer, expectedAnswer) <= 2;
    setQuizWasCorrect(isCorrect);
    setQuizSubmitted(true);
    if (isCorrect) setQuizScore((score) => score + 1);
  };

  const showNextQuizQuestion = () => {
    setQuizIndex((index) => index + 1);
    setQuizAnswer("");
    setQuizSubmitted(false);
    setQuizWasCorrect(false);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizAnswer("");
    setQuizSubmitted(false);
    setQuizWasCorrect(false);
    setQuizScore(0);
  };

  const openSubject = (subject: Subject) => {
    setSelected(subject);
    if (subject.id === "currents" || subject.id === "sunlight") setCurrentTopic(null);
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <main className="site-shell">
      <header className="site-header">
        <button className="brand" onClick={() => setSelected(null)} aria-label="Return to all subjects">
          <img src="/assets/marine-biology-class-logo-transparent.png" alt="Marine Biology Class" />
        </button>
      </header>

      {!selected ? (
        <section className="subject-index" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">Explore by subject</p>
            <h1 id="page-title">Choose a path<br /><em>through the ocean.</em></h1>
            <p className="intro">Study how water moves, then meet one remarkable animal from each layer of the sea.</p>
          </div>

          <div className="subject-grid">
            {subjects.filter((subject) => !subject.general).map((subject) => (
              <button className={`subject-card ${subject.tone}`} key={subject.id} onClick={() => openSubject(subject)}>
                <span className="card-number">{subject.number}</span>
                <div className={`card-placeholder ${subject.id === "currents" ? "has-subject-image" : ""}`} aria-hidden="true">
                  {subject.id === "currents" ? (
                    <img src="/assets/global-ocean-currents.png" alt="" />
                  ) : (
                    <><span>{subject.tone === "sunlight" ? "☼" : subject.tone === "twilight" ? "◐" : "✦"}</span><small>Image placeholder</small></>
                  )}
                </div>
                <div className="card-copy"><span>{subject.depth}</span><h2>{subject.title}</h2><p>{subject.short}</p></div>
                <span className="card-arrow">↗</span>
              </button>
            ))}
          </div>

          <button className="general-card" onClick={() => openSubject(subjects[4])}>
            <img src="/assets/ocean-depths-slide.png" alt="Ocean depth zones from the sunlit surface to the midnight zone" />
            <span className="general-overlay" />
            <span className="card-number">05</span>
            <span className="general-copy"><small>Complete field plate · 0–4,000 m</small><strong>The General Ocean</strong><em>See the whole water column</em></span>
            <span className="general-arrow">Explore <b>→</b></span>
          </button>
        </section>
      ) : selected.id === "currents" && currentTopic === null ? (
        <section className="currents-index" aria-labelledby="currents-title">
          <button className="back-button" onClick={() => setSelected(null)}><span>←</span> All subjects</button>
          <div className="currents-heading">
            <p className="eyebrow">Ocean Currents · Choose a topic</p>
            <h1 id="currents-title">Follow the<br /><em>moving ocean.</em></h1>
          </div>
          <div className="current-card-grid">
            {currentTopics.map((topic, index) => (
              <button className={`current-subject-card topic-${index + 1}`} key={topic} onClick={() => setCurrentTopic(index)}>
                <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                <div className={`current-card-art ${index < 2 ? "has-topic-image" : ""}`} aria-hidden="true">
                  {index === 0 ? (
                    <img src="/assets/upwelling-side-view.png" alt="" />
                  ) : index === 1 ? (
                    <img src="/assets/global-conveyor-belt.png?v=2" alt="" />
                  ) : (
                    <><span>{index === 2 ? "↻" : "↝"}</span><small>Study topic</small></>
                  )}
                </div>
                <div className="card-copy"><span>Ocean currents</span><h2>{topic}</h2><p>Click to reveal this topic.</p></div>
                <span className="card-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
      ) : selected.id === "sunlight" && currentTopic === null ? (
        <section className="currents-index sunlight-index" aria-labelledby="sunlight-title">
          <button className="back-button" onClick={() => setSelected(null)}><span>←</span> All subjects</button>
          <div className="currents-heading">
            <p className="eyebrow">Marine Life in Sunlight · Choose a topic</p>
            <h1 id="sunlight-title">Explore the<br /><em>sunlit ocean.</em></h1>
          </div>
          <div className="current-card-grid sunlight-card-grid">
            {sunlightTopics.map((topic, index) => (
              <button className={`current-subject-card sunlight-topic-${index + 1}`} key={topic} onClick={() => setCurrentTopic(index)}>
                <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="current-card-art sunlight-topic-art" aria-hidden="true">
                  <span>{index === 0 ? "☼" : "◡"}</span>
                  <small>{index === 0 ? "Life powered by sunlight" : "Featured animal"}</small>
                </div>
                <div className="card-copy"><span>Sunlight zone</span><h2>{topic}</h2><p>Click to reveal this topic.</p></div>
                <span className="card-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className={`subject-detail ${selected.tone} ${selected.id === "currents" && currentTopic === 0 ? "upwelling-layout" : ""} ${selected.id === "currents" && currentTopic === 1 ? "conveyor-layout" : ""} ${selected.id === "currents" && currentTopic === 2 ? "coriolis-layout" : ""} ${selected.id === "currents" && currentTopic === 3 ? "ekman-layout" : ""} ${selected.id === "sunlight" ? "sunlight-topic-layout" : ""}`} aria-labelledby="detail-title">
          <button className="back-button" onClick={() => selected.id === "currents" || selected.id === "sunlight" ? setCurrentTopic(null) : setSelected(null)}><span>←</span> {selected.id === "currents" ? "Ocean Currents" : selected.id === "sunlight" ? "Marine Life in Sunlight" : "All subjects"}</button>
          <div className={`detail-copy ${selected.id === "currents" ? "currents-copy" : ""}`}>
            <div className="detail-meta"><span>{selected.number} · Ocean subject</span><span>{selected.depth}</span></div>
            {selected.id === "currents" ? (
              <>
                <p className="eyebrow">Ocean Currents · Topic {Number(currentTopic) + 1}</p>
                <h1 id="detail-title">{currentTopics[currentTopic as number]}</h1>
                {currentTopic === 0 ? (
                  <article className="current-article" role="tabpanel">
                    <h2>The Physics of Moving Water</h2>
                    <p>In the open ocean, wind does not simply push water in a straight line. Because Earth rotates on its axis, moving objects are deflected across the globe. This phenomenon is known as the <strong>Coriolis Effect</strong>. In the Northern Hemisphere, water is deflected to the <strong>right</strong> of the wind&apos;s direction; in the Southern Hemisphere, it is deflected to the <strong>left</strong>.</p>
                    <p>When strong coastal winds blow parallel to a coastline, the Coriolis Effect—combined with friction between layers of water—creates a net movement of surface water away from the coast at a 90-degree angle. This structural bulk movement of water is called <strong>Ekman Transport</strong>. As the warm, sunlit surface water is systematically stripped away and pushed offshore, it leaves behind a physical void. To fill this space, dense, cold water from the deep ocean is drawn upward toward the sunlit surface layer. This process is called <strong>ocean upwelling</strong>.</p>

                    <h2>The Marine Conveyor of Nutrients</h2>
                    <p>The deep ocean is essentially a massive biological recycling bin. In the upper, sunlit layers of the ocean (the photic zone), marine organisms live, reproduce, and die. Waste products, decaying organic matter, and dead organisms constantly sink downward into the dark depths—a phenomenon known as <strong>marine snow</strong>.</p>
                    <p>Deep-sea bacteria decompose this material, breaking it down into basic inorganic chemical compounds. Because there is no sunlight in the deep ocean, photosynthetic plants cannot grow to consume these minerals. As a result, the deep ocean acts as a massive reservoir for critical, life-sustaining nutrients:</p>
                    <ul>
                      <li><strong>Nitrates (NO<sub>3</sub><sup>−</sup>):</strong> Essential for synthesizing proteins and nucleic acids in marine plants.</li>
                      <li><strong>Phosphates (PO<sub>4</sub><sup>3−</sup>):</strong> Required for cellular energy transfer and genetic structural building blocks.</li>
                      <li><strong>Silicates (SiO<sub>4</sub><sup>4−</sup>):</strong> Crucial for microscopic organisms like <strong>diatoms</strong>, which use silica to construct glass-like protective shells.</li>
                    </ul>
                    <p>When upwelling occurs, it acts like an ecological elevator, hoisting these concentrated nutrients up into the photic zone. Suddenly exposed to sunlight, microscopic marine plants called <strong>phytoplankton</strong> rapidly consume the nutrients, fueling explosive population growths known as <strong>algal blooms</strong>. These microscopic cells form the foundational base of the marine food web, instantly attracting zooplankton, small baitfish, and massive top-tier predators like whales, sharks, and commercial fish stocks.</p>
                  </article>
                ) : currentTopic === 1 ? (
                  <article className="current-article conveyor-article" role="tabpanel">
                    <h2>A Planet-Wide Current System</h2>
                    <p>Deep beneath the ocean&apos;s surface lies a massive current system moving more than 20 million tons of water every second (the equivalent of roughly 8,000 Olympic swimming pools). Formally called <strong>thermohaline circulation</strong>, this network is driven entirely by differences in water temperature (&quot;thermo&quot;) and saltiness (&quot;haline&quot;), which dictate seawater density. These forces set off a planet-wide loop that takes roughly 1,000 years to complete a single circuit.</p>
                    <p>The journey begins in the frigid North Atlantic Ocean near Greenland and Iceland. Intense polar winds chill the surface water, causing it to contract and become denser. Simultaneously, sea ice forms on the surface, leaving salt behind in a process known as <strong>brine rejection</strong>. This remaining unfrozen water becomes extraordinarily salty and cold. Heavy and packed tight, this dense water mass sinks rapidly toward the abyss, creating a downwelling zone known as <strong>North Atlantic Deep Water (NADW)</strong>.</p>

                    <h2>From the Atlantic to the Global Ocean</h2>
                    <p>Once the NADW hits the ocean floor, it begins a slow, southward crawl along the Atlantic basin. It flows past the equator, enters the South Atlantic, and hooks into the Antarctic Circumpolar Current. In this frozen southern ring, the current picks up additional cold, dense water from the Antarctic shelf, gaining further momentum.</p>
                    <p>From Antarctica, the deep current splits into two branches moving north into the Indian and Pacific Oceans. As these cold streams travel into warmer climates, they mix with less dense waters. Through a process called <strong>upwelling</strong>, the water warms, decreases in density, and rises back toward the surface. Now in the upper layers of the ocean, the water loops back toward the west and north, driven by winds and equatorial heat. It joins major surface currents like the <strong>Gulf Stream</strong>, carrying tropical heat northward across the Atlantic to replace the water constantly sinking near Greenland.</p>

                    <h2>Climate Regulation and Nutrient Distribution</h2>
                    <p>The global conveyor belt serves two functions vital to keeping the planet habitable: <strong>climate regulation</strong> and <strong>nutrient distribution</strong>.</p>
                    <p>First, it acts as a planetary thermostat. By moving massive quantities of warm water from the equator to high latitudes, it moderates global climates. The heat released by the Gulf Stream in the North Atlantic keeps Western Europe relatively mild, preventing places like the United Kingdom from experiencing the brutally sub-zero winters seen at identical latitudes in Canada.</p>
                    <p>Second, the conveyor belt supports the marine food web. The deep ocean floor acts as a repository for organic matter, rich in nitrates, phosphates, and decayed organisms. When upwelling currents lift this deep water back to the surface, they bring these rich nutrients into the sunlit zone. This sparks massive blooms of phytoplankton—microscopic organisms that serve as the fundamental base for all marine life, from small fish to blue whales.</p>

                    <h2>A Vulnerable Engine</h2>
                    <p>Today, marine scientists are watching the North Atlantic with growing concern. Human-driven climate change is causing global temperatures to rise, leading to rapid melting of the Greenland Ice Sheet and Arctic sea ice. This melting sends massive torrents of fresh water flooding into the North Atlantic downwelling zone.</p>
                    <p>Because fresh water lacks salt, it is significantly less dense than salty ocean water. Furthermore, rising temperatures mean the surface water is not cooling down as intensely as it used to. This combination creates a buoyant fresh water cap on the ocean surface. If the surface water is too light to sink, the downwelling engine stalls. Without the heavy sinking water to push the deep current forward, the entire global conveyor belt could slow down or stop completely. A collapse of this system could trigger rapid climate shifts, causing plunging temperatures in Europe, altered global rainfall patterns, and a collapse of marine ecosystems due to starved nutrient cycles.</p>
                  </article>
                ) : currentTopic === 2 ? (
                  <article className="current-article coriolis-article" role="tabpanel">
                    <h2>Section 1: The Coriolis Effect</h2>
                    <p>The <strong>Coriolis effect</strong> is the apparent deflection of freely moving objects caused entirely by the rotation of the Earth. When winds, ocean currents, airplanes, or projectiles travel long distances across the globe, their paths appear to curve relative to the ground below. This phenomenon occurs because the observer is standing on a rotating planet, which creates the illusion of a sideways force acting on the moving object. In reality, there is no physical force pushing the object sideways; the deflection is a result of looking at a straight path from a spinning frame of reference.</p>

                    <h2>Section 2: Physical Mechanism</h2>
                    <p>The underlying cause of this effect is the difference in rotational speed at different latitudes on a spherical planet. The Earth completes one full rotation every twenty-four hours on its axis. Because a sphere has the largest circumference at its middle, the ground at the equator must travel much faster than the ground near the poles to finish a rotation in the same amount of time. At the equator, the Earth spins eastward at approximately one thousand miles per hour, whereas at mid-latitudes the speed decreases to roughly seven hundred miles per hour, eventually dropping to zero at the exact poles. When an object or air mass moves away from the equator toward the north or south, its inertia preserves its initial fast eastward momentum. As it enters areas where the ground beneath it moves slower, the object outpaces the Earth&apos;s rotation and moves ahead of the surface, resulting in an eastward curve.</p>

                    <h2>Section 3: Geographic Rules</h2>
                    <p>The direction of the deflection depends entirely on the hemisphere of the planet. In the <strong>Northern Hemisphere</strong>, freely moving objects always deflect to the <strong>right</strong> of their intended direction of travel. This rightward curve applies whether the object travels north, south, east, or west. In the <strong>Southern Hemisphere</strong>, freely moving objects always deflect to the <strong>left</strong> of their intended direction of travel. The Coriolis effect is exactly zero at the equator because moving strictly east or west along the center of the sphere involves no change in the radius of rotation.</p>

                    <h2>Section 4: Atmospheric and Technical Impacts</h2>
                    <p>This phenomenon directly dictates the structural behavior of large weather systems, ocean gyres, and long-range navigation. Hurricanes develop around zones of low atmospheric pressure where air converges from all directions. When surrounding air rushes toward the center in the Northern Hemisphere, the rightward deflection forces the wind to spin counterclockwise around the low-pressure system. Conversely, in the Southern Hemisphere, the leftward deflection causes hurricanes to spin clockwise. In addition to weather systems, long-range aerospace and marine navigation must account for this shift. Commercial flight paths and military guidance computer systems use mathematical corrections to offset the Earth&apos;s rotation so that aircraft do not drift hundreds of miles away from their destinations.</p>
                  </article>
                ) : (
                  <article className="current-article ekman-article" role="tabpanel">
                    <h2>Wind at the Surface</h2>
                    <p>When wind blows across the ocean, the ripples and waves at the surface appear to travel with it. The water itself behaves differently. Wind transfers energy to the uppermost layer through friction, but Earth&apos;s rotation turns that moving water away from the wind&apos;s path. The combined movement of the wind-driven upper ocean is called <strong>Ekman transport</strong>.</p>
                    <p>When the motion of the entire wind-influenced layer is added together, the net transport is about <strong>90 degrees to the right of the wind in the Northern Hemisphere</strong> and <strong>90 degrees to the left in the Southern Hemisphere</strong>. This sideways transport helps shape ocean circulation, climate, and biological productivity.</p>

                    <h2>Nansen&apos;s Clue and Ekman&apos;s Model</h2>
                    <p>During the late nineteenth century, Norwegian explorer <strong>Fridtjof Nansen</strong> noticed an important pattern while the research ship <em>Fram</em> was trapped in Arctic ice. The wind pushed the ice pack at an angle rather than directly downwind. Nansen suspected that Earth&apos;s rotation was responsible.</p>
                    <p>Swedish oceanographer <strong>Vagn Walfrid Ekman</strong> developed the mathematical explanation and published it in 1905. His model showed how wind, friction, and the Coriolis effect create a chain reaction through the upper water column.</p>

                    <h2>Friction Meets Rotation</h2>
                    <p>The wind first grips the ocean&apos;s surface and transfers kinetic energy to the water. The Coriolis effect then deflects this moving layer—to the right in the Northern Hemisphere and to the left in the Southern Hemisphere. In an idealized deep ocean, the surface current travels roughly 45 degrees away from the wind.</p>
                    <p>The moving surface layer drags the water beneath it. Each deeper layer receives less energy, moves more slowly, and turns farther from the wind than the layer above. The main pattern is:</p>
                    <ul>
                      <li>The surface layer moves fastest and at an angle to the wind.</li>
                      <li>Each deeper layer moves more slowly because friction dissipates energy.</li>
                      <li>Each layer is rotated farther by the Coriolis effect.</li>
                    </ul>

                    <h2>The Ekman Spiral</h2>
                    <p>If oceanographers draw an arrow for the speed and direction of every layer, the arrows form a turning, shrinking pattern called the <strong>Ekman spiral</strong>. The idealized spiral may extend through roughly the upper 100 meters, although its real depth changes with wind strength, turbulence, stratification, and location.</p>
                    <p>Individual layers travel in different directions, but their movements combine into one net transport at a right angle to the wind. Ekman transport describes this integrated motion of the full wind-driven layer, not the path of one surface wave or one parcel of water.</p>

                    <h2>Coastal Upwelling</h2>
                    <p>Along the California coast, a southward wind can drive Northern Hemisphere Ekman transport offshore. As surface water moves away from land, cold, nutrient-rich water rises from below to replace it. This process is called <strong>coastal upwelling</strong>.</p>
                    <p>The rising water carries nitrates, phosphates, and other nutrients into the sunlit zone. Phytoplankton use these nutrients to grow, supporting food webs that include zooplankton, fish, seabirds, and whales. Upwelling regions occupy only a small portion of the ocean but support some of its most productive fisheries.</p>

                    <h2>Coastal Downwelling</h2>
                    <p>If the wind reverses, Ekman transport can push surface water toward the coast. Water piles up along the shoreline and is forced downward. This is <strong>coastal downwelling</strong>.</p>
                    <p>Downwelling does not bring deep nutrients into the sunlit zone, so it usually produces less surface biological growth than upwelling. However, it performs another important job by carrying oxygen-rich surface water into deeper parts of the ocean.</p>
                  </article>
                )}
              </>
            ) : selected.id === "sunlight" ? (
              <>
                <p className="eyebrow">Marine Life in Sunlight · Topic {Number(currentTopic) + 1}</p>
                <h1 id="detail-title">{sunlightTopics[currentTopic as number]}</h1>
                {currentTopic === 0 ? (
                  <>
                  <article className="current-article sunlight-article" role="tabpanel">
                    <h2>The Ocean&apos;s Brightest Layer</h2>
                    <p>The sunlight zone, also called the <strong>epipelagic zone</strong>, extends from the surface to roughly 200 metres deep. Enough light reaches this layer for photosynthesis, making it the most productive and familiar part of the open ocean. Its exact depth changes with water clarity, weather, season, and location.</p>
                    <p>Although this zone is only a thin layer compared with the full depth of the sea, it contains most of the ocean&apos;s photosynthetic life. Warm temperatures, abundant light, and contact with the atmosphere create conditions that support plankton, fish, reptiles, seabirds, and marine mammals.</p>

                    <h2>Photosynthesis Begins the Food Web</h2>
                    <p>Microscopic organisms called <strong>phytoplankton</strong> use sunlight, carbon dioxide, and nutrients to make food. They form the base of most sunlit-ocean food webs and also release oxygen during photosynthesis.</p>
                    <p>Zooplankton graze on phytoplankton. Small fish and filter feeders consume the plankton, and larger predators—including tuna, sharks, dolphins, and seabirds—feed higher in the same connected web. In coastal areas, seagrasses, algae, mangroves, and coral-reef organisms add even more habitats and food sources.</p>

                    <h2>Life in Constant Motion</h2>
                    <p>Sunlit waters are energetic. Waves mix the surface, winds drive currents, and tides move water through coastal habitats. Many animals use these flows to migrate, find food, disperse young, or conserve energy.</p>
                    <p>Visibility also shapes survival. Some animals use silvery scales or transparent bodies to blend into bright water. Others are dark above and pale below—a pattern called <strong>countershading</strong> that makes them harder to see from either direction.</p>

                    <h2>Daily Visitors from the Deep</h2>
                    <p>The sunlight zone changes dramatically between day and night. After sunset, enormous numbers of animals rise from deeper water to feed near the surface. Before sunrise, many descend again to hide from visual predators. This daily vertical migration moves carbon and nutrients through the ocean.</p>

                    <h2>A Productive but Vulnerable Habitat</h2>
                    <p>Sunlit marine ecosystems are affected by warming water, pollution, overfishing, habitat damage, and changes in ocean chemistry. Protecting seagrass meadows, coral reefs, coastal wetlands, and open-ocean food webs helps preserve both marine biodiversity and the benefits people receive from the sea.</p>
                  </article>
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
                  <article className="current-article turtle-article" role="tabpanel">
                    <h2>A Reptile of Warm, Shallow Seas</h2>
                    <p>The <strong>green sea turtle</strong> (<em>Chelonia mydas</em>) lives in tropical and subtropical waters around the world. Adults are often found in sunlit coastal habitats such as seagrass meadows, lagoons, bays, and coral reefs. Their streamlined shells and powerful front flippers allow them to travel efficiently through the water.</p>
                    <p>Unlike fish, sea turtles breathe air. A green turtle must return to the surface for oxygen, although a resting turtle can remain underwater far longer than an actively swimming one. It also depends on sunlight-warmed water because, like other reptiles, it cannot regulate its body temperature internally in the same way a mammal can.</p>

                    <h2>From Omnivorous Young to Grazing Adults</h2>
                    <p>Young green turtles eat a mixed diet that may include small animals, algae, and other drifting food. As they mature, many become mainly herbivorous and graze on seagrasses and algae. This dietary shift is unusual among sea turtles.</p>
                    <p>Regular grazing clips seagrass blades and can encourage fresh growth. Healthy seagrass meadows provide shelter and feeding grounds for fish, crustaceans, and many other organisms, while also trapping sediment and storing carbon. The turtle therefore influences an entire habitat as it feeds.</p>

                    <h2>Long-Distance Navigation</h2>
                    <p>Green turtles may migrate hundreds or thousands of kilometres between feeding areas and nesting beaches. They use several environmental clues to navigate, including the position of the sun, waves, chemical signals, and Earth&apos;s magnetic field.</p>
                    <p>A female often returns to the same broad region where she hatched. After crawling onto a sandy beach, she digs a nest above the high-tide line and lays a clutch of eggs. Weeks later, the hatchlings emerge and race toward the brightest open horizon, which under natural conditions leads them toward the sea.</p>

                    <h2>Growing Up Is Dangerous</h2>
                    <p>Hatchlings face birds, crabs, fish, and other predators. Older turtles must survive storms, sharks, disease, and long migrations. Human activity adds further dangers, including accidental capture in fishing gear, boat strikes, plastic pollution, artificial lighting near nesting beaches, and the loss of seagrass habitat.</p>

                    <h2>Why Green Turtles Matter</h2>
                    <p>Green turtles connect beaches, reefs, seagrass meadows, and the open ocean during their lives. By grazing, migrating, and transporting nutrients, they help link several parts of the sunlit marine ecosystem.</p>
                    <p>Protecting nesting beaches, reducing plastic waste, using turtle-safe fishing methods, and conserving coastal feeding grounds all improve their chance of survival. A healthy green turtle population is also a sign that the surrounding coastal ecosystem is functioning well.</p>
                  </article>
                  <TurtleFeedingLab />
                  <TurtleQuiz />
                  </>
                )}
              </>
            ) : (
              <>
                <p className="eyebrow">Featured animal</p>
                <h1 id="detail-title">{selected.animal}</h1>
                <p className="scientific">{selected.scientific}</p>
                <p className="animal-description">{selected.description}</p>
                <aside className="field-note"><span>✦</span><div><strong>Field note</strong><p>{selected.fact}</p></div></aside>
              </>
            )}
          </div>
          <div className={`detail-visual ${selected.general ? "has-image" : ""} ${selected.id === "currents" && currentTopic === 1 ? "has-topic-map" : ""}`}>
            {selected.general ? (
              <img src="/assets/ocean-depths-slide.png" alt="Complete scientific illustration of ocean depth zones" />
            ) : selected.id === "currents" && currentTopic === 1 ? (
              <section className="conveyor-simulator" aria-labelledby="conveyor-model-title">
                <img src="/assets/global-conveyor-belt.png?v=2" alt="Global conveyor belt map showing warm surface currents in red and cold currents in blue" />
                <div className="conveyor-temperature-panel">
                  <div className="conveyor-panel-heading">
                    <span>Interactive temperature model</span>
                    <h2 id="conveyor-model-title">Temperature drives the belt</h2>
                    <p>A larger temperature difference makes cold North Atlantic water denser, so it sinks more strongly and speeds up the conveyor.</p>
                  </div>
                  <div className="conveyor-controls">
                    <label>
                      <span>Warm surface water <output>{warmWaterTemp}°C</output></span>
                      <input type="range" min="20" max="32" step="1" value={warmWaterTemp} onChange={(event) => setWarmWaterTemp(Number(event.target.value))} />
                    </label>
                    <label>
                      <span>North Atlantic water <output>{northAtlanticTemp}°C</output></span>
                      <input type="range" min="-2" max="12" step="1" value={northAtlanticTemp} onChange={(event) => setNorthAtlanticTemp(Number(event.target.value))} />
                    </label>
                  </div>
                  <div className="conveyor-speed" aria-live="polite">
                    <div className="speed-gauge" style={{ "--gauge-rotation": `${conveyorNeedle}deg` } as CSSProperties}>
                      <i />
                      <b />
                    </div>
                    <div><span>Conveyor speed</span><strong>{conveyorStatus}</strong><small>{conveyorSpeed}% strength</small></div>
                  </div>
                </div>
              </section>
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
              <section className="upwelling-quiz" aria-labelledby="upwelling-quiz-title">
                <div className="quiz-shell">
                  <div className="quiz-header">
                    <div>
                      <span>Knowledge check</span>
                      <h2 id="upwelling-quiz-title">Upwelling quiz</h2>
                    </div>
                    <strong>{quizComplete ? "Complete" : `Question ${quizIndex + 1} of ${upwellingQuiz.length}`}</strong>
                  </div>
                  <div className="quiz-progress" aria-hidden="true">
                    <i style={{ width: `${(Math.min(quizIndex + (quizSubmitted ? 1 : 0), upwellingQuiz.length) / upwellingQuiz.length) * 100}%` }} />
                  </div>

                  {quizComplete ? (
                    <div className="quiz-finish" aria-live="polite">
                      <span>Quiz complete</span>
                      <strong>{quizScore} / {upwellingQuiz.length}</strong>
                      <p>{quizScore === upwellingQuiz.length ? "Perfect score—you know how an upwelling event works." : "Nice work. Try it again to strengthen the parts you missed."}</p>
                      <button type="button" onClick={restartQuiz}>Try the quiz again</button>
                    </div>
                  ) : (
                    <div className="quiz-question">
                      <p className="quiz-kind">{currentQuizQuestion.options ? "Four-choice question" : "Spelling question"}</p>
                      <h3>{currentQuizQuestion.prompt}</h3>

                      {currentQuizQuestion.options ? (
                        <div className="quiz-options">
                          {rotateQuizOptions(currentQuizQuestion.options, quizIndex).map((option, index) => (
                            <button
                              type="button"
                              key={option}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswer(option)}
                              className={`quiz-option ${quizAnswer === option ? "selected" : ""} ${quizSubmitted && option === currentQuizQuestion.answer ? "correct" : ""} ${quizSubmitted && quizAnswer === option && option !== currentQuizQuestion.answer ? "incorrect" : ""}`}
                            >
                              <span>{String.fromCharCode(65 + index)}</span>
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <label className="spelling-answer">
                          <span>Your spelling</span>
                          <input
                            type="text"
                            value={quizAnswer}
                            disabled={quizSubmitted}
                            autoComplete="off"
                            spellCheck="false"
                            placeholder="Type your answer"
                            onChange={(event) => setQuizAnswer(event.target.value)}
                            onKeyDown={(event) => { if (event.key === "Enter") submitQuizAnswer(); }}
                          />
                        </label>
                      )}

                      {quizSubmitted && (
                        <p className={`quiz-feedback ${quizWasCorrect ? "correct" : "incorrect"}`} aria-live="polite">
                          {quizWasCorrect ? "Correct!" : <>Not quite. The correct answer is <strong>{currentQuizQuestion.answer}</strong>.</>}
                        </p>
                      )}

                      <div className="quiz-actions">
                        <span>Score: {quizScore} / {quizIndex + (quizSubmitted ? 1 : 0)}</span>
                        {!quizSubmitted ? (
                          <button type="button" disabled={!quizAnswer} onClick={submitQuizAnswer}>Check answer</button>
                        ) : (
                          <button type="button" onClick={showNextQuizQuestion}>{quizIndex === upwellingQuiz.length - 1 ? "See results" : "Next question →"}</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
              </>
            ) : selected.id === "currents" && currentTopic === 2 ? (
              <>
                <CoriolisGlobe />
                <CoriolisQuiz />
              </>
            ) : selected.id === "currents" ? (
              <div className="large-placeholder currents-placeholder"><span>↝</span><p>{currentTopics[currentTopic as number]}</p><small>{currentTopic === 0 ? "Nutrients rise · life follows" : "ABCDE"}</small></div>
            ) : (
              <div className="large-placeholder"><span>{selected.tone === "current" ? "↝" : selected.tone === "sunlight" ? "☼" : selected.tone === "twilight" ? "◐" : "✦"}</span><p>Animal image placeholder</p><small>{selected.animal}</small></div>
            )}
            <div className="visual-label"><span>Subject {selected.number}</span><p>{selected.title}</p></div>
          </div>
        </section>
      )}
    </main>
  );
}
