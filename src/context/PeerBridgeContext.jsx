import React, { createContext, useContext, useState, useEffect } from 'react';
import { SAMPLE_PERSONAS, DEFAULT_CURRENT_USER_ID } from '../data/samplePersonas';
import {
  getStoredMissions,
  saveStoredMissions,
  getStoredCurrentUserId,
  saveStoredCurrentUserId,
  resetStorageToDefaults
} from '../services/storageService';
import {
  checkBackendHealth,
  fetchMissionsApi,
  createMissionApi,
  joinMissionApi,
  leaveMissionApi,
  addTaskApi,
  toggleTaskApi,
  deleteTaskApi,
  updateMissionStatusApi,
  switchDemoPersonaApi
} from '../services/apiService';

const PeerBridgeContext = createContext();

export function PeerBridgeProvider({ children }) {
  const [missions, setMissions] = useState(() => getStoredMissions());
  const [currentUserId, setCurrentUserId] = useState(() => getStoredCurrentUserId());
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'explore' | 'my-circles' | 'my-missions'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [inspectMatchMissionId, setInspectMatchMissionId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Check backend availability on load
  useEffect(() => {
    let mounted = true;
    async function initBackend() {
      const isHealthy = await checkBackendHealth();
      if (!mounted) return;
      if (isHealthy) {
        setIsBackendConnected(true);
        await switchDemoPersonaApi(currentUserId);
        try {
          const res = await fetchMissionsApi();
          if (mounted && res && Array.isArray(res.missions) && res.missions.length > 0) {
            setMissions(res.missions);
          }
        } catch (err) {
          console.warn('Could not fetch missions from backend, using local:', err);
        }
      } else {
        setIsBackendConnected(false);
      }
    }
    initBackend();
    return () => { mounted = false; };
  }, [currentUserId]);

  // Sync missions to LocalStorage when changed
  useEffect(() => {
    saveStoredMissions(missions);
  }, [missions]);

  // Sync current user to LocalStorage when changed
  useEffect(() => {
    saveStoredCurrentUserId(currentUserId);
  }, [currentUserId]);

  const activePersona = SAMPLE_PERSONAS.find(p => p.id === currentUserId) || SAMPLE_PERSONAS[0];

  const addToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchPersona = async (newUserId) => {
    setCurrentUserId(newUserId);
    const newPersona = SAMPLE_PERSONAS.find(p => p.id === newUserId);
    addToast('Persona Switched', `Active student is now ${newPersona?.name} (${newPersona?.role})`, 'info');
    if (isBackendConnected) {
      await switchDemoPersonaApi(newUserId);
      try {
        const res = await fetchMissionsApi();
        if (res && Array.isArray(res.missions)) {
          setMissions(res.missions);
        }
      } catch (err) {
        console.warn('Error refreshing missions after persona switch:', err);
      }
    }
  };

  const createMission = async (missionData) => {
    const newMission = {
      id: `m-custom-${Date.now()}`,
      title: missionData.title.trim(),
      category: missionData.category,
      description: missionData.description.trim(),
      subject: missionData.subject ? missionData.subject.trim() : missionData.title.trim(),
      availability: missionData.availability.trim(),
      availabilityKey: missionData.availabilityKey || 'flexible',
      groupSize: parseInt(missionData.groupSize, 10) || 4,
      commitment: missionData.commitment || 'Regular',
      meetingLink: missionData.meetingLink || '',
      sessionNotes: missionData.sessionNotes || '',
      createdBy: {
        id: activePersona.id,
        name: activePersona.name,
        avatar: activePersona.avatar,
        year: activePersona.year
      },
      members: [
        {
          id: activePersona.id,
          name: activePersona.name,
          role: 'Host',
          year: activePersona.year,
          avatar: activePersona.avatar,
          joinedAt: 'Just now'
        }
      ],
      status: 'Active',
      createdAt: new Date().toISOString(),
      checklist: missionData.initialTasks && missionData.initialTasks.length > 0
        ? missionData.initialTasks.map((text, idx) => ({
            id: `t-${Date.now()}-${idx}`,
            text: text.trim(),
            completed: false
          }))
        : [
            { id: `t-${Date.now()}-1`, text: 'Kickoff meeting & align on shared goals', completed: false },
            { id: `t-${Date.now()}-2`, text: 'Review core concept outline & resources', completed: false },
            { id: `t-${Date.now()}-3`, text: 'Practice / build collaboratively', completed: false }
          ]
    };

    setMissions(prev => [newMission, ...prev]);
    setIsCreateModalOpen(false);
    addToast('Mission Created!', `"${newMission.title}" is now active and discoverable.`, 'success');

    if (isBackendConnected) {
      try {
        const payload = {
          title: newMission.title,
          category: newMission.category,
          description: newMission.description,
          subject: newMission.subject,
          availability: newMission.availability,
          availabilityKey: newMission.availabilityKey,
          groupSize: newMission.groupSize,
          commitment: newMission.commitment,
          initialTasks: newMission.checklist.map(t => t.text)
        };
        const res = await createMissionApi(payload);
        if (res && res.mission) {
          setMissions(prev => prev.map(m => m.id === newMission.id ? res.mission : m));
        }
      } catch (err) {
        console.warn('Backend create mission failed, kept in local state:', err);
      }
    }

    return newMission;
  };

  const joinMission = async (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return { success: false, reason: 'Mission not found.' };

    const isAlreadyMember = mission.members.some(m => m.id === activePersona.id);
    if (isAlreadyMember) {
      addToast('Already Joined', 'You are already an active member of this circle.', 'warning');
      return { success: false, reason: 'Already a member.' };
    }

    if (mission.members.length >= mission.groupSize) {
      addToast('Circle Full', 'This circle has reached maximum student capacity.', 'error');
      return { success: false, reason: 'Capacity reached.' };
    }

    const newMember = {
      id: activePersona.id,
      name: activePersona.name,
      role: 'Member',
      year: activePersona.year,
      avatar: activePersona.avatar,
      joinedAt: 'Just now'
    };

    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          members: [...m.members, newMember]
        };
      }
      return m;
    }));

    addToast('Joined Circle!', `You have joined "${mission.title}". You can now track shared progress in My Circles.`, 'success');

    if (isBackendConnected) {
      try {
        const res = await joinMissionApi(missionId);
        if (res && res.mission) {
          setMissions(prev => prev.map(m => m.id === missionId ? res.mission : m));
        }
      } catch (err) {
        console.warn('Backend join failed, continuing with local state:', err);
      }
    }

    return { success: true };
  };

  const leaveMission = async (missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          members: m.members.filter(mem => mem.id !== activePersona.id)
        };
      }
      return m;
    }));
    addToast('Left Circle', 'You have left this collaboration circle.', 'info');

    if (isBackendConnected) {
      try {
        const res = await leaveMissionApi(missionId);
        if (res && res.mission) {
          setMissions(prev => prev.map(m => m.id === missionId ? res.mission : m));
        }
      } catch (err) {
        console.warn('Backend leave failed, continuing with local state:', err);
      }
    }
  };

  const toggleTask = async (missionId, taskId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          checklist: m.checklist.map(t => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          })
        };
      }
      return m;
    }));

    if (isBackendConnected && taskId && !taskId.startsWith('t-')) {
      try {
        await toggleTaskApi(taskId);
      } catch (err) {
        console.warn('Backend task toggle failed, kept in local state:', err);
      }
    }
  };

  const addTask = async (missionId, taskText) => {
    if (!taskText || !taskText.trim()) return;
    const newTask = {
      id: `t-${Date.now()}`,
      text: taskText.trim(),
      completed: false
    };

    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          checklist: [...m.checklist, newTask]
        };
      }
      return m;
    }));
    addToast('Task Added', `Added "${taskText.trim()}" to circle checklist.`, 'info');

    if (isBackendConnected) {
      try {
        const res = await addTaskApi(missionId, taskText.trim());
        if (res && res.task) {
          setMissions(prev => prev.map(m => {
            if (m.id === missionId) {
              return {
                ...m,
                checklist: m.checklist.map(t => t.id === newTask.id ? res.task : t)
              };
            }
            return m;
          }));
        }
      } catch (err) {
        console.warn('Backend add task failed, kept in local state:', err);
      }
    }
  };

  const deleteTask = async (missionId, taskId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          checklist: m.checklist.filter(t => t.id !== taskId)
        };
      }
      return m;
    }));

    if (isBackendConnected && taskId && !taskId.startsWith('t-')) {
      try {
        await deleteTaskApi(taskId);
      } catch (err) {
        console.warn('Backend delete task failed, kept in local state:', err);
      }
    }
  };

  const completeMission = async (missionId, status = 'Completed') => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status
        };
      }
      return m;
    }));
    if (status === 'Completed') {
      addToast('Goal Accomplished!', 'Congratulations on completing this mission circle!', 'success');
    } else {
      addToast('Mission Re-opened', 'Circle status returned to Active.', 'info');
    }

    if (isBackendConnected) {
      try {
        await updateMissionStatusApi(missionId, status);
      } catch (err) {
        console.warn('Backend complete mission failed, kept in local state:', err);
      }
    }
  };

  const updateCircleNotes = (missionId, sessionNotes) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return { ...m, sessionNotes };
      }
      return m;
    }));
  };

  const updateCircleMeetingLink = (missionId, meetingLink) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return { ...m, meetingLink };
      }
      return m;
    }));
    addToast('Meeting Link Updated', 'Collaborative video call link saved for this circle.', 'info');
  };

  const handleResetData = () => {
    const fresh = resetStorageToDefaults();
    setMissions(fresh.missions);
    setCurrentUserId(fresh.currentUserId);
    addToast('Demo Reset', 'Reset all missions, members, and checklists to initial seed state.', 'info');
  };

  const selectedMission = missions.find(m => m.id === selectedMissionId) || null;
  const inspectMatchMission = missions.find(m => m.id === inspectMatchMissionId) || null;

  // Circles where current user is a member or host
  const myJoinedCircles = missions.filter(m => 
    m.members && m.members.some(mem => mem.id === activePersona.id)
  );

  // Missions created by current user
  const myCreatedMissions = missions.filter(m => 
    m.createdBy?.id === activePersona.id
  );

  return (
    <PeerBridgeContext.Provider
      value={{
        missions,
        activePersona,
        currentUserId,
        activeTab,
        setActiveTab,
        isCreateModalOpen,
        setIsCreateModalOpen,
        selectedMission,
        setSelectedMissionId,
        inspectMatchMission,
        setInspectMatchMissionId,
        toasts,
        addToast,
        removeToast,
        switchPersona,
        createMission,
        joinMission,
        leaveMission,
        toggleTask,
        addTask,
        deleteTask,
        completeMission,
        updateCircleNotes,
        updateCircleMeetingLink,
        handleResetData,
        myJoinedCircles,
        myCreatedMissions,
        isBackendConnected
      }}
    >
      {children}
    </PeerBridgeContext.Provider>
  );
}

export function usePeerBridge() {
  const context = useContext(PeerBridgeContext);
  if (!context) {
    throw new Error('usePeerBridge must be used within a PeerBridgeProvider');
  }
  return context;
}
