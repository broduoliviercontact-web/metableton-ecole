import { Router } from 'express';
import * as scoreService from '../services/oscillatorMemoryScoreService.js';

const router = Router();

/**
 * GET /api/oscillator-memory/scores
 * Public endpoint — returns the top anonymous scores.
 * Query params:
 *   - limit (optional): number of scores to return, capped at 50, default 10.
 */
router.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const scores = await scoreService.listTopScores(limit);

    res.json({ data: scores });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/oscillator-memory/scores
 * Public endpoint — submit a new anonymous score.
 * Body:
 *   - pseudo: string (2-20 chars, letters/digits/spaces/hyphen/underscore)
 *   - score: integer (0-100)
 */
router.post('/', async (req, res, next) => {
  try {
    const { pseudo, score } = req.body || {};
    const entry = await scoreService.submitScore({ pseudo, score });

    res.status(201).json({ data: entry });
  } catch (err) {
    next(err);
  }
});

export default router;
