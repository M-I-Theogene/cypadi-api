import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { ParticlesBg } from "./ui/ParticlesBg";
import { SectionHeading } from "./ui/SectionHeading";

type Member = {
  img: string;
  name: string;
  title: string;
  tags: string[];
};

// Get base URL with trailing slash
const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") + "/";

const members: Member[] = [
  {
    img: `${BASE_URL}team/paccy.jpg`,
    name: "Masengesho Pacifique",
    title: "CEO, Founder",
    tags: ["UI/UX", "Cybersecurity Analyst"],
  },
  {
    img: `${BASE_URL}team/elias.jpeg`,
    name: "Dukuzumuremyi Elias",
    title: "CPO, Co‑Founder",
    tags: ["System Analyst", "IoT Specialist"],
  },
  {
    img: `${BASE_URL}team/feza.jpeg`,
    name: "Flora Feza",
    title: "AI Specialist, Advisor",
    tags: ["AI/ML", "Advisory"],
  },
  {
    img: `${BASE_URL}team/theogene.jpeg`,
    name: "M.Ishimwe Theogene",
    title: "Full Stack Developer",
    tags: ["Full‑stack", "Cloud"],
  },
];

export const Team: React.FC = () => (
  <section className="section team" id="team" data-aos="fade-up">
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <ParticlesBg
        id="team-particles"
        color="#facc15"
        density={28}
        zIndex={0}
      />
    </div>

    <motion.div
      className="container"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div className="text-center mb-12">
        <SectionHeading title="Meet Our Team" />
        <p
          className="muted max-w-2xl mx-auto text-center"
          style={{ textAlign: "center" }}
          data-aos="fade-up"
          data-aos-delay="80"
        >
          The people behind Cypadi — blending design, engineering and AI to
          build the future.
        </p>
      </div>

      {/* Animated network background */}
      <div className="team__bg" aria-hidden="true" />

      <div className="team__grid">
        {members.map((m, i) => (
          <Tilt
            key={m.name}
            glareEnable
            glareMaxOpacity={0.15}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            scale={1.02}
          >
            <motion.article
              className="team__card"
              data-aos="fade-up"
              data-aos-delay={i * 100}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="team__card-glow" />
              <figure className="team__photo">
                <img src={m.img} alt={m.name} loading="lazy" />
                <i className="team__photo-gradient" />
              </figure>
              <div className="team__content">
                <h3 className="team__name">{m.name}</h3>
                <p className="team__role">{m.title}</p>
                <ul className="team__tags">
                  {m.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </Tilt>
        ))}
      </div>
    </motion.div>
  </section>
);
