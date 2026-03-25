// ============================================================
// questions.data.ts
// The hardcoded question database for tic-tac-toe.
// This is Phase 1 only — in a later phase this gets replaced
// by an API call to a real backend.
// The structure is designed so swapping to an API later
// requires changing ONE function in game.service.ts only.
// Angular equivalent: a mock data file or an in-memory dataset.
// ============================================================

import { GridHeader, CellQuestion } from '../types/game.types';

// ROW_HEADERS are the clubs shown on the LEFT side of the board.
// Index 0 = top row, index 1 = middle row, index 2 = bottom row.
export const ROW_HEADERS: GridHeader[] = [
  {
    id: 'arsenal',
    label: 'Arsenal',
    image: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  },
  {
    id: 'aston_villa',
    label: 'Aston Villa',
    image: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg',
  },
  {
    id: 'liverpool',
    label: 'Liverpool',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  },
];

// COL_HEADERS are the clubs shown on the TOP of the board.
// Index 0 = left column, index 1 = middle column, index 2 = right column.
export const COL_HEADERS: GridHeader[] = [
  {
    id: 'man_city',
    label: 'Man City',
    image: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  },
  {
    id: 'chelsea',
    label: 'Chelsea',
    image: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  },
  {
    id: 'man_utd',
    label: 'Man Utd',
    image: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  },
];

// QUESTIONS contains one entry per cell in the 3x3 grid (9 total).
// Each question is defined by its row header + column header combination.
// acceptedAnswers are all lowercase — the validation function lowercases
// the user's input before comparing so capitalisation never matters.
// Multiple entries per cell handle different ways to type the same name:
// 'van persie', 'robin van persie', 'rvp' all mean the same player.
export const QUESTIONS: CellQuestion[] = [
  {
    rowHeader: ROW_HEADERS[0],   // Arsenal
    colHeader: COL_HEADERS[0],   // Man City
    acceptedAnswers: [
      'samir nasri', 'nasri',
      'kolarov', 'aleksandar kolarov',
    ],
  },
  {
    rowHeader: ROW_HEADERS[0],   // Arsenal
    colHeader: COL_HEADERS[1],   // Chelsea
    acceptedAnswers: [
      'ashley cole', 'cole',
      'william gallas', 'gallas',
      'petr cech', 'cech',
    ],
  },
  {
    rowHeader: ROW_HEADERS[0],   // Arsenal
    colHeader: COL_HEADERS[2],   // Man Utd
    acceptedAnswers: [
      'robin van persie', 'van persie', 'rvp',
      'mikael silvestre', 'silvestre',
    ],
  },
  {
    rowHeader: ROW_HEADERS[1],   // Aston Villa
    colHeader: COL_HEADERS[0],   // Man City
    acceptedAnswers: [
      'gareth barry', 'barry',
      'james milner', 'milner',
    ],
  },
  {
    rowHeader: ROW_HEADERS[1],   // Aston Villa
    colHeader: COL_HEADERS[1],   // Chelsea
    acceptedAnswers: [
      'marc albrighton', 'albrighton',
      'ashley young', 'young',
    ],
  },
  {
    rowHeader: ROW_HEADERS[1],   // Aston Villa
    colHeader: COL_HEADERS[2],   // Man Utd
    acceptedAnswers: [
      'dwight yorke', 'yorke',
      'richard dunne', 'dunne',
    ],
  },
  {
    rowHeader: ROW_HEADERS[2],   // Liverpool
    colHeader: COL_HEADERS[0],   // Man City
    acceptedAnswers: [
      'raheem sterling', 'sterling',
      'steve mcmanaman', 'mcmanaman',
    ],
  },
  {
    rowHeader: ROW_HEADERS[2],   // Liverpool
    colHeader: COL_HEADERS[1],   // Chelsea
    acceptedAnswers: [
      'fernando torres', 'torres',
      'daniel sturridge', 'sturridge',
    ],
  },
  {
    rowHeader: ROW_HEADERS[2],   // Liverpool
    colHeader: COL_HEADERS[2],   // Man Utd
    acceptedAnswers: [
      'paul ince', 'ince',
      'michael owen', 'owen',
    ],
  },
];
