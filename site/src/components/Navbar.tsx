import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = () => {
      if (document.body.classList.contains("pace-done")) setReady(true);
    };
    const id = window.setInterval(check, 50);
    check();
    const t = window.setTimeout(() => setReady(true), 3000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(t);
    };
  }, []);

  const magEnter = () => (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transition = "transform 0.2s ease";
  };
  const magMove = () => (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    el.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
  };
  const magLeave = () => (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = "translate(0,0)";
  };

  const links = [
    { to: "home", label: "Home" },
    { to: "about", label: "About" },
    { to: "services", label: "Services" },
    { to: "portfolio", label: "Portfolio" },
    { to: "blog", label: "Updates" },
  ];

  const handleNavClick = (_to?: string) => {
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`navbar ${
        scrolled ? "navbar--scrolled" : ""
      } fixed top-0 left-0 right-0`}
      style={{ zIndex: 10000 }}
    >
      <div className="relative">
        <div
          className={
            `navbar__inner mx-auto w-[min(1200px,92%)] flex items-center justify-between ` +
            `transition-all duration-300 border-b border-white/10 ` +
            `${
              scrolled
                ? "h-14 backdrop-blur-md bg-black/50"
                : "h-20 backdrop-blur-xs bg-black/30"
            }
          `
          }
        >
          <a
            href="#"
            aria-label="Cypadi"
            className="navbar__brand relative inline-flex items-center gap-2 group select-none"
          >
            <img
              src={`${(import.meta.env.BASE_URL || "/").replace(
                /\/$/,
                ""
              )}/logo/cypadi_trancyparent_logo.png`}
              alt="Cypadi"
              className="h-8 w-auto drop-shadow-[0_4px_18px_rgba(250,204,21,0.30)]"
              decoding="async"
            />
          </a>

          {/* Desktop nav */}
          <nav
            className={
              `navbar__nav hidden md:flex items-center gap-6 px-3 py-1 rounded-full border ` +
              `backdrop-blur-md bg-black/30 border-white/10 ` +
              `${scrolled ? "shadow-lg" : "shadow"}`
            }
          >
            {links.map((l) => {
              const isHome = location.pathname === "/";

              // Updates link: always route to home then scroll to blog
              if (l.to === "blog") {
                return (
                  <RouterLink
                    key={l.to}
                    to="/#blog"
                    className="relative inline-block px-1 text-white/90 hover:text-[#facc15] transition-colors"
                    onMouseEnter={magEnter()}
                    onMouseMove={magMove()}
                    onMouseLeave={magLeave()}
                    onClick={() => {
                      handleNavClick(l.to);
                      setTimeout(() => {
                        const element = document.getElementById("blog");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 150);
                    }}
                  >
                    {l.label}
                    <span className="hover-underline" />
                  </RouterLink>
                );
              }

              // Other links: use smooth scroll on home, route+scroll from inner pages
              if (isHome) {
                return (
                  <ScrollLink
                    key={l.to}
                    to={l.to}
                    spy
                    smooth
                    offset={-80}
                    duration={600}
                    activeClass="navbar-link-active"
                    className="relative inline-block px-1 text-white/90 hover:text-[#facc15] transition-colors"
                    onMouseEnter={magEnter()}
                    onMouseMove={magMove()}
                    onMouseLeave={magLeave()}
                    onClick={() => handleNavClick(l.to)}
                  >
                    {l.label}
                    <span className="hover-underline" />
                  </ScrollLink>
                );
              }

              return (
                <RouterLink
                  key={l.to}
                  to={`/#${l.to}`}
                  className="relative inline-block px-1 text-white/90 hover:text-[#facc15] transition-colors"
                  onMouseEnter={magEnter()}
                  onMouseMove={magMove()}
                  onMouseLeave={magLeave()}
                  onClick={() => {
                    handleNavClick(l.to);
                    setTimeout(() => {
                      const element = document.getElementById(l.to);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 150);
                  }}
                >
                  {l.label}
                  <span className="hover-underline" />
                </RouterLink>
              );
            })}
            {location.pathname === "/" ? (
              <ScrollLink
                to="contact"
                spy
                smooth
                offset={-80}
                duration={600}
                activeClass="navbar-link-active"
                className="contact-link relative ml-2 inline-flex items-center rounded-full bg-[#facc15] px-4 py-2 text-black hover:shadow-neon transition-shadow"
                onClick={() => handleNavClick("contact")}
              >
                Contact
                <span className="hover-underline" />
              </ScrollLink>
            ) : (
              <RouterLink
                to="/#contact"
                className="contact-link relative ml-2 inline-flex items-center rounded-full bg-[#facc15] px-4 py-2 text-black hover:shadow-neon transition-shadow"
                onClick={() => {
                  handleNavClick("contact");
                  setTimeout(() => {
                    const element = document.getElementById("contact");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 150);
                }}
              >
                Contact
                <span className="hover-underline" />
              </RouterLink>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="navbar__toggle md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/10 text-white"
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              initial={false}
              animate={open ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              {open ? <FiX /> : <FiMenu />}
            </motion.span>
          </button>
        </div>

        {/* Mobile menu - rendered via portal to avoid stacking context issues */}
        {typeof window !== "undefined" &&
          createPortal(
            <AnimatePresence>
              {open && (
                <>
                  {/* Backdrop overlay */}
                  <motion.div
                    className="navbar__mobile-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setOpen(false)}
                  />

                  {/* Mobile menu panel */}
                  <motion.nav
                    className="navbar__mobile-menu"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 200,
                      duration: 0.4,
                    }}
                  >
                    {/* Mobile menu header */}
                    <div className="navbar__mobile-header">
                      <button
                        aria-label="Close menu"
                        className="navbar__mobile-close"
                        onClick={() => setOpen(false)}
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    {/* Mobile navigation links */}
                    <div className="navbar__mobile-links">
                      {links.map((l, index) => {
                        const isHome = location.pathname === "/";

                        if (l.to === "blog") {
                          return (
                            <motion.div
                              key={l.to}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <RouterLink
                                to="/#blog"
                                className="navbar__mobile-link"
                                onClick={() => {
                                  handleNavClick(l.to);
                                  setTimeout(() => {
                                    const element =
                                      document.getElementById("blog");
                                    if (element) {
                                      element.scrollIntoView({
                                        behavior: "smooth",
                                      });
                                    }
                                  }, 150);
                                }}
                              >
                                <span className="navbar__mobile-link-text">
                                  {l.label}
                                </span>
                                <span className="navbar__mobile-link-underline" />
                              </RouterLink>
                            </motion.div>
                          );
                        }

                        if (isHome) {
                          return (
                            <motion.div
                              key={l.to}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <ScrollLink
                                to={l.to}
                                spy
                                smooth
                                offset={-80}
                                duration={600}
                                activeClass="navbar-link-active"
                                className="navbar__mobile-link"
                                onClick={() => handleNavClick(l.to)}
                              >
                                <span className="navbar__mobile-link-text">
                                  {l.label}
                                </span>
                                <span className="navbar__mobile-link-underline" />
                              </ScrollLink>
                            </motion.div>
                          );
                        }

                        return (
                          <motion.div
                            key={l.to}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <RouterLink
                              to={`/#${l.to}`}
                              className="navbar__mobile-link"
                              onClick={() => {
                                handleNavClick(l.to);
                                setTimeout(() => {
                                  const element = document.getElementById(l.to);
                                  if (element) {
                                    element.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                  }
                                }, 150);
                              }}
                            >
                              <span className="navbar__mobile-link-text">
                                {l.label}
                              </span>
                              <span className="navbar__mobile-link-underline" />
                            </RouterLink>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Mobile CTA button */}
                    <motion.div
                      className="navbar__mobile-cta-wrapper"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: links.length * 0.1 }}
                    >
                      {location.pathname === "/" ? (
                        <ScrollLink
                          to="contact"
                          spy
                          smooth
                          offset={-80}
                          duration={600}
                          activeClass="navbar-link-active"
                          className="navbar__mobile-cta"
                          onClick={() => handleNavClick("contact")}
                        >
                          Contact Us
                        </ScrollLink>
                      ) : (
                        <RouterLink
                          to="/#contact"
                          className="navbar__mobile-cta"
                          onClick={() => {
                            handleNavClick("contact");
                            setTimeout(() => {
                              const element =
                                document.getElementById("contact");
                              if (element) {
                                element.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }
                            }, 150);
                          }}
                        >
                          Contact Us
                        </RouterLink>
                      )}
                    </motion.div>
                  </motion.nav>
                </>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>
    </motion.header>
  );
};
