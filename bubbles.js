(function () {
  'use strict';

  const BUBBLE_COUNT = 4;
  const IMAGE_COUNT = 20;
  const IMAGE_DIR = 'images/bubbles/';
  const IMAGE_EXT = '.jpg';
  const MIN_DURATION = 12;
  const MAX_DURATION = 30;
  const MIN_OPACITY = 0.55;
  const MAX_OPACITY = 0.9;
  const INITIAL_PHASES = [0.2, 0.39, 0.58, 0.77];

  const container = document.getElementById('bubbles-container');
  if (!container) return;

  const imageSequence = Array.from({ length: IMAGE_COUNT }, (_, i) =>
    `${IMAGE_DIR}${i + 1}${IMAGE_EXT}`
  );
  for (let i = imageSequence.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [imageSequence[i], imageSequence[swapIndex]] = [imageSequence[swapIndex], imageSequence[i]];
  }

  let nextImageIndex = 0;
  let activeBubbleCount = 0;
  const FALLBACK_GRADIENTS = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fccb90, #d57eeb)',
    'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
    'linear-gradient(135deg, #f5576c, #ff6a00)',
    'linear-gradient(135deg, #c471f5, #fa71cd)',
    'linear-gradient(135deg, #48c6ef, #6f86d6)',
    'linear-gradient(135deg, #feada6, #f5efef)',
    'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
    'linear-gradient(135deg, #d4fc79, #96e6a1)',
    'linear-gradient(135deg, #84fab0, #8fd3f4)',
    'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
    'linear-gradient(135deg, #fdcbf1, #e6dee9)',
    'linear-gradient(135deg, #a6c0fe, #f68084)',
    'linear-gradient(135deg, #fccb90, #d57eeb)',
    'linear-gradient(135deg, #e8dff5, #fce2ce)'
  ];

  let useRealImages = true;
  const probe = new Image();
  probe.onerror = () => { useRealImages = false; };
  probe.src = imageSequence[0];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createBubble(lane, initialPhase = 0) {
    const duration = rand(MIN_DURATION, MAX_DURATION);
    const opacity = Number(rand(MIN_OPACITY, MAX_OPACITY).toFixed(2));

    const imageSrc = imageSequence[nextImageIndex];
    nextImageIndex += 1;
    activeBubbleCount += 1;

    const swayWrapper = document.createElement('div');
    swayWrapper.className = 'bubble-sway-wrapper';
    swayWrapper.style.cssText = `
      position: absolute;
      bottom: calc(0px - var(--bubble-size) - 20px);
      left: calc(${lane * 25}vw + (25vw - var(--bubble-size)) / 2);
      width: var(--bubble-size);
      height: var(--bubble-size);
      --bubble-size: clamp(1px, calc(25vw - 28px), 230px);
      pointer-events: none;
    `;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.cssText = `
      width: 100%;
      height: 100%;
      --bubble-opacity: ${opacity};
      animation: bubbleFloat ${duration.toFixed(1)}s linear forwards;
    `;
    if (initialPhase > 0) {
      bubble.style.animationDelay = `-${(duration * initialPhase).toFixed(2)}s`;
    }

    if (useRealImages) {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => {
        img.remove();
        const idx = Number(imageSrc.match(/\d+/)[0]) - 1;
        bubble.style.background = FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
      };
      bubble.appendChild(img);
    } else {
      const idx = Number(imageSrc.match(/\d+/)[0]) - 1;
      bubble.style.background = FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
    }

    swayWrapper.appendChild(bubble);
    container.appendChild(swayWrapper);

    bubble.addEventListener('animationend', () => {
      swayWrapper.remove();
      activeBubbleCount -= 1;

      if (nextImageIndex < imageSequence.length) {
        createBubble(lane, rand(0.18, 0.24));
      } else if (activeBubbleCount === 0) {
        window.location.assign('letter.html');
      }
    });
  }

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    for (let lane = 0; lane < BUBBLE_COUNT; lane += 1) {
      createBubble(lane, INITIAL_PHASES[lane]);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 120);
  });
})();
