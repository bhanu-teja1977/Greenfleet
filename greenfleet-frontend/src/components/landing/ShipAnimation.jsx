import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import shipData from '../../assets/ship.json';

export default function ShipAnimation({ className = '', style = {} }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: !prefersReducedMotion,
        autoplay: !prefersReducedMotion,
        animationData: shipData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });

      animRef.current.addEventListener('DOMLoaded', () => {
        setLoaded(true);
        if (prefersReducedMotion && animRef.current) {
          animRef.current.goToAndStop(120, true);
        }
      });
    } catch (err) {
      console.warn('Lottie ship animation failed to load:', err);
    }

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`gfq-ship-lottie-container ${className} ${loaded ? 'is-loaded' : 'is-loading'}`}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ...style,
      }}
      role="img"
      aria-label="Animated cargo ship sailing on a maritime green corridor"
    />
  );
}
