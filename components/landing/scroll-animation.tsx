"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

export function ScrollAnimation({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: ScrollAnimationProps) {
  
  const getInitial = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 40 }
      case "down": return { opacity: 0, y: -40 }
      case "left": return { opacity: 0, x: 40 } // enters from right
      case "right": return { opacity: 0, x: -40 } // enters from left
      case "none": return { opacity: 0, scale: 0.95 }
    }
  }

  const getAnimate = () => {
    switch (direction) {
      case "up": 
      case "down": return { opacity: 1, y: 0 }
      case "left": 
      case "right": return { opacity: 1, x: 0 }
      case "none": return { opacity: 1, scale: 1 }
    }
  }

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }} // Spring-ish ease
      className={className}
    >
      {children}
    </motion.div>
  )
}
