// Simple synthesized chime. Exposes window.playMagicChime() to play a soft, emotional chime.
(function(){
  function playMagicChime(){
    try{
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // A small arpeggiated chord
      const freqs = [880, 1100, 1320];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        o.connect(g);
        g.connect(ctx.destination);

        // Envelope
        g.gain.setValueAtTime(0, now + i * 0.02);
        g.gain.linearRampToValueAtTime(0.12 / (i + 1), now + 0.02 + i * 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + i * 0.06);

        o.start(now + i * 0.02);
        o.stop(now + 1.3 + i * 0.06);
      });

      // Gentle metallic click using noise filtered (adds sparkle)
      try {
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * 0.02;
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1200;
        noise.connect(noiseFilter);
        noiseFilter.connect(ctx.destination);
        noise.start(now + 0.08);
        noise.stop(now + 0.25);
      } catch (e) {
        // ignore
      }
    }catch(e){
      // ignore
    }
  }

  // @ts-ignore
  window.playMagicChime = playMagicChime;
})();
