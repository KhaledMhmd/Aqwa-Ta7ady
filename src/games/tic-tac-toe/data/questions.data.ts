// ============================================================
// questions.data.ts
// Hardcoded question database for tic-tac-toe. Phase 1 only.
// In later phases this is replaced by an API call.
// Angular equivalent: a mock data file or in-memory dataset.
// ============================================================

import { GridHeader, CellQuestion } from '../types/game.types';

// ROW_HEADERS — clubs shown on the LEFT side of the board.
export const ROW_HEADERS: GridHeader[] = [
  { id: 'arsenal', label: 'Arsenal', image: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
  { id: 'aston_villa', label: 'Aston Villa', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Aston_Villa_FC_new_crest.svg/250px-Aston_Villa_FC_new_crest.svg.png' },
  { id: 'liverpool', label: 'Liverpool', image: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
];

// COL_HEADERS — clubs shown on the TOP of the board.
export const COL_HEADERS: GridHeader[] = [
  { id: 'man_city', label: 'Man City', image: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
  { id: 'chelsea', label: 'Chelsea', image: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
  { id: 'man_utd', label: 'Man Utd', image: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
];

// QUESTIONS — one per cell in the 3x3 grid (9 total).
export const QUESTIONS: CellQuestion[] = [
  { rowHeader: ROW_HEADERS[0], colHeader: COL_HEADERS[0], acceptedAnswers: ['samir nasri', 'nasri', 'kolarov', 'aleksandar kolarov'] },
  { rowHeader: ROW_HEADERS[0], colHeader: COL_HEADERS[1], acceptedAnswers: ['ashley cole', 'cole', 'william gallas', 'gallas', 'petr cech', 'cech'] },
  { rowHeader: ROW_HEADERS[0], colHeader: COL_HEADERS[2], acceptedAnswers: ['robin van persie', 'van persie', 'rvp', 'mikael silvestre', 'silvestre'] },
  { rowHeader: ROW_HEADERS[1], colHeader: COL_HEADERS[0], acceptedAnswers: ['gareth barry', 'barry', 'james milner', 'milner'] },
  { rowHeader: ROW_HEADERS[1], colHeader: COL_HEADERS[1], acceptedAnswers: ['marc albrighton', 'albrighton', 'ashley young', 'young', 'bosnich', 'marc bosnich'] },
  { rowHeader: ROW_HEADERS[1], colHeader: COL_HEADERS[2], acceptedAnswers: ['dwight yorke', 'yorke', 'richard dunne', 'dunne', 'bosnich', 'marc bosnich'] },
  { rowHeader: ROW_HEADERS[2], colHeader: COL_HEADERS[0], acceptedAnswers: ['raheem sterling', 'sterling', 'steve mcmanaman', 'mcmanaman'] },
  { rowHeader: ROW_HEADERS[2], colHeader: COL_HEADERS[1], acceptedAnswers: ['fernando torres', 'torres', 'daniel sturridge', 'sturridge'] },
  { rowHeader: ROW_HEADERS[2], colHeader: COL_HEADERS[2], acceptedAnswers: ['paul ince', 'ince', 'michael owen', 'owen'] },
];