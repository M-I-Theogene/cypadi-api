import React from "react";

export const SectionHeading: React.FC<{
  title: string;
  className?: string;
}> = ({ title, className }) => (
  <div className={`section-heading ${className ?? ""}`} data-aos="fade-up">
    {/* Bold, modern title */}
    <h2 className="heading-title">{title}</h2>
    {/* Decorative animated underline */}
    <span className="heading-underline heading-underline--grow" />
  </div>
);

