import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { ScaleLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const contentType = response.headers.get("content-type");
      const payload = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
      const normalized =
        typeof payload === "string" ? { message: payload } : payload;

      if (!response.ok || !normalized?.success) {
        throw new Error(
          normalized?.message ||
            "We couldn't send your message. Please try again."
        );
      }

      setStatus({
        type: "success",
        message: normalized.message || "Your message has been delivered.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section contact" id="contact" data-aos="fade-up">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
          <SectionHeading title="Contact Us" />
          <p
            className="muted max-w-2xl mx-auto text-sm md:text-base px-4 md:px-0 text-center"
            style={{ textAlign: "center" }}
            data-aos="fade-up"
            data-aos-delay="50"
          >
            Get in touch with us. We're here to help bring your ideas to life.
          </p>
        </div>

        <div className="contact__wrapper">
          {/* Contact Form */}
          <motion.form
            className="form"
            data-aos="fade-right"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="form__group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
                className="form__input"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                required
                className="form__input"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                rows={6}
                required
                className="form__input form__textarea"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <motion.button
              className="btn btn--glow form__submit"
              type="submit"
              whileHover={sending ? {} : { scale: 1.02 }}
              whileTap={sending ? {} : { scale: 0.98 }}
              disabled={sending}
              aria-busy={sending}
            >
              {sending ? (
                <div className="form__submit-loading">
                  <ScaleLoader
                    height={16}
                    width={4}
                    radius={2}
                    margin={2}
                    color="#111111"
                  />
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Send Message
                </>
              )}
            </motion.button>

            {status && (
              <motion.div
                className={`form__status form__status--${status.type}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                aria-live="polite"
              >
                {status.type === "success" ? (
                  <FiCheckCircle />
                ) : (
                  <FiAlertCircle />
                )}
                <span>{status.message}</span>
              </motion.div>
            )}
          </motion.form>

          {/* Contact Info & Map */}
          <motion.div
            data-aos="fade-left"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="contact__info">
              <h3 className="contact__info-title">Reach Us Directly</h3>
              <ul className="contact__info-list">
                <li className="contact__info-item">
                  <FiMail className="contact__info-icon" />
                  <div>
                    <span className="contact__info-label">Email</span>
                    <a
                      href="mailto:info@cypadi.com"
                      className="contact__info-link"
                    >
                      info@cypadi.com
                    </a>
                  </div>
                </li>
                <li className="contact__info-item">
                  <FiPhone className="contact__info-icon" />
                  <div>
                    <span className="contact__info-label">Phone</span>
                    <a href="tel:+250784801809" className="contact__info-link">
                      +250 784 801 809
                    </a>
                  </div>
                </li>
                <li className="contact__info-item">
                  <FiMapPin className="contact__info-icon" />
                  <div>
                    <span className="contact__info-label">Location</span>
                    <span className="contact__info-text">Kigali, Rwanda</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="contact__map">
              <iframe
                title="map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.536055940174!2d30.12898667396126!3d-1.9380489980443425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xffc4c8632468e3f%3A0xed0a1aedbc8e6930!2sCYPADI%20LTD!5e0!3m2!1sen!2srw!4v1762285978835!5m2!1sen!2srw"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export const Contact: React.FC = () => (
  <section className="section contact" id="contact" data-aos="fade-up">
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <div className="text-center mb-8 md:mb-12 px-4 md:px-0">
        <SectionHeading title="Contact Us" />
        <p
          className="muted max-w-2xl mx-auto text-sm md:text-base px-4 md:px-0 text-center"
          style={{ textAlign: "center" }}
          data-aos="fade-up"
          data-aos-delay="50"
        >
          Get in touch with us. We're here to help bring your ideas to life.
        </p>
      </div>

      <div className="contact__wrapper">
        {/* Contact Form */}
        <motion.form
          className="form"
          data-aos="fade-right"
          onSubmit={(e) => e.preventDefault()}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="form__group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
              className="form__input"
            />
          </div>

          <div className="form__group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="form__input"
            />
          </div>

          <div className="form__group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              rows={6}
              required
              className="form__input form__textarea"
            />
          </div>

          <motion.button
            className="btn btn--glow form__submit"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSend className="mr-2" />
            Send Message
          </motion.button>
        </motion.form>

        {/* Contact Info & Map */}
        <motion.div
          data-aos="fade-left"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="contact__info">
            <h3 className="contact__info-title">Reach Us Directly</h3>
            <ul className="contact__info-list">
              <li className="contact__info-item">
                <FiMail className="contact__info-icon" />
                <div>
                  <span className="contact__info-label">Email</span>
                  <a
                    href="mailto:info@cypadi.com"
                    className="contact__info-link"
                  >
                    info@cypadi.com
                  </a>
                </div>
              </li>
              <li className="contact__info-item">
                <FiPhone className="contact__info-icon" />
                <div>
                  <span className="contact__info-label">Phone</span>
                  <a href="tel:+250 786 315 686" className="contact__info-link">
                    +250 786 315 686
                  </a>
                </div>
              </li>
              <li className="contact__info-item">
                <FiMapPin className="contact__info-icon" />
                <div>
                  <span className="contact__info-label">Location</span>
                  <span className="contact__info-text">Kigali, Rwanda</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact__map">
            <iframe
              title="map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.536055940174!2d30.12898667396126!3d-1.9380489980443425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xffc4c8632468e3f%3A0xed0a1aedbc8e6930!2sCYPADI%20LTD!5e0!3m2!1sen!2srw!4v1762285978835!5m2!1sen!2srw"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  </section>
);
