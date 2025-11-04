// Lightweight script loader used by multiple components.
// Exports a memoized `loadScript` and cleanup helpers for any listeners we attached
// to pre-existing <script> tags.

const scriptLoadMap: Record<string, Promise<void>> = {};
const scriptListenerMap = new Map<string, { el: HTMLScriptElement; handlers: { load?: EventListener; error?: EventListener } }>();

export function loadScript(src: string) {
  if (scriptLoadMap[src]) return scriptLoadMap[src];

  const p = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      // If the existing script has been marked loaded previously, resolve immediately.
      if (((existing as any).dataset && (existing as any).dataset.diwaliLoaded === 'true') || ((existing as any).readyState && (existing as any).readyState === 'complete')) {
        resolve();
        return;
      }

      const onload = () => {
        try { (existing as any).dataset = (existing as any).dataset || {}; (existing as any).dataset.diwaliLoaded = 'true'; } catch (e) {}
        existing.removeEventListener('load', onload);
        existing.removeEventListener('error', onerror);
        scriptListenerMap.delete(src);
        resolve();
      };
      const onerror = () => {
        existing.removeEventListener('load', onload);
        existing.removeEventListener('error', onerror);
        scriptListenerMap.delete(src);
        reject(new Error('Failed to load ' + src));
      };

      existing.addEventListener('load', onload);
      existing.addEventListener('error', onerror);
      scriptListenerMap.set(src, { el: existing, handlers: { load: onload, error: onerror } });
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => {
      try { (s as any).dataset = (s as any).dataset || {}; (s as any).dataset.diwaliLoaded = 'true'; } catch (e) {}
      resolve();
    };
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.body.appendChild(s);
  });

  scriptLoadMap[src] = p;
  return p;
}

export function cleanupScriptListener(src: string) {
  const entry = scriptListenerMap.get(src);
  if (!entry) return;
  const { el, handlers } = entry;
  try {
    if (handlers.load) el.removeEventListener('load', handlers.load);
    if (handlers.error) el.removeEventListener('error', handlers.error);
  } catch (e) {
    // ignore
  }
  scriptListenerMap.delete(src);
}

export function cleanupAllScriptListeners() {
  for (const [src, entry] of Array.from(scriptListenerMap.entries())) {
    const { el, handlers } = entry;
    try {
      if (handlers.load) el.removeEventListener('load', handlers.load);
      if (handlers.error) el.removeEventListener('error', handlers.error);
    } catch (e) {
      // ignore
    }
    scriptListenerMap.delete(src);
  }
}

export default loadScript;
