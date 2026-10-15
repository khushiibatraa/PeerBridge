import express from 'express';
import {
  getMissions,
  getMissionById,
  createMission,
  updateMissionStatus
} from '../controllers/missionController.js';
import {
  joinMission,
  leaveMission,
  getMissionMembers
} from '../controllers/membershipController.js';
import { addTask } from '../controllers/taskController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import { validateCreateMission } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Explore / Create
router.route('/')
  .get(optionalAuth, getMissions)
  .post(requireAuth, validateCreateMission, createMission);

// Single Mission
router.route('/:id')
  .get(optionalAuth, getMissionById);

// Mission Status
router.route('/:id/status')
  .patch(requireAuth, updateMissionStatus);

// Circle Membership (Join / Leave / Members)
router.route('/:id/join')
  .post(requireAuth, joinMission);

router.route('/:id/leave')
  .post(requireAuth, leaveMission);

router.route('/:id/members')
  .get(getMissionMembers);

// Milestone Tasks for a Mission
router.route('/:id/tasks')
  .post(requireAuth, addTask);

export default router;
