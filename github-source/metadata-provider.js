const names=items=>Array.isArray(items)?items.filter(x=>typeof x==='string').map(x=>x.slice(0,150)).slice(0,8):[];
export function movieMetadata(title,movies){
 const matches=movies.filter(m=>m.title===title.title&&m.year===title.year);
 if(matches.length!==1)return null;
 const m=matches[0];
 return {source:'Wikipedia movie dataset',sourceUrl:`https://en.wikipedia.org/wiki/${encodeURIComponent(m.href||m.title.replaceAll(' ','_'))}`,cast:names(m.cast),sourceGenres:names(m.genres)};
}
export function showMetadata(title,show){
 if(show.name!==title.title||Number(show.premiered?.slice(0,4))!==title.year||!Number.isInteger(show.id))return null;
 const poster=show.image?.medium;
 return {source:'TVmaze',sourceUrl:`https://www.tvmaze.com/shows/${show.id}`,license:'https://creativecommons.org/licenses/by-sa/4.0/',
  poster:typeof poster==='string'&&/^https:\/\/static\.tvmaze\.com\/uploads\/images\//.test(poster)?poster:null,
  rating:typeof show.rating?.average==='number'&&show.rating.average>=0&&show.rating.average<=10?show.rating.average:null,
  cast:names(show._embedded?.cast?.map(c=>c.person?.name)),status:typeof show.status==='string'?show.status.slice(0,80):null,
  sourceGenres:names(show.genres)};
}
