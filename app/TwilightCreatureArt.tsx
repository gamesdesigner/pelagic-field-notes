import {useId} from 'react';
export type TwilightKind='lanternfish'|'hatchetfish'|'bristlemouth'|'krill'|'jelly'|'vampire';
export default function TwilightCreatureArt({kind,lit=false,filaments=true}:{kind:TwilightKind;lit?:boolean;filaments?:boolean}){
 const id=useId().replace(/:/g,'');
 return <svg className={`twilight-creature-art art-${kind} ${lit?'is-lit':''}`} viewBox="0 0 260 150" aria-hidden="true">
  <defs><linearGradient id={`${id}-fish`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#617f91"/><stop offset=".5" stopColor="#b4ccd0"/><stop offset="1" stopColor="#263b50"/></linearGradient><linearGradient id={`${id}-vamp`}><stop stopColor="#6c3443"/><stop offset=".5" stopColor="#b76f68"/><stop offset="1" stopColor="#6b3c50"/></linearGradient></defs>
  {kind==='vampire'?<>
   <g className="vampire-fin"><path d="M155 45 Q140 6 187 22 Q195 42 179 54" fill="#9f6165" stroke="#cc9690"/><path d="M163 97 Q170 133 197 111 Q201 94 183 87" fill="#8b555f" stroke="#bd8783"/></g>
   <ellipse cx="171" cy="70" rx="56" ry="36" fill={`url(#${id}-vamp)`} stroke="#cb9291"/>
   <path className="vampire-web" d="M123 46 Q90 33 43 24 Q58 52 24 54 Q48 68 18 82 Q58 83 31 112 Q79 99 80 130 Q99 100 128 94Z" fill="#8d535d" stroke="#c98b85" strokeWidth="1.5"/>
   {[24,42,60,78,96,114].map((y,i)=><path key={y} d={`M121 ${50+i*7} Q76 ${48+i*6} ${i%2?27:43} ${y}`} fill="none" stroke="#d29d8c" strokeWidth="1.4"/>)}
   <ellipse cx="121" cy="65" rx="24" ry="29" fill="#91525a"/><ellipse cx="112" cy="60" rx="14" ry="17" fill="#86b6c8" stroke="#d2e2d9" strokeWidth="2"/><ellipse cx="109" cy="59" rx="8" ry="12" fill="#091924"/><circle cx="106" cy="54" r="3" fill="#dceee8"/>
   {filaments&&<g fill="none" stroke="#c5b294" strokeWidth="1.2"><path d="M116 86 Q70 135 5 127"/><path d="M118 47 Q71 6 7 12"/></g>}
   <g className="arm-tip-lights" fill="#a9e8f8" opacity={lit?1:.25}>{[[43,24],[24,54],[18,82],[31,112],[80,130]].map(([x,y])=><circle key={y} cx={x} cy={y} r={lit?4:2}/>)}</g>
  </>:kind==='jelly'?<>
   <g className="jelly-tentacles" fill="none" stroke="#d0a6b5" strokeWidth="1.4">{Array.from({length:13},(_,i)=><path key={i} d={`M${66+i*8} 64 Q${50+i*9} 98 ${68+i*8} 119 T${84+i*8} 143`}/>)}<path d="M158 64 Q206 72 198 108 T252 143" strokeWidth="2"/></g>
   <g className="jelly-bell"><path d="M52 65 Q65 10 119 16 Q169 12 184 65 Q117 93 52 65Z" fill="#874354" fillOpacity=".8" stroke="#c97c8b"/><ellipse cx="119" cy="59" rx="57" ry="17" fill="#a3596a" fillOpacity=".5" stroke="#d0949d"/>{Array.from({length:12},(_,i)=><circle key={i} cx={68+i*9} cy={62+Math.sin(i/11*Math.PI)*9} r="2.3" fill="#bd7c97"/>)}</g>
  </>:kind==='krill'?<>
   <g fill="none" stroke="#b7ccd0" strokeWidth="1.4"><path d="M76 63 Q35 25 9 40 M78 61 Q33 5 2 17"/>{Array.from({length:7},(_,i)=><path key={i} d={`M${89+i*13} ${70+i*2} l-9 25 l-15 15`}/>)}</g>
   <path d="M59 66 Q89 32 137 45 Q179 54 206 80 L234 72 L222 92 L237 104 Q207 110 191 98 Q135 104 100 80Z" fill="#b896a6" fillOpacity=".65" stroke="#d0b3b8" strokeWidth="2"/>
   {[108,124,141,158,175,192].map(x=><path key={x} d={`M${x} 49 q-8 14 -4 41`} fill="none" stroke="#d8bec4" strokeWidth="1.5"/>)}<path d="M72 65 l-26 -10 12 20" fill="#c9b0bc"/><circle cx="77" cy="56" r="7" fill="#162538" stroke="#b2d3da"/>
  </>:<>
   <path className="fish-tail" d="M207 65 L247 40 L237 75 L249 105 L204 88Z" fill="#678b9e" fillOpacity=".8" stroke="#b2c8d0"/>
   <path d={kind==='hatchetfish'?'M39 38 Q76 21 126 42 L205 64 L207 88 L145 98 Q109 143 72 112 Q47 91 39 38Z':kind==='bristlemouth'?'M19 67 Q81 38 167 59 L212 69 L210 86 Q98 108 31 88 L45 80Z':'M29 73 Q69 33 132 47 Q180 52 213 70 L209 89 Q114 115 37 87Z'} fill={`url(#${id}-fish)`} stroke="#bfd4d7" strokeWidth="1.5"/>
   <path d="M108 49 L128 25 L147 53 M115 100 L136 122 L146 100" fill="#6c95ab" fillOpacity=".7" stroke="#a7becb"/><path d="M74 57 Q88 73 76 92 M97 78 l37 7 -32 11" fill="none" stroke="#38596e" strokeWidth="2"/>
   <circle cx={kind==='hatchetfish'?57:52} cy={kind==='hatchetfish'?52:69} r={kind==='bristlemouth'?6:11} fill="#14334c" stroke="#c4e2e4" strokeWidth="2"/><circle cx={kind==='hatchetfish'?54:49} cy={kind==='hatchetfish'?49:66} r="3" fill="#ccebf1"/>
   {kind==='bristlemouth'&&<path d="M27 82 l6 -7 6 9 6 -7 6 10 6 -6" stroke="#d4e7e2" strokeWidth="1.3" fill="none"/>}
   <g className="fish-photophores" fill="#93e0f3">{Array.from({length:9},(_,i)=><circle key={i} cx={66+i*14} cy={kind==='hatchetfish'?102-Math.abs(i-3)*3:93-Math.abs(i-4)*1.7} r="2"/>)}</g>
  </>}
 </svg>;
}
