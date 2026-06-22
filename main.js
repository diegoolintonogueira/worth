/* Worth — main.js v3 */
(function(){
  'use strict';

  /* ── Scroll bar & header ── */
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
    navlinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        navlinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        toggle.setAttribute('aria-label','Abrir menu');
      });
    });
    document.addEventListener('click', function(e){
      if(!header.contains(e.target)){
        navlinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  /* ── Reveal (stagger-aware) ── */
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('in');
          obs.unobserve(en.target);
        }
      });
    },{threshold:0.1});
    document.querySelectorAll('.reveal,.stagger').forEach(function(el){ obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal,.stagger').forEach(function(el){ el.classList.add('in'); });
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
        if(en.isIntersecting){ animateCounter(en.target); cobs.unobserve(en.target); }
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

  /* ── Hero canvas — floating particles ── */
  var canvas = document.getElementById('hero-canvas');
  if(canvas){
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;
    function resizeCanvas(){
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, {passive:true});

    var colors = ['rgba(82,113,255,', 'rgba(201,162,75,', 'rgba(169,182,255,'];
    for(var i=0;i<55;i++){
      var c = colors[Math.floor(Math.random()*colors.length)];
      particles.push({
        x:Math.random()*1000,
        y:Math.random()*1000,
        r:Math.random()*1.8+.4,
        a:Math.random()*Math.PI*2,
        speed:Math.random()*.25+.05,
        alpha:Math.random()*.45+.1,
        color:c
      });
    }

    var mouseX=0, mouseY=0;
    window.addEventListener('mousemove', function(e){
      mouseX = e.clientX; mouseY = e.clientY;
    }, {passive:true});

    function drawParticles(){
      ctx.clearRect(0,0,W,H);
      particles.forEach(function(p){
        p.a += p.speed * .012;
        p.x += Math.cos(p.a) * p.speed;
        p.y += Math.sin(p.a) * p.speed;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    /* hero glow follows mouse */
    var heroGlow = document.querySelector('.hero-glow');
    if(heroGlow){
      window.addEventListener('mousemove', function(e){
        var hero = document.querySelector('.hero');
        if(!hero) return;
        var rect = hero.getBoundingClientRect();
        if(e.clientY < rect.bottom){
          var rx = ((e.clientX / window.innerWidth) - .5) * 30;
          var ry = ((e.clientY / window.innerHeight) - .5) * 20;
          heroGlow.style.transform = 'translate('+rx+'px,'+ry+'px)';
        }
      }, {passive:true});
    }
  }

  /* ── Cursor glow ── */
  var glow = document.createElement('div');
  glow.id = 'cursor-glow';
  document.body.appendChild(glow);
  var gx=0,gy=0,tx=0,ty=0;
  window.addEventListener('mousemove', function(e){ tx=e.clientX; ty=e.clientY; },{passive:true});
  (function animGlow(){
    gx+=(tx-gx)*.08; gy+=(ty-gy)*.08;
    glow.style.left=gx+'px'; glow.style.top=gy+'px';
    requestAnimationFrame(animGlow);
  })();

  /* ── Spotlight on vcard hover ── */
  document.querySelectorAll('.vcard').forEach(function(card){
    var spot = document.createElement('div');
    spot.className = 'vcard-spot';
    card.appendChild(spot);
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      spot.style.left = (e.clientX - r.left) + 'px';
      spot.style.top  = (e.clientY - r.top) + 'px';
    });
  });

  /* ── Calculadora de Projeção ── */
  var planos = {
    lite:  {preco:197, n1:0.20, n2:0.05},
    pro:   {preco:297, n1:0.30, n2:0.10},
    black: {preco:497, n1:0.50, n2:0.20}
  };
  var currentPlano = 'black';
  var n1 = 50, n2 = 2500;

  function fmt(v){ return 'R$'+v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }

  function calcUpdate(){
    var p = planos[currentPlano];
    var r1 = n1 * p.preco * p.n1;
    var r2 = n2 * p.preco * p.n2;
    var total = r1 + r2;
    var maxTotal = 500*planos.black.preco*planos.black.n1 + 25000*planos.black.preco*planos.black.n2;
    var el1 = document.getElementById('calc-r1');
    var el2 = document.getElementById('calc-r2');
    var elt = document.getElementById('calc-total');
    var bar = document.getElementById('calc-bar');
    if(el1) el1.textContent = fmt(r1);
    if(el2) el2.textContent = fmt(r2);
    if(elt) elt.textContent = fmt(total);
    if(bar) bar.style.width = Math.min((total/maxTotal)*100,100)+'%';
  }

  document.querySelectorAll('.calc-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.calc-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      currentPlano = tab.dataset.plano;
      calcUpdate();
    });
  });

  var rn1 = document.getElementById('range-n1');
  var rn2 = document.getElementById('range-n2');
  if(rn1){
    rn1.addEventListener('input', function(){
      n1 = +rn1.value;
      var v = document.getElementById('val-n1');
      if(v) v.textContent = n1+' membros';
      calcUpdate();
    });
  }
  if(rn2){
    rn2.addEventListener('input', function(){
      n2 = +rn2.value;
      var v = document.getElementById('val-n2');
      if(v) v.textContent = n2.toLocaleString('pt-BR')+' membros';
      calcUpdate();
    });
  }
  calcUpdate();

})();
