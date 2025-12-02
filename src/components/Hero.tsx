import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { Particles } from "@tsparticles/react";
import {
  FiCpu,
  FiCloud,
  FiSmartphone,
  FiGlobe,
  FiWifi,
  FiDatabase,
} from "react-icons/fi";

export const Hero: React.FC = () => {
  const shapesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const shapes = shapesRef.current?.querySelectorAll("span");
      if (!shapes) return;
      shapes.forEach((el, i) => {
        const speed = 0.08 + i * 0.04;
        (el as HTMLElement).style.transform = `translateY(${
          y * speed
        }px) rotate(${y * (0.01 + i * 0.005)}deg)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="section hero" id="home">
      <div className="hero__shapes" aria-hidden="true" ref={shapesRef}>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        <motion.i
          style={{
            position: "absolute",
            left: "12%",
            top: "24%",
            color: "#f1b301",
            fontSize: 22,
            opacity: 0.85,
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiCpu />
        </motion.i>
        <motion.i
          style={{
            position: "absolute",
            right: "18%",
            top: "18%",
            color: "#ffd75a",
            fontSize: 20,
            opacity: 0.7,
          }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiCloud />
        </motion.i>
        <motion.i
          style={{
            position: "absolute",
            left: "22%",
            bottom: "18%",
            color: "#f1b301",
            fontSize: 20,
            opacity: 0.75,
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiSmartphone />
        </motion.i>
        <motion.i
          style={{
            position: "absolute",
            right: "10%",
            bottom: "16%",
            color: "#f1c23a",
            fontSize: 22,
            opacity: 0.8,
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiGlobe />
        </motion.i>
        <motion.i
          style={{
            position: "absolute",
            left: "8%",
            top: "50%",
            color: "#f1b301",
            fontSize: 18,
            opacity: 0.6,
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiWifi />
        </motion.i>
        <motion.i
          style={{
            position: "absolute",
            right: "26%",
            top: "54%",
            color: "#ffd75a",
            fontSize: 18,
            opacity: 0.65,
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiDatabase />
        </motion.i>
      </div>
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          fullScreen: { enable: false },
          interactivity: {
            events: {
              onHover: { enable: true, mode: ["repulse", "bubble"] },
              resize: { enable: true },
            },
            modes: {
              repulse: { distance: 120, duration: 0.4 },
              bubble: { distance: 140, duration: 0.4, size: 4, opacity: 0.6 },
            },
          },
          particles: {
            color: { value: "#f1b301" },
            links: {
              enable: true,
              color: "#f1b301",
              distance: 130,
              opacity: 0.3,
            },
            move: { enable: true, speed: 1.1 },
            number: { value: 38 },
            opacity: { value: 0.4 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />
      <div className="container hero__inner">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero__title"
        >
          <span
            className="glitch"
            data-text="Innovating the Future of Technology"
          >
            Innovating the Future of Technology
          </span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="hero__subtitle"
        >
          <Typewriter
            options={{
              strings: [
                "Web & Mobile Engineering",
                "AI/ML Applications",
                "IoT & Edge Solutions",
                "API Integrations (MoMo, SMS)",
                "Secure Hosting & DevOps",
                "Wireless Telecommunications",
              ],
              autoStart: true,
              loop: true,
              delay: 28,
              deleteSpeed: 14,
            }}
          />
        </motion.div>
        <div className="hero__cta" data-aos="zoom-in">
          <a href="#contact" className="btn btn--glow">
            Get Started
          </a>
          <a href="#services" className="btn btn--outline">
            Our Services
          </a>
        </div>
      </div>
    </section>
  );
};
