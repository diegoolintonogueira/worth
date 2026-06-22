/* Worth — main.js */
(function(){
  'use strict';

  /* ── Scroll bar ── */
  const scrollBar = document.getElementById('scrollBar');
  const header    = document.getElementById('siteHeader');

  function onScroll(){
    const s = document.documentElement;
    const prog = s.scrollTop / (s.scrollHeight - s.clientHeight);
    if(scrollBar) scrollBar.style.width = (prog*100)+'%';
    if(header) header.classList.toggle('scrolled', s.scrollTop > 40);
  }
  window.addEventListener('scroll', onScroll, {passive:true});

  /* ── Mobile nav ── */
  const toggle   = document.getElementById('navToggle');
  const navlinks = document.getElementById('navlinks');

  if(toggle && navlinks){
    toggle.addEventListener('click', function(){
      const open = navlinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    /* close on link click */
    navlinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navlinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
    /* close on outside click */
    document.addEventListener('click', function(e){
      if(!header.contains(e.target)){
        navlinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Reveal on scroll ── */
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('in');
          obs.unobserve(en.target);
        }
      });
    },{threshold:0.12});
    document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* ── Counter animation ── */
  function animateCounter(el){
    const target = +el.dataset.to;
    const suffix = el.dataset.suffix || '';
    const fmt    = el.dataset.format === 'br';
    const dur    = 1800;
    const start  = performance.now();
    function step(now){
      const t = Math.min((now-start)/dur, 1);
      const ease = 1 - Math.pow(1-t, 3);
      const val  = Math.round(target * ease);
      el.textContent = fmt ? val.toLocaleString('pt-BR') + suffix : val + suffix;
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if('IntersectionObserver' in window){
    const cobs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          animateCounter(en.target);
          cobs.unobserve(en.target);
        }
      });
    },{threshold:0.5});
    document.querySelectorAll('.counter').forEach(function(el){ cobs.observe(el); });
  } else {
    document.querySelectorAll('.counter').forEach(function(el){
      const suffix = el.dataset.suffix||'';
      const fmt    = el.dataset.format==='br';
      const val    = +el.dataset.to;
      el.textContent = fmt ? val.toLocaleString('pt-BR')+suffix : val+suffix;
    });
  }

  /* ── Tabs (Projeção) ── */
  document.querySelectorAll('.tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      const panelId = tab.dataset.panel;
      /* deactivate all */
      document.querySelectorAll('.tab').forEach(function(t){
        t.classList.remove('tab--on');
        t.setAttribute('aria-selected','false');
      });
      document.querySelectorAll('.panel').forEach(function(p){
        p.classList.remove('panel--on');
        p.hidden = true;
      });
      /* activate target */
      tab.classList.add('tab--on');
      tab.setAttribute('aria-selected','true');
      const panel = document.getElementById(panelId);
      if(panel){ panel.classList.add('panel--on'); panel.hidden = false; }
    });
  });

  /* init first panel */
  const firstPanel = document.querySelector('.panel');
  if(firstPanel) firstPanel.hidden = false;

})();
