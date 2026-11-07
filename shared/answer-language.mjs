// Conservative language normalization shared by browser feedback and the server.
// Grammatical forms share a meaning; opposites and anatomical terms stay distinct.
const families=[
 'make makes making made','use uses using used','build builds building built','match matches matching matched','return returns returning returned','bounce bounces bouncing bounced','locate locates locating located','find finds finding found','filter filters filtering filtered filtration','strain strains straining strained','search searches searching searched','vary varies varied varying variation','differ differs differing differed difference differences different',
 'rotate rotates rotated rotating rotation spin spins spinning spun','echo echoes','pull pulls pulled pulling','plant plants','light lights',
 'color colour colors colours','meter metre meters metres','center centre centers centres','behavior behaviour behaviors behaviours','mollusk mollusc mollusks molluscs','defense defence defensive defend defends defending defended',
 'eat eats eating eaten ate','feed feeds feeding fed','breathe breath breathes breathing breathed','move moves moved moving movement movements motion motions','reflect reflects reflected reflecting reflection reflections','scatter scatters scattered scattering',
 'produce produces produced producing production','absorb absorbs absorbed absorbing absorption','detect detects detected detecting detection','protect protects protected protecting protection','reproduce reproduces reproduced reproducing reproduction','grow grows grew grown growing growth',
 'reduce reduces reduced reducing reduction','increase increases increased increasing','decrease decreases decreased decreasing','change changes changed changing','adjust adjusts adjusted adjusting','respond responds responded responding response responses','learn learns learned learnt learning',
 'divide divides divided dividing division','split splits splitting','mature matures matured maturing maturity','migrate migrates migrated migrating migration','swim swims swimming swam swum','sink sinks sinking sank sunk','rise rises rising rose risen','float floats floated floating',
 'catch catches catching caught','trap traps trapped trapping','bind binds bound binding','attach attaches attached attaching','release releases released releasing','retain retains retained retaining','expand expands expanded expanding expansion','contract contracts contracted contracting contraction',
 'warm warms warmed warming','cool cools cooled cooling','store stores stored storing storage','hunt hunts hunted hunting','injure injures injured injuring injury injuries','cut cuts cutting','slash slashes slashed slashing','slice slices sliced slicing','hurt hurts hurting','wound wounds wounded wounding',
 'emit emits emitted emitting emission','glow glows glowed glowing','communicate communicates communicated communicating communication','surface surfaces surfaced surfacing','hide hides hiding hid hidden','rest rests rested resting',
 'tooth teeth','foot feet','alga algae','bacterium bacteria','larva larvae','medusa medusae','antenna antennae','seta setae','septum septa','fish fishes','gas gases','species species','no nope nah','yes yep yeah',
];
const aliases=new Map(families.flatMap(family=>{const words=family.split(' ');return words.map(word=>[word,words[0]]);}));
const spellingForms=new Map(families.map(family=>{const words=family.split(' ');return [words[0],words];}));
export const wordSpellingForms=word=>spellingForms.get(word)||[word];
const smallNumbers='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(' ');
for(const [n,word] of smallNumbers.entries())aliases.set(word,String(n));
for(const [word,n] of Object.entries({thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90}))aliases.set(word,String(n));
const invariant=new Set(['species','yes','news','series','gladius','xiphias']);
export function canonicalWord(word){
 if(aliases.has(word))return aliases.get(word);
 if(invariant.has(word)||word.length<5)return word;
 if(word.endsWith('ies'))return word.slice(0,-3)+'y';
 if(/(?:ches|shes|xes|zzes)$/.test(word))return word.slice(0,-2);
 if(word.endsWith('s')&&!/(?:ss|us|is|as)$/.test(word))return word.slice(0,-1);
 return word;
}
const articles=new Set(['a','an','the','its','their']);
export function answerTokens(text){
 const normalized=text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'")
  .replace(/(?<=\d),(?=\d)/g,'').replace(/(?<=\d)\.(?=\d)/g,' ')
  .replace(/\b(can't|cannot)\b/g,'can not').replace(/\bwon't\b/g,'will not').replace(/n't\b/g,' not')
  .replace(/\b([a-z]+)'s\b/g,'$1')
  .replace(/\b(one|two|three|four|five|six|seven|eight|nine) hundred\b/g,(_,n)=>String(smallNumbers.indexOf(n)*100))
  .replace(/\b(one thousand|a thousand|thousand)\b/g,'1000')
  .replace(/[.!?;,]/g,' | ');
 const words=(normalized.match(/[a-z0-9]+|\|/g)||[]).filter(word=>!articles.has(word)).map(canonicalWord);
 const result=[];
 for(let i=0;i<words.length;i++){
  let current=words[i];
  if(/^\d+$/.test(current)&&Number(current)>=100&&Number(current)%100===0){
   let value=Number(current),next=i+1;
   if(words[next]==='and')next++;
   while(/^\d+$/.test(words[next]||'')&&Number(words[next])<value&&Number(words[next])<1000){value+=Number(words[next]);i=next;next++;if(words[next]==='and')next++;}
   current=String(value);
  }
  result.push(current);
 }
 return result;
}
