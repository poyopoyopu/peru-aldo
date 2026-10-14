(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<span></span>';document.body.prepend(progress);
  const bar=progress.firstElementChild;
  const topbar=document.querySelector('.topbar');
  let scheduled=false;
  function updateScroll(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+'%';
    if(topbar)topbar.classList.toggle('is-scrolled',window.scrollY>32);
    scheduled=false;
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();

  const revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduce){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -35px 0px'});
    revealItems.forEach((el,i)=>{el.style.transitionDelay=(i%3)*65+'ms';io.observe(el)});
  }else revealItems.forEach(el=>el.classList.add('visible'));

  const hero=document.querySelector('.hero-image');
  if(hero&&!reduce){window.addEventListener('scroll',()=>{hero.style.backgroundPosition=`center calc(47% + ${Math.min(window.scrollY,window.innerHeight)*.055}px)`},{passive:true})}

  // Consistent mobile wayfinding on every page; the RSVP action always goes to the invite.
  if(!document.querySelector('.mobile-dock')){
    const path=location.pathname.split('/').pop()||'index.html';
    const links=[
      {href:'index.html',icon:'⌂',label:'HOME',active:path==='index.html'},
      {href:'food.html',icon:'✳',label:'FOOD',active:path==='food.html'},
      {href:'story.html',icon:'◉',label:'STORY',active:path==='story.html'},
      {href:'index.html#join',icon:'↗',label:'JOIN',join:true,active:false}
    ];
    const dock=document.createElement('nav');dock.className='mobile-dock';dock.setAttribute('aria-label','サイトナビゲーション');
    links.forEach(item=>{const a=document.createElement('a');a.href=item.href;a.innerHTML=`<span class="dock-icon" aria-hidden="true">${item.icon}</span><span>${item.label}</span>`;if(item.active)a.setAttribute('aria-current','page');if(item.join)a.classList.add('dock-join');dock.append(a)});
    document.body.append(dock);
  }
  // Avoid navigating to an empty anchor when the current page has no invitation section.
  document.querySelectorAll('a[href="index.html#join"]').forEach(a=>a.addEventListener('click',e=>{if((location.pathname.split('/').pop()||'index.html')==='index.html'){const target=document.getElementById('join');if(target){e.preventDefault();target.scrollIntoView({behavior:reduce?'auto':'smooth'});history.replaceState(null,'','#join')}}}));
})();
