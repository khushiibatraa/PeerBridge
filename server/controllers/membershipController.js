import { Mission } from '../models/Mission.js';
import { Membership } from '../models/Membership.js';
import { hydrateMission } from './missionController.js';

/**
 * @desc    Join an active peer mission circle
 * @route   POST /api/missions/:id/join
 * @access  Private
 */
export async function joinMission(req, res, next) {
  try {
    const missionId = req.params.id;
    const userId = req.user._id;

    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found.'
      });
    }

    // 1. Duplicate Join Prevention Check
    const existingMembership = await Membership.findOne({
      user: userId,
      mission: missionId
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'You are already an active member of this circle.'
      });
    }

    // 2. Capacity Limit Check
    const currentMemberCount = await Membership.countDocuments({ mission: missionId });
    if (currentMemberCount >= mission.groupSize) {
      return res.status(400).json({
        success: false,
        message: 'This circle has reached maximum student capacity.'
      });
    }

    // 3. Create Membership Record
    await Membership.create({
      user: userId,
      mission: missionId,
      role: 'Member',
      joinedAt: new Date()
    });

    const populated = await Mission.findById(missionId).populate('createdBy', 'name avatar year');
    const hydrated = await hydrateMission(populated, req.user);

    res.status(200).json({
      success: true,
      message: `Successfully joined circle for "${mission.title}".`,
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Leave a peer mission circle
 * @route   POST /api/missions/:id/leave
 * @access  Private
 */
export async function leaveMission(req, res, next) {
  try {
    const missionId = req.params.id;
    const userId = req.user._id;

    const membership = await Membership.findOne({
      user: userId,
      mission: missionId
    });

    if (!membership) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this circle.'
      });
    }

    await Membership.deleteOne({ _id: membership._id });

    // If host leaves and other members exist, transfer host to next oldest member
    if (membership.role === 'Host') {
      const nextMember = await Membership.findOne({ mission: missionId }).sort({ joinedAt: 1 });
      if (nextMember) {
        nextMember.role = 'Host';
        await nextMember.save();
      }
    }

    const populated = await Mission.findById(missionId).populate('createdBy', 'name avatar year');
    const hydrated = populated ? await hydrateMission(populated, req.user) : null;

    res.status(200).json({
      success: true,
      message: 'You have left the collaboration circle.',
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get member roster for a specific circle
 * @route   GET /api/missions/:id/members
 * @access  Public
 */
export async function getMissionMembers(req, res, next) {
  try {
    const memberships = await Membership.find({ mission: req.params.id })
      .populate('user', 'name avatar year role handle bio')
      .sort({ role: 1, joinedAt: 1 });

    const members = memberships
      .filter(m => m.user)
      .map(m => ({
        id: m.user._id.toString(),
        name: m.user.name,
        role: m.role,
        year: m.user.year,
        avatar: m.user.avatar,
        handle: m.user.handle,
        joinedAt: m.joinedAt
      }));

    res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    next(error);
  }
}
