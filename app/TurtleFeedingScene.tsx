"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Props = { foodId: string; seasonId: string; temperature: number; noFood: boolean };

export default function TurtleFeedingScene({ foodId, seasonId, temperature, noFood }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLSpanElement>(null);
  const timeline = useRef<HTMLElement>(null);
  const seekRequest = useRef<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [stillFrame, setStillFrame] = useState("");
  const playback = useRef(true);

  useEffect(() => { playback.current = playing; }, [playing]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setPlaying(false);
    const change = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false); };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (!canvas.current) return;
    const element = canvas.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: element, antialias: true, alpha: false, preserveDrawingBuffer: true }); }
    catch { setUnavailable(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#287f92");
    scene.fog = new THREE.FogExp2("#287f92", .035);
    const camera = new THREE.PerspectiveCamera(37, 1, .1, 70);
    const target = new THREE.Vector3(.35, 1.1, 0);
    scene.add(new THREE.HemisphereLight("#b8f0eb", "#8c7856", 1.8));
    const sun = new THREE.DirectionalLight("#fff1be", 2.8);
    sun.position.set(-3, 8, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 });
    sun.shadow.bias = -.0008;
    scene.add(sun);
    const rim = new THREE.DirectionalLight("#6fc5e5", 1.5);
    rim.position.set(3, 3, -5); scene.add(rim);

    const random = (index: number) => { const n = Math.sin(index * 93.17 + 2.72) * 41731.34; return n - Math.floor(n); };
    const textures: THREE.Texture[] = [];
    function skinTexture() {
      const surface = document.createElement("canvas"); surface.width = 512; surface.height = 256;
      const ctx = surface.getContext("2d")!;
      ctx.fillStyle = "#c0b786"; ctx.fillRect(0, 0, 512, 256);
      for (let row = -1; row < 11; row++) for (let col = -1; col < 22; col++) {
        const x = col * 26 + (row % 2) * 13, y = row * 27;
        ctx.beginPath();
        for (let side = 0; side < 6; side++) { const a = side * Math.PI / 3; const px = x + Math.cos(a) * 12, py = y + Math.sin(a) * 12; if (!side) ctx.moveTo(px,py); else ctx.lineTo(px,py); }
        ctx.closePath(); ctx.fillStyle = ["#405743", "#596446", "#6b7150", "#384e3c"][Math.floor(random(row * 60 + col) * 4)]; ctx.fill();
      }
      const texture = new THREE.CanvasTexture(surface); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture); return texture;
    }
    const skin = new THREE.MeshStandardMaterial({ map:skinTexture(), roughness:.73, color:"#c5c998", side:THREE.DoubleSide });
    const underside = new THREE.MeshStandardMaterial({ color:"#b6b489", roughness:.85 });
    const shellMaterial = new THREE.MeshStandardMaterial({ color:"#555332", roughness:.6, metalness:0 });
    const beak = new THREE.MeshStandardMaterial({ color:"#b8b58d", roughness:.65 });
    const sphere = new THREE.SphereGeometry(1, 40, 24);
    const turtle = new THREE.Group(); scene.add(turtle);
    function ellipsoid(parent: THREE.Object3D, material: THREE.Material, position: number[], scale: number[]) {
      const mesh = new THREE.Mesh(sphere, material); mesh.position.set(...position as [number,number,number]); mesh.scale.set(...scale as [number,number,number]); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    }
    ellipsoid(turtle, underside, [0,-.05,0], [1.62,.28,1.02]);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1,64,32,0,Math.PI*2,0,Math.PI/2),shellMaterial);
    shell.scale.set(1.66,.74,1.08); shell.position.y=.03; shell.castShadow=true; shell.receiveShadow=true; turtle.add(shell);
    const seam = new THREE.MeshStandardMaterial({color:"#887d50",roughness:.7});
    const shellY = (x:number,z:number) => .04 + .74 * Math.sqrt(Math.max(.01,1-(x/1.66)**2-(z/1.08)**2));
    const borderVertices:number[] = [], veinVertices:number[] = [];
    function scute(cx:number,cz:number,rx:number,rz:number,index:number) {
      const vertices:number[] = [], indices:number[] = [];
      vertices.push(cx,shellY(cx,cz)+.008,cz);
      const corners=[[-.8,-1],[.8,-1],[1,-.8],[1,.8],[.8,1],[-.8,1],[-1,.8],[-1,-.8]];
      for(let ring=1;ring<=4;ring++) for(let side=0;side<8;side++) for(let sample=0;sample<4;sample++) {
        const a=corners[side],b=corners[(side+1)%8],t=sample/4;
        let x=cx+rx*(a[0]*(1-t)+b[0]*t)*ring/4,z=cz+rz*(a[1]*(1-t)+b[1]*t)*ring/4;
        const radius=Math.hypot(x/1.66,z/1.08);if(radius>.965){x*=.965/radius;z*=.965/radius;}
        vertices.push(x,shellY(x,z)+.012,z);
      }
      for(let i=0;i<32;i++) indices.push(0,1+i,1+(i+1)%32);
      for(let ring=0;ring<3;ring++) for(let i=0;i<32;i++){const a=1+ring*32+i,b=1+ring*32+(i+1)%32,c=a+32,d=b+32;indices.push(a,c,b,b,c,d);}
      const geometry=new THREE.BufferGeometry(); geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3)); geometry.setIndex(indices); geometry.computeVertexNormals();
      const material=new THREE.MeshStandardMaterial({color:["#5d5434","#666140","#515739","#6e5935"][index%4],roughness:.62,side:THREE.DoubleSide});
      const panel=new THREE.Mesh(geometry,material); panel.receiveShadow=true; turtle.add(panel);
      for(let i=0;i<32;i++) for(const k of [97+i,97+(i+1)%32]) borderVertices.push(vertices[k*3],vertices[k*3+1]+.003,vertices[k*3+2]);
      for(let ray=0;ray<9;ray++) {
        const angle=ray*Math.PI*2/9;
        const x=cx+Math.cos(angle)*rx*.76,z=cz+Math.sin(angle)*rz*.76;
        veinVertices.push(cx,shellY(cx,cz)+.02,cz,x,shellY(x,z)+.021,z);
      }
    }
    [-1.12,-.57,0,.57,1.12].forEach((x,i)=>scute(x,0,.274,.34,i));
    [-.99,-.33,.33,.99].forEach((x,i)=>{scute(x,.64,.32,.29,i+5);scute(x,-.64,.32,.29,i+9);});
    const borders=new THREE.BufferGeometry();borders.setAttribute("position",new THREE.Float32BufferAttribute(borderVertices,3));turtle.add(new THREE.LineSegments(borders,new THREE.LineBasicMaterial({color:"#353f29"})));
    const veins=new THREE.BufferGeometry();veins.setAttribute("position",new THREE.Float32BufferAttribute(veinVertices,3));turtle.add(new THREE.LineSegments(veins,new THREE.LineBasicMaterial({color:"#a39859",transparent:true,opacity:.25})));
    for(let i=0;i<24;i++) {
      const a=i*Math.PI*2/24;
      const edge=ellipsoid(turtle,seam,[1.62*Math.cos(a),.055,1.04*Math.sin(a)],[.16,.035,.1]);edge.rotation.y=-a;
    }
    const tail=ellipsoid(turtle,skin,[-1.72,-.13,0],[.33,.065,.085]); tail.rotation.z=.1;

    function flipper(x:number,z:number,front:boolean) {
      const rig=new THREE.Group(); rig.position.set(x,-.09,z); turtle.add(rig);
      const shape=new THREE.Shape();
      if(front) { shape.moveTo(0,0);shape.bezierCurveTo(.38,.08,.76,.58,.86,1.42);shape.bezierCurveTo(.55,1.28,-.25,.71,-.19,.16);shape.quadraticCurveTo(-.12,-.05,0,0); }
      else { shape.moveTo(0,0);shape.bezierCurveTo(.25,-.03,.46,.25,.37,.73);shape.bezierCurveTo(.04,.71,-.28,.39,-.15,.1);shape.closePath(); }
      const geometry=new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelThickness:.045,bevelSize:.04,bevelSegments:3,steps:1,curveSegments:16});
      geometry.rotateX(Math.PI/2); geometry.scale(1,1,z>0?1:-1);
      const mesh=new THREE.Mesh(geometry,skin); mesh.castShadow=true;rig.add(mesh);
      return {rig,front,side:Math.sign(z)};
    }
    const flippers=[flipper(.95,.74,true),flipper(.95,-.74,true),flipper(-1.22,.68,false),flipper(-1.22,-.68,false)];
    const neck=new THREE.Group(); neck.position.set(1.32,-.025,0); turtle.add(neck);
    ellipsoid(neck,skin,[.25,0,0],[.52,.23,.26]);
    ellipsoid(neck,skin,[.78,.065,0],[.48,.29,.31]);
    ellipsoid(neck,beak,[1.08,-.02,0],[.22,.17,.275]);
    const jaw=new THREE.Group(); jaw.position.set(.63,-.13,0);neck.add(jaw);
    ellipsoid(jaw,underside,[.28,-.045,0],[.38,.085,.245]);
    ellipsoid(jaw,beak,[.48,-.02,0],[.16,.057,.245]);
    const mouthInside=ellipsoid(neck,new THREE.MeshStandardMaterial({color:"#28332b",roughness:1}),[1.08,-.145,0],[.17,.018,.23]);
    for(const side of [-1,1]) {
      const iris=ellipsoid(neck,new THREE.MeshStandardMaterial({color:"#a6a254",roughness:.3}),[.89,.16,side*.267],[.098,.095,.042]);
      iris.rotation.y=side*.17;
      ellipsoid(neck,new THREE.MeshPhysicalMaterial({color:"#101b15",roughness:.05,clearcoat:1}),[.9,.17,side*.299],[.052,.062,.017]);
      ellipsoid(neck,new THREE.MeshBasicMaterial({color:"#e5f7ed"}),[.916,.192,side*.315],[.012,.014,.009]);
      ellipsoid(neck,new THREE.MeshStandardMaterial({color:"#4b573f"}),[1.22,.092,side*.12],[.018,.015,.016]);
    }
    const heldFood=new THREE.Group(); heldFood.position.set(1.18,-.15,0);neck.add(heldFood);
    const bladeShape=new THREE.Shape();bladeShape.moveTo(0,0);bladeShape.quadraticCurveTo(.12,.22,.035,.6);bladeShape.quadraticCurveTo(-.05,.26,0,0);
    const heldLeaf=new THREE.Mesh(new THREE.ShapeGeometry(bladeShape),new THREE.MeshStandardMaterial({color:foodId==="red-algae"?"#ab6570":"#78a745",side:THREE.DoubleSide,roughness:.8}));
    heldLeaf.rotation.z=Math.PI;heldFood.add(heldLeaf);

    const sandGeometry=new THREE.PlaneGeometry(32,26,70,60); sandGeometry.rotateX(-Math.PI/2);
    const sandPos=sandGeometry.attributes.position;
    for(let i=0;i<sandPos.count;i++) sandPos.setY(i,Math.sin(sandPos.getX(i)*2.5+Math.cos(sandPos.getZ(i)*1.5))*.025);
    sandGeometry.computeVertexNormals();
    const sand=new THREE.Mesh(sandGeometry,new THREE.MeshStandardMaterial({color:"#b5aa7d",roughness:1}));sand.receiveShadow=true;scene.add(sand);
    const instanceTransform=new THREE.Object3D();
    const pebbles=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshStandardMaterial({color:"#9b9872",roughness:1}),55);
    for(let i=0;i<55;i++) {instanceTransform.position.set((random(i+80)-.5)*18,.025,(random(i+90)-.5)*12);instanceTransform.scale.set(.035+random(i)*.08,.03,.055);instanceTransform.rotation.set(0,0,0);instanceTransform.updateMatrix();pebbles.setMatrixAt(i,instanceTransform.matrix);}scene.add(pebbles);
    const plants:{length:number;baseX:number;baseZ:number;index:number;target:boolean}[]=[];
    const plantMaterial=new THREE.MeshStandardMaterial({color:foodId==="red-algae"?"#974d60":"#597d36",roughness:.8,side:THREE.DoubleSide});
    const grassTime={value:0};
    plantMaterial.onBeforeCompile=shader=>{shader.uniforms.grassTime=grassTime;shader.vertexShader="uniform float grassTime;\n"+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace("#include <begin_vertex>","#include <begin_vertex>\ntransformed.x += sin(grassTime + position.y * 2.0) * position.y * position.y * 0.06; transformed.z += cos(grassTime + position.y) * position.y * position.y * 0.025;");};
    const plantCount=noFood||foodId==="juvenile-food"?0:Math.round(720*({spring:.85,summer:1,autumn:.65,winter:.42}[seasonId]??1));
    const broad=foodId==="sea-lettuce"?.2:foodId==="manatee-grass"?.012:foodId==="shoal-grass"?.018:.04;
    const plantShape=new THREE.Shape();plantShape.moveTo(-broad,0);plantShape.bezierCurveTo(-broad,.4,.13-broad,.8,.09,1);plantShape.bezierCurveTo(.13+broad,.75,broad,.3,broad,0);plantShape.closePath();
    const meadow=new THREE.InstancedMesh(new THREE.ShapeGeometry(plantShape,10),plantMaterial,plantCount+(plantCount?12:0));meadow.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(meadow);
    for(let i=0;i<plantCount+ (plantCount?12:0);i++) {
      const feedingPatch=i>=plantCount;
      const x=feedingPatch?2.65+(i-plantCount-6)*.055:(random(i+200)-.5)*18;
      const z=feedingPatch?(i%3-1)*.055:(random(i+450)-.5)*12;
      const length=feedingPatch?.57:(foodId==="eelgrass"?1.05:foodId==="shoal-grass"?.32:.65)*(.5+random(i+750));
      plants.push({length,baseX:x,baseZ:z,index:i,target:feedingPatch});
    }
    const prey:THREE.Mesh[]=[];
    if(foodId==="juvenile-food") for(let i=0;i<14;i++) { const jelly=ellipsoid(scene,new THREE.MeshStandardMaterial({color:"#c7e8da",transparent:true,opacity:.55,roughness:.2}),[(random(i)-.5)*10,.5+random(i+17)*2,(random(i+31)-.5)*5],[.13,.08,.13]);prey.push(jelly); }
    const flecks=new THREE.Group();scene.add(flecks);
    const fleckMaterial=new THREE.MeshStandardMaterial({color:"#74924e",roughness:1});
    for(let i=0;i<16;i++){ const piece=new THREE.Mesh(new THREE.PlaneGeometry(.025,.07),fleckMaterial);flecks.add(piece); }
    const particleGeometry=new THREE.BufferGeometry();const points=[];
    for(let i=0;i<100;i++) points.push((random(i+1000)-.5)*22,random(i+1300)*6,(random(i+1600)-.5)*15);
    particleGeometry.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
    const particles=new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:"#d5e9d9",size:.025,transparent:true,opacity:.38}));scene.add(particles);
    const lightRibbons:THREE.Mesh[]=[];
    for(let i=0;i<9;i++){const beam=new THREE.Mesh(new THREE.PlaneGeometry(.4,9),new THREE.MeshBasicMaterial({color:"#b8eee0",transparent:true,opacity:.035,depthWrite:false,side:THREE.DoubleSide}));beam.position.set((i-4)*2,4,-4);beam.rotation.z=-.22;scene.add(beam);lightRibbons.push(beam);}

    let elapsed=0, previous=performance.now(), frame=0, visible=true, lastStage="", lastRender=0, dirty=true;
    const smooth=(a:number,b:number,value:number)=>{const t=THREE.MathUtils.clamp((value-a)/(b-a),0,1);return t*t*(3-2*t);};
    const activity=THREE.MathUtils.clamp((temperature-17)/10,.3,1.15);
    const motion=temperature<10?.05:1;
    const foraging=!noFood && temperature>=21 && temperature<=30;
    const biteCenters=[6.6,10.6,14.6];
    const mouthWorld=new THREE.Vector3();
    function render(now:number){
      const dt=Math.min((now-previous)/1000,1);previous=now;
      if(playback.current && visible && !noFood)elapsed+=dt;
      const seeking=seekRequest.current!==null;
      if(seeking){elapsed=seekRequest.current!;seekRequest.current=null;dirty=true;}
      if(now-lastRender<1000/30 || ((!playback.current || noFood) && !dirty)){frame=requestAnimationFrame(render);return;}lastRender=now;dirty=false;
      const t=elapsed%20;
      let settled=smooth(2,4.8,t)*(1-smooth(16,19.5,t));
      let lower=0,open=0,pull=0,held=0,bits=0;
      biteCenters.forEach(center=>{
        const contact=smooth(center-.85,center-.18,t)*(1-smooth(center+.15,center+.85,t));
        lower=Math.max(lower,contact);open=Math.max(open,smooth(center-.55,center-.3,t)*(1-smooth(center-.13,center+.02,t)));
        pull=Math.max(pull,smooth(center+.04,center+.35,t)*(1-smooth(center+.55,center+.95,t)));
        held=Math.max(held,smooth(center-.07,center+.04,t)*(1-smooth(center+.45,center+.85,t)));
        bits=Math.max(bits,smooth(center+.15,center+.3,t)*(1-smooth(center+.6,center+1.15,t)));
      });
      if(!foraging){lower=0;settled=0;open=0;pull=0;held=0;bits=0;}
      turtle.position.set(-.35*Math.cos(t*Math.PI/10)*motion-pull*.1,1.52-settled*.23+Math.sin(t*Math.PI/10)*.04*motion,0);
      turtle.rotation.z=-.06-settled*.08-lower*.08+pull*.035;
      turtle.rotation.y=Math.sin(t*Math.PI/10)*.035*motion;
      neck.rotation.z=-lower*.3+pull*.12;
      neck.position.x=1.32+lower*.05-pull*.09;
      jaw.rotation.z=-open*.3;
      mouthInside.visible=open>.08;
      heldFood.visible=held>.1 && !noFood && foodId!=="juvenile-food";
      heldFood.scale.setScalar(Math.max(.05,held));heldFood.rotation.z=-pull*.45;
      flippers.forEach(({rig,front,side},i)=>{
        const swim=Math.sin(t*Math.PI*.6*activity+(i%2)*.35)*motion;
        rig.rotation.x=side*(front?.38+swim*.3*(1-settled*.8):.1+swim*.08);
        rig.rotation.y=side*(front?-.3+swim*.18*(1-settled*.7):.24+Math.sin(t*1.1)*.08*motion);
        rig.rotation.z=front?-.12+settled*.13:0;
      });
      const cropped=foraging?biteCenters.reduce((value,center)=>value+smooth(center+.02,center+.26,t),0):0;
      grassTime.value=t*Math.PI/10;
      plants.forEach(({index,target,length,baseX,baseZ},i)=>{instanceTransform.position.set(baseX,.025,baseZ);instanceTransform.rotation.set(0,random(index+890)*Math.PI,Math.sin(t*Math.PI/10+index*.61)*.12);instanceTransform.scale.set(1,length*(target?1-cropped*.17*(1-smooth(17.5,20,t)):1),1);instanceTransform.updateMatrix();meadow.setMatrixAt(i,instanceTransform.matrix);});meadow.instanceMatrix.needsUpdate=true;
      turtle.updateMatrixWorld(true);heldFood.getWorldPosition(mouthWorld);
      flecks.visible=bits>.02 && foodId!=="juvenile-food";
      flecks.children.forEach((piece,i)=>{piece.position.copy(mouthWorld);piece.position.x+=(random(i+1900)-.5)*bits*.55;piece.position.y-=bits*random(i+1950)*.4;piece.position.z+=(random(i+1990)-.5)*bits*.5;piece.rotation.set(t+i,i,t*.5);piece.scale.setScalar(bits);});
      prey.forEach((jelly,i)=>{jelly.position.y=.8+random(i+17)*1.5+Math.sin(t*Math.PI/10+i)*.15;});
      if(prey[0]){prey[0].position.set(2.65,.6,0).lerp(mouthWorld,held);prey[0].scale.setScalar(Math.max(.02,1-smooth(6.9,7.4,t))*.13);if(t>17)prey[0].scale.setScalar(smooth(17,20,t)*.13);}
      particles.rotation.y=Math.sin(t*Math.PI/10)*.025;
      lightRibbons.forEach((beam,i)=>{beam.position.x=(i-4)*2+Math.sin(t*Math.PI/10+i)*.16;});
      const label=temperature<10?"Cold-stunning risk — feeding stopped":noFood?"Resting over bare sand":!foraging?temperature<21?"Resting in cool water":"Resting in very warm water":foodId==="juvenile-food"?"Tracking drifting prey":!playback.current?"Paused":t<4.8?"Approach & settle":open>.1?"Open beak & grip":pull>.1?"Pull & swallow":lower>.2?"Lower head to the meadow":t>16?"Lift & glide":"Rest between bites";
      if(lastStage!==label){if(stage.current)stage.current.textContent=label;element.dataset.feedingStage=label;lastStage=label;}
      element.dataset.loopTime=t.toFixed(2);
      if(timeline.current)timeline.current.style.transform=`scaleX(${t/20})`;
      if(visible || seeking)renderer.render(scene,camera);
      frame=requestAnimationFrame(render);
    }
    const resize=()=>{
      const bounds=element.getBoundingClientRect();camera.aspect=bounds.width/Math.max(1,bounds.height);
      const factor=Math.max(1,1.25/camera.aspect);camera.position.set(4*factor,3.3*factor,9*factor);camera.lookAt(target);camera.updateProjectionMatrix();renderer.setSize(bounds.width,bounds.height,false);
      dirty=true;
    };
    const observer=new ResizeObserver(resize);observer.observe(element);
    const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:"100px"});visibility.observe(element);
    resize();render(performance.now());
    return()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();scene.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Line||object instanceof THREE.Points){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});textures.forEach(texture=>texture.dispose());renderer.dispose();};
  }, [foodId,seasonId,temperature,noFood]);

  return <>
    {unavailable ? <img className="feeding-3d-fallback" src="/assets/turtles/green-turtle-grazing.png" alt="Green sea turtle grazing in a seagrass meadow" /> : <canvas ref={canvas} className="feeding-animation-canvas" aria-hidden="true" />}
    {stillFrame && <img className="feeding-frame-preview" src={stillFrame} alt="Still frame of the animated green sea turtle" />}
    <div className="feeding-stage-control"><span ref={stage}>{unavailable ? "Illustration preview" : "Approach & settle"}</span>{!unavailable && !noFood && <button type="button" onClick={()=>{setStillFrame("");setPlaying(value=>!value);}}>{playing?"Pause feeding loop":"Play feeding loop"}</button>}{!unavailable && <button type="button" onClick={()=>{if(stillFrame){setStillFrame("");return;}if(canvas.current){setStillFrame(canvas.current.toDataURL("image/png"));setPlaying(false);}}}>{stillFrame?"Close still frame":"View still frame"}</button>}</div>
    <div className="feeding-timeline"><span>{noFood?"Resting · no food available":unavailable?"Static illustration":"20-second illustrated feeding loop"}</span><i><b ref={timeline} style={{animation:"none",transform:"scaleX(0)"}} /></i></div>
    {!unavailable && !noFood && <label className="feeding-scrubber">Inspect the sequence<input type="range" aria-label="Feeding loop position" min="0" max="19.9" step="0.1" defaultValue="0" onChange={event=>{seekRequest.current=Number(event.target.value);setPlaying(false);setStillFrame("");}} /></label>}
  </>;
}
