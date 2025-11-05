import React, { useState, useEffect, useCallback, useRef, useMemo, useReducer } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Clock } from "lucide-react";
import { Button } from "./ui/button";
// Confetti will be dynamically imported to avoid bundling it in the initial payload
import "./CountdownSection.refined.css";
import "./CountdownSection.animations.css";
import "./CountdownSection.performance.css";
import "./CountdownSection.optimized.css";
import CelebrationTitle from './CelebrationTitle';

// Local lightweight ErrorBoundary to protect heavy animation sections
class LocalErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Log to console for debugging; in prod this could be sent to telemetry
    // eslint-disable-next-line no-console
    console.error('Animation ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-6 bg-rose-50 text-rose-700 rounded">An animation error occurred.</div>;
    }
    // @ts-ignore - children are valid
    return this.props.children;
  }
}

interface CountdownSectionProps {
  onComplete: () => void;
}

// Configuration and constants (centralized)
const CONFIG = {
  TARGET_DATE: new Date("November 05, 2025 15:58:00"),
  COUNTDOWN_ALERT_THRESHOLD_MS: 11000,
  FINAL_COUNTDOWN_SECONDS: 11,
  HEARTS_ON_ALERT: 1,
  PARTICLE_COUNT: 12,
  CONFETTI_DURATION_MS: 8000,
} as const;

// Set target date for countdown (use CONFIG.TARGET_DATE where needed)
const TARGET_DATE = CONFIG.TARGET_DATE;

type AppState = {
  isComplete: boolean;
  revealStarted: boolean;
  hasPlayedAlert: boolean;
  hasPlayedCheer: boolean;
  showWillConfetti: boolean;
};

const initialState: AppState = {
  isComplete: false, // Force to false initially to ensure proper triggering
  revealStarted: false,
  hasPlayedAlert: false,
  hasPlayedCheer: false,
  showWillConfetti: false,
};

type Action =
  | { type: 'SET_COMPLETE' }
  | { type: 'START_REVEAL' }
  | { type: 'SET_PLAYED_ALERT' }
  | { type: 'SET_PLAYED_CHEER' }
  | { type: 'SET_CONFETTI'; payload: boolean }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_COMPLETE':
      // Once complete, stay complete
      return { ...state, isComplete: true };
    case 'START_REVEAL':
      return { ...state, revealStarted: true };
    case 'SET_PLAYED_ALERT':
      return { ...state, hasPlayedAlert: true };
    case 'SET_PLAYED_CHEER':
      return { ...state, hasPlayedCheer: true };
    case 'SET_CONFETTI':
      // Only allow confetti when complete
      return { ...state, showWillConfetti: state.isComplete ? action.payload : false };
    case 'RESET':
      // On reset, check if we're still past target date
      return { ...initialState, isComplete: new Date() >= TARGET_DATE };
    default:
      return state;
  }
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ onComplete }) => {
  // Debug toggle: set to true to disable overlay blur for quick verification
  const DEBUG_NO_BLUR = false;
  const [appState, dispatch] = useReducer(reducer, initialState);
  const alertSoundRef = useRef<HTMLAudioElement | null>(null);
  const cheerSoundRef = useRef<HTMLAudioElement | null>(null);
  const preloadedAlertRef = useRef<HTMLAudioElement | null>(null);
  const preloadedCheerRef = useRef<HTMLAudioElement | null>(null);
  // user and page motion/visibility settings
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  // dynamic confetti component (lazy-loaded)
  const [ConfettiComp, setConfettiComp] = useState<any>(null);
  // Track timeouts to clear on unmount
  const timersRef = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  // UI-driven pulse and floating heart state (replace direct DOM mutations)
  const [screenPulse, setScreenPulse] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number; top: number; tx: string; ty: string; r: string;}>>([]);
  // Ripple effects managed by React (replaces direct DOM ripple insertion)
  const [ripples, setRipples] = useState<Array<{ id: number; left: number; top: number }>>([]);
  // confetti visibility is now in reducer (appState.showWillConfetti)
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1200, height: typeof window !== 'undefined' ? window.innerHeight : 800 });

  // Adaptive counts based on hardwareConcurrency and reduced-motion
  const hardwareConcurrency = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 4;
  // lightweight runtime low-power detection (small benchmark + hardwareConcurrency check)
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // quick CPU probe: run a small loop and measure duration (keeps main-thread block small)
      const start = performance.now();
      let s = 0;
      // tuned to be short but indicative; reduce iterations if needed
      for (let i = 0; i < 100000; i++) s += i;
      const dur = performance.now() - start;
      // if the loop takes more than 50ms, consider device low-power
      const slowCpuDetected = dur > 50;
      const lowByConcurrency = hardwareConcurrency <= 2;
      setIsLowPowerDevice(Boolean(slowCpuDetected || lowByConcurrency));
      // eslint-disable-next-line no-console
      console.debug('CPU probe ms=', Math.round(dur), 'hc=', hardwareConcurrency, 'lowPower=', Boolean(slowCpuDetected || lowByConcurrency));
    } catch (e) {
      // conservative fallback
      setIsLowPowerDevice(hardwareConcurrency <= 2);
    }
  }, []);
  const effectiveParticleCount = isLowPowerDevice ? 0 : (prefersReducedMotion ? Math.max(6, Math.floor(hardwareConcurrency * 2)) : Math.max(8, Math.floor(hardwareConcurrency * 4)));
  const effectiveConfettiPieces = prefersReducedMotion || isLowPowerDevice ? 0 : Math.min(300, Math.max(60, Math.floor(hardwareConcurrency * 60)));
  const effectiveConfettiDuration = hardwareConcurrency <= 2 ? Math.floor(CONFIG.CONFETTI_DURATION_MS / 2) : CONFIG.CONFETTI_DURATION_MS;

  // Reduce number of particles for better performance and make this depend on adaptive count
  const particles = useMemo(() => Array.from({ length: effectiveParticleCount }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  })), [effectiveParticleCount]);


  // Memoized stable orbs to avoid re-creating animated elements on every tick
  const StableOrbs: React.FC = React.memo(() => {
    if (isLowPowerDevice) return null;
    // Generate stable pseudo-random values once
    const orbs = useMemo(() => {
      const generateStable = (i: number, multiplier: number, max: number) =>
        ((i * multiplier) % max);
      return Array.from({ length: 6 }).map((_, i) => {
        const width = 100 + generateStable(i, 17919, 300);
        const height = 100 + generateStable(i, 31513, 300);
        const left = `${generateStable(i, 12347, 100)}%`;
        const top = `${generateStable(i, 45689, 100)}%`;
        const background = `radial-gradient(circle at center, ${
          i % 2 === 0 ? 'rgba(255,182,193,0.4)' : 'rgba(255,228,225,0.4)'
        } 0%, transparent 70%)`;
        const duration = 10 + i * 2;
        return { width, height, left, top, background, duration, i };
      });
    }, []);

    return (
      <>
        {orbs.map(({ width, height, left, top, background, duration, i }) => (
          <motion.div
            key={i}
            className="absolute rounded-full hardware-accelerated"
            style={{
              width,
              height,
              background,
              left,
              top,
              // reduced blur to lower paint cost
              filter: 'blur(24px)'
            }}
            // only transform/translate/scale are animated to avoid repainting filters
            animate={{ x: [0, 18, 0], y: [0, 12, 0], scale: [1, 1.03, 1] }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </>
    );
  });

  // Particle field memoized to avoid re-renders unless particle set changes
  const ParticleField: React.FC<{ particles: typeof particles; prefersReducedMotion: boolean; isPageVisible: boolean; isVisible: boolean; effectiveConfettiPieces: number; windowSize: { width: number; height: number } }>
    = React.memo(({ particles, prefersReducedMotion, isPageVisible, isVisible, effectiveConfettiPieces, windowSize }) => {
    if (prefersReducedMotion || !isPageVisible || !isVisible || isLowPowerDevice) return null;
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
            <motion.div
            key={particle.id}
            className="absolute"
            style={{ left: particle.left }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{
              y: '-20vh',
              opacity: [0, 1, 1, 0],
              x: [0, 12, -12, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
                {particle.id % 2 === 0 ? (
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-rose-400/60 fill-rose-400/60" />
            ) : (
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-pink-400/60" />
            )}
          </motion.div>
        ))}
      </div>
    );
  });

  // Memoized TimeUnit to avoid re-renders unless its value or alert flags change
  const TimeUnit: React.FC<{ unit: string; value: number; index: number; isFinal: boolean; isHeartbeat: boolean }> = React.memo(({ unit, value, index, isFinal, isHeartbeat }) => {
    return (
      <motion.div
        key={unit}
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.06 }}
        whileHover={{ scale: 1.03, y: -6 }}
        className="relative"
      >
        <motion.div 
          className="time-unit-card rounded-2xl p-6"
        >
          <motion.div
            className={`number-display font-poppins text-4xl md:text-5xl font-bold mb-2 number-3d ${isFinal ? 'final-countdown' : ''} ${isHeartbeat ? 'heartbeat' : ''}`}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            transition={{ type: 'tween', duration: 0.35 }}
          >
            <div className="number-3d-content">
              {value.toString().padStart(2, "0")}
            </div>
          </motion.div>

          <motion.div 
            className="font-dancing text-xl text-rose-500 capitalize"
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {unit}
          </motion.div>

          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="enhanced-sparkle"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 30}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.6, 1, 0.6],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ scale: [1, 1.12, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
        </motion.div>
      </motion.div>
    );
  }, (prev, next) => prev.value === next.value && prev.isFinal === next.isFinal && prev.isHeartbeat === next.isHeartbeat);

  useEffect(() => {
    // IntersectionObserver to pause heavy effects when offscreen
    if (typeof window !== 'undefined' && sectionRef.current) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => setIsVisible(entry.isIntersecting));
      }, { threshold: 0.05 });
      obs.observe(sectionRef.current);
      return () => obs.disconnect();
    }

    // Debounced resize handler for better performance
    let resizeTimer: number;
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) window.clearTimeout(resizeTimer);
    };
  }, []);
  // prefers-reduced-motion listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setPrefersReducedMotion(Boolean((e as any).matches));
    try {
      setPrefersReducedMotion(mq.matches);
      if (mq.addEventListener) mq.addEventListener('change', onChange as any);
      else mq.addListener(onChange as any);
    } catch (e) {
      // older browsers fallback
      try { setPrefersReducedMotion((mq as any).matches); } catch {}
    }
    return () => {
      try {
        if (mq.removeEventListener) mq.removeEventListener('change', onChange as any);
        else mq.removeListener(onChange as any);
      } catch {}
    };
  }, []);

  // Page visibility: pause heavy effects when tab is hidden
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handler = () => setIsPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    handler();
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  // Add transient UI states for reveal effects
  const [backgroundFlash, setBackgroundFlash] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ 
    id: number; 
    left: number; 
    top: number;
    scale: number;
    rotation: number;
    delay: number;
  }>>([]);

  // Audio management with proper cleanup
  const cleanupAudio = useCallback(() => {
    const cleanupSound = (ref: React.MutableRefObject<HTMLAudioElement | null>) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.src = '';
        ref.current.remove();
        ref.current = null;
      }
    };
    cleanupSound(alertSoundRef);
    cleanupSound(cheerSoundRef);
    cleanupSound(preloadedAlertRef);
    cleanupSound(preloadedCheerRef);
  }, []);

  // Celebration effect scheduler - staggers effects for smooth transition
  const scheduleCelebrationEffects = useCallback(() => {
    console.log('scheduleCelebrationEffects called');
    if (!mounted.current) {
      console.log('Component not mounted, skipping celebration');
      return;
    }
    
    // Frame timing helper to ensure smooth transitions
    const scheduleNextFrame = (fn: () => void) => {
      return new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          fn();
          resolve();
        });
      });
    };

    const schedule: Array<{ delay: number; action: () => void }> = [
      // Phase 1: Initial state change only (0ms) - extremely lightweight
      {
        delay: 0,
        action: () => {
          dispatch({ type: 'SET_COMPLETE' });
        }
      },
      // Phase 2: Simple visual feedback (16ms - next frame)
      {
        delay: 16,
        action: () => {
          setBackgroundFlash(true);
        }
      },
      // Phase 3: Title transition effects (100ms)
      {
        delay: 100,
        action: async () => {
          // Small initial sparkle set with precise positioning
          const initialSparkles = Array.from({ length: 4 }).map((_, i) => ({
            id: Date.now() + i,
            left: 50 + (Math.cos((Math.PI * 2 * i) / 4) * 30),
            top: 50 + (Math.sin((Math.PI * 2 * i) / 4) * 30),
            scale: 0.7,
            rotation: (i * 90) % 360, // Exact 90-degree intervals
            delay: i * 0.05
          }));
          await scheduleNextFrame(() => setSparkles(initialSparkles));
        }
      },
      // Phase 4: Audio and ambient effects (300ms)
      {
        delay: 300,
        action: async () => {
          if (!prefersReducedMotion) {
            // Use preloaded audio if available, otherwise create new
            const cheerAudio = preloadedCheerRef.current || new Audio('/cheering.wav');
            cheerAudio.volume = 0.8;

            // Reset audio to start
            try {
              cheerAudio.currentTime = 0;
            } catch (e) {
              console.warn('Could not reset audio time:', e);
            }

            // Function to attempt playback
            const attemptPlay = async () => {
              console.log('Attempting to play celebration sound...');
              try {
                console.log('Audio state before play:', {
                  readyState: cheerAudio.readyState,
                  paused: cheerAudio.paused,
                  currentTime: cheerAudio.currentTime,
                  volume: cheerAudio.volume
                });
                
                await cheerAudio.play();
                console.log('🎉 Celebration sound playing successfully');
                cheerSoundRef.current = cheerAudio;
                dispatch({ type: 'SET_PLAYED_CHEER' });
              } catch (error) {
                console.warn('Could not play celebration sound:', error);
                console.log('Audio state after error:', {
                  readyState: cheerAudio.readyState,
                  paused: cheerAudio.paused,
                  currentTime: cheerAudio.currentTime,
                  error: cheerAudio.error
                });
                return false;
              }
              return true;
            };

            // Try to play with retries
            console.log('Starting celebration sound playback attempts...');
            for (let i = 0; i < 3; i++) {
              console.log(`Attempt ${i + 1} of 3 to play celebration sound`);
              if (await attemptPlay()) {
                console.log('Successfully played celebration sound');
                break;
              }
              if (i < 2) {
                console.log(`Waiting before attempt ${i + 2}...`);
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            }
          }
        }
      },
      // Phase 5: Main celebration (500ms) - heavy effects
      {
        delay: 500,
        action: () => {
          // Only show confetti on capable devices
          if (!prefersReducedMotion && !isLowPowerDevice && isPageVisible && isVisible) {
            // Stagger confetti start
            requestAnimationFrame(() => {
              dispatch({ type: 'SET_CONFETTI', payload: true });
              const confettiHide = window.setTimeout(
                () => dispatch({ type: 'SET_CONFETTI', payload: false }),
                effectiveConfettiDuration
              );
              timersRef.current.push(confettiHide);
            });
          }
        }
      },
      // Phase 6: Delayed sparkle waves (800ms+) - decorative
      {
        delay: 800,
        action: async () => {
          if (prefersReducedMotion || isLowPowerDevice) return;
          
          // Create perfect circular distribution
          const createSparkleWave = (count: number, radius: number) =>
            Array.from({ length: count }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / count;
              return {
                id: Date.now() + i,
                left: 50 + Math.cos(angle) * radius,
                top: 50 + Math.sin(angle) * radius,
                scale: 0.6,
                rotation: (i * (360 / count)) % 360, // Exact angular distribution
                delay: i * (0.8 / count) // Evenly distributed delays
              };
            });

          // Add sparkles in small batches to maintain smoothness
          const wave1 = createSparkleWave(6, 50);
          await scheduleNextFrame(() => setSparkles(wave1));

          // Second wave after a frame
          if (!mounted.current) return;
          const wave2Timer = window.setTimeout(async () => {
            const wave2 = createSparkleWave(8, 70);
            await scheduleNextFrame(() => setSparkles(wave2));
          }, 200);
          timersRef.current.push(wave2Timer);
        }
      }
    ];

    // Use Promise-based sequencing for better timing control
    const executeSchedule = async () => {
      for (const { delay, action } of schedule) {
        if (!mounted.current) break;
        
        await new Promise(resolve => {
          const timer = window.setTimeout(async () => {
            if (mounted.current) {
              await action();
            }
            resolve(null);
          }, delay);
          timersRef.current.push(timer);
        });
      }

      // Cleanup phase - only if still mounted
      if (mounted.current) {
        const cleanupTimer = window.setTimeout(() => {
          requestAnimationFrame(() => {
            if (mounted.current) {
              setSparkles([]);
              setBackgroundFlash(false);
            }
          });
        }, 3000);
        timersRef.current.push(cleanupTimer);
      }
    };

    // Start the sequence
    executeSchedule();
  }, [prefersReducedMotion, isLowPowerDevice, isPageVisible, isVisible, effectiveConfettiDuration]);

  // Mounted ref for avoiding effects after unmount
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    
    // Force immediate completion check on mount
    const now = new Date();
    const targetTime = new Date(TARGET_DATE);
    console.log('Initial mount check:', {
      now: now.toISOString(),
      target: targetTime.toISOString(),
      difference: targetTime.getTime() - now.getTime()
    });
    
    if (now >= targetTime && !appState.isComplete) {
      console.log('🎯 Target date already passed on mount, triggering completion');
      dispatch({ type: 'SET_COMPLETE' });
      scheduleCelebrationEffects();
    }
    
    return () => {
      mounted.current = false;
    };
  }, []);

  // Cleanup audio and refs on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Add styles for enhanced effects
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .reveal-bg-flash {
        position: relative;
      }
      
      .reveal-bg-flash::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.4);
        opacity: 0;
        pointer-events: none;
        animation: gentle-flash 3s ease-in-out forwards;
      }
      
      @keyframes gentle-flash {
        0% { opacity: 0; }
        20% { opacity: 0.4; }
        35% { opacity: 0.35; }
        65% { opacity: 0.2; }
        100% { opacity: 0; }
      }
      
      @keyframes sparkle-pop {
        0% { 
          opacity: 0; 
          transform: translate(-50%, -50%) scale(0.3) rotate(0deg); 
        }
        20% { 
          opacity: 1; 
          transform: translate(-50%, -50%) scale(1) rotate(90deg); 
        }
        80% { 
          opacity: 0.7; 
          transform: translate(-50%, -50%) scale(0.9) rotate(180deg); 
        }
        100% { 
          opacity: 0; 
          transform: translate(-50%, -50%) scale(0.6) rotate(240deg); 
        }
      }
      
      .sparkle-particle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: radial-gradient(circle at 30% 30%, #fff, rgba(255,255,255,0.8) 30%, rgba(255,200,80,0.9) 60%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        /* avoid animating drop-shadow (expensive) */
        box-shadow: 0 2px 8px rgba(255,200,80,0.24);
      }
      
      .gold-pulse {
        /* animate only transform/opacity for performance; keep a subtle static glow */
        box-shadow: 0 6px 18px rgba(255, 215, 120, 0.18), 0 0 40px rgba(255, 200, 80, 0.12);
        animation: gold-pulse 1.5s ease-in-out infinite !important;
      }
      
      @keyframes gold-pulse {
        0%, 100% {
          opacity: 0.95;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.04);
        }
      }

      /* Optimize animation performance */
      .hardware-accelerated {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        will-change: transform;
      }

      .animate-gpu {
        transform: translate3d(0,0,0);
      }
    `;

    // Insert styles only once
    if (!document.getElementById('countdown-styles')) {
      style.id = 'countdown-styles';
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('countdown-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Preload audio resources once (helps with reliable playback)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Function to properly preload an audio file
    const preloadAudio = async (src: string): Promise<HTMLAudioElement | null> => {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        
        // Create a load promise
        const loadPromise = new Promise((resolve, reject) => {
          audio.onloadeddata = () => resolve(audio);
          audio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
        });

        // Set source and begin loading
        audio.src = src;
        await loadPromise;
        
        // Trigger a silent play/pause to handle autoplay restrictions
        try {
          audio.volume = 0;
          await audio.play();
          audio.pause();
          audio.volume = 1;
          console.log(`Successfully preloaded audio: ${src}`);
        } catch (e) {
          console.warn(`Couldn't test play audio ${src}:`, e);
        }

        return audio;
      } catch (e) {
        console.warn(`Failed to preload audio ${src}:`, e);
        return null;
      }
    };

    // Preload both audio files
    Promise.all([
      preloadAudio('/countdown-alert.mp3').then(audio => {
        preloadedAlertRef.current = audio;
      }),
      preloadAudio('/cheering.wav').then(audio => {
        preloadedCheerRef.current = audio;
      })
    ]).catch(e => {
      console.warn('Some audio preloading failed:', e);
    });

    return () => {
      const cleanup = (ref: React.MutableRefObject<HTMLAudioElement | null>) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = '';
          ref.current.remove();
          ref.current = null;
        }
      };
      cleanup(preloadedAlertRef);
      cleanup(preloadedCheerRef);
    };
  }, []);

  // Lazy-load confetti component when we need it to keep initial bundle small
  useEffect(() => {
    if (!appState.showWillConfetti) return;
    // only load when we will show it and motion is allowed
    if (prefersReducedMotion || isLowPowerDevice) return;
    import('react-confetti')
      .then(mod => {
        setConfettiComp(() => mod.default || mod);
      })
      .catch((err) => {
        // ignore load failures (confetti is non-critical)
        console.warn('Failed to load confetti module', err);
      });
  }, [appState.showWillConfetti, prefersReducedMotion]);

  // If page hidden or reduced-motion requested, ensure confetti won't be shown
  useEffect(() => {
    if (!isPageVisible && appState.showWillConfetti) {
      // hide confetti when page hidden
      dispatch({ type: 'SET_CONFETTI', payload: false });
    }
    if (prefersReducedMotion && appState.showWillConfetti) {
      dispatch({ type: 'SET_CONFETTI', payload: false });
    }
  }, [isPageVisible, prefersReducedMotion, appState.showWillConfetti]);

  // Clear queued timers and audio on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
      cleanupAudio();
    };
  }, [cleanupAudio]);

  const calculateInitialTimeLeft = () => {
    const now = new Date();
    const difference = TARGET_DATE.getTime() - now.getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateInitialTimeLeft());

  // Handler that performs the reveal and calls onComplete
  const handleReveal = useCallback(() => {
    if (!appState.isComplete) return;
    // mark reveal started and call parent handler
    dispatch({ type: 'START_REVEAL' });
    onComplete();
  }, [appState.isComplete, onComplete]);

  // Tick the countdown and manage celebration effects
  useEffect(() => {
    let mounted = true;

    const calculateTimeLeft = () => {
      if (!mounted) return;
      
      // Force current time for testing
      const now = new Date();
      console.log('Raw now:', now);
      
      // Ensure TARGET_DATE is properly parsed
      const targetTime = new Date(TARGET_DATE);
      console.log('Raw target:', targetTime);
      
      const difference = targetTime.getTime() - now.getTime();
      console.log('Time difference (ms):', difference);
      console.log('Current completion state:', appState.isComplete);

      // If we're past the target date
      if (difference <= 0) {
        console.log('🎯 Target date reached!');
        console.log('Current state:', {
          isComplete: appState.isComplete,
          showWillConfetti: appState.showWillConfetti,
          hasPlayedCheer: appState.hasPlayedCheer
        });

        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        if (!appState.isComplete) {
          console.log('🎊 Initiating celebration sequence!');
          dispatch({ type: 'SET_COMPLETE' });
          
          // Force immediate confetti
          dispatch({ type: 'SET_CONFETTI', payload: true });
          
          // Schedule celebration effects
          scheduleCelebrationEffects();
          
          // Force confetti timeout
          setTimeout(() => {
            console.log('Forcing confetti cleanup');
            if (mounted) {
              dispatch({ type: 'SET_CONFETTI', payload: false });
            }
          }, CONFIG.CONFETTI_DURATION_MS);
        }
        return;
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }

      // Run audio/visual triggers only when visible to save resources and avoid unwanted autoplay
      if (!isVisible) return;

      // Play countdown alert at threshold
      if (difference > 0 && difference <= CONFIG.COUNTDOWN_ALERT_THRESHOLD_MS && !appState.hasPlayedAlert) {
        dispatch({ type: 'SET_PLAYED_ALERT' });
        // Use preloaded audio if available
        const audio = preloadedAlertRef.current ?? new Audio('/countdown-alert.mp3');
        audio.volume = 0.7;
        audio.play().catch((error) => {
          console.warn('Could not play alert sound:', error);
          setTimeout(() => { try { audio.play().catch(() => {}); } catch {} }, 100);
        });
        alertSoundRef.current = audio;

        // visual pulse
        setScreenPulse(true);
        const pulseRemove = window.setTimeout(() => setScreenPulse(false), 500);
        timersRef.current.push(pulseRemove);

        // floating heart near final seconds
        if (secondsLeft <= 5) {
          const id = Date.now();
          const left = 50 + (Math.random() * 30 - 15);
          const top = 60 + (Math.random() * 10 - 5);
          const tx = `${Math.random() * 200 - 100}px`;
          const ty = `${-100 - Math.random() * 100}px`;
          const r = `${Math.random() * 360}deg`;
          setFloatingHearts(h => [...h, { id, left, top, tx, ty, r }]);
          const heartRemove = window.setTimeout(() => {
            setFloatingHearts(h => h.filter(x => x.id !== id));
          }, 1500);
          timersRef.current.push(heartRemove);
        }
      } else if (alertSoundRef.current && difference > CONFIG.COUNTDOWN_ALERT_THRESHOLD_MS) {
        // stop alert if it was playing and we're above threshold again
        try { alertSoundRef.current.pause(); } catch {}
        alertSoundRef.current = null;
      }

      // Note: Celebration is now handled by scheduleCelebrationEffects
    };

    // immediate call
    calculateTimeLeft();

    // Polling for time updates is lightweight; heavy triggers are gated by isVisible
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [isVisible, appState.hasPlayedAlert, appState.isComplete]);

  // Note: auto-triggering has been removed — reveal now only happens
  // when the user clicks the "Surprise Unlocked!" button.

  return (
  <section ref={sectionRef} className={`countdown-section relative min-h-screen py-24 px-6 overflow-hidden hardware-accelerated
    ${appState.isComplete ? 'celebration-theme' : 'anticipation-theme'}
    ${backgroundFlash ? 'reveal-bg-flash' : ''}`}>        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 -z-10" 
          style={{
            backgroundImage: appState.isComplete ? 
              `linear-gradient(120deg, 
                #FF69B4,
                #FF1493,
                #FF69B4
              )` : 
              `linear-gradient(120deg, 
                rgba(255, 182, 193, 0.7),
                rgba(255, 218, 224, 0.8),
                rgba(255, 192, 203, 0.7),
                rgba(255, 228, 225, 0.8)
              )`,
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            transition: 'all 1.5s ease-in-out',
          }}
        />
        
        {/* Dynamic color orbs - memoized with stable values */}
        <div className="absolute inset-0 overflow-hidden -z-5">
          <StableOrbs />
        </div>

        {/* Enhanced bokeh backdrop */}
        <div className="bokeh-layer" aria-hidden />
        
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 10s linear infinite',
          }}
        />
        
        {/* Petal overlay with enhanced opacity */}
        <div className="petal-overlay opacity-40" aria-hidden />

        {/* Use the 'I knew it' confetti + floating particles when triggered */}
        {appState.showWillConfetti && (
          <>
            {/* Render dynamic confetti if the module loaded and motion is allowed */}
            {ConfettiComp && !prefersReducedMotion && isPageVisible && isVisible && (
              <ConfettiComp
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={effectiveConfettiPieces}
                gravity={0.25}
                colors={["#fb7185", "#f43f5e", "#fda4af", "#fbbf24", "#ffffff"]}
              />
            )}

            {/* Ambient glow layers (from WillYouBeMyWife) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-2xl animate-float-slow composite-layer" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-300/30 rounded-full blur-2xl animate-float composite-layer" />
            </div>

            {/* Floating particles (hearts / dots) — capped by effectiveParticleCount */}
            <ParticleField particles={particles} prefersReducedMotion={prefersReducedMotion} isPageVisible={isPageVisible} isVisible={isVisible} effectiveConfettiPieces={effectiveConfettiPieces} windowSize={windowSize} />
          </>
        )}
        
        {/* Screen pulse (replaces direct DOM insertion) */}
        {screenPulse && <div className="screen-pulse" aria-hidden />}

        {/* Floating hearts (replaces direct DOM insertion) */}
        {floatingHearts.map(h => (
          <div
            key={h.id}
            className="floating-heart"
            aria-hidden
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              '--tx': h.tx,
              '--ty': h.ty,
              '--r': h.r
            } as React.CSSProperties}
          >
            ❤️
          </div>
        ))}

  {/* Radial rays with increased glow */}
  {appState.isComplete && <div className="radial-rays" aria-hidden />}

      {/* Enhanced Floating Romantic Elements with stable positions */}
      <div className="floating-elements-container composite-layer hardware-accelerated">
        {useMemo(() => Array.from({ length: 8 }).map((_, i) => {
          const complete = appState.isComplete;
          const Icon = i % 3 === 0 ? Heart : i % 2 === 0 ? Star : Sparkles;
          const generateStable = (base: number, range: number, seed: number) => 
            base + (((i * seed) % 100) / 100) * range;
          
          const depth = ((i * 12347) % 100) / 100;
          const iconSizePx = 24 + Math.floor(depth * 16);
          const left = `${generateStable(15, 70, 17919)}%`;
          const top = `${generateStable(15, 70, 31513)}%`;
          const zIndex = Math.floor(depth * 10);
          const rotateDuration = generateStable(3, 2, 45689);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ 
                opacity: complete ? 0.25 : 0.15,
                scale: 1,
                y: 0
              }}
              transition={{ delay: i * 0.2, duration: 1.5, ease: 'easeOut' }}
              className="floating-element absolute pointer-events-none"
              style={{ left, top, zIndex, willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: complete ? [0.9, 1.1] : [0.95, 1.05]
                }}
                transition={{ duration: rotateDuration, repeat: Infinity, ease: 'easeInOut', delay: i * -0.2 }}
              >
                <Icon
                  className={`${complete ? 'text-rose-300' : 'text-rose-200'}`}
                  style={{ width: iconSizePx, height: iconSizePx }}
                  fill="currentColor"
                />
              </motion.div>
            </motion.div>
          );
        }), [appState.isComplete])}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <LocalErrorBoundary>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <motion.div 
              className="inline-block relative"
              animate={{
                rotate: [0, 360],
                transition: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            >
              <motion.div
                // only animate scale/opacity for performant animation
                animate={{
                  scale: [1, 1.06, 1],
                  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Clock className="w-20 h-20 text-rose-500" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.12, 0.8],
                  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -right-4 -top-4"
              >
                <Sparkles className="w-8 h-8 text-rose-400" />
              </motion.div>
            </motion.div>
{/* Celebration / Title (extracted) */}
                <CelebrationTitle
  isComplete={appState.isComplete}
  name={"Ruqayya Jaan 💫"}
  subtitle={"This Is Your Moment ❤️"}
/>
            

          </div>

          {!appState.isComplete && (
            <div
              role="timer"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {Object.entries(timeLeft).map(([unit, value], index) => (
                <TimeUnit
                  key={unit}
                  unit={unit}
                  value={value as number}
                  index={index}
                  isFinal={timeLeft.seconds <= 11}
                  isHeartbeat={timeLeft.seconds <= 5}
                />
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent max-w-sm mx-auto"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scaleX: [0.95, 1.05, 0.95],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-50 px-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
              </motion.div>
            </div>

            <motion.p
              style={{
                background: 'linear-gradient(120deg, #be123c, #e11d48, #be123c)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                animation: 'shimmer-wave 3s linear infinite',
                textShadow: '0 0 20px rgba(190,18,60,0.4)',
                filter: 'drop-shadow(0 2px 6px rgba(190,18,60,0.4))',
              }}
              className="font-dancing text-2xl"
              animate={{
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {appState.isComplete ? "Finally sharing what I’ve been working on for you, jana ❤️" : "Preparing something special for u jana ❤️..."}
            </motion.p>

            <motion.div 
              className="flex justify-center gap-2"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-rose-400" />
              </motion.div>
              <motion.p
                className={`font-poppins italic ${appState.isComplete ? 'text-rose-900' : 'text-rose-700/60'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {appState.isComplete ? "Your journey awaits..." : "The anticipation builds..."}
              </motion.p>
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, -180, -360],
                }}
                transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-rose-400" />
              </motion.div>
            </motion.div>

            {/* Enhanced reveal button with ambient effects */}
            <div className="flex justify-center mt-12 relative">
              {/* Enhanced ambient glow layers */}
              <AnimatePresence>
                {appState.isComplete && (
                  <>
                    {/* Outer radial burst */}
                    <motion.div
                      key="outer-burst"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: [0, 0.36, 0],
                        scale: [1, 2.2, 2.8]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        times: [0, 0.5, 1]
                      }}
                      className="outer-burst absolute rounded-full bg-gradient-to-r from-rose-300/40 via-pink-400/40 to-rose-300/40"
                      style={{ 
                        width: 240,
                        height: 240,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                    
                    {/* Middle glow ring */}
                    <motion.div
                      key="middle-ring"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: [0, 0.44, 0],
                        scale: [1, 1.6, 2]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                      className="middle-ring absolute rounded-full bg-gradient-to-r from-rose-400/50 via-pink-500/50 to-rose-400/50"
                      style={{ 
                        width: 180,
                        height: 180,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                    
                    {/* Inner pulsing core */}
                    <motion.div
                      key="inner-pulse"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: [0.32, 0.68, 0.32],
                        scale: [1, 1.24, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                      className="inner-pulse absolute rounded-full bg-gradient-to-r from-rose-500/60 via-pink-600/60 to-rose-500/60"
                      style={{ 
                        width: 140,
                        height: 140,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                    
                    {/* Quick flash bursts */}
                    <motion.div
                      key="flash-bursts"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: [0, 0.28, 0],
                        scale: [1, 1.38, 1.9],
                        rotate: [0, 160, 320]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.7
                      }}
                      className="absolute w-full h-full"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(244,114,182,0.36) 0%, transparent 60%)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  </>
                )}
              </AnimatePresence>

              <motion.div 
                style={{ zIndex: 10 }}
                animate={appState.revealStarted ? {
                  scale: [1, 1.06, 1],
                  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                } : {}}
              >
                <Button
                  onClick={(e) => {
                    // React-managed ripple: compute local coords and add to state
                    const button = e.currentTarget as HTMLElement;
                    const rect = button.getBoundingClientRect();
                    const left = e.clientX - rect.left;
                    const top = e.clientY - rect.top;
                    const id = Date.now();
                    setRipples(r => [...r, { id, left, top }]);

                    // schedule ripple removal and track timer for cleanup
                    const removeTimer = window.setTimeout(() => {
                      setRipples(r => r.filter(x => x.id !== id));
                    }, 1000);
                    timersRef.current.push(removeTimer);

                    // Add haptic feedback for mobile
                    if (window.navigator.vibrate) {
                      window.navigator.vibrate(200);
                    }

                    handleReveal();
                  }}
                  disabled={!appState.isComplete}
                  className={`magic-button enhanced-button px-8 py-4 rounded-full text-lg font-semibold shadow-lg relative overflow-hidden
                    ${appState.isComplete 
                        ? "bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:via-pink-600 hover:to-rose-600 text-white transform hover:scale-105 transition-transform" 
                        : "bg-rose-300 text-white/70 cursor-not-allowed"
                      }`}
                >
                    {appState.isComplete && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5
                      }}
                    />
                  )}
                  <motion.span 
                    className="relative z-10 flex items-center gap-2"
                    animate={appState.isComplete ? {
                      scale: [1, 1.05, 1],
                      // animate transform and opacity only for performance
                      opacity: [1, 0.98, 1]
                    } : {}}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {appState.isComplete ? (
                      <>
                        <motion.div
                          animate={{
                            rotate: [0, 180, 360],
                            scale: [0.9, 1.08, 0.9]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        <span>Surprise Unlocked!</span>
                        <motion.div
                          animate={{
                            rotate: [0, -180, -360],
                            scale: [0.9, 1.08, 0.9]
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      </>
                    ) : (
                      'Waiting for the moment...'
                    )}
                  </motion.span>
                    {/* shimmer trail on hover */}
                    <span className="hover-shimmer" />

                    {/* orbiting sparkles when celebration active */}
                    {appState.isComplete && [0,1,2].map(n => (
                      <span key={n} className="orbit-sparkle" style={{ animationDelay: `${n * 0.4}s` }} />
                    ))}
                    {/* Render React-managed ripples */}
                    {ripples.map(r => (
                      <span
                        key={r.id}
                        className="ripple"
                        aria-hidden
                        style={{ left: `${r.left}px`, top: `${r.top}px` } as React.CSSProperties}
                      />
                    ))}
                  </Button>

                {/* Enhanced sparkles with varied animations */}
                <AnimatePresence>
                  {sparkles.map(s => (
                    <motion.div
                      key={s.id}
                      className="enhanced-sparkle"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, s.scale, 0],
                        rotate: [0, s.rotation, s.rotation * 2],
                        x: `${s.left}%`,
                        y: `${s.top}%`,
                      }}
                      transition={{
                        duration: 1.2,
                        delay: s.delay,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
        </LocalErrorBoundary>
      </div>
    </section>
  );
};

export default CountdownSection;
