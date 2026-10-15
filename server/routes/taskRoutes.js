import express from 'express';
import { toggleTask, deleteTask } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/:id/toggle', requireAuth, toggleTask);
router.delete('/:id', requireAuth, deleteTask);

export default router;
