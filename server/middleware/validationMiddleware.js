/**
 * Validation helpers for request bodies
 */

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Full name is required.');
  if (!email || !email.trim()) {
    errors.push('Email address is required.');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
    errors.push('Please provide a valid university email address.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(' ') });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }
  next();
}

export function validateCreateMission(req, res, next) {
  const { title, category, description, availability, groupSize } = req.body;
  const errors = [];

  if (!title || title.trim().length < 5) {
    errors.push('Mission title must be at least 5 characters long.');
  }

  const validCategories = ['Study', 'Hackathon', 'Career', 'Projects'];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}.`);
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long.');
  }

  if (!availability || !availability.trim()) {
    errors.push('Availability/timing is required.');
  }

  const parsedSize = parseInt(groupSize, 10);
  if (isNaN(parsedSize) || parsedSize < 2 || parsedSize > 8) {
    errors.push('Group size must be an integer between 2 and 8 students.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(' ') });
  }

  next();
}
