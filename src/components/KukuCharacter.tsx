"use client";

import React from "react";
import { motion } from "framer-motion";

interface KukuCharacterProps {
  mood?: "happy" | "cool" | "curious" | "proud" | "searching" | "sleepy";
  className?: string;
  size?: number;
  animate?: boolean;
}

export const KukuCharacter: React.FC<KukuCharacterProps> = ({
  mood = "cool",
  className = "",
  size = 140,
  animate = true,
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="kukuBodyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="75%" stopColor="#F2F0EB" />
            <stop offset="100%" stopColor="#DFDCD5" />
          </radialGradient>
          <linearGradient id="kukuCombGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF2E2E" />
            <stop offset="100%" stopColor="#C50F0F" />
          </linearGradient>
          <linearGradient id="kukuBeakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC700" />
            <stop offset="100%" stopColor="#FF9900" />
          </linearGradient>
          <linearGradient id="kukuShadesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#222228" />
            <stop offset="100%" stopColor="#09090C" />
          </linearGradient>
          <filter id="kukuGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.22)" />

        {/* Entire Body Motion Group */}
        <motion.g
          filter="url(#kukuGlow)"
          animate={
            animate
              ? mood === "happy"
                ? { y: [0, -8, 0, -4, 0], rotate: [0, -3, 3, 0] }
                : mood === "searching"
                ? { rotate: [-4, 6, -4], x: [-3, 3, -3] }
                : mood === "sleepy"
                ? { y: [0, 3, 0], scaleY: [1, 0.96, 1] }
                : { y: [0, -4, 0], rotate: [0, 1, 0] }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: mood === "happy" ? 1.4 : mood === "searching" ? 2.2 : 2.8,
            ease: "easeInOut",
          }}
        >
          {/* Feet */}
          <g id="feet">
            <path d="M 80 170 L 75 186 M 80 170 L 83 186 M 80 170 L 70 183" stroke="#FF9900" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 120 170 L 115 186 M 120 170 L 123 186 M 120 170 L 128 183" stroke="#FF9900" strokeWidth="4.5" strokeLinecap="round" />
          </g>

          {/* Red Tail Feathers */}
          <motion.g
            id="tail"
            animate={animate ? { rotate: [0, 6, -4, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            style={{ transformOrigin: "60px 140px" }}
          >
            <path d="M 60 135 C 30 130 18 100 24 80 C 35 105 48 118 64 125 Z" fill="url(#kukuCombGrad)" />
            <path d="M 55 142 C 22 145 10 120 16 98 C 28 120 45 132 58 135 Z" fill="#D91616" />
            <path d="M 58 150 C 30 162 16 142 22 125 C 34 140 48 145 60 144 Z" fill="#B30E0E" />
          </motion.g>

          {/* Plump White Body */}
          <path
            d="M 65 140 C 50 110 70 65 105 65 C 145 65 160 105 148 145 C 140 172 80 172 65 140 Z"
            fill="url(#kukuBodyGrad)"
            stroke="#DFDCD5"
            strokeWidth="2"
          />

          {/* Fluffy Chest Highlight */}
          <path
            d="M 105 85 C 132 90 142 120 135 145 C 122 165 92 165 85 145 C 80 115 90 85 105 85 Z"
            fill="#FFFFFF"
            opacity="0.75"
          />

          {/* Rooster Comb (3 peaks on head) */}
          <motion.g
            id="comb"
            animate={animate ? { rotate: [-2, 3, -2] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ transformOrigin: "105px 65px" }}
          >
            <path
              d="M 90 68 C 82 45 98 32 108 48 C 114 30 132 32 130 52 C 142 42 152 56 142 70 C 130 76 100 76 90 68 Z"
              fill="url(#kukuCombGrad)"
              stroke="#A80909"
              strokeWidth="2"
            />
          </motion.g>

          {/* Red Wattle (under beak) */}
          <motion.path
            d="M 125 110 C 138 112 142 132 132 142 C 124 150 116 138 118 126 Z"
            fill="url(#kukuCombGrad)"
            stroke="#A80909"
            strokeWidth="1.5"
            animate={animate ? { rotate: [0, 6, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            style={{ transformOrigin: "125px 110px" }}
          />

          {/* Yellow Beak */}
          <path
            d="M 122 92 L 152 103 L 123 112 Z"
            fill="url(#kukuBeakGrad)"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Cool Sunglasses (Kuku Signature!) */}
          <g id="sunglasses">
            {/* Frame / Bridge */}
            <path
              d="M 95 90 C 105 88 128 88 135 91"
              fill="none"
              stroke="#09090C"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Left Lens */}
            <path
              d="M 94 88 C 104 88 114 92 112 104 C 110 114 94 114 90 106 C 88 98 90 88 94 88 Z"
              fill="url(#kukuShadesGrad)"
              stroke="#FFB800"
              strokeWidth="1.8"
            />
            {/* Right Lens */}
            <path
              d="M 118 90 C 128 90 138 94 136 106 C 134 116 118 116 114 108 C 112 100 114 90 118 90 Z"
              fill="url(#kukuShadesGrad)"
              stroke="#FFB800"
              strokeWidth="1.8"
            />
            {/* White Glare / Specular shine on lenses */}
            <path
              d="M 94 92 L 102 92 L 96 104 L 92 104 Z"
              fill="#FFFFFF"
              opacity="0.45"
            />
            <path
              d="M 120 94 L 127 94 L 122 105 L 118 105 Z"
              fill="#FFFFFF"
              opacity="0.45"
            />
          </g>

          {/* Left Wing (holding or gesturing) */}
          <motion.g
            id="wing"
            animate={
              animate
                ? mood === "happy"
                  ? { rotate: [0, -18, 0, -12, 0] }
                  : mood === "proud"
                  ? { rotate: [0, -10, 0] }
                  : { rotate: [0, -5, 0] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ transformOrigin: "90px 110px" }}
          >
            <path
              d="M 90 110 C 72 115 62 140 76 156 C 88 166 108 152 110 132 C 112 120 102 110 90 110 Z"
              fill="#FFFFFF"
              stroke="#DFDCD5"
              strokeWidth="2"
            />
            {/* Wing Feather Strokes */}
            <path d="M 80 135 C 88 145 98 142 104 135" stroke="#DFDCD5" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 84 145 C 92 152 100 148 102 142" stroke="#DFDCD5" strokeWidth="2" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* Mood Accents */}
          {mood === "curious" && (
            <motion.text
              x="148"
              y="70"
              fontSize="24"
              fontWeight="bold"
              fill="#FFB800"
              animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              ?
            </motion.text>
          )}

          {mood === "happy" && (
            <motion.g
              animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <polygon points="155,50 159,60 170,61 161,68 164,78 155,72 146,78 149,68 140,61 151,60" fill="#FFB800" />
            </motion.g>
          )}

          {mood === "searching" && (
            <motion.g
              animate={{ rotate: [-10, 15, -10] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              style={{ transformOrigin: "140px 115px" }}
            >
              <circle cx="150" cy="115" r="14" fill="none" stroke="#FFB800" strokeWidth="3" />
              <line x1="160" y1="125" x2="174" y2="139" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
          )}
        </motion.g>
      </svg>
    </div>
  );
};
