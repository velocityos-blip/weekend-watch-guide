import {catalog} from './catalog.js';

// Original selection notes; no availability, audience-rating or viewing claims.
export const guides = [
 {slug:'feel-good-movies',title:'Feel-good movies for a relaxed evening',description:'Choose a warm comedy by the kind of evening you want: food, friendship, romance or a colourful adventure.',intro:'A feel-good film can still contain conflict. These picks lean toward warmth, humour and a satisfying change of perspective. Choose by tone rather than treating this as a ranking.',picks:[
 ['chef','For a gentle reset','The food-truck journey gives this comedy a clear, modest pleasure: watching someone rebuild work and family life around something he enjoys. Pick it when you want warmth and momentum rather than a complicated plot. Expect some strong language.'],
 ['paddington-2','For kindness and visual comedy','The missing-present story gives Paddington a reason to meet a wonderfully eccentric cast. The appeal is the contrast between his patient manners and the chaos around him. Choose it for playful invention; check local age guidance if watching with children.'],
 ['pellichoopulu','For a Telugu romantic comedy','The food-truck ambition makes this more than a meeting between two potential partners. It is a good fit when you want romance tied to finding direction in life. Choose it over a louder ensemble comedy when you prefer a smaller-scale story.'],
 ['zindagi','For a friendship escape','A trip through Spain gives the friends room to question their routines and expectations. Choose this when you have time for a longer, scenic film and want emotional conversations alongside the humour.'],
 ['palm-springs','For romance with a strange premise','A time loop turns a wedding into an unusual relationship test. Choose it when a conventional romantic comedy sounds too predictable. Its adult humour and darker moments make it a different kind of comfort watch from Paddington.']
 ]},
 {slug:'short-comedy-series',title:'Short comedy series for a quick evening watch',description:'Three comedies with roughly 20–30 minute episodes, compared by tone, continuity and the kind of humour you enjoy.',intro:'A short episode does not have to mean a disposable story. These series offer different balances of quick jokes, character warmth and continuing plots. The catalog runtimes below are approximate episode lengths; individual episodes vary.',picks:[
 ['brooklyn','For quick ensemble jokes','Choose Brooklyn Nine-Nine when you want a workplace cast with contrasting personalities and frequent punchlines. It is the most straightforward starting point here for someone who wants an energetic sitcom rhythm. Police-work situations remain part of its comedy.'],
 ['the-good-place','For a story that keeps changing','The afterlife premise turns questions about being a better person into comic problems. Choose it if you enjoy fantasy and an unfolding mystery as well as jokes. Start at the beginning and avoid detailed plot summaries: the changing setup is part of the pleasure.'],
 ['ted-lasso','For encouragement and character warmth','The football setting gives the team a shared challenge, but relationships and leadership are central to its appeal. Choose it when warmth matters more than the number of jokes per minute. Episodes can run longer than the catalog estimate, so check before a strict 30-minute break.']
 ]},
 {slug:'thought-provoking-science-fiction',title:'Thought-provoking science fiction: what to watch next',description:'Compare Arrival, Severance, Dark and Interstellar by commitment, mood and the questions at the centre of each story.',intro:'These picks use science-fiction ideas to explore communication, identity, family and time. The best choice depends on whether you want a single evening or a continuing puzzle. The notes below avoid major plot revelations.',picks:[
 ['arrival','For a complete film about communication','A linguist facing unfamiliar visitors makes understanding, rather than combat, the central task. Choose Arrival when you want a contained film with an emotional thread and room to think afterward. Its deliberate pace suits an attentive evening.'],
 ['severance','For an unsettling workplace mystery','Separating work memories from personal memories turns a familiar office into a question about identity and consent. Choose this if you like a controlled atmosphere and a mystery that develops over episodes. It asks for a series commitment rather than delivering a whole story in one sitting.'],
 ['dark','For a dense series puzzle','A missing child opens a network of connections across families and generations. Choose Dark if you enjoy tracking relationships and paying close attention. German is the original language; subtitles and dubbing depend on the service and region.'],
 ['interstellar','For an expansive, emotional film','The space mission connects survival on a large scale with a family separated by time and distance. Choose it when you want spectacle alongside the ideas and can give a long film your full attention.']
 ]}
];
export const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const publicPaths = ['/', '/guides/', ...guides.map(g=>'/guides/'+g.slug), '/metadata-credits.html'];
function shell(title,description,path,body,origin) {
 const canonical = escapeHtml(new URL(path,origin).href);
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHtml(title)+' | Weekend Watch Guide</title><meta name="description" content="'+escapeHtml(description)+'"><link rel="canonical" href="'+canonical+'"><meta property="og:type" content="website"><meta property="og:title" content="'+escapeHtml(title)+'"><meta property="og:description" content="'+escapeHtml(description)+'"><meta property="og:url" content="'+canonical+'"><link rel="stylesheet" href="/guides.css"></head><body><header><a href="/">weekend ↗</a><nav aria-label="Main navigation"><a href="/">Find a watch</a><a href="/guides/">Watch guides</a></nav></header><main>'+body+'</main><footer><p>Weekend Watch Guide · Original selection notes from our curated catalog.</p><a href="/metadata-credits.html">Metadata credits</a></footer></body></html>';
}
function links() {return '<ul class="guide-links">'+guides.map(g=>'<li><a href="/guides/'+g.slug+'">'+escapeHtml(g.title)+'</a><p>'+escapeHtml(g.description)+'</p></li>').join('')+'</ul>';}
export function renderGuide(path,origin) {
 if(path==='/guides/')return shell('Movie and series watch guides','Find a movie or series by mood, time available and the kind of story you want.','/guides/','<p class="eyebrow">A SHORTLIST FOR YOUR EVENING</p><h1>Less searching. More watching.</h1><p>Start with a focused guide, then use our discovery tool to explore the catalog. No account is needed to read these guides.</p>'+links(),origin);
 const guide=guides.find(g=>path==='/guides/'+g.slug);
 if(!guide)return null;
 const picks=guide.picks.map(([id,heading,note])=>{
 const movie=catalog.find(m=>m.id===id);
 if(!movie)throw new Error('Unknown guide title: '+id);
 return '<article><h2>'+escapeHtml(movie.title)+' <span>('+movie.year+')</span></h2><p class="meta">'+escapeHtml(movie.type)+' · '+movie.minutes+' min'+(movie.type==='Series'?' / episode, approx.':'')+' · '+escapeHtml(movie.language)+'</p><h3>'+escapeHtml(heading)+'</h3><p>'+escapeHtml(note)+'</p></article>';
 }).join('');
 return shell(guide.title,guide.description,path,'<a href="/guides/">← All watch guides</a><h1>'+escapeHtml(guide.title)+'</h1><p class="lead">'+escapeHtml(guide.intro)+'</p>'+picks+'<aside><h2>Before you press play</h2><p>Streaming availability, cuts, age ratings and language options vary by country and service. Check the title on your local service before subscribing or renting. We do not sell streams or claim current platform availability.</p><p>Selections use the catalog’s genre, mood and runtime information. These are editorial suggestions, not audience ratings or claims of personal viewing.</p><a class="cta" href="/">Find a pick for your mood ↗</a></aside><h2>Another kind of evening?</h2>'+links(),origin);
}
export function renderSitemap(origin) {return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+publicPaths.map(p=>'<url><loc>'+escapeHtml(new URL(p,origin).href)+'</loc></url>').join('')+'</urlset>';}
export function searchResource(path,origin) {
 if(path==='/robots.txt')return {type:'text/plain; charset=utf-8',body:'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: '+new URL('/sitemap.xml',origin).href+'\n'};
 if(path==='/sitemap.xml')return {type:'application/xml; charset=utf-8',body:renderSitemap(origin)};
 const body=renderGuide(path,origin);
 return body?{type:'text/html; charset=utf-8',body}:null;
}
