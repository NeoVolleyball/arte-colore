// Plays the colour-deck intro (inline, right after #ac-intro in <body>):
// a deck of colour cards fans open, the wordmark writes itself, then the deck
// slaps shut, its top card grows into the hero card and the wordmark flies
// into the header.
(function () {
  var html = document.documentElement;
  var root = document.getElementById('ac-intro');
  if (!html.classList.contains('intro') || !root) {
    if (root) root.remove();
    return;
  }
  var EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchmove'];
  if (!root.animate) return finish(); // no Web Animations API: the gate's timeout and CSS hide it

  var $ = function (s) {
    return root.querySelector(s);
  };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bg = $('.aci-bg');
  var deck = $('.aci-deck');
  var cards = Array.prototype.slice.call(root.querySelectorAll('.aci-card'));
  var heroCard = $('.aci-hero');
  var mark = $('.aci-mark');
  var extras = [$('.aci-stroke'), $('.aci-tag')];
  var step = parseFloat(getComputedStyle(root).getPropertyValue('--step')) || 12;
  var start = performance.now();
  var MIN = reduce ? 450 : 1050; // the intro always plays at least this long
  var MAX = 3600; // ...and leaves by this point even if the page is still loading
  var out = 'cubic-bezier(0.22, 1, 0.36, 1)';
  var spring = 'cubic-bezier(0.2, 0.9, 0.3, 1.25)';
  var sway = null;
  var leaving = false;

  function offset(card) {
    return parseFloat(card.style.getPropertyValue('--d')) || 0;
  }

  html.classList.add('aci-blocking');

  if (!reduce) {
    // the deck rises closed, then sweeps open while every card fans out from the centre
    deck.animate(
      [
        { opacity: 0, transform: 'translateY(16svh) scale(0.88)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 460, easing: out, fill: 'both' },
    );
    deck.animate([{ transform: 'rotate(-9deg)' }, { transform: 'rotate(0deg)' }], {
      duration: 950,
      delay: 140,
      easing: out,
      composite: 'add',
    });
    cards.forEach(function (card) {
      var d = offset(card);
      var a = d * step;
      card.animate(
        d
          ? [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + a * 1.09 + 'deg)', offset: 0.62 }, { transform: 'rotate(' + a + 'deg)' }]
          : [{ transform: 'translateY(0)' }, { transform: 'translateY(-5%)', offset: 0.45 }, { transform: 'translateY(0)' }],
        { duration: 640, delay: 210 + Math.abs(d) * 36, easing: d ? spring : out, fill: 'both' },
      );
    });

    $('.aci-rivet').animate(
      [{ transform: 'scale(0)' }, { transform: 'scale(1.3)', offset: 0.6 }, { transform: 'none' }],
      { duration: 420, delay: 160, easing: out, fill: 'both' },
    );

    // small logo: its own mini fan opens in echo
    $('.aci-fan').animate(
      [
        { opacity: 0, transform: 'scale(0.4) rotate(-20deg)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 520, delay: 330, easing: spring, fill: 'both' },
    );
    [['.aci-s1', -26, -33], ['.aci-s3', 26, 33]].forEach(function (s, i) {
      $(s[0]).animate(
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + s[2] + 'deg)', offset: 0.6 }, { transform: 'rotate(' + s[1] + 'deg)' }],
        { duration: 620, delay: 420 + i * 80, easing: spring, fill: 'both' },
      );
    });

    // wordmark: letters rise out of a blur, one after the other
    var k = 0;
    Array.prototype.forEach.call(root.querySelectorAll('.aci-word'), function (word) {
      var chars = word.textContent.split('');
      word.textContent = '';
      chars.forEach(function (ch) {
        var span = document.createElement('span');
        span.className = 'aci-ch';
        span.textContent = ch;
        word.appendChild(span);
        span.animate(
          [
            { opacity: 0, transform: 'translateY(0.55em) rotate(7deg)', filter: 'blur(6px)' },
            { opacity: 1, transform: 'none', filter: 'blur(0)' },
          ],
          { duration: 480, delay: 400 + k++ * 26, easing: out, fill: 'both' },
        );
      });
    });
    $('.aci-stroke path').animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
      duration: 560,
      delay: 640,
      easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
      fill: 'both',
    });
    $('.aci-tag').animate(
      [
        { opacity: 0, letterSpacing: '0.6em' },
        { opacity: 1, letterSpacing: '0.24em' },
      ],
      { duration: 700, delay: 640, easing: out, fill: 'both' },
    );
  }

  function loaded() {
    return document.readyState === 'complete';
  }

  // page still loading after the intro: the open fan sways gently until it's ready
  function breathe() {
    if (reduce || leaving || loaded()) return;
    sway = deck.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(2deg)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(0deg)' }],
      { duration: 2200, easing: 'ease-in-out', iterations: Infinity, composite: 'add' },
    );
  }

  function whenReady(fn) {
    var t = setTimeout(fn, Math.max(0, MAX - (performance.now() - start)));
    function go() {
      clearTimeout(t);
      if (!sway) return fn();
      // let the current sway finish so the fan comes back to rest without a jump
      sway.effect.updateTiming({ iterations: Math.floor((sway.currentTime || 0) / 2200) + 1 });
      sway.finished.then(fn).catch(function () {}); // cancelled by skip()
    }
    if (loaded()) go();
    else window.addEventListener('load', go, { once: true });
  }

  setTimeout(function () {
    breathe();
    whenReady(function () {
      leave(false);
    });
  }, MIN);

  // any interaction skips straight to the site
  EVENTS.forEach(function (e) {
    window.addEventListener(e, skip, { passive: true, once: true });
  });
  function skip() {
    if (leaving) return;
    if (sway) sway.cancel();
    leave(true);
  }

  function leave(fast) {
    if (leaving) return;
    leaving = true;
    html.classList.remove('aci-blocking');
    var f = fast ? 0.55 : 1;
    var hero = document.querySelector('section[aria-labelledby="hero-title"]');
    var heroBox = hero && hero.getBoundingClientRect();
    if (reduce || !heroBox || heroBox.bottom < 80 || heroBox.top > innerHeight - 80) return fadeAway(reduce ? 320 : 380 * f);

    var FOLD = 300 * f;
    var GROW = 540 * f;

    // 1. the fan slaps shut onto the terracotta card
    cards.forEach(function (card) {
      if (card === heroCard) return;
      card.animate([{ transform: 'rotate(0deg)' }], { duration: FOLD, easing: 'cubic-bezier(0.55, 0, 0.8, 0.3)', fill: 'forwards' });
    });
    extras.forEach(function (el) {
      el.animate([{ opacity: 0, transform: 'translateY(6px)' }], { duration: 220 * f, easing: 'ease-in', fill: 'forwards' });
    });
    fly(mark, FOLD + GROW);

    setTimeout(function () {
      // 2. the top card grows into the hero card, its paper strip into the hero's label
      var from = heroCard.getBoundingClientRect();
      heroBox = hero.getBoundingClientRect();
      var label = hero.querySelector('.chip-label');
      var labelH = label ? label.getBoundingClientRect().height : 60;
      var radius = getComputedStyle(hero).borderTopLeftRadius;
      var morph = heroCard.cloneNode(true);
      morph.className = 'aci-morph';
      morph.style.cssText = '--c:#8E4A31;left:0;top:0;width:' + from.width + 'px;height:' + from.height + 'px;transform:translate(' + from.left + 'px,' + from.top + 'px)';
      root.appendChild(morph);
      heroCard.style.visibility = 'hidden';
      deck.animate([{ opacity: 0 }], { duration: 160, fill: 'forwards' });

      var ease = 'cubic-bezier(0.76, 0, 0.24, 1)';
      morph.animate(
        [
          { width: from.width + 'px', height: from.height + 'px', transform: 'translate(' + from.left + 'px,' + from.top + 'px)', borderRadius: '6px' },
          { width: heroBox.width + 'px', height: heroBox.height + 'px', transform: 'translate(' + heroBox.left + 'px,' + heroBox.top + 'px)', borderRadius: radius },
        ],
        { duration: GROW, easing: ease, fill: 'forwards' },
      );
      var strip = morph.querySelector('.aci-label');
      strip.animate([{ height: from.height * 0.2 + 'px' }, { height: labelH + 'px' }], { duration: GROW, easing: ease, fill: 'forwards' });
      Array.prototype.forEach.call(strip.children, function (el) {
        el.animate([{ opacity: 0 }], { duration: 140, fill: 'forwards' });
      });
      // the cream veil lifts as the card reaches its place, uncovering header and margins
      bg.animate([{ opacity: 0 }], { duration: GROW * 0.55, delay: GROW * 0.45, easing: 'ease-in-out', fill: 'forwards' });

      setTimeout(function () {
        // 3. hand over to the real page: logo appears under the copy, hero content starts its entrance
        html.classList.add('aci-landed');
        html.classList.remove('intro-hold');
        mark.animate([{ opacity: 0 }], { duration: 140, fill: 'forwards' });
        morph.animate([{ opacity: 0 }], { duration: 260, easing: 'ease-out', fill: 'forwards' });
        setTimeout(finish, 270);
      }, GROW + 10);
    }, FOLD);
  }

  // fly the wordmark onto the header logo (same proportions, so one uniform scale)
  function fly(el, duration) {
    var target = document.querySelector('header a[aria-label^="Arte Colore"] > span');
    var a = el.getBoundingClientRect();
    var b = target && target.getBoundingClientRect();
    if (!b || !b.width) return el.animate([{ opacity: 0 }], { duration: 200, fill: 'forwards' });
    var s = b.width / a.width;
    var dx = b.left - a.left;
    var dy = b.top + b.height / 2 - (a.top + (a.height * s) / 2);
    el.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }], {
      duration: duration,
      easing: 'cubic-bezier(0.65, 0, 0.25, 1)',
      fill: 'forwards',
    });
  }

  function fadeAway(duration) {
    html.classList.remove('intro-hold');
    root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: duration, easing: 'ease-out', fill: 'forwards' });
    setTimeout(finish, duration + 20);
  }

  function finish() {
    html.classList.remove('intro', 'intro-hold', 'aci-blocking', 'aci-landed');
    if (root) root.remove();
    EVENTS.forEach(function (e) {
      window.removeEventListener(e, skip);
    });
  }
})();
