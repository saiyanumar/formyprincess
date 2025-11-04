// Loads canvas-confetti from CDN and exposes window.launchConfetti(options)
(function(){
  let loaded = false;
  let confettiFn = null;

  function loadScript(cb){
    if (loaded) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    s.onload = function(){ loaded = true; confettiFn = window.confetti || null; cb(); };
    s.onerror = function(){ loaded = true; confettiFn = window.confetti || null; cb(); };
    document.head.appendChild(s);
  }

  function launchConfetti(opts){
    loadScript(function(){
      try{
        if (window.confetti) {
          // default burst
          const defaults = {
            particleCount: 80,
            spread: 70,
            ticks: 160,
            gravity: 0.6,
            origin: { y: 0.6 }
          };
          window.confetti(Object.assign({}, defaults, opts || {}));
          // a couple small bursts
          setTimeout(()=> window.confetti && window.confetti(Object.assign({}, defaults, { particleCount: 40, spread: 100, origin: { x: 0.25, y: 0.6 } })), 120);
          setTimeout(()=> window.confetti && window.confetti(Object.assign({}, defaults, { particleCount: 40, spread: 100, origin: { x: 0.75, y: 0.6 } })), 240);
        }
      }catch(e){/* ignore */}
    });
  }

  // @ts-ignore
  window.launchConfetti = launchConfetti;
})();
