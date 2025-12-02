import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiEye } from "react-icons/fi";
import { SectionHeading } from "./ui/SectionHeading";

export const About: React.FC = () => (
  <section className="section about" id="about">
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "none" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center mb-8 md:mb-16 px-4 md:px-0">
        <SectionHeading title="About Cypadi" />
        <p
          className="muted max-w-3xl mx-auto text-sm md:text-base leading-relaxed text-center"
          style={{ textAlign: "center" }}
        >
          We are an innovation-driven technology company crafting reliable,
          secure and scalable solutions. From modern web platforms to ML/AI and
          IoT systems, we partner with organizations to turn bold ideas into
          business value.
        </p>
      </div>

      <div className="about-cards-grid mb-8 md:mb-16 max-w-4xl mx-auto px-4 md:px-0">
        {/* Mission Statement */}
        <motion.div
          className="card p-4 md:p-6 flex-1"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <FiTarget className="text-xl md:text-2xl text-cyp-yellow" />
            <h3 className="text-base md:text-lg font-semibold">Our Mission</h3>
          </div>
          <p className="text-muted text-xs md:text-sm leading-relaxed">
            To empower businesses with cutting-edge technology solutions that
            drive innovation, enhance efficiency, and create lasting value. We
            strive to be the bridge between visionary ideas and technological
            excellence.
          </p>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          className="card p-4 md:p-6 flex-1"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <FiEye className="text-xl md:text-2xl text-cyp-yellow" />
            <h3 className="text-base md:text-lg font-semibold">Our Vision</h3>
          </div>
          <p className="text-muted text-xs md:text-sm leading-relaxed">
            To be the leading technology partner globally, recognized for our
            commitment to innovation, quality, and customer success. We envision
            a future where technology seamlessly integrates with business goals.
          </p>
        </motion.div>
      </div>
    </motion.div>
  </section>
);
