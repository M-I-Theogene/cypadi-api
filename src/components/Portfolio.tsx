import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  FiCode,
  FiCpu,
  FiSmartphone,
  FiExternalLink,
  FiX,
  FiPlay,
  FiArrowRight,
  FiEye,
} from "react-icons/fi";
import { SectionHeading } from "./ui/SectionHeading";

type Project = {
  id: string;
  title: string;
  category: "AI & ML" | "Web Development" | "Mobile App";
  description: string;
  image: string;
  url?: string;
  status?: "completed" | "under-development";
  buttonText?: string;
  isDownload?: boolean;
};

// Get base URL with trailing slash
const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") + "/";

const projects: Project[] = [
  {
    id: "1",
    title: "Car Renting System Using Machine Learning",
    category: "AI & ML",
    description:
      "An intelligent car rental platform powered by ML algorithms for predictive pricing, demand forecasting, and personalized recommendations.",
    image: `${BASE_URL}projects/car_rental_system.png`,
    status: "under-development",
  },
  {
    id: "2",
    title: "AI-Powered Legal Assistance System",
    category: "AI & ML",
    description:
      "Advanced legal AI system that assists with document analysis, case research, and legal consultation using natural language processing.",
    image: `${BASE_URL}projects/legal_system2.png`,
    status: "under-development",
  },
  {
    id: "3",
    title: "Mental Health Support for Rwanda",
    category: "AI & ML",
    description:
      "Provides compassionate, culturally-sensitive mental health support through advanced AI technology. Available in English, Kinyarwanda, French, and Kiswahili.",
    image: `${BASE_URL}projects/mental_health_system.png`,
    url: "https://cypadiltd-aimhsa-chatbot.hf.space/",
    status: "completed",
  },
  {
    id: "4",
    title: "Sunshine Rwanda – NGO website",
    category: "Web Development",
    description:
      "Built an interactive real-time platform empowering the Shine Rwanda NGO to deliver effective counselling and family support services online.",
    image: `${BASE_URL}projects/sunshine_rwanda.png`,
    url: "https://www.sunshinerwanda.org",
    status: "completed",
  },
  {
    id: "5",
    title: "Evergreen Rwanda – Environmental platform",
    category: "Web Development",
    description:
      "Developed a dynamic website for Evergreen Rwanda NGO to promote environmental awareness and showcase youth-led sustainability projects.",
    image: `${BASE_URL}projects/evergreenrwanda.png`,
    url: "https://evergreenrwanda.rw",
    status: "completed",
  },
  {
    id: "7",
    title: "APAD IN AFRICA – Development Organization Website",
    category: "Web Development",
    description:
      "APAD IN AFRICA - A movement committed to transforming lives and shaping a more peaceful, empowered, and sustainable future for African communities.",
    image: `${BASE_URL}projects/apadinafrica.png`,
    url: "https://apadinafrica.org.rw/",
    status: "completed",
  },
  {
    id: "6",
    title: "Exam app",
    category: "Mobile App",
    description:
      "Built an interactive Flutter mobile app that helps learners prepare for exams through personalized training and automated question practice.",
    image: `${BASE_URL}projects/exam_app.png`,
    url: "https://cypadi.com/apps/EXAMAPP.apk",
    status: "completed",
    buttonText: "Get App",
    isDownload: true,
  },
];

const categories = ["All", "AI & ML", "Web Development", "Mobile App"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};

function ProjectCard({
  project,
  index,
  onCardClick,
}: {
  project: Project;
  index: number;
  onCardClick: (project: Project) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    const img = imageRef.current;
    if (!el || !img) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const maxMove = 20;
    img.style.transform = `translate(${deltaX * maxMove}px, ${
      deltaY * maxMove
    }px) scale(1.1)`;

    const rx = ((y - rect.height / 2) / rect.height) * -4;
    const ry = ((x - rect.width / 2) / rect.width) * 4;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    const img = imageRef.current;
    if (!el || !img) return;
    el.style.transform = "";
    img.style.transform = "scale(1)";
    setHover(false);
  }, []);

  const onEnter = useCallback(() => setHover(true), []);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCardClick(project);
  };

  return (
    <motion.div
      variants={cardVariants}
      ref={ref}
      className={`portfolio__card ${hover ? "is-hover" : ""}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      data-aos="fade-up"
      data-aos-delay={index * 100}
    >
      <div className="portfolio__card-glow" />
      <div className="portfolio__card-shine" />

      <div className="portfolio__card-image">
        <motion.img
          ref={imageRef}
          src={project.image}
          alt={project.title}
          initial={{ scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <div className="portfolio__card-gradient" />

        <motion.div
          className="portfolio__card-overlay"
          initial={{ y: 20, opacity: 0 }}
          animate={hover ? { y: 0, opacity: 1 } : { y: 20, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="portfolio__card-category"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              hover ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }
            }
            transition={{ delay: 0.1 }}
          >
            {project.category}
          </motion.span>

          <motion.h3
            className="portfolio__card-title"
            initial={{ y: 10, opacity: 0 }}
            animate={hover ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {project.title}
          </motion.h3>
        </motion.div>

        {/* Animated skewed shapes that fill the card on hover */}
        <motion.div
          className="portfolio__card-hover-fill portfolio__card-hover-fill--left"
          initial={{ x: "-125%", skewX: -25, opacity: 0 }}
          animate={
            hover
              ? { x: 0, skewX: 0, opacity: 0.9 }
              : { x: "-125%", skewX: -25, opacity: 0 }
          }
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.div
          className="portfolio__card-hover-fill portfolio__card-hover-fill--right"
          initial={{ x: "125%", skewX: 25, opacity: 0 }}
          animate={
            hover
              ? { x: 0, skewX: 0, opacity: 0.9 }
              : { x: "125%", skewX: 25, opacity: 0 }
          }
          transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* View Details text that appears when shapes fill */}
        <motion.div
          className="portfolio__card-view-details"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={
            hover
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.8, y: 20 }
          }
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <FiEye size={24} />
          <span>View Details</span>
          <FiArrowRight size={20} />
        </motion.div>
      </div>

      <div className="portfolio__card-border" />
    </motion.div>
  );
}

// Project Modal Component
const ProjectModal: React.FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const backdropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (project) {
      console.log("Modal opening for project:", project.title);
      // Prevent body scroll when modal is open
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.classList.add("project-modal-open");

      // Scroll backdrop to top to ensure modal is centered
      if (backdropRef.current) {
        backdropRef.current.scrollTop = 0;
      }

      // Prevent ESC key from closing immediately
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleEscape);

      return () => {
        console.log("Modal closing");
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.classList.remove("project-modal-open");
        window.scrollTo(0, scrollY);
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [project, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on backdrop, not modal content
    if (e.target === e.currentTarget && backdropRef.current === e.target) {
      console.log("Backdrop clicked, closing modal");
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!project) {
    console.log("No project, returning null");
    return null;
  }

  console.log("Rendering modal for:", project.title);

  const modalContent = (
    <motion.div
      ref={backdropRef}
      className="project-modal__backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleBackdropClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <motion.div
        className="project-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
        exit={{
          opacity: 0,
          scale: 0.9,
          y: 140,
          x: 120,
          rotate: -8,
        }}
        transition={{
          duration: 0.55,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        onClick={handleModalClick}
      >
        <button
          className="project-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX />
        </button>
        <div className="project-modal__header">
          <img
            src={project.image}
            alt={project.title}
            className="project-modal__image"
          />
          <div className="project-modal__image-overlay" />
          <div className="project-modal__content">
            <div className="project-modal__title-section">
              <h2 className="project-modal__title">{project.title}</h2>
              <div className="project-modal__actions">
                {project.status === "completed" && project.url ? (
                  <a
                    href={project.url}
                    target={project.isDownload ? undefined : "_blank"}
                    rel={project.isDownload ? undefined : "noopener noreferrer"}
                    download={project.isDownload ? "EXAMAPP.apk" : undefined}
                    className="project-modal__play-btn"
                  >
                    <FiPlay />
                    {project.buttonText || "Visit Site"}
                  </a>
                ) : (
                  <button className="project-modal__play-btn" disabled>
                    <FiPlay />
                    Coming Soon
                  </button>
                )}
              </div>
              {project.status === "completed" && (
                <span className="project-modal__badge">LIVE</span>
              )}
            </div>

            <div className="project-modal__info">
              <div className="project-modal__info-section">
                <h3 className="project-modal__info-title">About</h3>
                <p className="project-modal__info-text">
                  {project.description}
                </p>
              </div>

              <div className="project-modal__info-section">
                <h3 className="project-modal__info-title">Category</h3>
                <p className="project-modal__info-text">{project.category}</p>
              </div>

              <div className="project-modal__info-section">
                <h3 className="project-modal__info-title">Project Info</h3>
                <div className="project-modal__info-details">
                  <div className="project-modal__info-item">
                    <span className="project-modal__info-label">Status:</span>
                    <span
                      className={`project-modal__info-value ${
                        project.status === "completed"
                          ? "project-modal__info-value--completed"
                          : "project-modal__info-value--development"
                      }`}
                    >
                      {project.status === "completed"
                        ? "Completed"
                        : "Under Development"}
                    </span>
                  </div>
                  {project.url && (
                    <div className="project-modal__info-item">
                      <span className="project-modal__info-label">Link:</span>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-modal__info-link"
                      >
                        {project.isDownload ? "Download" : "Visit Site"}
                        <FiExternalLink />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = (
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory)
  ).sort((a, b) => {
    // Sort: completed projects first, then under-development
    if (a.status === "completed" && b.status !== "completed") return -1;
    if (a.status !== "completed" && b.status === "completed") return 1;
    return 0; // Keep original order for same status
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "AI & ML":
        return <FiCpu />;
      case "Web Development":
        return <FiCode />;
      case "Mobile App":
        return <FiSmartphone />;
      default:
        return <FiCode />;
    }
  };

  return (
    <section className="section portfolio" id="portfolio" data-aos="fade-up">
      <div className="portfolio__bg" aria-hidden="true" />

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
          <SectionHeading title="Our Projects" />

          <motion.p
            className="muted max-w-3xl mx-auto text-lg text-center"
            style={{ textAlign: "center" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Showcasing innovation and technical diversity across AI, web
            development, and mobile applications.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <motion.div
          className="portfolio__tabs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-aos="fade-up"
          data-aos-delay="250"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`portfolio__tab ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category !== "All" && (
                <motion.span
                  className="portfolio__tab-icon"
                  animate={
                    activeCategory === category
                      ? { rotate: [0, -10, 10, 0] }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  {getCategoryIcon(category)}
                </motion.span>
              )}
              {category}
              {activeCategory === category && (
                <motion.div
                  className="portfolio__tab-indicator"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid with Enhanced Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="portfolio__grid gsap-cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onCardClick={setSelectedProject}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedProject && (
          <ProjectModal
            key={selectedProject.id}
            project={selectedProject}
            onClose={() => {
              console.log("Closing modal, setting selectedProject to null");
              setSelectedProject(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
