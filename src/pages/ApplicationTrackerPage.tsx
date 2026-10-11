import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Kanban,
  ListFilter,
  Plus,
  Calendar,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  MapPin,
  ChevronRight,
  Search,
} from 'lucide-react';
import { ApplicationRecord, ApplicationStatus } from '../types';

export const ApplicationTrackerPage: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    deleteApplication,
    setCurrentRoute,
    setSelectedJobId,
    jobs,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const STATUS_COLUMNS: ApplicationStatus[] = [
    'Interested',
    'Applied',
    'Assessment',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];

  const filteredApps = applications.filter((app) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      app.jobTitle.toLowerCase().includes(q) ||
      app.company.toLowerCase().includes(q) ||
      app.notes.toLowerCase().includes(q)
    );
  });

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Interested':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Applied':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'Assessment':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Interview':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Offer':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Rejected':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Withdrawn':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const handleStartEditNotes = (app: ApplicationRecord) => {
    setEditingId(app.id);
    setEditNotes(app.notes);
  };

  const handleSaveNotes = (id: string) => {
    const currentApp = applications.find((a) => a.id === id);
    if (currentApp) {
      updateApplicationStatus(id, currentApp.status, editNotes);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Kanban className="w-3.5 h-3.5" />
            <span>Recruitment Pipeline & Status Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Job Application Tracker ({applications.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track interview rounds, screening dates, customized cover notes, and offer statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Board View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setCurrentRoute('job-recommendations')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Job
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search tracked applications..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>Active Pipeline:</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white font-bold">
            {applications.filter((a) => a.status === 'Applied').length} Applied
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
            {applications.filter((a) => a.status === 'Interview').length} Interviewing
          </span>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {STATUS_COLUMNS.map((columnStatus) => {
              const columnApps = filteredApps.filter((a) => a.status === columnStatus);
              return (
                <div
                  key={columnStatus}
                  className="flex-1 min-w-[280px] bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 flex flex-col"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{columnStatus}</span>
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        {columnApps.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards in Column */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                    {columnApps.length === 0 ? (
                      <div className="p-8 text-center text-slate-600 text-[11px] italic">
                        No applications in this stage
                      </div>
                    ) : (
                      columnApps.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3 hover:border-slate-700 transition group shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4
                                onClick={() => {
                                  setSelectedJobId(app.jobId);
                                  setCurrentRoute('job-details');
                                }}
                                className="text-xs font-bold text-white hover:text-blue-400 cursor-pointer line-clamp-1"
                              >
                                {app.jobTitle}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">{app.company}</p>
                            </div>
                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="text-slate-600 hover:text-red-400 p-1 transition opacity-0 group-hover:opacity-100"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Applied: {app.appliedDate}</span>
                            <span className="font-bold text-emerald-400">
                              {app.matchScoreAtApply}% Match
                            </span>
                          </div>

                          {/* Notes view / edit */}
                          {editingId === app.id ? (
                            <div className="space-y-1.5 pt-1">
                              <textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                rows={2}
                                className="w-full p-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNotes(app.id)}
                                  className="px-2 py-0.5 text-[10px] bg-blue-600 text-white rounded font-bold"
                                >
                                  Save Notes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p
                              onClick={() => handleStartEditNotes(app)}
                              className="text-[11px] text-slate-300 italic line-clamp-2 cursor-pointer hover:text-white bg-slate-900/50 p-2 rounded-lg"
                              title="Click to edit notes"
                            >
                              &quot;{app.notes}&quot;
                            </p>
                          )}

                          {/* Quick stage changer select */}
                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Move to:</span>
                            <select
                              value={app.status}
                              onChange={(e) =>
                                updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                              }
                              className="text-[10px] bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
                            >
                              {STATUS_COLUMNS.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Role & Employer</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Fit Score</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-850/50 transition">
                  <td className="p-4">
                    <span
                      onClick={() => {
                        setSelectedJobId(app.jobId);
                        setCurrentRoute('job-details');
                      }}
                      className="font-bold text-white hover:text-blue-400 cursor-pointer block"
                    >
                      {app.jobTitle}
                    </span>
                    <span className="text-slate-400 text-[11px]">{app.company}</span>
                  </td>
                  <td className="p-4 text-slate-400">{app.appliedDate}</td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                      }
                      className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
                    >
                      {STATUS_COLUMNS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 font-bold text-emerald-400">{app.matchScoreAtApply}%</td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">{app.notes}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="text-slate-500 hover:text-red-400 p-1.5 transition"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
