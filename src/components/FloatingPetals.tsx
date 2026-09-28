import React from 'react';

export const FloatingPetals: React.FC = () => {
  // Aesthetic fixed petal configurations for smooth floating animation without hydration mismatch
  const petals = [
    { id: 0, left: '8%', delay: '0.5s', duration: '14s', size: 22, rotation: 45, opacity: 0.55, isTulip: true },
    { id: 1, left: '22%', delay: '3.2s', duration: '18s', size: 18, rotation: 120, opacity: 0.45, isTulip: false },
    { id: 2, left: '35%', delay: '1.2s', duration: '12s', size: 26, rotation: 210, opacity: 0.60, isTulip: true },
    { id: 3, left: '48%', delay: '5.5s', duration: '16s', size: 16, rotation: 80, opacity: 0.35, isTulip: false },
    { id: 4, left: '62%', delay: '2.1s', duration: '15s', size: 24, rotation: 315, opacity: 0.50, isTulip: true },
    { id: 5, left: '75%', delay: '4.0s', duration: '19s', size: 20, rotation: 160, opacity: 0.40, isTulip: false },
    { id: 6, left: '88%', delay: '0.8s', duration: '13s', size: 28, rotation: 270, opacity: 0.65, isTulip: true },
    { id: 7, left: '15%', delay: '6.0s', duration: '17s', size: 19, rotation: 35, opacity: 0.42, isTulip: false },
    { id: 8, left: '29%', delay: '2.8s', duration: '14s', size: 23, rotation: 145, opacity: 0.52, isTulip: true },
    { id: 9, left: '42%', delay: '4.5s', duration: '16s', size: 17, rotation: 225, opacity: 0.38, isTulip: false },
    { id: 10, left: '56%', delay: '1.8s', duration: '18s', size: 25, rotation: 95, opacity: 0.58, isTulip: true },
    { id: 11, left: '70%', delay: '5.2s', duration: '15s', size: 21, rotation: 300, opacity: 0.48, isTulip: false },
    { id: 12, left: '83%', delay: '3.6s', duration: '13s', size: 27, rotation: 175, opacity: 0.62, isTulip: true },
    { id: 13, left: '94%', delay: '6.8s', duration: '20s', size: 16, rotation: 50, opacity: 0.36, isTulip: false },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            top: '-5vh',
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 30 30"
            fill="none"
            style={{
              transform: `rotate(${p.rotation}deg)`,
              opacity: p.opacity,
            }}
          >
            {p.isTulip ? (
              <path
                d="M15 2 C22 8, 26 18, 15 28 C4 18, 8 8, 15 2 Z"
                fill="#f8bbd0"
                stroke="#d81b60"
                strokeWidth="0.5"
              />
            ) : (
              <path
                d="M15 3 C25 5, 27 20, 15 27 C3 20, 5 5, 15 3 Z"
                fill="#fcedf2"
                stroke="#c2185b"
                strokeWidth="0.5"
              />
            )}
          </svg>
        </div>
      ))}
    </div>
  );
};
