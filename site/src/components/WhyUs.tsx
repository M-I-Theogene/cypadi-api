import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiCode, FiCpu, FiHeadphones } from "react-icons/fi";

const features = [
  {
    icon: <FiAward />,
    title: "Expertise & Experience",
    description:
      "Years of experience in delivering complex technology solutions across various industries.",
  },
  {
    icon: <FiCode />,
    title: "Customized Solutions",
    description:
      "Tailored solutions designed specifically for your unique business needs.",
  },
  {
    icon: <FiCpu />,
    title: "Cutting-Edge Technology",
    description:
      "Latest technologies including AI/ML, IoT, and modern web frameworks.",
  },
  {
    icon: <FiHeadphones />,
    title: "Reliable Support",
    description:
      "24/7 support and maintenance to ensure your systems run smoothly.",
  },
];

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    const rx = ((y - rect.height / 2) / rect.height) * -8;
    const ry = ((x - rect.width / 2) / rect.width) * 8;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    setHover(false);
  }, []);

  const onEnter = useCallback(() => setHover(true), []);

  const onClick = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return (
    <motion.article
      ref={ref}
      className={`card whyus__card ${hover ? "is-hover" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      data-aos="zoom-in"
      data-aos-delay={delay * 100}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      onClick={onClick}
    >
      <div className="card__glow" />
      <div className="whyus__icon">{icon}</div>
      <h3 className="whyus__title">{title}</h3>
      <p className="whyus__description">{description}</p>
    </motion.article>
  );
}

export const WhyUs: React.FC = () => (
  <section className="section whyus" id="whyus" data-aos="fade-up">
    <div className="whyus__bg" aria-hidden="true" />

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
        className="text-center mb-16"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <motion.div
          className="section-heading"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="heading-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {Array.from("Why Choose Cypadi?").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.03,
                  ease: "easeOut",
                }}
                style={{ display: "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.span
            className="heading-underline heading-underline--grow"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          />
        </motion.div>
        <motion.p
          className="muted max-w-3xl mx-auto text-lg mt-6 text-center"
          style={{ textAlign: "center" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {Array.from(
            "We combine engineering excellence with modern design and dependable delivery."
          ).map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: 0.6 + index * 0.02,
                ease: "easeOut",
              }}
              style={{ display: "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>
      </div>

      <div
        className="whyus__grid gsap-cards"
        data-aos="fade-up"
        data-aos-delay="250"
      >
        {features.map((feature, i) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={i * 0.1}
          />
        ))}
      </div>
    </motion.div>
  </section>
);
