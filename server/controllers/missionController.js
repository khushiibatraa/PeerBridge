import { Mission } from '../models/Mission.js';
import { Membership } from '../models/Membership.js';
import { ChecklistTask } from '../models/ChecklistTask.js';
import { calculateMissionMatch } from '../services/matchingService.js';

/**
 * Hydrates a mission with its members, checklist tasks, and personalized match score
 */
export async function hydrateMission(mission, student = null) {
  const missionId = mission._id;

  const [memberships, tasks] = await Promise.all([
    Membership.find({ mission: missionId }).populate('user', 'name avatar year role handle bio goals primaryCategory availabilityKey commitment'),
    ChecklistTask.find({ mission: missionId }).sort({ order: 1, createdAt: 1 })
  ]);

  const members = memberships
    .filter(m => m.user) // ensure user reference still exists
    .map(m => ({
      id: m.user._id.toString(),
      name: m.user.name,
      role: m.role,
      year: m.user.year,
      avatar: m.user.avatar,
      handle: m.user.handle,
      joinedAt: m.joinedAt ? m.joinedAt.toISOString() : new Date().toISOString()
    }));

  const checklist = tasks.map(t => ({
    id: t._id.toString(),
    text: t.text,
    completed: t.completed,
    order: t.order
  }));

  const createdBy = mission.createdBy && typeof mission.createdBy === 'object' && mission.createdBy.name
    ? {
        id: mission.createdBy._id.toString(),
        name: mission.createdBy.name,
        avatar: mission.createdBy.avatar,
        year: mission.createdBy.year
      }
    : null;

  const matchInfo = calculateMissionMatch(mission, student);

  return {
    id: mission._id.toString(),
    title: mission.title,
    category: mission.category,
    description: mission.description,
    subject: mission.subject || '',
    availability: mission.availability,
    availabilityKey: mission.availabilityKey,
    groupSize: mission.groupSize,
    commitment: mission.commitment,
    status: mission.status,
    createdBy,
    members,
    checklist,
    createdAt: mission.createdAt ? mission.createdAt.toISOString() : new Date().toISOString(),
    matchScore: matchInfo.percentage,
    matchInfo
  };
}

/**
 * @desc    Explore / List missions with filters and heuristic match ranking
 * @route   GET /api/missions
 * @access  Public (Optional Auth for personalized matching)
 */
export async function getMissions(req, res, next) {
  try {
    const {
      search,
      category,
      availabilityKey,
      commitment,
      hideFull,
      sortBy = 'match',
      scope = 'all'
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by schedule
    if (availabilityKey && availabilityKey !== 'All') {
      query.availabilityKey = availabilityKey;
    }

    // Filter by commitment pace
    if (commitment && commitment !== 'All') {
      query.commitment = commitment;
    }

    // Keyword search
    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { subject: regex },
        { category: regex }
      ];
    }

    // Scope filter for My Missions / Circles
    if (scope === 'my-created' && req.user) {
      query.createdBy = req.user._id;
    }

    let missions = await Mission.find(query)
      .populate('createdBy', 'name avatar year')
      .sort({ createdAt: -1 });

    // Scope filter for 'my-joined'
    if (scope === 'my-joined' && req.user) {
      const userMemberships = await Membership.find({ user: req.user._id }).select('mission');
      const joinedMissionIds = new Set(userMemberships.map(m => m.mission.toString()));
      missions = missions.filter(m => joinedMissionIds.has(m._id.toString()));
    }

    // Hydrate all missions in parallel
    let hydrated = await Promise.all(
      missions.map(m => hydrateMission(m, req.user))
    );

    // Filter out full circles if requested
    if (hideFull === 'true' || hideFull === true) {
      hydrated = hydrated.filter(m => m.members.length < m.groupSize);
    }

    // Sorting
    if (sortBy === 'match') {
      hydrated.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'newest') {
      hydrated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'capacity') {
      hydrated.sort((a, b) => (b.groupSize - b.members.length) - (a.groupSize - a.members.length));
    }

    res.status(200).json({
      success: true,
      count: hydrated.length,
      missions: hydrated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get single mission by ID with full details
 * @route   GET /api/missions/:id
 * @access  Public (Optional Auth)
 */
export async function getMissionById(req, res, next) {
  try {
    const mission = await Mission.findById(req.params.id).populate('createdBy', 'name avatar year');
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found.'
      });
    }

    const hydrated = await hydrateMission(mission, req.user);

    res.status(200).json({
      success: true,
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Create a new mission with initial roadmap tasks and host membership
 * @route   POST /api/missions
 * @access  Private (Authenticated student)
 */
export async function createMission(req, res, next) {
  try {
    const {
      title,
      category,
      description,
      subject,
      availability,
      availabilityKey,
      groupSize,
      commitment,
      initialTasks
    } = req.body;

    const mission = await Mission.create({
      title: title.trim(),
      category,
      description: description.trim(),
      subject: subject ? subject.trim() : title.trim(),
      availability: availability.trim(),
      availabilityKey: availabilityKey || 'flexible',
      groupSize: parseInt(groupSize, 10) || 4,
      commitment: commitment || 'Regular',
      createdBy: req.user._id,
      status: 'Active'
    });

    // Create Host membership
    await Membership.create({
      user: req.user._id,
      mission: mission._id,
      role: 'Host',
      joinedAt: new Date()
    });

    // Create initial roadmap checklist tasks
    const tasksToInsert = Array.isArray(initialTasks) && initialTasks.filter(t => t && t.trim()).length > 0
      ? initialTasks.filter(t => t && t.trim()).map((t, idx) => ({
          mission: mission._id,
          text: t.trim(),
          completed: false,
          order: idx
        }))
      : [
          { mission: mission._id, text: 'Kickoff meeting & align on shared goals', completed: false, order: 0 },
          { mission: mission._id, text: 'Review core concept outline & resources', completed: false, order: 1 },
          { mission: mission._id, text: 'Practice / build collaboratively', completed: false, order: 2 }
        ];

    await ChecklistTask.insertMany(tasksToInsert);

    const populatedMission = await Mission.findById(mission._id).populate('createdBy', 'name avatar year');
    const hydrated = await hydrateMission(populatedMission, req.user);

    res.status(201).json({
      success: true,
      message: 'Mission created successfully.',
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update mission status (Active <-> Completed)
 * @route   PATCH /api/missions/:id/status
 * @access  Private
 */
export async function updateMissionStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status || !['Active', 'Completed', 'Archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Active, Completed, or Archived.'
      });
    }

    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found.'
      });
    }

    // Verify user is a member of this mission
    const membership = await Membership.findOne({
      user: req.user._id,
      mission: mission._id
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'You must be a member of this circle to update its milestone status.'
      });
    }

    mission.status = status;
    await mission.save();

    const populated = await Mission.findById(mission._id).populate('createdBy', 'name avatar year');
    const hydrated = await hydrateMission(populated, req.user);

    res.status(200).json({
      success: true,
      message: `Mission status updated to ${status}.`,
      mission: hydrated
    });
  } catch (error) {
    next(error);
  }
}
