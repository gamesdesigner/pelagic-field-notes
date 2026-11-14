// Append renderer destinations: earlier saved links and unit indices stay stable.
export const ambushBigfinUnits=[
 {id:'bobbitWorm',title:'Bobbit Worm',scientific:'Eunice aphroditois · A marine annelid',summary:'Explore a hidden seafloor hunter, watch its four-second ambush reconstruction, and investigate prey defenses.',tag:'Burrows, jaws & ambush'},
 {id:'bigfinSquid',title:'Bigfin Squid',scientific:'Magnapinna spp. · Deep-sea cephalopods',summary:'Inspect the eerie still illustration, trace long filaments and broad fins, and separate observations from feeding hypotheses.',tag:'Deep-sea anatomy & evidence'},
].map((unit,index)=>({...unit,image:`/assets/ambush-and-bigfin/${index===0?'bobbit-worm':'bigfin-squid'}-still-v1.webp`,subjectId:'extensions',unit:36+index}));
