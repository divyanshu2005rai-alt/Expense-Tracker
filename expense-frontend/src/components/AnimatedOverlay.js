import React, { useMemo } from 'react';
import './AnimatedOverlay.css';
import bgImage from '../assets/background.png';

const AnimatedOverlay = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      const left = Math.random() * 100;
      const animationDuration = 5 + Math.random() * 9;
      const animationDelay = -(Math.random() * 15);
      const width = 8 + Math.random() * 12;
      const height = width * 1.4;
      const drift = -150 + Math.random() * 300;
      const rotateEnd = 360 + Math.random() * 1080;
      return {
        id: i,
        left: `${left}vw`,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${animationDelay}s`,
        width: `${width}px`,
        height: `${height}px`,
        '--drift': `${drift}px`,
        '--rotate-end': `${rotateEnd}deg`,
      };
    });
  }, []);

  return (
    <div className="animated-bg-container">
      <div className="bg-image-layer" style={{ backgroundImage: `url(${bgImage})` }}></div>
      <div className="sakura-container">
        {petals.map((petal) => (
          <div key={petal.id} className="petal" style={{ left: petal.left, width: petal.width, height: petal.height, animationDuration: petal.animationDuration, animationDelay: petal.animationDelay, '--drift': petal['--drift'], '--rotate-end': petal['--rotate-end'] }}></div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedOverlay;
