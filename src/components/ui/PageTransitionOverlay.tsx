import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { usePageTransition } from "../../hooks/usePageTransition";

export const PageTransitionOverlay: React.FC = () => {
  const [active, setActive] = useState(false);
  const [transitionActive, setTransitionActive] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  const { isTransitioning, direction: transitionDirection } =
    usePageTransition();

  // Handle scroll-based subtle transitions
  useEffect(() => {
    let timer = 0 as unknown as number;
    let last = 0;
    const arm = () => {
      const now = Date.now();
      if (now - last < 900) return; // throttle
      last = now;
      setActive(true);
      clearTimeout(timer);
      timer = setTimeout(() => setActive(false), 420) as unknown as number;
    };
    const onScroll = () => arm();
    const onWheel = () => arm();
    const onTouch = () => arm();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("hashchange", arm);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("hashchange", arm);
      clearTimeout(timer);
    };
  }, []);

  // Handle explicit page transitions
  useEffect(() => {
    if (isTransitioning) {
      setTransitionActive(true);

      // Animate overlay in
      if (overlayRef.current && swipeRef.current && fadeRef.current) {
        gsap.set([swipeRef.current, fadeRef.current], { clearProps: "all" });

        // Fade overlay
        gsap.fromTo(
          fadeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "power2.out" }
        );

        // Swipe animation
        const isDown = transitionDirection === "down";
        gsap.fromTo(
          swipeRef.current,
          {
            x: isDown ? "-120%" : "120%",
            skewX: isDown ? -12 : 12,
          },
          {
            x: isDown ? "120%" : "-120%",
            skewX: isDown ? -12 : 12,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              // Fade out
              gsap.to(fadeRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                  setTransitionActive(false);
                },
              });
            },
          }
        );
      }
    } else {
      setTransitionActive(false);
    }
  }, [isTransitioning, transitionDirection]);

  return (
    <>
      {/* Subtle scroll-based transition */}
      <AnimatePresence>
        {active && !transitionActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 20,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ x: "-120%", skewX: -12 }}
              animate={{ x: "120%", skewX: -12 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "55%",
                background:
                  "linear-gradient(90deg, rgba(241,179,1,0.0), rgba(241,179,1,0.18), rgba(241,179,1,0.0))",
                filter: "blur(6px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explicit page transition overlay */}
      {transitionActive && (
        <div
          ref={overlayRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            ref={fadeRef}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.85)",
            }}
          />
          <div
            ref={swipeRef}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "60%",
              background:
                "linear-gradient(90deg, rgba(250,204,21,0.0), rgba(250,204,21,0.35), rgba(250,204,21,0.0))",
              filter: "blur(8px)",
              boxShadow: "0 0 60px rgba(250,204,21,0.3)",
            }}
          />
        </div>
      )}
    </>
  );
};
