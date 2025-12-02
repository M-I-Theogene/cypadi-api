import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Stats } from "./components/Stats";
import { Portfolio } from "./components/Portfolio";
import { WhyUs } from "./components/WhyUs";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { Preloader } from "./components/Preloader";
import { useGsapScroll } from "./hooks/useGsapScroll";
import { CursorGlow } from "./components/ui/CursorGlow";
import { PageTransitionOverlay } from "./components/ui/PageTransitionOverlay";
import { Team } from "./components/Team";
import { TawkTo } from "./components/TawkTo";
import { Blog } from "./components/Blog";
import { BlogPostPage } from "./pages/BlogPost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      mirror: true,
      offset: 60,
      easing: "ease-out-quart",
    });

    const handleResize = () => {
      AOS.refresh();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useGsapScroll();

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Team />
      <Stats />
      <WhyUs />
      <Testimonials />
      <Blog />
      <Contact />
    </>
  );
};

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      mirror: true,
      offset: 60,
      easing: "ease-out-quart",
    });
  }, [location]);

  return (
    <div className="app-root" style={{ position: "relative" }}>
      <Preloader />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <CursorGlow />
      </div>
      <Navbar />
      <PageTransitionOverlay />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
      <Footer />
      <BackToTop />
      <TawkTo />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
    </div>
  );
};

export default App;
