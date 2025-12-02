import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "aos/dist/aos.css";
import "./styles/global.css";
import "pace-js";
import "pace-js/themes/yellow/pace-theme-minimal.css";

// Initialize Pace.js with configuration
declare global {
  interface Window {
    Pace: {
      options: any;
      start: () => void;
      restart: () => void;
      stop: () => void;
      progress: number;
    };
  }
}

// Configure Pace.js after it loads
if (typeof window !== "undefined") {
  // Wait for Pace to be available
  const initPace = () => {
    if (window.Pace) {
      window.Pace.options = {
        ajax: false,
        document: true,
        eventLag: false,
        restartOnPushState: false,
        restartOnRequestAfter: false,
        elements: {
          checkInterval: 50,
          selectors: ["body"],
        },
        target: "body",
        minTime: 250,
        maxProgressPerFrame: 20,
        ghostTime: 100,
      };

      // Ensure Pace starts
      window.Pace.start();
    } else {
      // Retry if Pace isn't loaded yet
      setTimeout(initPace, 100);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPace);
  } else {
    initPace();
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
