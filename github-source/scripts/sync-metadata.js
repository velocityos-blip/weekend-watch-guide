import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {catalog} from '../catalog.js';
import {movieMetadata,showMetadata} from '../metadata-provider.js';

async function get(url){
 const response=await fetch(url,{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'WeekendWatchGuide/1.0 (weekendwatchguide.com)'}});
 if(!response.ok)throw new Error(`Metadata provider returned ${response.status}`);
 return response.json();
}
const target=new URL('../metadata/titles.json',import.meta.url);
let previous={};try{previous=JSON.parse(readFileSync(target,'utf8'));}catch{}
const output={...previous}, checkedAt=new Date().toISOString();
const movies=process.env.MOVIE_DATA_FILE?JSON.parse(readFileSync(process.env.MOVIE_DATA_FILE,'utf8')):await get('https://raw.githubusercontent.com/servant-42/wikipedia-movie-data/master/movies.json');
for(const title of catalog){
 try {
  let details;
  if(title.type==='Movie')details=movieMetadata(title,movies);
  else {
   const results=await get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(title.title)}`);
   const match=results.find(({show})=>show.name===title.title&&Number(show.premiered?.slice(0,4))===title.year);
   if(match){const show=await get(`https://api.tvmaze.com/shows/${Number(match.show.id)}?embed=cast`);details=showMetadata(title,show);}
  }
  if(details)output[title.id]={...details,checkedAt};
 }catch(error){console.error(`${title.id}: ${error.message}; keeping previous metadata`);if(/returned (401|403|429)/.test(error.message))break;}
}
writeFileSync(new URL('../metadata/titles.json.tmp',import.meta.url),JSON.stringify(output,null,2)+'\n');
renameSync(new URL('../metadata/titles.json.tmp',import.meta.url),target);
console.log(`Saved metadata for ${Object.keys(output).length} curated titles.`);
