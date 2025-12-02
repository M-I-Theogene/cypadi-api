import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import {
  FiCpu,
  FiGlobe,
  FiCloud,
  FiRadio,
  FiShoppingCart,
  FiSettings,
  FiBookOpen,
  FiShield,
  FiCreditCard,
} from "react-icons/fi";

const items = [
  {
    icon: <FiCpu />,
    title: "AI/ML Integration & Projects",
    desc: "Automations, predictive models and data intelligence tuned to your workflows.",
  },
  {
    icon: <FiRadio />,
    title: "IoT Projects",
    desc: "Connected sensors, gateways and dashboards for real‑time visibility.",
  },
  {
    icon: <FiCloud />,
    title: "Web Hosting",
    desc: "Secure, scalable, fully managed hosting with 99.9% uptime.",
  },
  {
    icon: <FiGlobe />,
    title: "Web & Application Development",
    desc: "Full‑stack web systems and custom apps engineered for performance.",
  },
  {
    icon: <FiShoppingCart />,
    title: "E‑commerce Websites",
    desc: "Conversion‑ready storefronts with payments, invoicing and fulfillment flows.",
  },
  {
    icon: <FiSettings />,
    title: "Computer Maintenance & Networks",
    desc: "Workstation repairs, LAN/WAN setup and proactive monitoring.",
  },
  {
    icon: <FiBookOpen />,
    title: "ICT Training & Internship",
    desc: "Hands‑on curricula, mentorship and placement for future tech talent.",
  },
  {
    icon: <FiShield />,
    title: "Network Security & Cybersecurity",
    desc: "Risk assessments, advanced monitoring and incident response programs.",
  },
  {
    icon: <FiCreditCard />,
    title: "Payment & SMS API Integration",
    desc: "MoMo, card and messaging APIs unified for seamless customer journeys.",
  },
];

function ServiceCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
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
    const rx = ((y - rect.height / 2) / rect.height) * -10; // rotateX
    const ry = ((x - rect.width / 2) / rect.width) * 10; // rotateY
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
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
    <article
      ref={ref}
      className={`card ${hover ? "is-hover" : ""}`}
      data-aos="zoom-in"
      data-aos-delay={delay}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      onClick={onClick}
    >
      <div className="card__glow" />
      <div className="card__icon">{icon}</div>
      <h3 className="card__title">{title}</h3>
      <p className="card__desc">{desc}</p>
    </article>
  );
}

export const Services: React.FC = () => (
  <section className="section services" id="services" data-aos="fade-up">
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div data-aos="fade-up" data-aos-delay="150">
        <SectionHeading title="Our Services" />
      </div>
      <div
        className="services__grid gsap-cards"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {items.map((s, i) => (
          <ServiceCard
            key={s.title}
            icon={s.icon}
            title={s.title}
            desc={s.desc}
            delay={i * 80}
          />
        ))}
      </div>
    </motion.div>
  </section>
);
