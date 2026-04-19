import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const HighlightText = React.forwardRef(
  ({
    text,
    as: Component = "h1",
    className,
    textClassName,
    highlightClassName,
    duration = 1.5,
    highlightColor = "#6366f1", // Default to brand color
    ease = "easeInOut",
    ...props
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("text-center w-full flex justify-center", className)} 
        {...props}
      >
        <Component 
          className={cn(
            "text-4xl sm:text-5xl md:text-6xl font-[700] leading-[1.3] tracking-tight max-w-4xl",
            textClassName
          )}
        >
          <motion.span
            className={cn(
              "relative inline-block py-[10px] px-[12px] sm:px-[16px] rounded-[12px] mx-2",
              "text-white whitespace-nowrap overflow-hidden",
              highlightClassName
            )}
            initial={{
              clipPath: "inset(0 100% 0 0)",
              backgroundColor: highlightColor,
            }}
            whileInView={{
              clipPath: "inset(0 0% 0 0)",
            }}
            viewport={{ 
              once: true,
              amount: 0,
              margin: "500px"
            }}
            transition={{
              duration,
              ease,
              delay: 0.1
            }}
          >
            {text}
          </motion.span>
        </Component>
      </div>
    )
  }
)
HighlightText.displayName = "HighlightText"

export { HighlightText }
