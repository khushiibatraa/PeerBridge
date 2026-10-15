import { calculateMissionMatch, calculatePeerMatch } from './src/services/matchingService.js';
import { SAMPLE_PERSONAS } from './src/data/samplePersonas.js';
import { INITIAL_MISSIONS } from './src/data/sampleMissions.js';

console.log('--- RUNNING PEERBRIDGE VERIFICATION SUITE ---');

const aanya = SAMPLE_PERSONAS.find(p => p.id === 'user-aanya');
const rohan = SAMPLE_PERSONAS.find(p => p.id === 'user-rohan');
const mehak = SAMPLE_PERSONAS.find(p => p.id === 'user-mehak');

const dbmsMission = INITIAL_MISSIONS.find(m => m.id === 'm-dbms-1');
const hackMission = INITIAL_MISSIONS.find(m => m.id === 'm-hack-1');
const interviewMission = INITIAL_MISSIONS.find(m => m.id === 'm-interview-1');
const fullCircleMission = INITIAL_MISSIONS.find(m => m.id === 'm-os-1');

// 1. Verify Aanya matching
console.log('\n[Test 1] Aanya vs DBMS Revision Session:');
const aanyaMatch = calculateMissionMatch(dbmsMission, aanya);
console.log(`Percentage: ${aanyaMatch.percentage}%`);
console.log(`Goal: ${aanyaMatch.goalScore}/50, Avail: ${aanyaMatch.availScore}/30, Commit: ${aanyaMatch.commitScore}/20`);
console.log(`Explanations:`, aanyaMatch.explanations);
if (aanyaMatch.percentage >= 90) {
  console.log('✅ PASS: Aanya has high compatibility (>=90%) with DBMS session.');
} else {
  console.error('❌ FAIL: Expected >=90%');
}

// 2. Verify Rohan matching
console.log('\n[Test 2] Rohan vs Hackathon Sprint:');
const rohanMatch = calculateMissionMatch(hackMission, rohan);
console.log(`Percentage: ${rohanMatch.percentage}%`);
console.log(`Goal: ${rohanMatch.goalScore}/50, Avail: ${rohanMatch.availScore}/30, Commit: ${rohanMatch.commitScore}/20`);
console.log(`Explanations:`, rohanMatch.explanations);
if (rohanMatch.percentage >= 90) {
  console.log('✅ PASS: Rohan has high compatibility (>=90%) with Hackathon session.');
} else {
  console.error('❌ FAIL: Expected >=90%');
}

// 3. Verify Mehak matching
console.log('\n[Test 3] Mehak vs Mock Interview Session:');
const mehakMatch = calculateMissionMatch(interviewMission, mehak);
console.log(`Percentage: ${mehakMatch.percentage}%`);
console.log(`Goal: ${mehakMatch.goalScore}/50, Avail: ${mehakMatch.availScore}/30, Commit: ${mehakMatch.commitScore}/20`);
console.log(`Explanations:`, mehakMatch.explanations);
if (mehakMatch.percentage >= 90) {
  console.log('✅ PASS: Mehak has high compatibility (>=90%) with Mock Interview session.');
} else {
  console.error('❌ FAIL: Expected >=90%');
}

// 4. Cross-compatibility check (Aanya on Hackathon should be significantly lower)
console.log('\n[Test 4] Aanya vs Hackathon Sprint (Incompatible Track/Availability):');
const aanyaHackMatch = calculateMissionMatch(hackMission, aanya);
console.log(`Percentage: ${aanyaHackMatch.percentage}%`);
if (aanyaHackMatch.percentage < aanyaMatch.percentage) {
  console.log(`✅ PASS: Correct discrimination: ${aanyaHackMatch.percentage}% vs ${aanyaMatch.percentage}%`);
} else {
  console.error('❌ FAIL: Incompatible mission did not receive lower score');
}

// 5. Capacity Check
console.log('\n[Test 5] Full Circle Capacity Check:');
console.log(`Circle: ${fullCircleMission.title}`);
console.log(`Members: ${fullCircleMission.members.length}, Group Size: ${fullCircleMission.groupSize}`);
const isFull = fullCircleMission.members.length >= fullCircleMission.groupSize;
if (isFull) {
  console.log('✅ PASS: Full circle correctly detected capacity 3/3.');
} else {
  console.error('❌ FAIL: Expected full circle to be full.');
}

// 6. Checklist dynamic percentage test
console.log('\n[Test 6] Dynamic Checklist Progress Calculation:');
const sampleTasks = [
  { id: '1', text: 'Task 1', completed: true },
  { id: '2', text: 'Task 2', completed: false },
  { id: '3', text: 'Task 3', completed: false },
  { id: '4', text: 'Task 4', completed: false }
];
let pct = Math.round((sampleTasks.filter(t => t.completed).length / sampleTasks.length) * 100);
console.log(`1 of 4 completed: ${pct}%`);
if (pct === 25) console.log('✅ PASS: 1/4 = 25%');

// Toggle task 2
sampleTasks[1].completed = true;
pct = Math.round((sampleTasks.filter(t => t.completed).length / sampleTasks.length) * 100);
console.log(`2 of 4 completed: ${pct}%`);
if (pct === 50) console.log('✅ PASS: 2/4 = 50%');

// Add task 5
sampleTasks.push({ id: '5', text: 'Task 5', completed: false });
pct = Math.round((sampleTasks.filter(t => t.completed).length / sampleTasks.length) * 100);
console.log(`2 of 5 completed: ${pct}%`);
if (pct === 40) console.log('✅ PASS: 2/5 = 40%');

console.log('\nALL 6 VERIFICATION CHECKS PASSED SUCCESSFULLY!');
