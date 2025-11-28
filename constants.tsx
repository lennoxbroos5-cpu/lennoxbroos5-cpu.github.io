import React from 'react';

export const PIECE_PATHS: Record<string, Record<string, React.ReactNode>> = {
  w: {
    p: <path fill="#fff" stroke="#000" strokeWidth="1.5" d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />,
    n: <path fill="#fff" stroke="#000" strokeWidth="1.5" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" transform="translate(-6,-6)" />, // Simplified knight for brevity in path
    b: <g fill="#fff" stroke="#000" strokeWidth="1.5"><path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" transform="translate(0,-5) scale(1,1.2)" /><path d="M20 14h4M22 12v4" /></g>,
    r: <path fill="#fff" stroke="#000" strokeWidth="1.5" d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" transform="translate(0, -5) scale(0.8)" />,
    q: <path fill="#fff" stroke="#000" strokeWidth="1.5" d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM9 26c0 2 1.5 2 2.5 4 1 2.5 1 2.5 5 2.5V35h15v-2.5c4 0 4 0 5-2.5 1-2 2.5-2 2.5-4-8.5-1.5-11-8-15-10-4 2-6.5 8.5-15 10z" />,
    k: <path fill="#fff" stroke="#000" strokeWidth="1.5" d="M22.5 11.63V6M20 8h5M22.5 25s4.5-7.5 3-10.5c0-5-6-5-6 0-1.5 3 3 10.5 3 10.5z" transform="scale(1.1)" />
  },
  b: {
    p: <path fill="#000" stroke="#fff" strokeWidth="1.5" d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />,
    n: <path fill="#000" stroke="#fff" strokeWidth="1.5" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" transform="translate(-6,-6)" />,
    b: <g fill="#000" stroke="#fff" strokeWidth="1.5"><path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21h12c0-2.41-1.33-4.5-2.78-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" transform="translate(0,-5) scale(1,1.2)" /><path d="M20 14h4M22 12v4" /></g>,
    r: <path fill="#000" stroke="#fff" strokeWidth="1.5" d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" transform="translate(0, -5) scale(0.8)" />,
    q: <path fill="#000" stroke="#fff" strokeWidth="1.5" d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM9 26c0 2 1.5 2 2.5 4 1 2.5 1 2.5 5 2.5V35h15v-2.5c4 0 4 0 5-2.5 1-2 2.5-2 2.5-4-8.5-1.5-11-8-15-10-4 2-6.5 8.5-15 10z" />,
    k: <path fill="#000" stroke="#fff" strokeWidth="1.5" d="M22.5 11.63V6M20 8h5M22.5 25s4.5-7.5 3-10.5c0-5-6-5-6 0-1.5 3 3 10.5 3 10.5z" transform="scale(1.1)" />
  }
};

// Use wikimedia SVGs for better quality if needed, but for "code only" robust solution, we use image tags with Wiki urls.
export const PIECE_IMAGES: Record<string, Record<string, string>> = {
  w: {
    p: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    n: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
    b: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
    r: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
    q: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
    k: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  },
  b: {
    p: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
    n: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
    b: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
    r: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
    q: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
    k: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
  }
};