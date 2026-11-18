(function () {
  'use strict';

  const wishMessage = document.getElementById('wish-message');
  const pageLayout = document.querySelector('.page-layout');
  const message = wishMessage.textContent.trim();
  const characters = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(message), ({ segment }) => segment)
    : Array.from(message);

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function revealWish() {
    wishMessage.textContent = '';
    await wait(500);
    wishMessage.hidden = false;

    for (const character of characters) {
      const letter = document.createElement('span');
      letter.className = 'wish-letter';
      letter.textContent = character;
      wishMessage.appendChild(letter);
      requestAnimationFrame(() => letter.classList.add('is-visible'));
      await wait(24);
    }

    pageLayout.classList.add('page-layout--vanishing');
    await wait(200);
    window.location.assign('bubbles.html');
  }

  revealWish();
})();
