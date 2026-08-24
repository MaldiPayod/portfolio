/* carousels: duplicate the static items forda auto-scroll loop, then auto-scroll (pausable) + drag to scroll*/

function duplicateTrack(id) {
  const track = document.getElementById(id);
  track.innerHTML += track.innerHTML;
}
duplicateTrack("gallery-track");
duplicateTrack("designs-track");

function setupCarousel(wrapId, direction, speed) {
  const wrap = document.getElementById(wrapId);
  let autoScroll = true;
  let resumeTimer = null;
  let lastTime = null; 

  // auto-scroll loop
  function step(timestamp) {
    if (lastTime === null) lastTime = timestamp;
    const delta = timestamp - lastTime; // gaano katagal mula noong huling frame
    lastTime = timestamp;

    if (autoScroll) {
      wrap.scrollLeft += direction * speed * (delta / 16.67);
      const half = wrap.scrollWidth / 2;
      if (direction > 0 && wrap.scrollLeft >= half) wrap.scrollLeft = 0;
      if (direction < 0 && wrap.scrollLeft <= 0) wrap.scrollLeft = half;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  function pauseThenResume() {
    autoScroll = false;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      autoScroll = true;
    }, 2500);
  }

  // drag-to-scroll (mouse)
  let isDown = false,
    startX = 0,
    startScroll = 0,
    moved = 0;
  wrap.addEventListener("mousedown", (e) => {
    isDown = true;
    moved = 0;
    wrap.classList.add("dragging");
    startX = e.pageX;
    startScroll = wrap.scrollLeft;
    pauseThenResume();
  });
  window.addEventListener("mouseup", () => {
    isDown = false;
    wrap.classList.remove("dragging");
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    moved = Math.abs(dx);
    wrap.scrollLeft = startScroll - dx;
  });

  wrap.addEventListener("touchstart", pauseThenResume, { passive: true });
  wrap.addEventListener("wheel", pauseThenResume, { passive: true });

  // di bast basta maoopen pic
  wrap.querySelectorAll(".c-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (moved > 6) e.preventDefault();
    });
  });
}
setupCarousel("gallery-wrap", 1, 0.9);
setupCarousel("designs-wrap", -1, 0.9);

// fade in scroll
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 },
);
revealEls.forEach((el) => observer.observe(el));