(function () {
  'use strict';

  var envelope = document.getElementById('envelope');
  var toggle = document.getElementById('musicToggle');
  var overlay = document.getElementById('bgOverlay');
  var audio = document.getElementById('bgAudio');

  var mobile = window.matchMedia('(max-width: 768px)').matches;
  var view = mobile ? document.getElementById('mobileView') : document.getElementById('desktopView');
  var cards = (view || document).querySelectorAll('.card');
  var pager = mobile ? document.getElementById('pager') : null;
  var deck = mobile && pager;   // both pages use the swipe deck on mobile
  var has3 = view && view.querySelector('.card--3');
  var opening = false;          // guards against double-trigger mid-animation
  var audioBroken = false;
  var volume = 0.8;             // set the playback level here (0-1)
  var muted = false;

  // If the audio file is missing, fail silently — never break the page.
  audio.addEventListener('error', function () { audioBroken = true; });

  function reveal(card) {
    card.classList.add('visible');
    card.setAttribute('aria-hidden', 'false');
  }

  envelope.addEventListener('click', function () {
    if (opening) return;
    opening = true;

    // Dim the background as the card opens.
    overlay.classList.add('show');

    // User gesture: safe to start audio now (if present).
    if (!audioBroken) {
      audio.play().then(function () { audio.volume = volume; })
        .catch(function () { audioBroken = true; });
    }

    // 1. Flap folds down.
    envelope.classList.add('opening');

    if (deck) {
      // Card 1 rises from the center of page 1 (scale 0 -> 1.1 -> 1).
      // Cards 2 and 3 are revealed alongside, clipped off-screen by the locked
      // pager, so they glide in from the right when the deck slides.
      setTimeout(function () {
        envelope.classList.add('gone');
        cards.forEach(reveal);
        toggle.hidden = false;
      }, 550);

      // The deck slides to page 2; card 1 rides along to the left while
      // card 2 enters from the right.
      setTimeout(function () {
        pager.scrollTo({ left: pager.clientWidth, behavior: 'smooth' });
      }, 4000);

      // Then on to page 3, if there is one (index only; walkabout has two).
      if (has3) {
        setTimeout(function () {
          pager.scrollTo({ left: pager.clientWidth * 2, behavior: 'smooth' });
        }, 7000);
      }

      // Entrance done: unlock swiping.
      setTimeout(function () {
        pager.classList.remove('locked');
      }, has3 ? 7600 : 4600);
    } else {
      // 2. Envelope fades/slides away, closed card revealed.
      setTimeout(function () {
        envelope.classList.add('gone');
        cards.forEach(reveal);
      }, 550);

      // 3. Book-flip open.
      setTimeout(function () {
        cards.forEach(function (c) { c.classList.add('open'); });
      }, 1000);

      // 4. Music toggle appears after both pages land.
      setTimeout(function () {
        toggle.hidden = false;
      }, 2600);
    }
  });

  toggle.addEventListener('click', function () {
    if (audioBroken) return;
    // Mute = volume 0 (audio keeps playing); unmute = back to the set level.
    muted = !muted;
    audio.volume = muted ? 0 : volume;
    toggle.classList.toggle('muted', muted);
  });
})();