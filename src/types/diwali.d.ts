// Type declarations for the global symbols used by the Diwali fireworks script.
// This file narrows `window` for the handful of globals the vendor script exposes.
interface Window {
  // Helpers the wrapper uses
  __diwali_adjust_canvases?: () => void;
  __diwali_birthday_timer?: number;
  __diwali_continue_timer?: number;
  __diwali_finale_timers?: number[];
  __diwali_resume_audio?: () => boolean;

  // Functions in the original script
  init?: () => void;
  startSequence?: () => number | void;
  seqRandomFastShell?: () => number | void;
  seqRandomShell?: () => number | void;

  // Objects
  soundManager?: any;
  toggleSound?: (enable?: boolean) => void;

  // Vendor libs
  fscreen?: any;
  Stage?: any;
  MyMath?: any;
}

declare module '*.css';

export {};
