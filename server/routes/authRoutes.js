import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  switchDemoPersona,
  listPersonas
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.post('/switch-demo', switchDemoPersona);
router.get('/personas', listPersonas);

export default router;
