(function () {
  'use strict';

  var envelope = document.getElementById('envelope');
  var card = document.getElementById('card');
  var toggle = document.getElementById('musicToggle');
  var overlay = document.getElementById('bgOverlay');
  var audio = document.getElementById('bgAudio');

  var opening = false;   // guards against double-trigger mid-animation
  var audioBroken = false;
  var volume = 0.8;      // set the playback level here (0-1)
  var muted = false;

  // If the audio file is missing, fail silently — never break the page.
  audio.addEventListener('error', function () { audioBroken = true; });

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

    // 2. Envelope fades/slides away, closed card revealed.
    setTimeout(function () {
      envelope.classList.add('gone');
      card.classList.add('visible');
      card.setAttribute('aria-hidden', 'false');
    }, 550);

    // 3. Book-flip open.
    setTimeout(function () {
      card.classList.add('open');
    }, 1000);

    // 4. Music toggle appears after both pages land.
    setTimeout(function () {
      toggle.hidden = false;
    }, 2600);
  });

  toggle.addEventListener('click', function () {
    if (audioBroken) return;
    // Mute = volume 0 (audio keeps playing); unmute = back to the set level.
    muted = !muted;
    audio.volume = muted ? 0 : volume;
    toggle.classList.toggle('muted', muted);
  });
})();