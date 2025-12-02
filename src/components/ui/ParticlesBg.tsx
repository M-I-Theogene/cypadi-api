import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export type ParticlesBgProps = {
  id?: string;
  color?: string;
  density?: number;
  zIndex?: number;
};

export const ParticlesBg: React.FC<ParticlesBgProps> = ({
  id = "particles-bg",
  color = "#facc15",
  density = 36,
  zIndex = 0,
}) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const particlesLoaded = async (_?: Container) => {};

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 60,
      fullScreen: { enable: false, zIndex },
      interactivity: {
        events: {
          onHover: { enable: true, mode: ["repulse", "bubble"] },
          resize: { enable: true },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          bubble: { distance: 140, duration: 0.4, size: 2.5, opacity: 0.5 },
        },
      },
      particles: {
        color: { value: color },
        links: { enable: true, color, distance: 130, opacity: 0.22, width: 1 },
        move: { enable: true, speed: 0.8 },
        number: { value: density },
        opacity: { value: 0.35 },
        size: { value: { min: 1, max: 2.5 } },
      },
      detectRetina: true,
      background: { color: { value: "transparent" } },
    }),
    [color, density, zIndex]
  );

  if (!init) return null;

  return (
    <Particles id={id} options={options} particlesLoaded={particlesLoaded} />
  );
};












