/**
 * Tiny bridge so Axios interceptors (non-React) can toggle global loading state
 * without importing React from `api.ts`.
 */

let refCount = 0;
let listener: ((busy: boolean) => void) | null = null;

export function registerApiLoadingListener(fn: (busy: boolean) => void) {
  listener = fn;
  return () => {
    listener = null;
  };
}

export function setApiLoading(delta: boolean) {
  refCount += delta ? 1 : -1;
  if (refCount < 0) refCount = 0;
  listener?.(refCount > 0);
}
