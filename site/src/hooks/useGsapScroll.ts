import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapScroll() {
  useEffect(() => {
    const cleanup: Array<() => void> = [];
    // Parallax background shift removed - not needed for static backgrounds

    // Stagger reveal for elements with data-reveal
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    reveals.forEach((el) => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "none",
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
      cleanup.push(() => ctx.revert());
    });

    // Animate GSAP shapes on scroll
    const shapeContainers =
      document.querySelectorAll<HTMLElement>(".gsap-shapes");
    shapeContainers.forEach((container) => {
      const shapes = container.querySelectorAll<HTMLElement>(".shape");
      const ctx = gsap.context(() => {
        shapes.forEach((shape, index) => {
          gsap.fromTo(
            shape,
            {
              opacity: 0,
              scale: 0,
              rotation: -45,
              x: gsap.utils.random(-100, 100),
              y: gsap.utils.random(-100, 100),
            },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              x: 0,
              y: 0,
              duration: 1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: container,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
              delay: index * 0.1,
            }
          );

          // Floating animation
          gsap.to(shape, {
            y: "+=20",
            rotation: "+=10",
            duration: 3 + index * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      });
      cleanup.push(() => ctx.revert());
    });

    // Animate floating shapes
    const floatingShapes =
      document.querySelectorAll<HTMLElement>(".floating-shape");
    floatingShapes.forEach((shape) => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          shape,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: shape.closest("section"),
              start: "top 70%",
            },
          }
        );

        gsap.to(shape, {
          y: "+=30",
          rotation: "+=360",
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
      cleanup.push(() => ctx.revert());
    });

    // Line draw effect for bent SVG lines
    const lineSvgs =
      document.querySelectorAll<SVGPathElement>(".gsap-line path");
    lineSvgs.forEach((path) => {
      const ctx = gsap.context(() => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: path,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
      cleanup.push(() => ctx.revert());
    });

    // Dotted underline animation (combined dots)
    const dotRows = document.querySelectorAll<HTMLElement>(".gsap-dots");
    dotRows.forEach((row) => {
      const dots = row.querySelectorAll<HTMLElement>(".dot");
      const ctx = gsap.context(() => {
        gsap.fromTo(
          dots,
          { y: 6, opacity: 0, scale: 0.6, filter: "blur(2px)" },
          {
            y: 0,
            opacity: 0.9,
            scale: 1,
            filter: "none",
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.04,
            scrollTrigger: { trigger: row, start: "top 85%" },
          }
        );
      });
      cleanup.push(() => ctx.revert());
    });

    // Animate cards with stagger
    const cardContainers =
      document.querySelectorAll<HTMLElement>(".gsap-cards");
    cardContainers.forEach((container) => {
      const cards = container.querySelectorAll<HTMLElement>(
        ".card, .stat, .team__card, .whyus__card"
      );
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              start: "top 75%",
            },
          }
        );
      });
      cleanup.push(() => ctx.revert());
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);
}
