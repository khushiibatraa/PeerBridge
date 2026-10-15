import { ChecklistTask } from '../models/ChecklistTask.js';
import { Mission } from '../models/Mission.js';
import { Membership } from '../models/Membership.js';
import { hydrateMission } from './missionController.js';

/**
 * @desc    Add a milestone task to circle roadmap
 * @route   POST /api/missions/:id/tasks
 * @access  Private (Circle Member)
 */
export async function addTask(req, res, next) {
  try {
    const missionId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task text is required.'
      });
    }

    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found.'
      });
    }

    // Verify user is a member
    const membership = await Membership.findOne({
      user: req.user._id,
      mission: missionId
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'You must be a member of this circle to add milestone tasks.'
      });
    }

    const taskCount = await ChecklistTask.countDocuments({ mission: missionId });

    const newTask = await ChecklistTask.create({
      mission: missionId,
      text: text.trim(),
      completed: false,
      order: taskCount
    });

    const populated = await Mission.findById(missionId).populate('createdBy', 'name avatar year');
    const hydrated = await hydrateMission(populated, req.user);

    res.status(201).json({
      success: true,
      task: {
        id: newTask._id.toString(),
        text: newTask.text,
        completed: newTask.completed,
        order: newTask.order
      },
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Toggle milestone task completion
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Private (Circle Member)
 */
export async function toggleTask(req, res, next) {
  try {
    const taskId = req.params.id;
    const task = await ChecklistTask.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Milestone task not found.'
      });
    }

    // Verify user is a member of the associated mission
    const membership = await Membership.findOne({
      user: req.user._id,
      mission: task.mission
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'You must be a member of this circle to update milestone tasks.'
      });
    }

    task.completed = !task.completed;
    task.completedBy = task.completed ? req.user._id : null;
    await task.save();

    const populated = await Mission.findById(task.mission).populate('createdBy', 'name avatar year');
    const hydrated = await hydrateMission(populated, req.user);

    res.status(200).json({
      success: true,
      task: {
        id: task._id.toString(),
        text: task.text,
        completed: task.completed,
        order: task.order
      },
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete a milestone task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Circle Member)
 */
export async function deleteTask(req, res, next) {
  try {
    const taskId = req.params.id;
    const task = await ChecklistTask.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Milestone task not found.'
      });
    }

    const membership = await Membership.findOne({
      user: req.user._id,
      mission: task.mission
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'You must be a member of this circle to delete milestone tasks.'
      });
    }

    const missionId = task.mission;
    await ChecklistTask.deleteOne({ _id: taskId });

    const populated = await Mission.findById(missionId).populate('createdBy', 'name avatar year');
    const hydrated = await hydrateMission(populated, req.user);

    res.status(200).json({
      success: true,
      message: 'Task removed from milestone roadmap.',
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}
