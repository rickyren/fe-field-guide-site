'use strict';
(function(){
 const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ts=t=>{t=Math.floor(Number(t)||0);const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(s).padStart(2,'0')};
 let R=null;
 function col(cr,list){
  if(!list.length)return `<div class="rv-col rv-none"><div class="rv-up">${esc(cr.up)}</div><p class="quiet">本期视频未单独点评。</p></div>`;
  return `<div class="rv-col"><div class="rv-up">${esc(cr.up)}</div>${list.map(e=>`<div class="rv-entry"><div class="row"><span class="tag rv-tier">${e.tier?esc(e.tier):'未定档'}</span><a href="${esc(e.url)}" target="_blank" rel="noreferrer">▶ ${ts(e.start)}–${ts(e.end)}</a></div><p>${esc(e.text)}</p></div>`).join('')}</div>`;
 }
 function render(){
  const q=$('reviewSearch').value.trim().toLowerCase(),only=$('reviewCreator').value;
  const rows=Object.entries(R.characters).filter(([n,v])=>(!only||v[only].length)&&(!q||(n+' '+R.creators.map(c=>v[c.key].map(e=>e.text+' '+(e.tier||'')).join(' ')).join(' ')).toLowerCase().includes(q)));
  $('reviewCount').textContent=`显示 ${rows.length} / ${Object.keys(R.characters).length} 名角色`;
  $('reviewCards').innerHTML=rows.map(([n,v])=>`<article class="rv-card" id="rv-${esc(n)}"><div class="portraithead">${v.avatar?`<img src="${esc(v.avatar)}" alt="" width="52" height="52" loading="lazy">`:''}<h3>${esc(n)}</h3><span class="quiet">${R.creators.map(c=>`${esc(c.up)}：${v[c.key].length?v[c.key].map(e=>esc(e.tier||'未定档')).join(' / '):'—'}`).join(' · ')}</span></div><div class="rv-grid">${R.creators.map(c=>col(c,v[c.key])).join('')}</div></article>`).join('')||'<p class="empty">没有匹配的评价。</p>';
 }
 fetch('data/reviews.json').then(r=>{if(!r.ok)throw Error('reviews.json');return r.json()}).then(d=>{R=d;
  $('reviewCreators').innerHTML=d.creators.map(c=>`<a href="${esc(c.url)}" target="_blank" rel="noreferrer">${esc(c.up)} · ${c.count}条 ↗</a>`).join('');
  $('reviewCreator').innerHTML+=d.creators.map(c=>`<option value="${c.key}">${esc(c.up)}</option>`).join('');
  ['reviewSearch','reviewCreator'].forEach(id=>$(id).addEventListener('input',render));render();
 }).catch(e=>{$('reviewCards').innerHTML='<p class="empty">评价数据未能载入，请通过网页地址访问后刷新。</p>';console.error(e)});
})();
