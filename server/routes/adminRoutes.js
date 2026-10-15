import express from 'express';
import { seedDatabase } from '../services/seedService.js';

const router = express.Router();

router.post('/reset-demo', async (req, res, next) => {
  try {
    await seedDatabase(true);
    res.status(200).json({
      success: true,
      message: 'Demo database has been reset to clean initial seed state.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
