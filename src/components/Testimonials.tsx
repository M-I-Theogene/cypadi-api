import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const data = [
  {
    name: "Ama",
    text: "Cypadi delivered beyond expectations with stellar performance.",
  },
  {
    name: "Kwame",
    text: "Fast, reliable and secure — great partner for our business.",
  },
  {
    name: "Akosua",
    text: "Beautiful design and solid engineering. Highly recommended.",
  },
];

export const Testimonials: React.FC = () => (
  <section className="section testimonials" id="testimonials">
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center mb-12">
        <SectionHeading title="Testimonials" />
      </div>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={24}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
      >
        {data.map((t) => (
          <SwiperSlide key={t.name}>
            <blockquote className="testimonial" data-aos="fade-in">
              <p>“{t.text}”</p>
              <footer>— {t.name}</footer>
            </blockquote>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  </section>
);
