'use strict';
(function(){
 const sections=[...document.querySelectorAll('main > section[data-page]')];
 const nav=[...document.querySelectorAll('[data-nav]')];
 function showView(id,scroll=true){
  const target=document.getElementById(id)||document.getElementById('intro');
  const section=target.closest('section[data-page]');
  if(!section)return;
  const page=section.dataset.page;
  sections.forEach(s=>{const active=s.dataset.page===page;s.classList.toggle('is-visible',active);s.hidden=!active;});
  nav.forEach(a=>{if(a.dataset.nav===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  for(let p=target.parentElement;p&&p!==section;p=p.parentElement){if(p.tagName==='DETAILS')p.open=true;}
  if(target.tagName==='DETAILS')target.open=true;
  if(scroll)target.scrollIntoView({behavior:'auto',block:'start'});
 }
 window.guideNavigate=function(id){if(location.hash==='#'+id)showView(id);else location.hash=id;};
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');if(!a)return;
  const id=a.getAttribute('href').slice(1);if(!document.getElementById(id))return;
  e.preventDefault();
  if(a.dataset.openRoute&&typeof window.guideSelectRoute==='function')window.guideSelectRoute(a.dataset.openRoute);
  window.guideNavigate(id);
 });
 window.addEventListener('hashchange',()=>showView(decodeURIComponent(location.hash.slice(1))||'intro'));
 showView(decodeURIComponent(location.hash.slice(1))||'intro',false);
})();
