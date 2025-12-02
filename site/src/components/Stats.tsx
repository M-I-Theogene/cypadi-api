import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";

type Stat = { label: string; end: number; suffix?: string };

const stats: Stat[] = [
  { label: "Projects Delivered", end: 100, suffix: "+" },
  { label: "Satisfied Clients", end: 80, suffix: "+" },
  { label: "APIs Integrated", end: 50, suffix: "+" },
  { label: "Uptime", end: 99, suffix: "%" },
];

function useCounter(target: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const durationMs = 1200;
    const totalFrames = Math.round((durationMs / 1000) * 60);
    const animate = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target]);
  return value;
}

export const Stats: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section stats" id="stats" ref={ref} data-aos="fade-up">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div
          className="text-center mb-10"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <SectionHeading title="Our Achievements" />
        </div>
        <div
          className="stats__grid gsap-cards"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {stats.map((s) => {
            const val = useCounter(s.end, visible);
            return (
              <div
                key={s.label}
                className="stat"
                data-aos="zoom-in"
                data-aos-delay={stats.indexOf(s) * 100}
              >
                <div className="stat__num">
                  {val}
                  {s.suffix ?? ""}
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
