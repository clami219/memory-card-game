import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const colors = ["bg-yellow-400", "bg-red-400", "bg-blue-400", "bg-green-400", "bg-purple-400"];

const getRandomPosition = (width, height) => {
  const x = Math.random() * (width * 0.6) + width * 0.2;
  const y = Math.random() * (height * 0.6) + height * 0.2;
  return { x, y };
};

const Firework = ({ x, y, onComplete, delay }) => {
  const particles = Array.from({ length: 16 });

  return (
    <motion.div
      className="absolute"
      style={{ left: x - 8, top: y - 8 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 ${colors[i % colors.length]} rounded-full absolute`}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{
            x: Math.cos((i / 16) * Math.PI * 2) * 80,
            y: Math.sin((i / 16) * Math.PI * 2) * 80,
            opacity: 0,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onAnimationComplete={onComplete}
        />
      ))}
    </motion.div>
  );
};

export default function FireworksComponent({ trigger }) {
  const [explosions, setExplosions] = useState([]);

  useEffect(() => {
    if (trigger) {
      const { innerWidth: width, innerHeight: height } = window;
      const newExplosions = Array.from({ length: 20 }).map(() => ({
        ...getRandomPosition(width, height),
        id: Date.now() + Math.random(),
        delay: Math.random() + 0.2
      }));
      setExplosions((prev) => [...prev, ...newExplosions]);
    }
  }, [trigger]);

  return (
    <>
        {explosions.map(({ x, y, id, delay }) => (
          <Firework
            key={id}
            x={x}
            y={y}
            delay={delay}
            onComplete={() =>
              setExplosions((prev) => prev.filter((exp) => exp.id !== id))
            }
          />
        ))}
    </>
  );
}