import { useEffect, useRef } from "react";
import { triggerPageTransition } from "./usePageTransition";

export function useScrollTransition() {
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isTransitioning.current) return;

      const currentScrollY = window.scrollY;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
      const scrollDirection =
        currentScrollY > lastScrollY.current ? "down" : "up";

      // Only trigger on significant scrolls (more than 300px)
      if (scrollDiff > 300) {
        // Check if we're crossing a major section boundary
        const sections = document.querySelectorAll("section[id], div[id]");
        let currentSection: Element | null = null;
        let nextSection: Element | null = null;

        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;

          if (
            currentScrollY >= sectionTop - 200 &&
            currentScrollY < sectionTop + rect.height
          ) {
            currentSection = section;
            if (scrollDirection === "down" && index < sections.length - 1) {
              nextSection = sections[index + 1];
            } else if (scrollDirection === "up" && index > 0) {
              nextSection = sections[index - 1];
            }
          }
        });

        // Trigger transition if we're moving between major sections
        if (currentSection && nextSection) {
          isTransitioning.current = true;
          triggerPageTransition(scrollDirection);

          // Reset transitioning flag after animation
          if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
          }
          scrollTimeout.current = setTimeout(() => {
            isTransitioning.current = false;
          }, 800);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);
}
