import React, { useEffect, useRef } from "react";

export const CursorGlow: React.FC<{ color?: string; size?: number }> = ({
  color = "rgba(241,179,1,0.35)",
  size = 220,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    };
    const render = () => {
      if (!el) return;
      el.style.setProperty("--gx", `${mouseX}px`);
      el.style.setProperty("--gy", `${mouseY}px`);
      raf = 0;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="cursor-glow"
      style={{
        // gradient drawn via CSS var positions
        background: `radial-gradient(${size}px ${size}px at var(--gx) var(--gy), ${color}, transparent 60%)`,
      }}
    />
  );
};
