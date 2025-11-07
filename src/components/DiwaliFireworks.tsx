import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './diwali-fireworks.css';
import { loadScript, cleanupAllScriptListeners } from '../utils/scriptLoader';

const vendorScripts = [
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/fscreen%401.0.1.js',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/Stage%400.1.4.js',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/MyMath.js'
];

interface FireworksConfig {
  shellSize?: number;
  shellCount?: number;
  quality?: number;
  autoLaunch?: boolean;
  finale?: boolean;
  gravity?: number;
}

interface DiwaliFireworksProps {
  onComplete: () => void;
  config?: FireworksConfig;
  // If true, run an optional performance reducer that lowers quality/shells to improve
  // playback on low-end devices. Disabled by default.
  enablePerformanceReducer?: boolean;
  // If true (default), explicitly set the original script's default values into the
  // DOM selects after the vendor script initializes. This mirrors the defaults from
  // the original `/fireworks/script.js` so behaviour is consistent.
  applyOriginalDefaults?: boolean;
}

const DiwaliFireworks = ({ onComplete, enablePerformanceReducer = false, applyOriginalDefaults = true }: DiwaliFireworksProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const portalHostRef = useRef<HTMLDivElement | null>(null);
  const [hostReady, setHostReady] = useState(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [showBirthday, setShowBirthday] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevActiveElementRef = useRef<HTMLElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const [reveal, setReveal] = useState(true);
  const [revealHidden, setRevealHidden] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadAllRef = useRef<(() => Promise<void>) | null>(null);

  // Helper to stop/pause any audio the original script may be playing.
  // The original `soundManager` exposes `pauseAll()` and a `ctx` AudioContext.
  // Call both where available to silence playback when leaving the page.
  const stopDiwaliAudio = () => {
    try {
      const sm = (window as any).soundManager;
      if (sm) {
        try {
          if (typeof sm.pauseAll === 'function') {
            sm.pauseAll();
          } else if (sm.ctx && typeof sm.ctx.suspend === 'function') {
            // fallback: suspend the audio context
            // ctx.suspend() returns a promise; swallow errors
            sm.ctx.suspend().catch(() => {});
          }
        } catch (e) {
          // ignore
        }
      }

      // Also toggle the script's sound flag off if a convenience exists
      if (typeof (window as any).toggleSound === 'function') {
        try { (window as any).toggleSound(false); } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
  };

  // If the original script exposes a full stop API, prefer that so visuals + audio
  // are deterministically halted. Otherwise fall back to audio-only stop.
  const stopAllDiwali = () => {
    try {
      if (typeof (window as any).__diwali_stop === 'function') {
        try { (window as any).__diwali_stop(); } catch (e) {}
      } else {
        stopDiwaliAudio();
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    let destroyed = false;
    let _prevBodyOverflow: string | null = null;
    let _prevBodyMargin: string | null = null;
    let _prevBodyPadding: string | null = null;

    // Load vendor scripts in sequence, then the local copied script in /diwali/script.js
    const loadAll = async () => {
      try {
        setLoadError(null);
        for (const src of vendorScripts) {
          // eslint-disable-next-line no-await-in-loop
          // load sequentially to preserve dependency order
          await loadScript(src);
          // log each vendor availability
          // eslint-disable-next-line no-console
          console.info('[Diwali POC] loaded vendor script:', src);
        }

        // Now load the fireworks script we copied into public/diwali/script.js
        await loadScript('/diwali/script.js');
        // eslint-disable-next-line no-console
        console.info('[Diwali POC] loaded /diwali/script.js');

        // Reveal the loading node only after the external script has been fetched.
        // This prevents a short flash of the loading UI when navigating from Auth.
        try {
          if (loadingRef.current) {
            // allow the script to manage/remove the node later as intended
            loadingRef.current.style.display = '';
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[Diwali POC] failed to reveal loading node', e);
        }

        // Try to resume audio via the script's exposed helper (if available).
        try {
          const resumed = (window as any).__diwali_resume_audio && (window as any).__diwali_resume_audio();
          // eslint-disable-next-line no-console
          console.info('[Diwali POC] attempted audio resume:', !!resumed);
          // If the original script exposes a toggleSound function, enable sound in its store so
          // playback functions won't be gated by soundEnabled === false.
          try {
            if (typeof (window as any).toggleSound === 'function') {
              (window as any).toggleSound(true);
              // Try resume again after enabling the sound flag
              const resumed2 = (window as any).__diwali_resume_audio && (window as any).__diwali_resume_audio();
              // eslint-disable-next-line no-console
              console.info('[Diwali POC] toggled sound on and re-attempted resume:', !!resumed2);
            }
          } catch (e) {
            // ignore
          }
        } catch (e) {
          // ignore
        }

        // Helper: wait until the original script has populated the selects (or timeout)
  const waitForSelects = async (timeout = 5000) => {
          const start = Date.now();
          while (Date.now() - start < timeout) {
            const shellType = document.querySelector('.shell-type') as HTMLSelectElement | null;
            const qualitySel = document.querySelector('.quality-ui') as HTMLSelectElement | null;
            if (shellType && shellType.options.length > 0 && qualitySel && qualitySel.options.length > 0) return;
            // wait a bit
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 50));
          }
        };

  // Apply defaults mirroring the original /fireworks/script.js store defaults.
  const applyDefaultsToDOM = () => {
          try {
            const IS_MOBILE = window.innerWidth <= 640;
            const IS_DESKTOP = window.innerWidth > 800;
            const IS_HEADER = IS_DESKTOP && window.innerHeight < 300;
            const hwConcurrency = (navigator as any).hardwareConcurrency;
            const minCount = window.innerWidth <= 1024 ? 4 : 8;
            const IS_HIGH_END_DEVICE = hwConcurrency ? hwConcurrency >= minCount : false;

            const qualityDefault = String(IS_HIGH_END_DEVICE ? 3 : 2); // QUALITY_HIGH=3, QUALITY_NORMAL=2
            const shellDefault = 'Random';
            const sizeDefault = IS_DESKTOP ? '3' : (IS_HEADER ? '1.2' : '2');
            const skyLightingDefault = String(2); // SKY_LIGHT_NORMAL
            const scaleFactorDefault = IS_MOBILE ? 0.9 : (IS_HEADER ? 0.75 : 1);

            const setSelectValue = (selector: string, value: string) => {
              const el = document.querySelector(selector) as HTMLSelectElement | null;
              if (!el) return;
              // If the option exists, set it; otherwise, do not force an invalid value.
              const found = Array.from(el.options).some((opt) => opt.value === value);
              if (found) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
              }
            };

            setSelectValue('.quality-ui', qualityDefault);
            setSelectValue('.shell-type', shellDefault);
            // shell-size may accept non-integer '1.2' in the original script's store; try to set if present
            setSelectValue('.shell-size', sizeDefault);
            setSelectValue('.sky-lighting', skyLightingDefault);
            setSelectValue('.scaleFactor', scaleFactorDefault.toFixed(2));

            // Booleans
            try {
              const autoLaunch = document.querySelector('.auto-launch') as HTMLInputElement | null;
              if (autoLaunch) {
                autoLaunch.checked = true;
                autoLaunch.dispatchEvent(new Event('click', { bubbles: true }));
              }
            } catch (e) {}

          } catch (e) {
            // ignore
          }
        };

        // Performance reducer: opt-in behavior that carefully reduces quality & shell load.
        const reduceShellsForSmoothness = () => {
          try {
            const qualitySel = document.querySelector('.quality-ui') as HTMLSelectElement | null;
            if (qualitySel && qualitySel.options.length > 0) {
              // pick the lowest quality option (first)
              qualitySel.value = qualitySel.options[0]?.value || qualitySel.value;
              qualitySel.dispatchEvent(new Event('input', { bubbles: true }));
            }

            const shellSize = document.querySelector('.shell-size') as HTMLSelectElement | null;
            if (shellSize && shellSize.options.length > 0) {
              shellSize.value = shellSize.options[0]?.value || shellSize.value;
              shellSize.dispatchEvent(new Event('input', { bubbles: true }));
            }

            const autoLaunch = document.querySelector('.auto-launch') as HTMLInputElement | null;
            if (autoLaunch && autoLaunch.checked) {
              autoLaunch.click();
            }

            const finaleMode = document.querySelector('.finale-mode') as HTMLInputElement | null;
            if (finaleMode && finaleMode.checked) {
              finaleMode.click();
            }

            const controls = document.querySelector('.controls') as HTMLElement | null;
            if (controls) controls.classList.add('hide');
            // eslint-disable-next-line no-console
            console.info('[Diwali POC] applied smoothness reductions (quality/shell/auto/finale)');
          } catch (e) {
            // ignore
          }
        };

        // After loading the script, optionally wait for selects and apply the original defaults
        if (applyOriginalDefaults) {
          try {
            await waitForSelects(2000);
            applyDefaultsToDOM();
          } catch (e) {
            // ignore
          }
        }

        // If performance reducer is requested, schedule an early reduction to avoid heavy bursts
        if (enablePerformanceReducer) {
          try {
            const smoothTimer = window.setTimeout(() => {
              try { reduceShellsForSmoothness(); } catch (e) {}
            }, 1000);
            timersRef.current.push(smoothTimer as unknown as number);
          } catch (e) {}
        }

        // Show the birthday overlay after 5s and continue button after 15s
        try {
          const birthdayTimer = window.setTimeout(() => {
            // If configured, reduce heavy settings just before showing the overlay
            try {
              if (enablePerformanceReducer) {
                reduceShellsForSmoothness();
              }
            } catch (e) {}
            setShowBirthday(true);
          }, 5000);
          const continueTimer = window.setTimeout(() => {
            setShowContinue(true);
          }, 20000);
          (window as any).__diwali_birthday_timer = birthdayTimer;
          (window as any).__diwali_continue_timer = continueTimer;
          timersRef.current.push(birthdayTimer as unknown as number, continueTimer as unknown as number);
        } catch (e) {
          // ignore
        }

        try {
          // ensure audio is enabled
          try {
            const sm = (window as any).soundManager;
            if (sm && typeof sm.resumeAll === 'function') {
              sm.resumeAll();
            } else if (sm && sm.ctx && typeof sm.ctx.resume === 'function') {
              sm.ctx.resume().catch(() => {});
            }
          } catch (e) {
            // ignore
          }

          const finaleTimers: number[] = [];
          const FINAL_BURSTS = 15;
          const FINAL_SPACING_MS = 150;

          // Launch a moderated series of sequences (do not modify original config/selects)
          for (let i = 0; i < FINAL_BURSTS; i++) {
            const tm = window.setTimeout(() => {
              try {
                const fn = (window as any).startSequence || (window as any).seqRandomFastShell || (window as any).seqRandomShell;
                if (typeof fn === 'function') fn();
              } catch (e) {
                // ignore
              }
            }, 3000 + i * FINAL_SPACING_MS);
            finaleTimers.push(tm);
          }
          (window as any).__diwali_finale_timers = finaleTimers;
        } catch (e) {
          // ignore
        }

        // Temporarily remove body margins and disable scrolling so the fixed overlay
        // truly covers the viewport. Save previous values to restore on unmount.
        try {
          _prevBodyOverflow = document.body.style.overflow || null;
          _prevBodyMargin = document.body.style.margin || null;
          _prevBodyPadding = document.body.style.padding || null;
          document.body.style.overflow = 'hidden';
          document.body.style.margin = '0';
          document.body.style.padding = '0';
        } catch (e) {
          // ignore
        }

        // Mobile devices sometimes report layout quirks (safe-area, 100vw rounding) that
        // cause a thin blank strip at the left. Force the canvas elements to match the
        // viewport and the devicePixelRatio so the drawing surface fully covers the screen.
        const adjustCanvases = () => {
          try {
            const dpr = window.devicePixelRatio || 1;
            const main = document.getElementById('main-canvas') as HTMLCanvasElement | null;
            const trails = document.getElementById('trails-canvas') as HTMLCanvasElement | null;
            const rect = rootRef.current?.getBoundingClientRect();
            const baseW = rect && rect.width ? rect.width : window.innerWidth;
            const baseH = rect && rect.height ? rect.height : window.innerHeight;

            [main, trails].forEach((c) => {
              if (!c) return;
              // ensure CSS covers the viewport completely
              c.style.position = 'fixed';
              c.style.left = '0';
              c.style.top = '0';
              c.style.right = '0';
              c.style.bottom = '0';
              c.style.width = '100vw';
              c.style.height = '100vh';
              c.style.margin = '0';
              c.style.padding = '0';
              c.style.border = 'none';
              c.style.outline = 'none';

              // use the root element size (not window) to avoid scrollbar/safe-area rounding
              const w = Math.max(1, Math.floor(baseW * dpr));
              const h = Math.max(1, Math.floor(baseH * dpr));
              if (c.width !== w || c.height !== h) {
                c.width = w;
                c.height = h;
                // force a reflow so the script's drawing uses the new buffer
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                c.offsetWidth;
                // eslint-disable-next-line no-console
                console.info('[Diwali POC] resized canvas to', w, h);
              }
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[Diwali POC] adjustCanvases failed', e);
          }
        };

        // Run immediately and shortly after to catch race conditions
        adjustCanvases();
        // run a couple more times in case the original script resizes canvases after init
        setTimeout(adjustCanvases, 150);
        setTimeout(adjustCanvases, 300);
        setTimeout(adjustCanvases, 600);

        // start the reveal fade shortly after the script settles so the fireworks
        // crossfade from black instead of popping in abruptly.
        try {
          // Give the vendor script a bit more time to settle before removing the reveal overlay.
          // 120ms was occasionally too short on first load (network/CPU variance). Increase to 400ms.
          setTimeout(() => {
            setReveal(false);
          }, 400);
        } catch (e) {
          // ignore
        }
        // expose the function reference briefly so we can remove the listener on unmount
        try {
          (window as any).__diwali_adjust_canvases = adjustCanvases;
          window.addEventListener('resize', adjustCanvases);
        } catch (e) {
          // ignore
        }

        // We no longer append the React-managed root node to document.body directly.
        // Instead we render into a portal host appended to document.body (see effect below).

        // quick runtime checks for expected globals
        // eslint-disable-next-line no-console
        console.info('[Diwali POC] globals:', {
          fscreen: typeof (window as any).fscreen !== 'undefined',
          Stage: typeof (window as any).Stage !== 'undefined',
          MyMath: typeof (window as any).MyMath !== 'undefined',
          init: typeof (window as any).init === 'function'
        });

        // Watchdog: if the script hasn't removed the loading state after a short timeout,
        // attempt to call the original `init()` as a fallback and print helpful diagnostics.
        setTimeout(() => {
          try {
            const loadingNode = document.querySelector('.loading-init');
            const stageContainer = document.querySelector('.stage-container');
            if (loadingNode && stageContainer && stageContainer.classList.contains('remove')) {
              // eslint-disable-next-line no-console
              console.warn('[Diwali POC] Loading still present after 5s — attempting fallback init()');
              const maybeInit = (window as any).init;
              if (typeof maybeInit === 'function') {
                try {
                  maybeInit();
                  // eslint-disable-next-line no-console
                  console.info('[Diwali POC] Called fallback init()');
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error('[Diwali POC] fallback init() threw:', e);
                }
              } else {
                // eslint-disable-next-line no-console
                console.error('[Diwali POC] init() not available as fallback. Check console for earlier errors.');
              }
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[Diwali POC] watchdog error', e);
          }
        }, 5000);

        // The original script expects the DOM nodes to exist. Ensure root is mounted.
        // `script.js` runs init when ready, so nothing more to do here for POC.
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading Diwali vendor scripts', err);
        try {
          setLoadError(err instanceof Error ? err.message : String(err));
        } catch (e) {}
      }
    };

    loadAllRef.current = loadAll;
    // kick off initial load
    loadAll();

    return () => {
      destroyed = true;
      // It's tricky to fully teardown the original script since it registers global listeners and state.
      // For a POC we simply remove the main node so it won't be visible; a full port will add proper cleanup.
      // Clear any portal host created
      try {
        if (portalHostRef.current && portalHostRef.current.parentElement === document.body) {
          document.body.removeChild(portalHostRef.current);
        }
        portalHostRef.current = null;
      } catch (e) {
        // ignore
      }
      try {
        const fn = (window as any).__diwali_adjust_canvases;
        if (fn) {
          window.removeEventListener('resize', fn);
          // tidy up
          delete (window as any).__diwali_adjust_canvases;
        }
      } catch (e) {
        // ignore
      }

      // Remove any listeners we attached to pre-existing script tags
      try {
        // cleanup any listeners the loader attached to existing <script> tags
        cleanupAllScriptListeners();
      } catch (e) {
        // ignore
      }

      // clear birthday and continue timers if running
      try {
        const birthdayTimer = (window as any).__diwali_birthday_timer;
        const continueTimer = (window as any).__diwali_continue_timer;
        if (birthdayTimer) {
          clearTimeout(birthdayTimer);
          delete (window as any).__diwali_birthday_timer;
        }
        if (continueTimer) {
          clearTimeout(continueTimer);
          delete (window as any).__diwali_continue_timer;
        }
      } catch (e) {
        // ignore
      }

      // clear finale timers if any
      try {
        const arr: number[] = (window as any).__diwali_finale_timers || [];
        arr.forEach((tm) => clearTimeout(tm));
        delete (window as any).__diwali_finale_timers;
      } catch (e) {
        // ignore
      }

      // clear any timers we tracked locally
      try {
        (timersRef.current || []).forEach((tm) => clearTimeout(tm));
        timersRef.current = [];
      } catch (e) {}

      // Stop any audio the original script may be playing (best-effort)
      try {
        // Prefer full stop if available
        try { stopAllDiwali(); } catch (e) { stopDiwaliAudio(); }
      } catch (e) {}

      // restore body styles if we changed them
      try {
        if (_prevBodyOverflow !== null) document.body.style.overflow = _prevBodyOverflow;
        else document.body.style.removeProperty('overflow');
        if (_prevBodyMargin !== null) document.body.style.margin = _prevBodyMargin;
        else document.body.style.removeProperty('margin');
        if (_prevBodyPadding !== null) document.body.style.padding = _prevBodyPadding;
        else document.body.style.removeProperty('padding');
      } catch (e) {
        // ignore
      }

      // reset reveal state
      try {
        setReveal(true);
        setRevealHidden(false);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Create a portal host appended to document.body so React-managed DOM is isolated
  // from the vendor script which may mutate DOM directly. We create the host on mount
  // and remove it on unmount.
  useEffect(() => {
    try {
      const host = document.createElement('div');
      host.className = 'diwali-portal-host';
      document.body.appendChild(host);
      portalHostRef.current = host;
      // trigger a re-render so we can portal into the host
      setHostReady(true);
    } catch (e) {
      // ignore
      setHostReady(false);
    }

    return () => {
      try {
        if (portalHostRef.current && portalHostRef.current.parentElement === document.body) {
          document.body.removeChild(portalHostRef.current);
        }
      } catch (e) {
        // ignore
      }
      portalHostRef.current = null;
    };
  }, []);

  // When the Continue overlay/button is visible, disable pointer events on the canvases
  // to ensure the vendor script cannot receive pointer events. Restore when hidden.
  useEffect(() => {
    try {
      const main = document.getElementById('main-canvas') as HTMLCanvasElement | null;
      const trails = document.getElementById('trails-canvas') as HTMLCanvasElement | null;
      if (showContinue) {
        if (main) main.style.pointerEvents = 'none';
        if (trails) trails.style.pointerEvents = 'none';
        // focus the continue button for accessibility and save previously focused element
        try {
          prevActiveElementRef.current = document.activeElement as HTMLElement | null;
          setTimeout(() => {
            try { continueButtonRef.current && continueButtonRef.current.focus(); } catch (e) {}
          }, 0);
        } catch (e) {
          // ignore
        }
      } else {
        if (main) main.style.pointerEvents = '';
        if (trails) trails.style.pointerEvents = '';
        // restore focus when overlay is hidden
        try {
          if (prevActiveElementRef.current && typeof (prevActiveElementRef.current as any).focus === 'function') {
            prevActiveElementRef.current.focus();
          }
          prevActiveElementRef.current = null;
        } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
    return () => {
      try {
        const main = document.getElementById('main-canvas') as HTMLCanvasElement | null;
        const trails = document.getElementById('trails-canvas') as HTMLCanvasElement | null;
        if (main) main.style.pointerEvents = '';
        if (trails) trails.style.pointerEvents = '';
      } catch (e) {}
    };
  }, [showContinue]);

  // If portal host isn't ready yet, render nothing (it will render once created)
  if (!hostReady || !portalHostRef.current) return null;

  return createPortal(
    <div ref={rootRef} className="diwali-root">
      {/* Inline the SVG spritesheet (hidden) */}
      <div style={{ height: 0, width: 0, position: 'absolute', visibility: 'hidden' }} dangerouslySetInnerHTML={{ __html: `
        <svg xmlns="http://www.w3.org/2000/svg">
          <symbol id="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></symbol>
          <symbol id="icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></symbol>
          <symbol id="icon-close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></symbol>
          <symbol id="icon-settings" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></symbol>
          <symbol id="icon-sound-on" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></symbol>
          <symbol id="icon-sound-off" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></symbol>
        </svg>
      ` }} />

  {/* App structure from original index.html (trimmed to essentials) */}
      <div className="container">
        {/* hide the original script's loading node until the external script is loaded
            This prevents a brief flash of "Loading" when navigating from the Auth screen */}
        <div className="loading-init" ref={loadingRef} style={{ display: 'none' }}>
          <div className="loading-init__header">Loading</div>
          <div className="loading-init__status">Assembling Shells</div>
        </div>
        <div className="stage-container remove">
          <div className="canvas-container">
            <canvas id="trails-canvas"></canvas>
            <canvas id="main-canvas"></canvas>
          </div>
          <div className="controls">
            <div className="btn pause-btn"><svg fill="white" width="24" height="24"><use href="#icon-pause"></use></svg></div>
            <div className="btn sound-btn"><svg fill="white" width="24" height="24"><use href="#icon-sound-off"></use></svg></div>
            <div className="btn settings-btn"><svg fill="white" width="24" height="24"><use href="#icon-settings"></use></svg></div>
          </div>
          {/* menu and help modal are present in CSS; we keep structure for the script to find elements */}
          <div className="menu hide">
            <div className="menu__inner-wrap">
              <div className="btn btn--bright close-menu-btn">
                <svg fill="white" width="24" height="24"><use href="#icon-close"></use></svg>
              </div>
              <div className="menu__header">Settings</div>
              <div className="menu__subheader">For more info, click any label.</div>
              <form>
                <div className="form-option form-option--select">
                  <label className="shell-type-label">Shell Type</label>
                  <select className="shell-type"></select>
                </div>
                <div className="form-option form-option--select">
                  <label className="shell-size-label">Shell Size</label>
                  <select className="shell-size"></select>
                </div>
                <div className="form-option form-option--select">
                  <label className="quality-ui-label">Quality</label>
                  <select className="quality-ui"></select>
                </div>
                <div className="form-option form-option--select">
                  <label className="sky-lighting-label">Sky Lighting</label>
                  <select className="sky-lighting"></select>
                </div>
                <div className="form-option form-option--select">
                  <label className="scaleFactor-label">Scale</label>
                  <select className="scaleFactor"></select>
                </div>
                <div className="form-option form-option--checkbox">
                  <label className="auto-launch-label">Auto Fire</label>
                  <input className="auto-launch" type="checkbox" />
                </div>
                <div className="form-option form-option--checkbox form-option--finale-mode">
                  <label className="finale-mode-label">Finale Mode</label>
                  <input className="finale-mode" type="checkbox" />
                </div>
                <div className="form-option form-option--checkbox">
                  <label className="hide-controls-label">Hide Controls</label>
                  <input className="hide-controls" type="checkbox" />
                </div>
                <div className="form-option form-option--checkbox form-option--fullscreen">
                  <label className="fullscreen-label">Fullscreen</label>
                  <input className="fullscreen" type="checkbox" />
                </div>
                <div className="form-option form-option--checkbox">
                  <label className="long-exposure-label">Open Shutter</label>
                  <input className="long-exposure" type="checkbox" />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="help-modal">
          <div className="help-modal__overlay"></div>
          <div className="help-modal__dialog">
            <div className="help-modal__header" />
            <div className="help-modal__body" />
            <button type="button" className="help-modal__close-btn">Close</button>
          </div>
        </div>
        {/* Birthday text overlay - appears after 5s */}
        {showBirthday && (
          <div className="birthday-text" role="dialog" aria-label="Birthday message">
            <h1>Happy Birthday 🎂</h1>
            <h2>RUQAYYA JAN 💖</h2>
            <p>May your day sparkle brighter than these fireworks ✨</p>
          </div>
        )}
        
        {/* Continue button - appears after 15s */}
        {showContinue && (
          // Fullscreen transparent overlay that captures *all* pointer events and prevents
          // them from reaching the underlying canvas. This ensures clicking anywhere won't
          // accidentally trigger the fireworks script. The overlay contains the Continue button.
          <div
            className="continue-overlay"
            onClick={(e) => {
              // Capture and stop propagation for clicks on the overlay itself
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <button
              onClick={(e) => {
                // Stop propagation so the overlay handler doesn't forward anything
                e.stopPropagation();
                e.preventDefault();
                // Hide overlay to prevent further interaction
                try { stopAllDiwali(); } catch (err) {}
                try { setShowContinue(false); } catch (err) {}
                try { if (onComplete) onComplete(); } catch (err) {}
              }}
                ref={continueButtonRef}
                className="continue-button"
              aria-label="Continue to next section"
            >
              Deze click ka 💝
            </button>
          </div>
        )}
      </div>
      {/* Loading error / retry UI */}
      {loadError && (
        <div className="diwali-error-overlay" role="alertdialog" aria-live="assertive">
          <div className="diwali-error-inner">
            <p>Failed to load fireworks assets: {loadError}</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try { setLoadError(null); } catch (err) {}
                  try { loadAllRef.current && loadAllRef.current(); } catch (err) {}
                }}
              >
                Retry
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try { setLoadError(null); } catch (err) {}
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reveal overlay that crossfades the fireworks in */}
      {!revealHidden && (
        <div
          className={`reveal-overlay ${reveal ? 'visible' : 'hidden'}`}
          onTransitionEnd={() => {
            if (!reveal) setRevealHidden(true);
          }}
        />
      )}
    </div>,
    portalHostRef.current
  );
};

export default DiwaliFireworks;
