import http from 'node:http';
import express from 'express';
import {readFileSync,mkdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes,scrypt,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {isAbsolute} from 'node:path';
import {catalog,genres,tones} from './catalog.js';
import {recommend} from './recommend.js';
const derive=promisify(scrypt), port=Number(process.env.PORT||3001), production=process.env.NODE_ENV==='production';
if(production&&!process.env.APP_ORIGIN)throw new Error('APP_ORIGIN is required in production');
if(production&&(!process.env.DATA_DIR||!isAbsolute(process.env.DATA_DIR)))throw new Error('A persistent absolute DATA_DIR outside deployment folders is required in production');
mkdirSync(process.env.DATA_DIR||'data',{recursive:true});
const db=new DatabaseSync(`${process.env.DATA_DIR||'data'}/wwg.sqlite`);
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE,name TEXT,salt TEXT,hash TEXT,profile TEXT DEFAULT '{}');
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user TEXT REFERENCES users(id) ON DELETE CASCADE,expires INTEGER);
 CREATE TABLE IF NOT EXISTS feedback(user TEXT REFERENCES users(id) ON DELETE CASCADE,movie TEXT,status TEXT,rating INTEGER,review TEXT,updated TEXT,PRIMARY KEY(user,movie));
 CREATE TABLE IF NOT EXISTS saved(user TEXT REFERENCES users(id) ON DELETE CASCADE,movie TEXT,PRIMARY KEY(user,movie));`);
const digest=s=>createHash('sha256').update(s).digest('hex');
const limits=new Map();
setInterval(()=>{limits.clear();db.prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());},900000).unref();
function session(req){const raw=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('wwg_session='))?.slice(12);return raw?db.prepare('SELECT users.* FROM users JOIN sessions ON users.id=sessions.user WHERE token=? AND expires>?').get(digest(raw),Date.now()):null;}
function publicUser(u){return {name:u.name,email:u.email,profile:JSON.parse(u.profile)};}
function history(u){return db.prepare('SELECT movie,status,rating,review,updated FROM feedback WHERE user=?').all(u.id);}
async function body(req){let text='';for await(const part of req){text+=part;if(text.length>16000)throw new Error('Request too large');}try{return JSON.parse(text||'{}');}catch{throw new Error('Invalid request');}}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'};
const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/scene.svg':'scene.svg','/cinema.css':'cinema.css','/cinema-hero.png':'cinema-hero.png','/metadata-credits.html':'metadata-credits.html'};
const app=express();
app.disable('x-powered-by');
app.use(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https://static.tvmaze.com; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
 const json=(data,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 try {
 const url=new URL(req.url,'http://localhost'),path=url.pathname;
 if(production&&req.headers.host===`www.${new URL(process.env.APP_ORIGIN).host}`){res.writeHead(308,{Location:process.env.APP_ORIGIN+url.pathname+url.search});return res.end();}
 if(path==='/api/health'&&req.method==='GET')return json({ok:true,release:'metadata-2026-11-07'});
 if(!path.startsWith('/api/')){if(!files[path]||req.method!=='GET'){res.writeHead(404);return res.end('Not found');} const f=files[path];res.writeHead(200,{'Content-Type':mime[f.slice(f.lastIndexOf('.'))]});return res.end(readFileSync(new URL(`./public/${f}`,import.meta.url)));}
 if(req.method!=='GET'&&req.headers.origin!==(process.env.APP_ORIGIN||`http://localhost:${port}`))return json({error:'Request origin rejected'},403);
 const user=session(req);
 if(path==='/api/bootstrap'&&req.method==='GET')return json({user:user?publicUser(user):null,catalog,genres,tones,history:user?history(user):[],saved:user?db.prepare('SELECT movie FROM saved WHERE user=?').all(user.id).map(x=>x.movie):[]});
 if(path==='/api/recommendations'&&req.method==='GET')return json(recommend(user?JSON.parse(user.profile):{},user?history(user):[],Object.fromEntries(url.searchParams)));
 if(['/api/signup','/api/login'].includes(path)&&req.method==='POST'){
 const ip=req.socket.remoteAddress, count=(limits.get(ip)||0)+1;limits.set(ip,count);if(count>25)return json({error:'Too many attempts. Try again in 15 minutes.'},429);
 const b=await body(req);const email=String(b.email||'').trim().toLowerCase(), password=String(b.password||'');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||password.length<12||password.length>128)return json({error:'Use a valid email and a password of 12–128 characters.'},400);
 let u=db.prepare('SELECT * FROM users WHERE email=?').get(email);
 if(path==='/api/signup'){
 if(u)return json({error:'Unable to create this account. Try signing in.'},400);
 const name=String(b.name||'').trim().slice(0,50);if(!name)return json({error:'Please enter your name.'},400);
 const salt=randomBytes(16).toString('hex'),hash=(await derive(password,salt,64)).toString('hex');
 db.prepare('INSERT INTO users(id,email,name,salt,hash) VALUES(?,?,?,?,?)').run(randomBytes(16).toString('hex'),email,name,salt,hash);u=db.prepare('SELECT * FROM users WHERE email=?').get(email);
 }else{const hash=await derive(password,u?.salt||'dummy-constant-salt',64);if(!u||!timingSafeEqual(hash,Buffer.from(u.hash,'hex')))return json({error:'Email or password is incorrect.'},401);}
 const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token),u.id,Date.now()+7*86400000);
 res.setHeader('Set-Cookie',`wwg_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${production?'; Secure':''}`);return json({user:publicUser(u)});
 }
 if(!user)return json({error:'Sign in to save your taste and watch history.'},401);
 if(path==='/api/logout'&&req.method==='POST'){const raw=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('wwg_session='))?.slice(12);if(raw)db.prepare('DELETE FROM sessions WHERE token=?').run(digest(raw));res.setHeader('Set-Cookie','wwg_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');return json({ok:true});}
 if(path==='/api/profile'&&req.method==='POST'){const b=await body(req);const pick=(a,allowed)=>Array.isArray(a)?[...new Set(a.filter(x=>allowed.includes(x)))]:[];const profile={genres:pick(b.genres,genres),tones:pick(b.tones,tones),languages:pick(b.languages,[...new Set(catalog.map(m=>m.language))])};db.prepare('UPDATE users SET profile=? WHERE id=?').run(JSON.stringify(profile),user.id);return json({profile});}
 if(path==='/api/feedback'&&req.method==='POST'){const b=await body(req);if(!catalog.some(m=>m.id===b.movie)||!['watched','dismissed'].includes(b.status)||!Number.isInteger(b.rating)||b.rating<0||b.rating>5)return json({error:'Invalid feedback'},400);db.prepare('INSERT INTO feedback VALUES(?,?,?,?,?,?) ON CONFLICT(user,movie) DO UPDATE SET status=excluded.status,rating=excluded.rating,review=excluded.review,updated=excluded.updated').run(user.id,b.movie,b.status,b.rating,String(b.review||'').slice(0,1000),new Date().toISOString());return json({ok:true});}
 if(path==='/api/saved'&&req.method==='POST'){const b=await body(req);if(!catalog.some(m=>m.id===b.movie)||typeof b.saved!=='boolean')return json({error:'Invalid title'},400);if(b.saved)db.prepare('INSERT OR IGNORE INTO saved VALUES(?,?)').run(user.id,b.movie);else db.prepare('DELETE FROM saved WHERE user=? AND movie=?').run(user.id,b.movie);return json({ok:true});}
 if(path==='/api/export'&&req.method==='GET')return json({user:publicUser(user),history:history(user),saved:db.prepare('SELECT movie FROM saved WHERE user=?').all(user.id)});
 return json({error:'Not found'},404);
 }catch(err){console.error(err.message);return json({error:'Unable to complete this request. Please try again.'},400);}
});
const server=http.createServer(app);
server.listen(port,'0.0.0.0',()=>console.log(`Weekend Watch Guide: http://localhost:${port}`));
