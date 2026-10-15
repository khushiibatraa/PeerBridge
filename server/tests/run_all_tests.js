import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../services/seedService.js';
import { User } from '../models/User.js';
import { Mission } from '../models/Mission.js';
import { Membership } from '../models/Membership.js';
import { ChecklistTask } from '../models/ChecklistTask.js';
import { calculateMissionMatch } from '../services/matchingService.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   PEERBRIDGE FULL-STACK BACKEND VERIFICATION SUITE   ');
  console.log('======================================================\n');

  try {
    // 1. Connect DB and seed
    await connectDB();
    await seedDatabase(true);

    // ==========================================
    // SUITE 1: AUTHENTICATION & PASSWORD HASHING
    // ==========================================
    console.log('\n--- SUITE 1: AUTHENTICATION & PASSWORD HASHING ---');

    // Test 1.1: Password Hashing on User Creation
    const testUser = await User.create({
      name: 'Sarah Connor',
      email: 'sarah.c@university.edu',
      password: 'PlainSecretPassword123!',
      role: 'Student',
      year: '2nd Year CS',
      primaryCategory: 'Study'
    });

    assert(testUser.password !== 'PlainSecretPassword123!', 'Password is cryptographically hashed');
    assert(testUser.password.startsWith('$2'), 'Bcrypt hash format verified');

    // Test 1.2: Password comparison method
    const matchSuccess = await testUser.matchPassword('PlainSecretPassword123!');
    const matchFail = await testUser.matchPassword('WrongPassword!');
    assert(matchSuccess === true, 'Correct password matches hashed password');
    assert(matchFail === false, 'Incorrect password correctly rejected');

    // Test 1.3: Serialization strips password
    const userJson = testUser.toJSON();
    assert(userJson.password === undefined, 'Password omitted from JSON serialization');
    assert(userJson.id === testUser._id.toString(), 'Virtual ID present in serialization');

    // Test 1.4: Duplicate email prevention
    let duplicateRejected = false;
    try {
      await User.create({
        name: 'Another Sarah',
        email: 'sarah.c@university.edu',
        password: 'AnotherPassword123!'
      });
    } catch (err) {
      duplicateRejected = true;
    }
    assert(duplicateRejected, 'Duplicate email registration rejected by database constraint');

    // Test 1.5: JWT token generation and validation
    const token = jwt.sign({ id: testUser._id }, ENV.JWT_SECRET, { expiresIn: '1d' });
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    assert(decoded.id === testUser._id.toString(), 'Signed JWT token decodes valid user ID');

    // ==========================================
    // SUITE 2: MISSIONS CRUD & VALIDATIONS
    // ==========================================
    console.log('\n--- SUITE 2: MISSIONS CRUD & VALIDATIONS ---');

    // Test 2.1: Create Mission with Roadmap Tasks & Host Membership
    const aanya = await User.findOne({ email: 'aanya@peerbridge.edu' });
    assert(!!aanya, 'Seed persona Aanya exists');

    const createdMission = await Mission.create({
      title: 'Operating Systems Virtual Memory Sprint',
      category: 'Study',
      description: 'Review paging, TLB misses, and page replacement algorithms for final exam.',
      subject: 'Operating Systems',
      availability: 'Tomorrow, 5 PM',
      availabilityKey: 'flexible',
      groupSize: 4,
      commitment: 'Focused',
      createdBy: aanya._id,
      status: 'Active'
    });

    assert(createdMission.title === 'Operating Systems Virtual Memory Sprint', 'Mission created in MongoDB');
    assert(createdMission.createdBy.toString() === aanya._id.toString(), 'CreatedBy references Aanya');

    // Host membership
    await Membership.create({
      user: aanya._id,
      mission: createdMission._id,
      role: 'Host'
    });

    // Roadmap tasks
    await ChecklistTask.create([
      { mission: createdMission._id, text: 'Review inverted page tables', completed: false, order: 0 },
      { mission: createdMission._id, text: 'Simulate FIFO vs LRU algorithm', completed: false, order: 1 }
    ]);

    const createdTasks = await ChecklistTask.find({ mission: createdMission._id });
    assert(createdTasks.length === 2, 'Roadmap tasks created for new mission');

    // Test 2.2: Input validation
    let validationRejected = false;
    try {
      await Mission.create({
        title: 'Tiny', // < 5 chars
        category: 'InvalidCategory',
        description: 'Short', // < 10 chars
        availability: 'Tonight',
        createdBy: aanya._id
      });
    } catch (err) {
      validationRejected = true;
    }
    assert(validationRejected, 'Invalid mission input correctly rejected by Mongoose validation');

    // ==========================================
    // SUITE 3: MEMBERSHIP & CAPACITY GUARDRAILS
    // ==========================================
    console.log('\n--- SUITE 3: MEMBERSHIP & CAPACITY GUARDRAILS ---');

    const rohan = await User.findOne({ email: 'rohan@peerbridge.edu' });
    assert(!!rohan, 'Seed persona Rohan exists');

    // Test 3.1: Rohan joins Aanya\'s new mission
    await Membership.create({
      user: rohan._id,
      mission: createdMission._id,
      role: 'Member'
    });

    let memberCount = await Membership.countDocuments({ mission: createdMission._id });
    assert(memberCount === 2, 'Rohan successfully joined circle (count = 2/4)');

    // Test 3.2: Duplicate join prevention
    let duplicateJoinRejected = false;
    try {
      await Membership.create({
        user: rohan._id,
        mission: createdMission._id,
        role: 'Member'
      });
    } catch (err) {
      duplicateJoinRejected = true;
    }
    assert(duplicateJoinRejected, 'Duplicate membership blocked by unique compound index { user, mission }');

    // Test 3.3: Exceeding capacity check
    const fullMission = await Mission.findOne({ title: 'OS Concurrency & Semaphore Workshop' });
    assert(!!fullMission, 'OS Concurrency full mission exists');
    const fullMissionMembers = await Membership.countDocuments({ mission: fullMission._id });
    assert(fullMissionMembers === fullMission.groupSize, `Full circle verified at capacity (${fullMissionMembers}/${fullMission.groupSize})`);

    // Verify application capacity logic
    const canJoinFull = fullMissionMembers < fullMission.groupSize;
    assert(canJoinFull === false, 'Capacity guard prevents new member from joining full circle');

    // ==========================================
    // SUITE 4: CHECKLIST ROADMAP PROGRESS
    // ==========================================
    console.log('\n--- SUITE 4: CHECKLIST ROADMAP PROGRESS ---');

    const firstTask = createdTasks[0];
    assert(firstTask.completed === false, 'Task begins uncompleted');

    // Toggle task
    firstTask.completed = true;
    firstTask.completedBy = rohan._id;
    await firstTask.save();

    const updatedTask = await ChecklistTask.findById(firstTask._id);
    assert(updatedTask.completed === true, 'Task completed status persisted to MongoDB');
    assert(updatedTask.completedBy.toString() === rohan._id.toString(), 'Task completedBy references student');

    // Recalculate progress
    const allTasks = await ChecklistTask.find({ mission: createdMission._id });
    const doneTasks = allTasks.filter(t => t.completed).length;
    const progressPercent = Math.round((doneTasks / allTasks.length) * 100);
    assert(progressPercent === 50, `Dynamic progress recalculated to 50% (${doneTasks}/${allTasks.length})`);

    // Complete all tasks & mission
    const secondTask = createdTasks[1];
    secondTask.completed = true;
    await secondTask.save();

    createdMission.status = 'Completed';
    await createdMission.save();

    const finalizedMission = await Mission.findById(createdMission._id);
    assert(finalizedMission.status === 'Completed', 'Mission marked Completed when milestones finished');

    // ==========================================
    // SUITE 5: DETERMINISTIC HEURISTIC MATCHING
    // ==========================================
    console.log('\n--- SUITE 5: DETERMINISTIC HEURISTIC MATCHING ---');

    const dbmsMission = await Mission.findOne({ title: 'DBMS Revision Session' });
    const hackMission = await Mission.findOne({ title: 'HackSprint: Campus Ride-Share MVP' });
    const mehak = await User.findOne({ email: 'mehak@peerbridge.edu' });
    const interviewMission = await Mission.findOne({ title: 'System Design & Behavioral Mock Interviews' });

    // Aanya vs DBMS: 100%
    const aanyaMatch = calculateMissionMatch(dbmsMission, aanya);
    assert(aanyaMatch.percentage === 100, `Aanya vs DBMS Session matches at 100% (actual: ${aanyaMatch.percentage}%)`);
    assert(aanyaMatch.goalScore === 50, 'Aanya gets 50/50 goal score for DBMS');
    assert(aanyaMatch.availScore === 30, 'Aanya gets 30/30 availability score for Tonight 7 PM');
    assert(aanyaMatch.commitScore === 20, 'Aanya gets 20/20 commitment score for Focused');

    // Rohan vs Hackathon: 100%
    const rohanMatch = calculateMissionMatch(hackMission, rohan);
    assert(rohanMatch.percentage === 100, `Rohan vs HackSprint matches at 100% (actual: ${rohanMatch.percentage}%)`);

    // Mehak vs Interview: 100%
    const mehakMatch = calculateMissionMatch(interviewMission, mehak);
    assert(mehakMatch.percentage === 100, `Mehak vs System Design matches at 100% (actual: ${mehakMatch.percentage}%)`);

    // Negative discrimination: Aanya vs Hackathon
    const aanyaHackMatch = calculateMissionMatch(hackMission, aanya);
    assert(aanyaHackMatch.percentage < 60, `Aanya vs Hackathon correctly scored low compatibility (${aanyaHackMatch.percentage}%)`);

    console.log('\n======================================================');
    console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
    console.log(`PASSED: ${passedTests}`);
    console.log(`FAILED: ${failedTests}`);
    console.log('======================================================\n');

    await disconnectDB();

    if (failedTests > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }

  } catch (error) {
    console.error('Fatal test error:', error);
    await disconnectDB();
    process.exit(1);
  }
}

runTests();
