import React, { useEffect, useState } from "react";

export const Preloader: React.FC = () => {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHide(true), 900);
    return () => clearTimeout(t);
  }, []);
  if (hide) return null;
  return (
    <div className="preloader" aria-hidden="true">
      <div className="spinner" />
    </div>
  );
};
