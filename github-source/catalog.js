import {readFileSync} from 'node:fs';
let metadata={};try{metadata=JSON.parse(readFileSync(new URL('./metadata/titles.json',import.meta.url),'utf8'));}catch{}
// Original editorial descriptions and tags; no third-party reviews or ratings.
export const catalog = [
 ['grand-budapest','The Grand Budapest Hotel',2014,'Movie',100,'English',['Comedy','Adventure'],['Witty','Quirky','Visually rich'],'A meticulous concierge, a loyal lobby boy, and one wonderfully elaborate adventure.','rose'],
 ['palm-springs','Palm Springs',2020,'Movie',90,'English',['Comedy','Romance','Sci-fi'],['Funny','Quirky','Feel-good'],'A wedding guest gets stuck in a time loop. Luckily, he finds someone to share the absurdity.','sunset'],
 ['ted-lasso','Ted Lasso',2020,'Series',30,'English',['Comedy','Drama'],['Feel-good','Funny','Warm'],'An optimistic American coach finds a new team, and a very different kind of football.','green'],
 ['knives-out','Knives Out',2019,'Movie',130,'English',['Mystery','Comedy'],['Witty','Suspenseful','Quirky'],'A family of suspects. One curious detective. A mystery with a wicked sense of humour.','amber'],
 ['paddington-2','Paddington 2',2017,'Movie',103,'English',['Comedy','Adventure'],['Feel-good','Warm','Funny'],'A thoughtful bear sets out to buy the perfect present and lands in a rather big misunderstanding.','blue'],
 ['brooklyn','Brooklyn Nine-Nine',2013,'Series',22,'English',['Comedy'],['Funny','Witty','Feel-good'],'A squad of very different detectives turns everyday police work into quick-fire comedy.','blue'],
 ['superbad','Superbad',2007,'Movie',113,'English',['Comedy'],['Funny','Quirky'],'Two friends try to make one last high-school party memorable. Expect adult humour.','amber'],
 ['the-good-place','The Good Place',2016,'Series',22,'English',['Comedy','Fantasy'],['Witty','Quirky','Feel-good'],'An unlikely newcomer to the afterlife tries to become a better person.','green'],
 ['dune','Dune',2021,'Movie',155,'English',['Sci-fi','Adventure'],['Epic','Visually rich','Intense'],'A young heir travels to a desert world at the centre of a struggle for power.','sand'],
 ['interstellar','Interstellar',2014,'Movie',169,'English',['Sci-fi','Drama'],['Epic','Emotional','Visually rich'],'A mission beyond our solar system becomes a story about time, survival, and family.','blue'],
 ['severance','Severance',2022,'Series',50,'English',['Sci-fi','Mystery'],['Suspenseful','Intense','Quirky'],'Office workers discover that separating work from life comes with unsettling consequences.','green'],
 ['arrival','Arrival',2016,'Movie',116,'English',['Sci-fi','Drama'],['Emotional','Thoughtful','Visually rich'],'A linguist searches for a way to communicate with unexpected visitors.','blue'],
 ['chef','Chef',2014,'Movie',114,'English',['Comedy','Drama'],['Feel-good','Warm','Funny'],'A chef starts over with a food truck, a road trip, and a chance to reconnect with his son.','amber'],
 ['3-idiots','3 Idiots',2009,'Movie',170,'Hindi',['Comedy','Drama'],['Funny','Emotional','Feel-good'],'Three engineering students navigate friendship, ambition, and the pressure to succeed.','sunset'],
 ['zindagi','Zindagi Na Milegi Dobara',2011,'Movie',155,'Hindi',['Drama','Adventure','Comedy'],['Feel-good','Emotional','Visually rich'],'Three friends take a trip through Spain and rethink the lives waiting for them at home.','blue'],
 ['panchayat','Panchayat',2020,'Series',35,'Hindi',['Comedy','Drama'],['Warm','Witty','Feel-good'],'A reluctant village secretary discovers the small surprises of rural life.','green'],
 ['andhadhun','Andhadhun',2018,'Movie',139,'Hindi',['Mystery','Comedy'],['Suspenseful','Quirky','Intense'],'A pianist becomes entangled in a crime where appearances are especially misleading.','amber'],
 ['jathi','Jathi Ratnalu',2021,'Movie',148,'Telugu',['Comedy'],['Funny','Quirky'],'Three friends arrive in the city and find themselves in a wildly escalating mix-up.','rose'],
 ['pellichoopulu','Pelli Choopulu',2016,'Movie',118,'Telugu',['Romance','Comedy'],['Warm','Feel-good','Funny'],'An unexpected meeting sparks a food-truck dream and a fresh start for two young people.','sunset'],
 ['rrr','RRR',2022,'Movie',187,'Telugu',['Action','Adventure'],['Epic','Intense','Emotional'],'Two men with secret missions form a friendship amid a sweeping action spectacle.','sand'],
 ['ee-nagaraniki','Ee Nagaraniki Emaindi',2018,'Movie',122,'Telugu',['Comedy','Drama'],['Funny','Warm','Feel-good'],'Four friends reconnect with their shared dream of making a film.','blue'],
 ['dark','Dark',2017,'Series',50,'German',['Mystery','Sci-fi'],['Intense','Suspenseful','Thoughtful'],'A disappearance in a small town reveals connections across generations.','green'],
 ['spirited-away','Spirited Away',2001,'Movie',125,'Japanese',['Fantasy','Adventure'],['Visually rich','Warm','Epic'],'A young girl enters a spirit world and must find the courage to bring her family home.','rose'],
 ['in-the-mood','In the Mood for Love',2000,'Movie',98,'Cantonese',['Romance','Drama'],['Emotional','Visually rich','Thoughtful'],'Two neighbours form a quiet connection in a story of longing and restraint.','rose']
].map(([id,title,year,type,minutes,language,genres,tones,description,color])=>({id,title,year,type,minutes,language,genres,tones,description,color,metadata:metadata[id]||null}));
export const genres=[...new Set(catalog.flatMap(m=>m.genres))].sort();
export const tones=[...new Set(catalog.flatMap(m=>m.tones))].sort();
