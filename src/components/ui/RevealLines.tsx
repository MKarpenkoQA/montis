import { motion, useInView } from "motion/react";
import { createElement, useRef } from "react";

export type RevealTag = "h1" | "h2" | "h3" | "p";

type RevealLinesProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: RevealTag;
};

export const RevealLines = ({
  text,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: RevealLinesProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const lines = text.split("\n");

  return createElement(
    Tag,
    { ref, className: `font-sans not-italic ${className}` },
    lines.map((line, index) => (
      <span key={index} className="block overflow-hidden leading-[1.05] pb-[0.05em]">
        <motion.span
          initial={{ y: "110%" }}
          animate={inView ? { y: "0%" } : { y: "110%" }}
          transition={{ duration: 0.9, delay: delay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="block font-sans not-italic"
        >
          {line}
        </motion.span>
      </span>
    )),
  );
};
