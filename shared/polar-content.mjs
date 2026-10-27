import {arcticUnits} from './arctic-units.mjs';
/** @typedef {{id:string,title:string,scientific:string,region:string,image:string,alt:string,description:string,width?:number,height?:number,ecology?:boolean,photo?:{author:string,location:string,sourceUrl:string,license:string,licenseUrl:string}}} PolarUnit */
/** @type {PolarUnit[]} */
export const polarUnits = [
 {id:'penguin',title:'Emperor Penguins',scientific:'Aptenodytes forsteri',region:'Antarctic comparison',image:'/assets/polar/emperor-penguin-v1.webp',alt:'Generated natural-history illustration of an adult emperor penguin and a gray chick standing on Antarctic sea ice.',description:'Compare insulation, diving, huddling, and breeding in the southern polar ocean.'},
 {id:'orca',title:'Orcas',scientific:'Orcinus orca',region:'Arctic and subarctic seas',image:'/assets/polar/orca-v1.webp',alt:'Generated underwater illustration of three orcas in cold northern water with open breathing space between distant ice floes.',description:'Connect sound, social learning, and hunting with a changing sea-ice landscape.'},
 {id:'lionsmane',title:'Lion’s Mane Jellyfish',scientific:'Cyanea capillata',region:'Cool northern seas',image:'/assets/polar/lions-mane-ronning.webp',width:1536,height:1150,alt:'Photograph of a lion’s mane jellyfish in Mandal, Norway, with a translucent scalloped bell, orange center, and fine tentacles against dark blue water.',photo:{author:'Arnstein Rønning',location:'Mandal, Norway',sourceUrl:'https://commons.wikimedia.org/wiki/File:Cyanea_capillata_no.JPG',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/'},description:'Follow stinging cells, a gelatinous body, and a life cycle shaped by currents.'},
 ...arcticUnits,
];
export const polarSources = {
 polarPenguins:{label:'Australian Antarctic Program · Penguin distribution and biology',url:'https://www.antarctica.gov.au/about-antarctica/animals/penguins/'},
 polarEmperor:{label:'Australian Antarctic Program · Emperor penguins',url:'https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/'},
 polarDives:{label:'Australian Antarctic Program · Recording emperor penguin dives',url:'https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/how-deep-can-they-dive/'},
 polarHuddle:{label:'Zitterbart et al. · Coordinated movements in penguin huddles',url:'https://pubmed.ncbi.nlm.nih.gov/21673816/'},
 polarOxygen:{label:'Ponganis et al. · Blood oxygen during emperor penguin dives',url:'https://pubmed.ncbi.nlm.nih.gov/38390686/'},
 polarOrca:{label:'NOAA Fisheries · Killer whale biology and populations',url:'https://www.fisheries.noaa.gov/species/killer-whale'},
 polarArcticOrca:{label:'Fisheries and Oceans Canada · Ice and marine mammal access',url:'https://www.dfo-mpo.gc.ca/science/mammals-mammiferes/climate-climatiques/index-eng.html'},
 polarRisk:{label:'Matthews et al. · Orcas and bowhead habitat selection',url:'https://pubmed.ncbi.nlm.nih.gov/32152110/'},
 polarKnowledge:{label:'Fisheries and Oceans Canada · Arctic ecosystem case studies',url:'https://www.dfo-mpo.gc.ca/oceans/publications/soto-rceo/2019/case-studies-etudes-cas-eng.html'},
 polarLion:{label:'Monterey Bay Aquarium · Lion’s mane jelly',url:'https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/lions-mane-jelly'},
 polarJelly:{label:'Smithsonian Ocean · Jelly anatomy and life cycles',url:'https://ocean.si.edu/ocean-life/invertebrates/jellyfish-and-comb-jellies'},
 polarEphyra:{label:'Field research · Release and growth of Cyanea capillata ephyrae',url:'https://doi.org/10.1016/0022-0981(87)90149-3'},
};
