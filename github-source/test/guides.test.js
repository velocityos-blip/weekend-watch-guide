import test from 'node:test';
import assert from 'node:assert/strict';
import {guides,publicPaths,renderGuide,renderSitemap,searchResource,escapeHtml} from '../guides.js';
const origin='https://weekendwatchguide.com';
test('public guides provide HTML content, unique canonicals and valid catalog references',()=>{
 const canonicalUrls=new Set();
 for(const path of publicPaths.filter(p=>p.startsWith('/guides/'))){
  const html=renderGuide(path,origin);
  assert.ok(html.includes('<h1>'));
  assert.ok(html.includes('href="'+origin+path+'"'));
  assert.ok(!html.includes('<script'));
  assert.ok(!html.includes('undefined'));
  canonicalUrls.add(html.match(/rel="canonical" href="([^"]+)"/)[1]);
 }
 assert.equal(canonicalUrls.size,guides.length+1);
 assert.equal(renderGuide('/guides/missing',origin),null);
 for(const guide of guides) for(const [id] of guide.picks) assert.ok(id);
});
test('sitemap contains exactly the public pages and robots points to it',()=>{
 const sitemap=renderSitemap(origin);
 assert.equal((sitemap.match(/<loc>/g)||[]).length,publicPaths.length);
 for(const path of publicPaths) assert.ok(sitemap.includes('<loc>'+origin+path+'</loc>'));
 assert.ok(!sitemap.includes('/api/'));
 assert.ok(searchResource('/robots.txt',origin).body.includes('Sitemap: '+origin+'/sitemap.xml'));
 assert.equal(searchResource('/missing',origin),null);
 assert.equal(searchResource('/sitemap.xml',origin).type,'application/xml; charset=utf-8');
 assert.equal(escapeHtml('<a "x">&'), '&lt;a &quot;x&quot;&gt;&amp;');
});
