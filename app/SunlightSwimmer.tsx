"use client";

import {useId} from 'react';

// Each swimming joint moves independently; the animal's body keeps its shape.
export default function SunlightSwimmer({kind}:{kind:string}) {
 const id=useId().replace(/:/g,'');
 if(kind==='phytoplankton') return <svg className="sunlight-swimmer" viewBox="0 0 240 150" aria-hidden="true">
  <g fill="#c6e2a0" stroke="#527d66" strokeWidth="2"><ellipse cx="88" cy="69" rx="28" ry="39" transform="rotate(25 88 69)"/><ellipse cx="148" cy="94" rx="37" ry="20" transform="rotate(-25 148 94)"/><circle cx="154" cy="40" r="20"/></g>
  <g stroke="#e5e8a8" fill="none" strokeWidth="2"><path d="M76 43L101 94 M69 53L96 88 M82 38L107 83 M120 104L173 80 M122 92L165 73"/><path d="M154 14V66 M128 40H180 M136 22L172 58 M136 58L172 22"/></g><g fill="#c0923e"><circle cx="85" cy="63" r="7"/><circle cx="147" cy="91" r="6"/><circle cx="154" cy="40" r="8"/></g>
 </svg>;
 if(kind==='green-turtle') return <svg className="sunlight-swimmer turtle-swimmer" viewBox="0 0 240 150" aria-hidden="true">
  <defs><linearGradient id={`${id}-shell`} x2=".3" y2="1"><stop stopColor="#8d9c64"/><stop offset="1" stopColor="#3d6250"/></linearGradient></defs>
  <g fill="#9ba777" stroke="#385d4d" strokeWidth="2"><path className="turtle-far-flipper" d="M135 68Q140 27 178 20Q177 45 156 77Z"/><path className="turtle-rear-flipper" d="M66 84Q29 104 31 124Q55 123 85 100Z"/></g>
  <path d="M177 65Q203 56 221 69L229 80Q216 92 195 89L170 96Z" fill="#a5b07d" stroke="#385d4d" strokeWidth="2"/><path d="M208 83L228 80" stroke="#466447" fill="none"/><circle cx="215" cy="72" r="3.5" fill="#142f31"/>
  <path d="M57 87L36 91L60 96" fill="#7b915e" stroke="#385d4d" strokeWidth="2"/>
  <ellipse cx="121" cy="80" rx="68" ry="40" fill={`url(#${id}-shell)`} stroke="#c6c392" strokeWidth="4"/>
  <g fill="none" stroke="#c6c392" strokeWidth="2" opacity=".8"><path d="M65 66Q121 33 177 66 M59 82Q120 114 183 82 M85 48L99 70L91 99 M124 41L128 66L138 107 M162 51L153 73L168 96 M99 70L128 66L153 73L138 93L109 95Z"/></g>
  <path className="turtle-near-flipper" d="M153 89Q177 113 159 142Q138 132 126 102Z" fill="#a8b47f" stroke="#385d4d" strokeWidth="2"/>
  <path className="turtle-back-paddle" d="M73 94Q55 119 68 131Q91 120 95 103Z" fill="#819766" stroke="#385d4d" strokeWidth="2"/>
 </svg>;
 if(kind==='moon-jelly') return <svg className="sunlight-swimmer jelly-swimmer" viewBox="0 0 240 180" aria-hidden="true">
  <g className="jelly-trailing-arms" fill="none" stroke="#c4e7ed" strokeWidth="3" opacity=".65"><path d="M94 84Q73 113 100 135T94 169 M111 85Q131 112 111 139T119 174 M132 86Q114 119 138 144T134 174 M147 82Q170 113 147 145"/></g>
  <g className="jelly-swimming-bell"><path d="M61 84C64 13 177 13 181 84Q122 108 61 84Z" fill="#c9e4ed" fillOpacity=".65" stroke="#e0f4ee" strokeWidth="2"/><path d="M70 79Q120 17 172 79" fill="none" stroke="#edf9ee" strokeWidth="2" opacity=".65"/><g fill="none" stroke="#c796c1" strokeWidth="4"><ellipse cx="109" cy="63" rx="9" ry="12"/><ellipse cx="133" cy="63" rx="9" ry="12"/><ellipse cx="109" cy="82" rx="9" ry="9"/><ellipse cx="133" cy="82" rx="9" ry="9"/></g><path d="M61 84Q120 99 181 84" fill="none" stroke="#ebf5ee" strokeWidth="4"/></g>
 </svg>;
 const dolphin=kind==='dolphin';
 return <svg className={`sunlight-swimmer ${dolphin?'dolphin-swimmer':'tuna-swimmer'}`} viewBox="0 0 280 150" aria-hidden="true">
  <defs><linearGradient id={`${id}-body`} x2=".1" y2="1"><stop stopColor={dolphin?'#3d626e':'#245e78'}/><stop offset=".48" stopColor={dolphin?'#8caaa9':'#729caa'}/><stop offset=".65" stopColor="#dde4d5"/><stop offset="1" stopColor="#abbebd"/></linearGradient></defs>
  <g className={dolphin?'dolphin-tail-stock':'tuna-tail-stock'}>
   <path d="M97 63Q64 66 48 79Q62 92 99 94Z" fill={`url(#${id}-body)`} stroke="#365966" strokeWidth="2"/>
   <path className="swimmer-tail-fin" d={dolphin?'M53 77Q35 51 14 58L38 81L14 103Q40 106 56 85Z':'M52 78L22 34L29 74L20 116L55 87Z'} fill={dolphin?'#668c95':'#3e6c7d'} stroke="#365966" strokeWidth="2"/>
  </g>
  <path d={dolphin?'M85 66Q121 32 187 54Q217 61 232 74L264 80Q268 87 246 88L230 90Q189 113 119 99L84 93Z':'M82 65Q134 23 210 55Q241 65 257 80Q239 98 210 105Q135 126 82 94Z'} fill={`url(#${id}-body)`} stroke="#365966" strokeWidth="2"/>
  <path d={dolphin?'M134 52Q140 25 159 24L163 54Z':'M135 47L158 19L170 49Z'} fill="#456d79" stroke="#365966" strokeWidth="2"/>
  <path className="swimmer-pectoral" d={dolphin?'M181 88Q164 123 145 125L156 91Z':'M191 84Q166 116 142 114L165 84Z'} fill="#537d88" stroke="#365966" strokeWidth="2"/>
  {!dolphin&&<><path d="M211 60Q197 79 210 101" fill="none" stroke="#456976" strokeWidth="3"/><g fill="#d1bc76"><path d="M92 59L101 48L110 54 M79 64L86 54L91 60 M95 102L104 114L113 108 M80 98L88 108L94 102"/></g></>}
  {dolphin&&<><path d="M218 86L253 85" stroke="#496870" fill="none"/><path d="M190 57L199 58" stroke="#335462" strokeWidth="3"/><path d="M108 77Q155 94 201 90" stroke="#cfcc9d" strokeWidth="10" fill="none" opacity=".5"/></>}
  <circle cx={dolphin?225:232} cy={dolphin?73:72} r="3.5" fill="#102f3d"/><circle cx={dolphin?226:233} cy="71" r="1" fill="#fff"/>
 </svg>;
}

export function SunlightWaterSurface(){
 return <svg className="sunlight-water-surface" viewBox="0 0 1200 180" preserveAspectRatio="none" aria-hidden="true"><g className="surface-swell"><path d="M-400 92Q-300 65-200 92T0 92T200 92T400 92T600 92T800 92T1000 92T1200 92T1400 92V200H-400Z" fill="#48b8cd" opacity=".65"/><path className="surface-wave-front" d="M-400 106Q-300 85-200 106T0 106T200 106T400 106T600 106T800 106T1000 106T1200 106T1400 106V200H-400Z" fill="#269ec2" stroke="#d4f0e9" strokeWidth="3"/></g></svg>;
}
