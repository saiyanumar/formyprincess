import { motion, type Variants } from "framer-motion";

// Enhanced fade variants for smoother transitions
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(10px)",
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

// Scale with bounce effect
export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

// Floating animation for ambient elements
export const floatVariants: Variants = {
  hidden: { y: 0 },
  animate: {
      ease: "easeInOut",
    rotate: [-2, 0, 2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Heartbeat animation with rotation
export const heartbeatVariants = {
  hidden: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.15, 0.95, 1.1, 1],
    rotate: [0, -3, 0, 3, 0],
    transition: {
      duration: 2,
      ease: "easeOut",
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Shimmering effect
export const shimmerVariants = {
      ease: "easeInOut",
    backgroundPosition: "-200% 0",
    opacity: 0.5,
  },
  animate: {
    backgroundPosition: "200% 0",
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Enhanced reveal animation
export const magicalRevealVariants = {
  hidden: {
      ease: "easeOut",
    scale: 0.8,
    y: 20,
    filter: "blur(15px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

// Sparkle animation for decorative elements
export const sparkleVariants = {
      ease: "easeOut",
    opacity: 0,
    scale: 0,
    rotate: 0,
    filter: "blur(2px)",
  },
  animate: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    rotate: [0, 180, 360],
    filter: ["blur(2px)", "blur(0px)", "blur(2px)"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Pulse glow effect for highlights
export const pulseGlowVariants = {
  hidden: {
    boxShadow: "0 0 20px hsla(350, 100%, 88%, 0.2)",
    scale: 1,
  },
  animate: {
    boxShadow: [
      "0 0 20px hsla(350, 100%, 88%, 0.2)",
      "0 0 40px hsla(350, 100%, 88%, 0.4)",
      "0 0 20px hsla(350, 100%, 88%, 0.2)",
    ],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Motion components with enhanced animations
export const MotionText = motion.p;
export const MotionHeading = motion.h2;
export const MotionDiv = motion.div;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;
export const MotionImage = motion.img;

// Component-specific variants for consistent animations
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(10px)",
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Special reveal animation for countdown numbers
export const countdownNumberVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    filter: "blur(8px)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Button interaction variants
export const buttonVariants = {
  idle: {
    scale: 1,
    boxShadow: "0 4px 20px hsla(350, 100%, 88%, 0.2)",
  },
  hover: {
    scale: 1.05,
    y: -2,
    boxShadow: "0 8px 30px hsla(350, 100%, 88%, 0.3)",
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  tap: {
    scale: 0.95,
    y: 0,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Ambient background particle variants
export const particleVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    y: 0,
  },
  animate: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    y: [-20, 20],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      repeatType: "reverse",
    },
  },
};

// Reveal text animation with sparkles
export const revealTextVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(15px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};

// Letter animation for romantic text reveals
export const letterVariants = {
  hidden: { 
    opacity: 0,
    y: 50,
    filter: "blur(10px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      delay: i * 0.05,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};
