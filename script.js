  /* ---- sample data ---- */
  const projects = [
    {emoji:'💻', title:'project one', desc:'short description of what this project is about.'},
    {emoji:'🎨', title:'project two', desc:'short description of what this project is about.'},
    {emoji:'📱', title:'project three', desc:'short description of what this project is about.'},
  ];
  const projGrid = document.getElementById('proj-grid');
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'proj-card';
    card.innerHTML = `<div class="thumb">${p.emoji}</div><div class="info"><span>see details</span><h3>${p.title}</h3></div>`;
    card.addEventListener('click', () => openModal(p));
    projGrid.appendChild(card);
  });
 
  function openModal(p){
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-desc').textContent = p.desc;
    const pics = document.getElementById('modal-pics');
    pics.innerHTML = '';
    for(let i=0;i<4;i++){ const d = document.createElement('div'); pics.appendChild(d); }
    document.getElementById('modal').classList.add('open');
  }
  function closeModal(){ document.getElementById('modal').classList.remove('open'); }
  document.getElementById('modal').addEventListener('click', e=>{ if(e.target.id==='modal') closeModal(); });
 
  /* ---- carousels: fill content, auto-scroll (pausable), drag-to-scroll, click-to-zoom ---- */
  function fillTrack(id, emoji, count){
    const track = document.getElementById(id);
    let html = '';
    for(let i=0;i<count;i++){ html += `<div class="c-item" data-label="item ${i+1}">${emoji}</div>`; }
    track.innerHTML = html + html; // duplicate so the loop looks seamless
  }
  fillTrack('ui-track', '🎨', 6);
  fillTrack('pubmat-track', '📣', 6);
 
  function setupCarousel(wrapId, direction, speed){
    const wrap = document.getElementById(wrapId);
    let autoScroll = true;
    let resumeTimer = null;
 
    // auto-scroll loop
    function step(){
      if(autoScroll){
        wrap.scrollLeft += direction * speed;
        const half = wrap.scrollWidth / 2;
        if(direction > 0 && wrap.scrollLeft >= half) wrap.scrollLeft = 0;
        if(direction < 0 && wrap.scrollLeft <= 0) wrap.scrollLeft = half;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
 
    function pauseThenResume(){
      autoScroll = false;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { autoScroll = true; }, 2500);
    }
 
    // drag-to-scroll (mouse)
    let isDown = false, startX = 0, startScroll = 0, moved = 0;
    wrap.addEventListener('mousedown', e => {
      isDown = true; moved = 0; wrap.classList.add('dragging');
      startX = e.pageX; startScroll = wrap.scrollLeft; pauseThenResume();
    });
    window.addEventListener('mouseup', () => { isDown = false; wrap.classList.remove('dragging'); });
    window.addEventListener('mousemove', e => {
      if(!isDown) return;
      const dx = e.pageX - startX;
      moved = Math.abs(dx);
      wrap.scrollLeft = startScroll - dx;
    });
 
    // touch swipe (native overflow-x:auto already handles it) — just pause auto-scroll while touching
    wrap.addEventListener('touchstart', pauseThenResume, {passive:true});
    wrap.addEventListener('wheel', pauseThenResume, {passive:true});
 
    // click-to-zoom on items (ignore if it was actually a drag)
    wrap.querySelectorAll('.c-item').forEach(item => {
      item.addEventListener('click', () => {
        if(moved > 6) return; // was a drag, not a click
        openModal({ title: item.dataset.label, desc: 'click zoom preview — swap this with the real image/details.', emoji: item.textContent });
      });
    });
  }
  setupCarousel('ui-wrap', 1, 0.6);
  setupCarousel('pubmat-wrap', -1, 0.6);
 
 
  /* ---- fade-in on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));