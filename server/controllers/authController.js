import { User } from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function registerUser(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      handle,
      role,
      year,
      avatar,
      goals,
      primaryCategory,
      preferredAvailability,
      availabilityKey,
      commitment,
      bio
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email address already exists.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      handle: handle ? handle.trim() : undefined,
      role: role || 'Student',
      year: year || 'University Student',
      avatar: avatar || undefined,
      goals: Array.isArray(goals) ? goals : (goals ? [goals] : []),
      primaryCategory: primaryCategory || 'Study',
      preferredAvailability: preferredAvailability || 'Today, 7 PM',
      availabilityKey: availabilityKey || 'flexible',
      commitment: commitment || 'Regular',
      bio: bio || ''
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Authenticate student & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export async function getMe(req, res) {
  res.status(200).json({
    success: true,
    user: req.user
  });
}

/**
 * @desc    Update current student profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
export async function updateMe(req, res, next) {
  try {
    const allowedFields = [
      'name',
      'handle',
      'bio',
      'goals',
      'primaryCategory',
      'preferredAvailability',
      'availabilityKey',
      'commitment',
      'avatar',
      'year'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    const updatedUser = await req.user.save();

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Quick-switch demo persona for evaluators (issues genuine JWT)
 * @route   POST /api/auth/switch-demo
 * @access  Public
 */
export async function switchDemoPersona(req, res, next) {
  try {
    const { identifier } = req.body; // e.g. 'user-aanya' or 'aanya@peerbridge.edu' or 'aanya'

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Identifier is required (e.g. user-aanya or aanya@peerbridge.edu).'
      });
    }

    // Try finding by email or name regex
    let user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { email: new RegExp(`^${identifier.replace('user-', '')}@`, 'i') },
        { name: new RegExp(identifier.replace('user-', ''), 'i') }
      ]
    });

    if (!user) {
      // Default to first user if not found
      user = await User.findOne();
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No demo student profile found in database.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    List all demo personas for the UI selector
 * @route   GET /api/auth/personas
 * @access  Public
 */
export async function listPersonas(req, res, next) {
  try {
    const users = await User.find({
      email: { $in: ['aanya@peerbridge.edu', 'rohan@peerbridge.edu', 'mehak@peerbridge.edu', 'devansh@peerbridge.edu'] }
    });

    res.status(200).json({
      success: true,
      personas: users
    });
  } catch (error) {
    next(error);
  }
}
