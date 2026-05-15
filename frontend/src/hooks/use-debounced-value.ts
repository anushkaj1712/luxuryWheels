"use client";

import * as React from "react";

/** Debounces fast input (search) to cut API churn and keep typing smooth. */
export function useDebouncedValue<T>(value: T, delayMs = 320): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}
