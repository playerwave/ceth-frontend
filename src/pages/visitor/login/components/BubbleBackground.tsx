import styled from 'styled-components';
import { useState, useRef } from 'react';

const BubbleBackground = () => {
  const [draggedBubble, setDraggedBubble] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [, setIsDragging] = useState(false);
  const bubbleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleMouseDown = (e: React.MouseEvent, bubbleId: string) => {
    e.preventDefault();
    setDraggedBubble(bubbleId);
    setIsDragging(true);
    
    const bubble = bubbleRefs.current[bubbleId];
    if (bubble) {
      // หยุด animation
      bubble.style.animationPlayState = 'paused';
      
      // คำนวณตำแหน่งใหม่ให้ฟองอากาศอยู่ที่เมาส์พอดี
      const rect = bubble.getBoundingClientRect();
    //   const centerX = rect.left + rect.width / 2;
    //   const centerY = rect.top + rect.height / 2;
      
      // ตั้งตำแหน่งให้ฟองอากาศอยู่ที่เมาส์
      const newX = e.clientX - rect.width / 2;
      const newY = e.clientY - rect.height / 2;
      
      bubble.style.left = `${newX}px`;
      bubble.style.top = `${newY}px`;
      bubble.style.position = 'fixed';
      
      // ตั้งค่า offset เป็น 0 เพื่อให้ฟองอากาศอยู่ที่เมาส์พอดี
      setDragOffset({
        x: rect.width / 2,
        y: rect.height / 2
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedBubble && bubbleRefs.current[draggedBubble]) {
      const bubble = bubbleRefs.current[draggedBubble];
      if (bubble) {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // จำกัดการเคลื่อนที่ภายในหน้าจอ
        const maxX = window.innerWidth - bubble.offsetWidth;
        const maxY = window.innerHeight - bubble.offsetHeight;
        
        const clampedX = Math.max(0, Math.min(x, maxX));
        const clampedY = Math.max(0, Math.min(y, maxY));
        
        bubble.style.left = `${clampedX}px`;
        bubble.style.top = `${clampedY}px`;
        bubble.style.position = 'fixed';
      }
    }
  };

  const handleMouseUp = () => {
    if (draggedBubble && bubbleRefs.current[draggedBubble]) {
      const bubble = bubbleRefs.current[draggedBubble];
      if (bubble) {
        // เริ่ม animation ใหม่
        bubble.style.animationPlayState = 'running';
      }
    }
    setDraggedBubble(null);
    setIsDragging(false);
  };

  return (
    <StyledBackground
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="bubble bubble1 draggable" 
        ref={(el) => bubbleRefs.current['bubble1'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble1')}
      />
      <div 
        className="bubble bubble2 draggable" 
        ref={(el) => bubbleRefs.current['bubble2'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble2')}
      />
      <div 
        className="bubble bubble3 draggable" 
        ref={(el) => bubbleRefs.current['bubble3'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble3')}
      />
      <div 
        className="bubble bubble4 draggable" 
        ref={(el) => bubbleRefs.current['bubble4'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble4')}
      />
      <div 
        className="bubble bubble5 draggable" 
        ref={(el) => bubbleRefs.current['bubble5'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble5')}
      />
      <div 
        className="bubble bubble6 draggable" 
        ref={(el) => bubbleRefs.current['bubble6'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble6')}
      />
      <div 
        className="bubble bubble7 draggable" 
        ref={(el) => bubbleRefs.current['bubble7'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble7')}
      />
      <div 
        className="bubble bubble8 draggable" 
        ref={(el) => bubbleRefs.current['bubble8'] = el}
        onMouseDown={(e) => handleMouseDown(e, 'bubble8')}
      />
    </StyledBackground>
  );
};

const StyledBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  @keyframes float1 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.8; }
    25% { transform: translate(200%, -300%) scale(1.1); opacity: 0.6; }
    50% { transform: translate(400%, -600%) scale(0.9); opacity: 0.4; }
    75% { transform: translate(600%, -400%) scale(1.05); opacity: 0.6; }
    100% { transform: translate(800%, -800%) scale(1); opacity: 0.8; }
  }

  @keyframes float2 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.7; }
    25% { transform: translate(-150%, -200%) scale(0.95); opacity: 0.5; }
    50% { transform: translate(-300%, -400%) scale(1.1); opacity: 0.3; }
    75% { transform: translate(-450%, -300%) scale(0.9); opacity: 0.5; }
    100% { transform: translate(-600%, -500%) scale(1); opacity: 0.7; }
  }

  @keyframes float3 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
    25% { transform: translate(300%, -250%) scale(1.15); opacity: 0.4; }
    50% { transform: translate(600%, -500%) scale(0.85); opacity: 0.2; }
    75% { transform: translate(900%, -350%) scale(1.05); opacity: 0.4; }
    100% { transform: translate(1200%, -600%) scale(1); opacity: 0.6; }
  }

  @keyframes float4 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.8; }
    25% { transform: translate(-200%, -150%) scale(0.9); opacity: 0.6; }
    50% { transform: translate(-400%, -300%) scale(1.2); opacity: 0.4; }
    75% { transform: translate(-600%, -200%) scale(0.95); opacity: 0.6; }
    100% { transform: translate(-800%, -400%) scale(1); opacity: 0.8; }
  }

  @keyframes float5 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.7; }
    25% { transform: translate(250%, -400%) scale(1.2); opacity: 0.5; }
    50% { transform: translate(500%, -800%) scale(0.8); opacity: 0.3; }
    75% { transform: translate(750%, -600%) scale(1.1); opacity: 0.5; }
    100% { transform: translate(1000%, -1000%) scale(1); opacity: 0.7; }
  }

  @keyframes float6 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
    25% { transform: translate(-300%, -350%) scale(0.9); opacity: 0.4; }
    50% { transform: translate(-600%, -700%) scale(1.3); opacity: 0.2; }
    75% { transform: translate(-900%, -500%) scale(0.95); opacity: 0.4; }
    100% { transform: translate(-1200%, -800%) scale(1); opacity: 0.6; }
  }

  @keyframes float7 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.8; }
    25% { transform: translate(350%, -200%) scale(1.05); opacity: 0.6; }
    50% { transform: translate(700%, -400%) scale(0.9); opacity: 0.4; }
    75% { transform: translate(1050%, -300%) scale(1.15); opacity: 0.6; }
    100% { transform: translate(1400%, -500%) scale(1); opacity: 0.8; }
  }

  @keyframes float8 {
    0% { transform: translate(0%, 0%) scale(1); opacity: 0.7; }
    25% { transform: translate(-250%, -450%) scale(1.1); opacity: 0.5; }
    50% { transform: translate(-500%, -900%) scale(0.85); opacity: 0.3; }
    75% { transform: translate(-750%, -650%) scale(1.05); opacity: 0.5; }
    100% { transform: translate(-1000%, -1100%) scale(1); opacity: 0.7; }
  }

  .bubble {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%);
    box-shadow: 
      inset 0 0 20px rgba(255,255,255,0.2),
      0 0 30px rgba(255,255,255,0.1);
    backdrop-filter: blur(1px);
    cursor: grab;
    user-select: none;
    transition: transform 0.1s ease;
    animation-play-state: running;
  }

  .bubble:hover {
    transform: scale(1.05);
  }

  .bubble:active {
    cursor: grabbing;
    transform: scale(0.95);
    animation-play-state: paused;
  }

  .bubble1 {
    width: 180px;
    height: 180px;
    left: 5%;
    top: 70%;
    background: radial-gradient(circle at 30% 30%, rgba(220,38,127,0.6), rgba(236,72,153,0.5), rgba(251,113,133,0.4));
    animation: float1 15s linear infinite;
    animation-delay: 0s;
  }

  .bubble2 {
    width: 120px;
    height: 120px;
    left: 25%;
    top: 80%;
    background: radial-gradient(circle at 30% 30%, rgba(34,197,94,0.6), rgba(16,185,129,0.5), rgba(6,182,212,0.4));
    animation: float2 18s linear infinite;
    animation-delay: 2s;
  }

  .bubble3 {
    width: 150px;
    height: 150px;
    left: 50%;
    top: 75%;
    background: radial-gradient(circle at 30% 30%, rgba(147,51,234,0.6), rgba(168,85,247,0.5), rgba(196,181,253,0.4));
    animation: float3 20s linear infinite;
    animation-delay: 4s;
  }

  .bubble4 {
    width: 200px;
    height: 200px;
    left: 75%;
    top: 70%;
    background: radial-gradient(circle at 30% 30%, rgba(59,130,246,0.6), rgba(37,99,235,0.5), rgba(14,165,233,0.4));
    animation: float4 16s linear infinite;
    animation-delay: 6s;
  }

  .bubble5 {
    width: 170px;
    height: 170px;
    left: 15%;
    top: 60%;
    background: radial-gradient(circle at 30% 30%, rgba(245,158,11,0.6), rgba(251,146,60,0.5), rgba(249,115,22,0.4));
    animation: float5 22s linear infinite;
    animation-delay: 8s;
  }

  .bubble6 {
    width: 140px;
    height: 140px;
    left: 40%;
    top: 85%;
    background: radial-gradient(circle at 30% 30%, rgba(168,85,247,0.6), rgba(192,132,252,0.5), rgba(217,70,239,0.4));
    animation: float6 19s linear infinite;
    animation-delay: 10s;
  }

  .bubble7 {
    width: 185px;
    height: 185px;
    left: 65%;
    top: 60%;
    background: radial-gradient(circle at 30% 30%, rgba(34,197,94,0.6), rgba(74,222,128,0.5), rgba(132,204,22,0.4));
    animation: float7 17s linear infinite;
    animation-delay: 12s;
  }

  .bubble8 {
    width: 195px;
    height: 195px;
    left: 85%;
    top: 80%;
    background: radial-gradient(circle at 30% 30%, rgba(251,146,60,0.6), rgba(252,165,165,0.5), rgba(239,68,68,0.4));
    animation: float8 21s linear infinite;
    animation-delay: 14s;
  }
`;

export default BubbleBackground;
