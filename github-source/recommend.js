import {catalog} from './catalog.js';
export function recommend(profile={}, events=[], filters={}) {
 const weights={};
 for(const e of events){const m=catalog.find(m=>m.id===e.movie); if(!m)continue; const value=e.rating ? (e.rating-3)*1.5 : e.status==='dismissed'?-2:0; for(const t of [...m.genres,...m.tones])weights[t]=(weights[t]||0)+value;}
 return catalog.filter(m=>!events.some(e=>e.movie===m.id&&['watched','dismissed'].includes(e.status)))
 .filter(m=>(!filters.type||m.type===filters.type)&&(!filters.minutes||m.minutes<=Number(filters.minutes))&&(!filters.language||m.language===filters.language)&&(!filters.mood||m.tones.includes(filters.mood)))
 .map(m=>{const preferred=m.genres.filter(t=>(profile.genres||[]).includes(t)); const vibe=m.tones.filter(t=>(profile.tones||[]).includes(t)); const learned=[...m.genres,...m.tones].filter(t=>weights[t]>0); const score=preferred.length*4+vibe.length*3+[...m.genres,...m.tones].reduce((s,t)=>s+(weights[t]||0),0)+(profile.languages?.includes(m.language)?2:0);return {...m,score,reason:learned.length?`Your feedback favours ${learned.slice(0,2).join(' and ').toLowerCase()} stories.`:preferred.length||vibe.length?`Picked for your love of ${[...preferred,...vibe].slice(0,2).join(' and ').toLowerCase()}.`:'An editorial pick to help you discover your taste.'};})
 .sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
