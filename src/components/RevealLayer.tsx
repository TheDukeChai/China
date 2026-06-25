import React, { useRef, useEffect, useState } from 'react';

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

export const RevealLayer: React.FC<RevealLayerProps> = ({ image, cursorX, cursorY }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [maskUrl, setMaskUrl] = useState<string>('');

  // Handle window resizing to size the canvas appropriately
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync state size with physical canvas width/height properties
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.width;
    canvas.height = size.height;
  }, [size]);

  // Generate the soft circular opacity mask on every mouse position trail update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SPOTLIGHT_R = 260;

    // Clear background to prepare a transparent frame
    ctx.clearRect(0, 0, size.width, size.height);

    // Only render the gradient mask if the cursor is initialized / on screen
    if (cursorX !== -999 && cursorY !== -999) {
      const grad = ctx.createRadialGradient(
        cursorX, 
        cursorY, 
        0, 
        cursorX, 
        cursorY, 
        SPOTLIGHT_R
      );
      
      // Apply the precise stop alphas requested in the specification
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
      grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();
    }

    try {
      // Export frame to base64 PNG data URL
      const dataUrl = canvas.toDataURL('image/png');
      setMaskUrl(dataUrl);
    } catch (e) {
      console.error('Failed to generate spotlight masking layer data URL', e);
    }
  }, [cursorX, cursorY, size]);

  const maskStyle: React.CSSProperties = maskUrl
    ? {
        maskImage: `url(${maskUrl})`,
        WebkitMaskImage: `url(${maskUrl})`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        backgroundImage: `url(${image})`,
      }
    : {
        backgroundImage: `url(${image})`,
        opacity: 0, // Keep transparent initially to prevent layout flash during bootstrap
      };

  return (
    <>
      {/* Hidden high-performance canvas used to generate masking bitmaps dynamically */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        className="absolute inset-0 pointer-events-none z-20"
      />
      {/* Visual layer with custom background and mask styles */}
      <div
        id="lithos-reveal-overlay-mask"
        style={maskStyle}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none transition-all duration-100"
      />
    </>
  );
};
