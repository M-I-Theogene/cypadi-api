import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ProgressBar.css";

export const ProgressBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let tickTimer: number | null = null;
    let finishTimer: number | null = null;
    let hideTimer: number | null = null;

    const clearTimers = () => {
      if (tickTimer) {
        clearInterval(tickTimer);
        tickTimer = null;
      }
      if (finishTimer) {
        clearTimeout(finishTimer);
        finishTimer = null;
      }
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const finish = () => {
      if (tickTimer) {
        clearInterval(tickTimer);
        tickTimer = null;
      }
      setProgress(100);
      hideTimer = setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 250);
    };

    const start = () => {
      clearTimers();
      setActive(true);
      setProgress(0);

      tickTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const increment = Math.random() * 15 + 5;
          return Math.min(prev + increment, 90);
        });
      }, 120);

      finishTimer = setTimeout(() => {
        finish();
      }, 1200);
    };

    start();

    return () => {
      clearTimers();
    };
  }, [location.pathname]);

  return (
    <div
      className={`route-progress ${active ? "route-progress--active" : ""}`}
      aria-hidden="true"
    >
      <span className="route-progress__bar" style={{ width: `${progress}%` }} />
    </div>
  );
};
