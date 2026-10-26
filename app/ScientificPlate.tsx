import {useId} from 'react';
type Specimen={id:string;name:string;scientific:string;image:string;alt:string;description:string;source:string};
type Props={title:string;specimens:Specimen[];sources:Record<string,{label:string;url:string}>;note:string};
export default function ScientificPlate({title,specimens,sources,note}:Props){
 const id=useId();
 return (
  <section className="cephalopod-atlas" aria-labelledby={`${id}-title`}>
   <header><p className="eyebrow">Comparative plate · 01–{String(specimens.length).padStart(2,'0')}</p><h2 id={`${id}-title`}>{title}</h2><p>Study the illustrations, then match each number with the name and description below. Select an image to inspect the full-size plate.</p></header>
   <div className="cephalopod-specimen-grid">{specimens.map((specimen,index)=><figure key={specimen.id}>
    <a href={specimen.image} target="_blank" rel="noreferrer" aria-label={`Open full-size illustration ${index+1}: ${specimen.name}`}><img src={specimen.image} alt={specimen.alt} width="1536" height="1024" loading="lazy"/></a>
    <figcaption><a href={`#${id}-${specimen.id}`} aria-label={`Read description ${index+1}: ${specimen.name}`}>{index+1}.</a></figcaption>
   </figure>)}</div>
   <p className="cephalopod-plate-note">{note}</p>
   <ol className="cephalopod-specimen-key" aria-label="Names and descriptions of the numbered specimens">{specimens.map(specimen=><li id={`${id}-${specimen.id}`} key={specimen.id}><h3>{specimen.name}</h3><p className="cephalopod-scientific"><i>{specimen.scientific}</i></p><p>{specimen.description}</p><a href={sources[specimen.source].url} target="_blank" rel="noreferrer">Species and anatomy reference ↗</a></li>)}</ol>
  </section>
 );
}
