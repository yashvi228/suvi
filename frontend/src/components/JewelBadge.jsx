import React from 'react';

const TY = {
  Rings: 'ring',
  Earrings: 'ear',
  Necklaces: 'neck',
  Bangles: 'bang',
  Bracelets: 'brac',
  'Bridal Jewellery': 'bride',
};

export default function JewelBadge({ category, index = 0, className = "w-full h-full" }) {
  const bg = [
    ['#f9f2e6', '#e6d3b3'],
    ['#f1e4cf', '#d6bd92'],
    ['#fbf7ef', '#e8d9bf'],
  ][index % 3];

  const t = TY[category] || 'ring';
  const G = 'url(#gold-grad)';
  const M = 'url(#gem-grad)';

  let shape;
  if (t === 'ring') {
    shape = (
      <>
        <ellipse cx="100" cy="128" rx="46" ry="50" fill="none" stroke={G} strokeWidth="9" />
        <polygon points="100,48 124,70 100,100 76,70" fill={M} stroke={G} strokeWidth="3" />
        <path d="M76 70h48M100 48v52" stroke="#fff" opacity=".6" />
      </>
    );
  } else if (t === 'ear') {
    shape = [68, 132].map((x) => (
      <g key={x}>
        <circle cx={x} cy="44" r="8" fill={G} />
        <path d={`M${x} 60C${x - 26} 95 ${x - 18} 150 ${x} 152C${x + 18} 150 ${x + 26} 95 ${x} 60Z`} fill={G} />
        <circle cx={x} cy="112" r="10" fill={M} />
      </g>
    ));
  } else if (t === 'neck') {
    shape = (
      <>
        <path d="M28 46Q100 196 172 46" fill="none" stroke={G} strokeWidth="3.5" />
        <polygon points="100,122 116,142 100,172 84,142" fill={M} stroke={G} strokeWidth="3" />
      </>
    );
  } else if (t === 'bang') {
    shape = (
      <>
        <ellipse cx="100" cy="100" rx="72" ry="44" fill="none" stroke={G} strokeWidth="15" />
        <ellipse cx="100" cy="100" rx="72" ry="44" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeDasharray="3 7" />
      </>
    );
  } else if (t === 'brac') {
    shape = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * 6.283;
      return (
        <g key={i}>
          <circle cx={100 + 74 * Math.cos(a)} cy={100 + 38 * Math.sin(a)} r="9" fill={G} />
          <circle cx={100 + 74 * Math.cos(a)} cy={100 + 38 * Math.sin(a)} r="3.5" fill={M} />
        </g>
      );
    });
  } else {
    // Bridal Tiara
    shape = (
      <>
        <path d="M42 146L52 70 78 106 100 52 122 106 148 70 158 146Z" fill="none" stroke={G} strokeWidth="5" strokeLinejoin="round" />
        <path d="M42 158h116" stroke={G} strokeWidth="6" />
        {[[52, 68], [100, 50], [148, 68]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="7" fill={M} />
        ))}
        <circle cx="100" cy="112" r="9" fill={M} />
      </>
    );
  }

  const gradId = `b-grad-${index}-${t}`;

  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="40%">
          <stop offset="0%" stopColor={bg[0]} />
          <stop offset="100%" stopColor={bg[1]} />
        </radialGradient>
        <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a7440" />
          <stop offset="45%" stopColor="#ecd49c" />
          <stop offset="100%" stopColor="#b8935a" />
        </linearGradient>
        <linearGradient id="gem-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e9eef2" />
          <stop offset="100%" stopColor="#b9c7d3" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradId})`} />
      <ellipse cx="100" cy="185" rx="60" ry="5" fill="#000" opacity=".08" />
      {shape}
    </svg>
  );
}
