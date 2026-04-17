import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"; 
import Globe from "./Globe";
import { cn } from "../../lib/utils";

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 },  // Hero: Right side, balanced
    { top: "25%", left: "50%", scale: 0.9 },  // Innovation: Top side, subtle
    { top: "15%", left: "90%", scale: 2 },    // Discovery: Left side, medium
    { top: "50%", left: "50%", scale: 1.8 },  // Future: Center, large backdrop
  ]
};

// Utility function to smoothly interpolate between values
const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

// Parse percentage string to number
const parsePercent = (str) => parseFloat(str.replace('%', ''));

export default function ScrollGlobe({ sections, globeConfig = defaultGlobeConfig, className }) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
  const [showNavLabel, setShowNavLabel] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const lastScrollTime = useRef(0);
  const animationFrameId = useRef();
  const navLabelTimeoutRef = useRef();
  
  // Pre-calculate positions for performance
  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  // Simple, direct scroll tracking
  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
    
    setScrollProgress(progress);

    // Simple section detection
    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    // Direct position update - no interpolation
    const currentPos = calculatedPositions[Math.min(newActiveSection, calculatedPositions.length - 1)];
    if(currentPos) {
       const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;
       setGlobeTransform(transform);
    }

    setActiveSection(newActiveSection);
  }, [calculatedPositions, activeSection]);

  // Throttled scroll handler with RAF
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listeners and immediate execution
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition(); // Initial call
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (navLabelTimeoutRef.current) {
        clearTimeout(navLabelTimeoutRef.current);
      }
    };
  }, [updateScrollPosition]);

  // Initial globe position
  useEffect(() => {
    const initialPos = calculatedPositions[0];
    if(initialPos) {
      const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
      setGlobeTransform(initialTransform);
    }
  }, [calculatedPositions]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full max-w-screen overflow-x-hidden bg-slate-950 text-white min-h-[400vh]",
        className
      )}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800/80 z-50">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 via-blue-400 to-indigo-600 will-change-transform shadow-brand"
          style={{ 
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: 'left center',
            transition: 'transform 0.15s ease-out',
          }}
        />
      </div>



      {/* Ultra-smooth Globe with responsive scaling */}
      <div
        className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          filter: `opacity(${activeSection === 3 ? 0.3 : 0.85})`, // Subtle opacity for backdrop effect
        }}
      >
        <div className="absolute top-0 left-0 scale-75 sm:scale-90 lg:scale-100 origin-top-left">
          <Globe />
        </div>
      </div>

      {/* Dynamic sections - fully responsive */}
      <div className="relative z-20">
        {sections.map((section, index) => (
          <section
            key={section.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={cn(
              "relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 lg:py-20",
              "w-full max-w-full overflow-hidden",
              section.align === 'center' && "items-center text-center",
              section.align === 'right' && "items-end text-right",
              section.align !== 'center' && section.align !== 'right' && "items-start text-left"
            )}
          >
            <div className={cn(
              "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl will-change-transform transition-all duration-700",
              "opacity-100 translate-y-0"
            )}>
              
              <h1 className={cn(
                "font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight",
                index === 0 
                  ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl" 
                  : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
              )}>
                {section.subtitle ? (
                  <div className="space-y-1 sm:space-y-2">
                    <div className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      {section.title}
                    </div>
                    <div className="text-brand-400 text-[0.6em] sm:text-[0.7em] font-medium tracking-wider">
                      {section.subtitle}
                    </div>
                  </div>
                ) : (
                  <div className="background-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-transparent">
                    {section.title}
                  </div>
                )}
              </h1>
              
              <div className={cn(
                "text-slate-400 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-light",
                section.align === 'center' ? "text-center" : "text-left"
              )}>
                <p className={cn(
                  "mb-3 sm:mb-4 max-w-2xl",
                  section.align === 'center' && "mx-auto"
                )}>
                  {section.description}
                </p>
                {index === 0 && (
                  <div className={cn(
                    "flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6",
                    section.align === 'center' && "justify-center"
                  )}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                      <span>Interactive Experience</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <span>Scroll to Explore</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Features - Responsive grid */}
              {section.features && (
                <div className={cn(
                  "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-3xl",
                  section.align === 'center' && "mx-auto"
                )}>
                  {section.features.map((feature, featureIndex) => (
                    <div 
                      key={feature.title}
                      className={cn(
                        "group p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5",
                        "hover:border-brand-500/20 hover:-translate-y-1"
                      )}
                      style={{ animationDelay: `${featureIndex * 0.1}s` }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-brand-500/60 mt-1.5 sm:mt-2 group-hover:bg-brand-500 transition-colors flex-shrink-0" />
                        <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                          <h3 className="font-semibold text-white text-base sm:text-lg">{feature.title}</h3>
                          <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enhanced Actions - Responsive buttons */}
              {section.actions && (
                <div className={cn(
                  "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4",
                  section.align === 'center' && "justify-center",
                  section.align === 'right' && "justify-end",
                  (!section.align || section.align === 'left') && "justify-start"
                )}>
                  {section.actions.map((action, actionIndex) => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={cn(
                        "group relative px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base",
                        "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full sm:w-auto",
                        action.variant === 'primary' 
                          ? "bg-brand-500 text-white hover:bg-brand-400 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30" 
                          : "border-2 border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800 hover:border-brand-500/30 text-white"
                      )}
                      style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                    >
                      <span className="relative z-10">{action.label}</span>
                      {action.variant === 'primary' && (
                        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
