import test from 'node:test';
import assert from 'node:assert/strict';
import {recommend} from '../recommend.js';
test('mood, format, time and language are hard constraints',()=>{
 const result=recommend({},[],{mood:'Funny',type:'Movie',minutes:100,language:'English'});
 assert.ok(result.length);assert.ok(result.every(m=>m.type==='Movie'&&m.minutes<=100&&m.language==='English'&&m.tones.includes('Funny')));
});
test('positive comedy feedback promotes similar titles and excludes watched films',()=>{
 const base=recommend({},[],{}).find(m=>m.id==='brooklyn').score;
 const next=recommend({},[{movie:'superbad',status:'watched',rating:5}],{});
 assert.ok(next.find(m=>m.id==='brooklyn').score>base);assert.ok(!next.some(m=>m.id==='superbad'));
 assert.match(next.find(m=>m.id==='brooklyn').reason,/feedback/);
});
test('negative ratings lower affinity and dismissal excludes the title',()=>{
 const next=recommend({},[{movie:'superbad',status:'watched',rating:1},{movie:'brooklyn',status:'dismissed',rating:0}],{});
 assert.ok(next.find(m=>m.id==='chef').score<0);assert.ok(!next.some(m=>m.id==='brooklyn'));
});
test('stated preferences shape cold-start ranking',()=>{
 const top=recommend({genres:['Sci-fi'],tones:['Thoughtful']},[],{language:'English'})[0];
 assert.ok(top.genres.includes('Sci-fi'));assert.ok(top.tones.includes('Thoughtful'));
});
