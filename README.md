# PeerBridge — Find your people. Achieve more together.

> **Software Engineering Product Challenge MVP**  
> *Find your people. Make things happen.*

---

## 1. Problem Statement & Solution

### The University Collaboration Problem
Students frequently want to study a course together for an upcoming exam, assemble a hackathon squad, run peer mock interviews, or work on a focused side-project. However, connecting with compatible peers is notoriously hard:
- Existing class chat groups (WhatsApp, Telegram) are noisy and too broad.
- Close friends often have conflicting schedules or different academic tracks.
- Students do not know who is available *tonight* or *this weekend* with the same level of commitment.

### The PeerBridge Solution
**PeerBridge turns a student's intention into a temporary peer circle that helps them accomplish it.**

Instead of indefinite, passive social networking, PeerBridge is:
- **Intention-Driven**: Centered around an actionable, concrete mission.
- **Outcome-Bound**: Backed by a shared checklist and live progress tracking.
- **Temporary**: Once the milestone checklist is checked off, the mission is marked "Accomplished" and completed.

---

## 2. Core User Journey

```mermaid
graph LR
  A[Create Mission] --> B[Discover Compatible Peers]
  B --> C[Join Peer Circle]
  C --> D[Track Shared Progress]
  D --> E[Complete Goal]
```

1. **Create Mission**: Post an intention with title, category, schedule availability, group size, and roadmap tasks.
2. **Discover Compatible Peers**: Explore active missions with deterministic rule-based match scores ($0–100\%$).
3. **Join Peer Circle**: Immediate membership update with duplicate-prevention and circle capacity checks.
4. **Track Shared Progress**: Dynamic checklist where task toggles immediately recalculate progress percentages.
5. **Complete Goal**: Celebrate finishing the milestone and archive the completed circle.

---

## 3. Transparent Rule-Based Matching Algorithm

PeerBridge deliberately uses a **deterministic, rule-based matching engine** instead of black-box AI. It is 100% auditable and easy to explain during faculty evaluations:

$$\text{Compatibility Score} = \text{Goal/Topic Compatibility (50\%)} + \text{Availability (30\%)} + \text{Commitment (20\%)}$$

| Dimension | Max Weight | Logic / Criteria |
| :--- | :---: | :--- |
| **Goal & Topic** | **50%** | Exact topic keyword match (50 pts), same category (35 pts), or adjacent domain (15 pts). |
| **Availability** | **30%** | Identical time window (30 pts), flexible availability (22 pts), or schedule gap (8 pts). |
| **Commitment** | **20%** | Identical intensity (20 pts), adjacent pace (12 pts), or divergent intensity (5 pts). |

### Real-Time Persona Switching
Evaluators can use the **Persona Switcher** in the top navigation bar to switch between the 3 illustrative scenarios:
1. **Aanya (The Student)**: DBMS midterm focus • Available Tonight, 7 PM • Focused commitment.
2. **Rohan (The Builder)**: Hackathon & Web3 focus • Available This Weekend • Focused commitment.
3. **Mehak (The Career Preparer)**: Mock Interviews & System Design • Available Weekdays 6 PM • Regular commitment.

---

## 4. Technology Stack & Architecture

- **Frontend**: React 18 (JavaScript) + Vite
- **Styling**: Tailwind CSS with custom university palette (Deep Navy, Indigo, Emerald)
- **Icons**: Lucide React
- **Persistence**: Reactive `LocalStorage` layer with initial seed data
- **Zero Backend**: Completely self-contained, offline-capable frontend MVP

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, NotificationToast
│   ├── dashboard/    # HeroWelcome, QuickStats, JoinedCirclesSummary, ActiveMissionsList
│   ├── explore/      # ExploreView, MissionCard, MatchExplanationModal, EmptyState
│   ├── mission/      # CreateMissionModal, MissionDetailsModal
│   └── circles/      # MyCirclesView, CircleCard, ChecklistManager, MyMissionsView
├── context/
│   └── PeerBridgeContext.jsx  # Global state & LocalStorage sync
├── data/
│   ├── samplePersonas.js      # Student personas for testing matching
│   └── sampleMissions.js      # Realistic pre-seeded missions
└── services/
    ├── storageService.js      # LocalStorage persistence & reset utilities
    └── matchingService.js     # Rule-based 50/30/20 matching engine
```

---

## 5. Getting Started

### Development Server
```bash
npm install
npm run dev
```
The app runs at `http://localhost:3000/`.

### Run Verification Test Suite
```bash
npm test
```
Executes the automated matching algorithm test suite and edge-case state verification checks.

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.
