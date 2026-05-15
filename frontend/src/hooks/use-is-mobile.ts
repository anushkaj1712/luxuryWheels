"use client";

import * as React from "react";

const MOBILE_MAX = 767;

/** Viewport ≤767px — tune animation weight on phones. */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mobile;
}
