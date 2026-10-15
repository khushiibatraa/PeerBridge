/**
 * Rule-Based Matching Engine for PeerBridge
 * 
 * Formula:
 * Total Score (100%) = Goal/Topic Compatibility (50%) 
 *                     + Availability Compatibility (30%) 
 *                     + Commitment Compatibility (20%)
 * 
 * Deterministic, transparent, and auditable for university evaluation.
 */

const normalizeText = (str) => (str || '').toLowerCase().trim();

/**
 * Calculates rule-based compatibility between a student and a mission.
 * @param {Object} mission 
 * @param {Object} student 
 * @returns {Object} score breakdown and human-readable explanations
 */
export function calculateMissionMatch(mission, student) {
  if (!mission || !student) {
    return {
      percentage: 50,
      goalScore: 25,
      availScore: 15,
      commitScore: 10,
      explanations: ['Standard baseline match.'],
      summaryText: 'Moderate compatibility'
    };
  }

  const explanations = [];

  // 1. Goal & Topic Compatibility (Weight: 50%)
  let goalScore = 0;
  const studentGoals = (student.goals || []).map(g => normalizeText(g));
  const missionText = normalizeText(
    `${mission.title} ${mission.description} ${mission.subject || ''} ${mission.category}`
  );

  // Check specific keyword overlap between student goals and mission content
  let matchedKeyword = null;
  for (const goal of studentGoals) {
    const tokens = goal.split(/[\s,&/]+/).filter(t => t.length > 2);
    for (const token of tokens) {
      if (missionText.includes(token)) {
        matchedKeyword = token.toUpperCase();
        break;
      }
    }
    if (matchedKeyword) break;
  }

  if (matchedKeyword) {
    goalScore = 50;
    explanations.push(`Goal match: Shared topic focus on ${matchedKeyword} (+50%)`);
  } else if (normalizeText(student.primaryCategory) === normalizeText(mission.category)) {
    goalScore = 35;
    explanations.push(`Category match: Both focused on ${mission.category} (+35%)`);
  } else {
    // Cross-category or adjacent exploration
    goalScore = 15;
    explanations.push(`Different core track: ${mission.category} vs ${student.primaryCategory} (+15%)`);
  }

  // 2. Availability Compatibility (Weight: 30%)
  let availScore = 0;
  const missionAvailKey = mission.availabilityKey || 'flexible';
  const studentAvailKey = student.availabilityKey || 'flexible';

  if (missionAvailKey === studentAvailKey && missionAvailKey !== 'flexible') {
    availScore = 30;
    explanations.push(`Schedule match: Both available for ${mission.availability} (+30%)`);
  } else if (missionAvailKey === 'flexible' || studentAvailKey === 'flexible') {
    availScore = 22;
    explanations.push(`Schedule flexibility: Open timing overlap (+22%)`);
  } else {
    availScore = 8;
    explanations.push(`Schedule gap: ${mission.availability} vs ${student.preferredAvailability} (+8%)`);
  }

  // 3. Commitment Compatibility (Weight: 20%)
  let commitScore = 0;
  const mCommit = (mission.commitment || 'Regular').toLowerCase();
  const sCommit = (student.commitment || 'Regular').toLowerCase();

  if (mCommit === sCommit) {
    commitScore = 20;
    explanations.push(`Commitment match: Both prefer ${mission.commitment} intensity (+20%)`);
  } else if (
    (mCommit === 'regular' && (sCommit === 'focused' || sCommit === 'casual')) ||
    (sCommit === 'regular' && (mCommit === 'focused' || mCommit === 'casual'))
  ) {
    commitScore = 12;
    explanations.push(`Commitment alignment: Adjacent pace (${mission.commitment} vs ${student.commitment}) (+12%)`);
  } else {
    // Focused vs Casual
    commitScore = 5;
    explanations.push(`Commitment divergence: ${mission.commitment} vs ${student.commitment} (+5%)`);
  }

  const rawPercentage = goalScore + availScore + commitScore;
  const percentage = Math.min(100, Math.max(10, Math.round(rawPercentage)));

  let summaryText = 'Moderate Compatibility';
  if (percentage >= 85) {
    summaryText = 'High Priority Match — Ideal Peer Circle';
  } else if (percentage >= 65) {
    summaryText = 'Strong Match — Compatible Objectives';
  } else if (percentage >= 45) {
    summaryText = 'Partial Match — Broadened Exploration';
  } else {
    summaryText = 'Low Match — Different Schedule or Domain';
  }

  return {
    percentage,
    goalScore,
    availScore,
    commitScore,
    explanations,
    summaryText
  };
}

/**
 * Calculates mutual peer-to-peer compatibility score between two students
 */
export function calculatePeerMatch(studentA, studentB) {
  if (!studentA || !studentB) return { percentage: 50, reasons: [] };

  const pseudoMission = {
    category: studentB.primaryCategory,
    title: studentB.goals?.join(' ') || '',
    subject: studentB.goals?.[0] || '',
    availabilityKey: studentB.availabilityKey,
    availability: studentB.preferredAvailability,
    commitment: studentB.commitment
  };

  return calculateMissionMatch(pseudoMission, studentA);
}
