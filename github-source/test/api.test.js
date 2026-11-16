import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
test('accounts isolate private data, enforce origin, and retain learning across login',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'wwg-test-')),port=18000+Math.floor(Math.random()*10000),base=`http://localhost:${port}`;
 const child=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:String(port),DATA_DIR:dir,APP_ORIGIN:base},stdio:['ignore','pipe','pipe']});
 try {
 await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',()=>reject(Error('Test server exited')));});
 const call=async(path,data,cookie='',origin=base)=>{const r=await fetch(base+'/api/'+path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',Origin:origin,Cookie:cookie},body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 assert.equal((await call('profile',{genres:['Comedy']})).status,401);
 assert.equal((await call('signup',{name:'Test',email:'qa@example.test',password:'test-password-very-long'},'','https://wrong.test')).status,403);
 const a=await call('signup',{name:'Test',email:'qa@example.test',password:'test-password-very-long'});assert.equal(a.status,200);assert.ok(a.cookie);
 await call('profile',{genres:['Comedy'],tones:['Funny'],languages:['English']},a.cookie);
 await call('saved',{movie:'chef',saved:true},a.cookie);
 await call('feedback',{movie:'superbad',status:'watched',rating:5,review:'Private note'},a.cookie);
 assert.equal((await call('bootstrap',null,a.cookie)).data.history[0].review,'Private note');
 const b=await call('signup',{name:'Other',email:'other@example.test',password:'another-password-very-long'});
 assert.equal((await call('bootstrap',null,b.cookie)).data.history.length,0);
 assert.deepEqual((await call('bootstrap',null,b.cookie)).data.saved,[]);
 assert.equal((await call('login',{email:'qa@example.test',password:'wrong-password-long'})).status,401);
 assert.equal((await call('feedback',{movie:'invalid',status:'watched',rating:5},a.cookie)).status,400);
 await call('logout',{},a.cookie);assert.equal((await call('bootstrap',null,a.cookie)).data.user,null);
 const login=await call('login',{email:'qa@example.test',password:'test-password-very-long'});
 const restored=(await call('bootstrap',null,login.cookie)).data;assert.equal(restored.history.length,1);assert.deepEqual(restored.saved,['chef']);
 assert.equal((await call('export',null,b.cookie)).data.user.email,'other@example.test');
 }finally{child.kill();await new Promise(resolve=>child.once('exit',resolve));rmSync(dir,{recursive:true,force:true});}
});
