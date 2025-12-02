import { useEffect, useState, useCallback } from "react";

export interface PageTransitionState {
  isTransitioning: boolean;
  direction: "up" | "down" | "none";
  triggerTransition: (direction?: "up" | "down") => void;
}

let transitionListeners: Array<(state: PageTransitionState) => void> = [];
let triggerTransitionFn: ((direction?: "up" | "down") => void) | null = null;

export function usePageTransition(): PageTransitionState {
  const [state, setState] = useState<PageTransitionState>({
    isTransitioning: false,
    direction: "none",
    triggerTransition: () => {},
  });

  const triggerTransition = useCallback((direction: "up" | "down" = "down") => {
    const newState: PageTransitionState = {
      isTransitioning: true,
      direction,
      triggerTransition,
    };
    setState(newState);
    transitionListeners.forEach((listener) => listener(newState));

    // Auto-complete transition after animation
    setTimeout(() => {
      const completedState: PageTransitionState = {
        isTransitioning: false,
        direction: "none",
        triggerTransition,
      };
      setState(completedState);
      transitionListeners.forEach((listener) => listener(completedState));
    }, 600);
  }, []);

  useEffect(() => {
    const listener = (newState: PageTransitionState) => {
      setState(newState);
    };
    transitionListeners.push(listener);
    triggerTransitionFn = triggerTransition;

    return () => {
      transitionListeners = transitionListeners.filter((l) => l !== listener);
      if (transitionListeners.length === 0) {
        triggerTransitionFn = null;
      }
    };
  }, [triggerTransition]);

  return { ...state, triggerTransition };
}

// Global function to trigger transitions from anywhere
export function triggerPageTransition(direction: "up" | "down" = "down") {
  if (triggerTransitionFn) {
    triggerTransitionFn(direction);
  }
}
