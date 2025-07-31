function setup() {
  noCanvas();

  const root = getComputedStyle(document.documentElement);
  const FADE_DIST  = parseFloat(root.getPropertyValue('--fade-dist'));
  const LOGO_DIST  = parseFloat(root.getPropertyValue('--logo-dist'));
  const IMAGE_STEP = parseFloat(root.getPropertyValue('--image-step'));
  const SAFE_TOP   = parseFloat(root.getPropertyValue('--safe-top'));
  const SAFE_BOT   = parseFloat(root.getPropertyValue('--safe-bottom'));
  const SAFE_SIDE  = parseFloat(root.getPropertyValue('--safe-side'));

  const fadeEl    = document.getElementById('scroll-fade');
  const videoEl   = document.getElementById('bg-video');
  const contentEl = document.querySelector('.content-container');
  const logoEl    = document.querySelector('.logo');
  const galleryEl = document.getElementById('gallery');
  const scrollArrow = document.querySelector('.scroll-arrow');

  let acc = 0;
  const images = [];
  const positions = [
    {x:15,y:15},{x:50,y:10},{x:85,y:15},
    {x:10,y:50},{x:90,y:50},{x:15,y:85},
    {x:50,y:90},{x:85,y:85},{x:35,y:35},{x:65,y:65}
  ];

  // Opret billeder
  for (let i = 1; i <= 10; i++) {
    const img = document.createElement('img');
    img.className = 'gallery-img';
    img.src = `${i}${i===9?'.jpeg':'.jpg'}`;
    galleryEl.appendChild(img);
    images.push(img);
  }

  // Placér billeder inden for safe-area
  function positionImages() {
    const W = window.innerWidth - SAFE_SIDE*2;
    const H = window.innerHeight - SAFE_TOP - SAFE_BOT;
    images.forEach((img, idx) => {
      const pos = positions[idx];
      const x = SAFE_SIDE + (pos.x/100)*W;
      const y = SAFE_TOP  + (pos.y/100)*H;
      img.style.left = `${x}px`;
      img.style.top  = `${y}px`;
    });
  }
  window.addEventListener('resize', positionImages);
  positionImages();

  function update() {
    const o = Math.min(acc/FADE_DIST,1);
    fadeEl.style.opacity    = o;
    videoEl.style.opacity   = 1-o;
    contentEl.style.opacity = 1-o;

    if (acc >= LOGO_DIST) logoEl.classList.add('fixed');
    else                 logoEl.classList.remove('fixed');

    const rev = acc - FADE_DIST;
    images.forEach((img, idx) => {
      img.style.opacity = rev>idx*IMAGE_STEP ? 1 : 0;
    });

    // fade pil ud ved sidste sektion
    if (rev >= IMAGE_STEP*images.length) {
      scrollArrow.style.opacity = '0';
    } else {
      scrollArrow.style.opacity = '1';
    }

    if (rev >= IMAGE_STEP*images.length) {
      fadeEl.setAttribute('data-faded','true');
    } else {
      fadeEl.removeAttribute('data-faded');
    }
  }

  window.addEventListener('wheel', e => {
    e.preventDefault();
    acc = Math.max(acc + e.deltaY, 0);
    update();
  }, { passive: false });

  let startY = null;
  window.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
  }, { passive: false });
  window.addEventListener('touchmove', e => {
    e.preventDefault();
    const delta = startY - e.touches[0].clientY;
    acc = Math.max(acc + delta, 0);
    startY = e.touches[0].clientY;
    update();
  }, { passive: false });
}
