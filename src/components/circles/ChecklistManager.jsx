import React, { useState } from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Target, 
  CheckCircle2
} from 'lucide-react';

export default function ChecklistManager({ mission }) {
  const { toggleTask, addTask, deleteTask } = usePeerBridge();
  const [newTaskText, setNewTaskText] = useState('');

  const checklist = mission.checklist || [];
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isAllDone = totalTasks > 0 && completedTasks === totalTasks;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(mission.id, newTaskText.trim());
      setNewTaskText('');
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
      
      {/* Progress Metric Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-brand-600" />
            <span>Shared Milestone Roadmap</span>
          </span>
          <span className={`font-bold px-2.5 py-0.5 rounded-md border ${
            isAllDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            {progressPercent}% Complete
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${
              isAllDone ? 'bg-emerald-500' : 'bg-brand-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
          <span>{completedTasks} of {totalTasks} milestones completed</span>
          {isAllDone && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              All milestones accomplished! Ready to complete.
            </span>
          )}
        </div>
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-2 mb-3.5">
        {checklist.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
            No checklist items yet. Add tasks below to coordinate with your circle peers.
          </div>
        ) : (
          checklist.map(task => (
            <div
              key={task.id}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-emerald-50/40 border-emerald-100 text-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 shadow-xs'
              }`}
            >
              <button
                onClick={() => toggleTask(mission.id, task.id)}
                className="flex items-center gap-2.5 flex-1 text-left select-none focus:outline-none cursor-pointer"
              >
                {task.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 hover:text-brand-600 flex-shrink-0 transition-colors" />
                )}
                <span className={`text-xs ${
                  task.completed ? 'line-through text-slate-400' : 'text-slate-900 font-medium'
                }`}>
                  {task.text}
                </span>
              </button>

              <button
                onClick={() => deleteTask(mission.id, task.id)}
                className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                title="Remove milestone"
                aria-label="Remove milestone"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add New Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add shared milestone step..."
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Step</span>
        </button>
      </form>

    </div>
  );
}
