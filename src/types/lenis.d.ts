interface LenisScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  lerp?: number;
  immediate?: boolean;
  lock?: boolean;
  force?: boolean;
}

interface Window {
  lenis?: {
    scrollTo: (target: number | string, options?: LenisScrollOptions) => void;
    destroy: () => void;
    raf: (time: number) => void;
    on: (event: string, callback: (data?: unknown) => void) => void;
  };
}
