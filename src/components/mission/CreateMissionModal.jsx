import React, { useState } from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { 
  X, 
  Plus, 
  Trash2, 
  AlertCircle
} from 'lucide-react';

export default function CreateMissionModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, createMission, activePersona } = usePeerBridge();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Study',
    description: '',
    subject: '',
    availability: '',
    availabilityKey: 'today_evening',
    groupSize: '4',
    commitment: 'Focused',
  });

  const [initialTasks, setInitialTasks] = useState([
    'Align on shared scope & syllabus topics',
    'Collaborate on practice problems / prototype',
    'Review mistakes & outcome takeaways together'
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [errors, setErrors] = useState({});

  if (!isCreateModalOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      setInitialTasks(prev => [...prev, newTaskInput.trim()]);
      setNewTaskInput('');
    }
  };

  const handleRemoveTask = (index) => {
    setInitialTasks(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Mission title or goal is required.';
    } else if (formData.title.trim().length < 5) {
      errs.title = 'Title should be at least 5 characters.';
    }

    if (!formData.category) {
      errs.category = 'Please select a category.';
    }

    if (!formData.description.trim()) {
      errs.description = 'A short description of the goal is required.';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters.';
    }

    if (!formData.availability.trim()) {
      errs.availability = 'Preferred date and time / availability is required.';
    }

    const size = parseInt(formData.groupSize, 10);
    if (isNaN(size) || size < 2 || size > 8) {
      errs.groupSize = 'Desired group size must be between 2 and 8 students.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    createMission({
      ...formData,
      initialTasks: initialTasks.filter(t => t.trim().length > 0)
    });

    // Reset form
    setFormData({
      title: '',
      category: 'Study',
      description: '',
      subject: '',
      availability: '',
      availabilityKey: 'today_evening',
      groupSize: '4',
      commitment: 'Focused',
    });
    setInitialTasks([
      'Align on shared scope & syllabus topics',
      'Collaborate on practice problems / prototype',
      'Review mistakes & outcome takeaways together'
    ]);
  };

  const availabilityPresets = [
    { label: 'Today, 7 PM', key: 'today_evening' },
    { label: 'This Weekend', key: 'this_weekend' },
    { label: 'Weekdays 6 PM', key: 'weekday_evenings' },
    { label: 'Flexible / Evenings', key: 'flexible' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-modal overflow-hidden my-6">
        
        {/* Reference 4 Inspired Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-500"></div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create a Mission
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Posting as <strong className="text-slate-800">{activePersona.name}</strong> ({activePersona.year})
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Mission Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mission Title or Goal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. DBMS Revision Session, Campus Hackathon Squad"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${
                errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
              >
                <option value="Study">Study (Exams, Coursework)</option>
                <option value="Hackathon">Hackathon (Idea & Build)</option>
                <option value="Career">Career (Mock Interviews, DSA)</option>
                <option value="Projects">Projects (Open Source, Side Projects)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject or Focus <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="e.g. SQL, React, System Design"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Explain clearly what you intend to accomplish together..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Timing or Availability <span className="text-rose-500">*</span>
            </label>
            
            {/* Presets in Soft Blue */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {availabilityPresets.map(preset => (
                <button
                  type="button"
                  key={preset.key}
                  onClick={() => {
                    handleInputChange('availability', preset.label);
                    handleInputChange('availabilityKey', preset.key);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    formData.availability === preset.label
                      ? 'bg-softBlue text-brand-700 font-semibold border border-brand-300 shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={formData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              placeholder="e.g. Today, 7 PM or Saturday 10 AM"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${
                errors.availability ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.availability && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.availability}
              </p>
            )}
          </div>

          {/* Group Size & Commitment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Group Size <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.groupSize}
                onChange={(e) => handleInputChange('groupSize', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
              >
                <option value="2">2 Students (Pair)</option>
                <option value="3">3 Students</option>
                <option value="4">4 Students (Recommended Circle)</option>
                <option value="5">5 Students</option>
                <option value="6">6 Students</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Commitment Level
              </label>
              <select
                value={formData.commitment}
                onChange={(e) => handleInputChange('commitment', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
              >
                <option value="Focused">Focused (High intensity, sprint)</option>
                <option value="Regular">Regular (Steady pace)</option>
                <option value="Casual">Casual (Light, exploratory)</option>
              </select>
            </div>
          </div>

          {/* Initial Tasks */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                Shared Milestone Roadmap
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {initialTasks.length} milestones planned
              </span>
            </div>

            <div className="space-y-1.5 mb-2.5">
              {initialTasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800">
                  <span className="text-slate-400 text-[11px] font-semibold w-3.5">{idx + 1}.</span>
                  <span className="flex-1 font-medium">{task}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
                placeholder="Add milestone step..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-3.5 py-2 rounded-xl bg-softBlue text-brand-700 hover:bg-softBlue-hover text-xs font-semibold flex items-center gap-1 transition-colors border border-brand-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
            >
              Post Mission
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
