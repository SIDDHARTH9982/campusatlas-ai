import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * NavHeader - A premium floating tab navigation with a sliding cursor effect.
 * Adapted for CampusAtlas AI's dark theme.
 */
function NavHeader({ links = [] }) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative flex w-fit rounded-full border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-1 shadow-2xl shadow-black/50"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {links.map((link) => (
        <Tab key={link.href} setPosition={setPosition} href={link.href}>
          {link.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  href
}) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-4 py-2 text-xs uppercase text-slate-400 hover:text-white transition-colors duration-300 md:px-6 md:py-2.5 md:text-xs font-semibold tracking-wider"
    >
      <a href={href} className="block w-full h-full text-center">
        {children}
      </a>
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-8 rounded-full bg-slate-800 md:h-[40px] top-1 shadow-inner border border-slate-700/50"
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
};

export default NavHeader;
