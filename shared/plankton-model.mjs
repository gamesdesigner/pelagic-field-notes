// Illustrative two-producer, fixed-fish tank model. Indices are not field units.
export const nutrientDoses = { nitrogen:10, phosphorus:3, silicate:10 };
export const initialPlanktonState = () => ({day:0,diatoms:80,flagellates:55,nitrogen:14,phosphorus:5,silicate:12,temperature:18,fish:0});
export function addNutrient(state,nutrient) {
 if(!Object.hasOwn(nutrientDoses,nutrient))return state;
 return {...state,[nutrient]:Math.min(60,state[nutrient]+nutrientDoses[nutrient])};
}
export function stepPlankton(state) {
 const {diatoms:d,flagellates:f,nitrogen:n,phosphorus:p,silicate:s,temperature:t,fish}=state;
 const light=Math.max(0,1-(d+f)/600);
 const common=Math.min(n/(n+4),p/(p+1.5));
 let gd=d*.38*Math.exp(-(((t-16)/9)**2))*Math.min(common,s/(s+3))*light;
 let gf=f*.30*Math.exp(-(((t-24)/10)**2))*common*light;
 const needN=(gd+gf)*.09,needP=(gd+gf)*.0225,needS=gd*.08;
 const scale=Math.min(1,needN?n/needN:1,needP?p/needP:1,needS?s/needS:1);
 gd*=scale;gf*=scale;
 const grazing=fish*.045/(1+(d+f)/250);
 const mortality=.035+Math.max(0,t-28)*.015;
 const nextD=Math.max(0,d+gd-d*(mortality+grazing));
 const nextF=Math.max(0,f+gf-f*(mortality+grazing));
 return {...state,day:state.day+1,diatoms:nextD<.05?0:nextD,flagellates:nextF<.05?0:nextF,nitrogen:Math.max(0,n-(gd+gf)*.09),phosphorus:Math.max(0,p-(gd+gf)*.0225),silicate:Math.max(0,s-gd*.08)};
}
