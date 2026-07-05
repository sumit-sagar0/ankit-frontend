import React, { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Cursor — Custom trailing artistic cursor
   Applies a premium dot + trailing outline effect to the mouse position.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Check if device supports hover (ignore mobile)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    if (isTouchDevice) return; // Don't run cursor logic on mobile

    const updateMousePos = (e) => {
      if (!isVisible) setIsVisible(true);
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const checkHoverState = (e) => {
      // Check if hovered element is clickable (a, button, input) or has cursor: pointer
      const target = e.target;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', updateMousePos);
    window.addEventListener('mouseover', checkHoverState);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePos);
      window.removeEventListener('mouseover', checkHoverState);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Small dot that perfectly tracks cursor */}
      <div 
        style={{
          position: 'fixed',
          top: mousePos.y,
          left: mousePos.x,
          width: 8,
          height: 8,
          backgroundColor: 'var(--blue-600)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.2s, height 0.2s, background-color 0.2s',
          ...(isHovering ? { width: 4, height: 4, backgroundColor: '#f43f5e' } : {})
        }}
      />
      {/* Trailing outline ring */}
      <div 
        style={{
          position: 'fixed',
          top: mousePos.y,
          left: mousePos.x,
          width: 40,
          height: 40,
          border: '1.5px solid var(--blue-500)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, background-color 0.3s, top 0.1s ease-out, left 0.1s ease-out',
          opacity: 0.5,
          ...(isHovering ? { 
            width: 60, 
            height: 60, 
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
            opacity: 1
          } : {})
        }}
      />
    </>
  );
}
