// Runs in <head> before first paint: decides whether the intro plays this session.
(function () {
  var html = document.documentElement;
  try {
    if (sessionStorage.getItem('ac-intro')) return;
    sessionStorage.setItem('ac-intro', '1');
  } catch (e) {
    return; // no storage: never risk replaying it on every page view
  }
  html.classList.add('intro', 'intro-hold');
  // hard timeout, independent of the player script
  setTimeout(function () {
    html.classList.remove('intro', 'intro-hold', 'aci-blocking');
    var el = document.getElementById('ac-intro');
    if (el) el.remove();
  }, 4500);
})();
