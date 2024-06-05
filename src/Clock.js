// src/Clock.js
import React, { useEffect, useState } from 'react';
import './Clock.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="clock">
      <svg viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="195" stroke="white" strokeWidth="10" fill="black" />
        
        <text x="200" y="90" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle">Omega</text>
        <text x="200" y="120" fill="white" fontSize="16" textAnchor="middle">Speedmaster</text>
        <text x="200" y="140" fill="white" fontSize="12" textAnchor="middle">Professional</text>

        {/* Tachymeter Bezel */}
        <circle cx="200" cy="200" r="185" stroke="white" strokeWidth="4" fill="none" />
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * Math.PI / 180;
          const length = i % 5 === 0 ? 10 : 5;
          return (
            <line
              key={i}
              x1={200 + 185 * Math.cos(angle)}
              y1={200 + 185 * Math.sin(angle)}
              x2={200 + (185 - length) * Math.cos(angle)}
              y2={200 + (185 - length) * Math.sin(angle)}
              stroke="white"
              strokeWidth={i % 5 === 0 ? 3 : 1}
            />
          );
        })}

        {/* Markers */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * Math.PI / 180;
          const length = i % 5 === 0 ? 15 : 7;
          const color = i % 5 === 0 ? 'white' : '#9acd32'; // Glow-in-the-dark effect for minor markers
          return (
            <line
              key={i}
              x1={200 + 170 * Math.cos(angle)}
              y1={200 + 170 * Math.sin(angle)}
              x2={200 + (170 - length) * Math.cos(angle)}
              y2={200 + (170 - length) * Math.sin(angle)}
              stroke={color}
              strokeWidth={i % 5 === 0 ? 3 : 1}
            />
          );
        })}

        {/* Clock Hands */}
        <g transform={`rotate(${hourAngle}, 200, 200)`}>
          <line x1="200" y1="200" x2="200" y2="130" stroke="white" strokeWidth="8" />
          <polygon points="200,200 195,130 205,130" fill="white" />
        </g>
        <g transform={`rotate(${minuteAngle}, 200, 200)`}>
          <line x1="200" y1="200" x2="200" y2="90" stroke="white" strokeWidth="5" />
          <polygon points="200,200 195,90 205,90" fill="white" />
        </g>
        <g transform={`rotate(${secondAngle}, 200, 200)`}>
          <line x1="200" y1="210" x2="200" y2="70" stroke="red" strokeWidth="2" />
          <polygon points="200,210 197,70 203,70" fill="red" />
        </g>

        <circle cx="200" cy="200" r="10" fill="white" />

        {/* Sub-dials */}
        {[[120, 150], [200, 250], [280, 150]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="30" stroke="white" strokeWidth="2" fill="black" />
            {Array.from({ length: 60 }).map((_, j) => {
              const angle = (j * 6 - 90) * Math.PI / 180;
              const length = j % 5 === 0 ? 6 : 3;
              return (
                <line
                  key={j}
                  x1={x + 30 * Math.cos(angle)}
                  y1={y + 30 * Math.sin(angle)}
                  x2={x + (30 - length) * Math.cos(angle)}
                  y2={y + (30 - length) * Math.sin(angle)}
                  stroke="white"
                  strokeWidth={j % 5 === 0 ? 2 : 1}
                />
              );
            })}
            <line x1={x} y1={y} x2={x} y2={y - 15} stroke="white" strokeWidth="2" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default Clock;
