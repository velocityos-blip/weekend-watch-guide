import test from 'node:test';
import assert from 'node:assert/strict';
import {movieMetadata,showMetadata} from '../metadata-provider.js';
test('metadata never matches a different year or ambiguous movie',()=>{
 const title={title:'Dune',year:2021};
 assert.equal(movieMetadata(title,[{title:'Dune',year:1984}]),null);
 assert.equal(movieMetadata(title,[title,title]),null);
 assert.deepEqual(movieMetadata(title,[{...title,cast:['Actor'],href:'Dune_(2021_film)'}]).cast,['Actor']);
});
test('series rejects mismatches and unsafe poster hosts; absent rating stays unknown',()=>{
 const title={title:'Example',year:2020};
 const show={name:'Example',id:12,premiered:'2020-01-01',image:{medium:'https://evil.example/poster'},rating:{average:null}};
 const m=showMetadata(title,show);assert.equal(m.poster,null);assert.equal(m.rating,null);
 assert.equal(showMetadata(title,{...show,premiered:'2021-01-01'}),null);
});
