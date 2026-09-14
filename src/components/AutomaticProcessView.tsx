import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Play,
  Edit2,
  Info,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Server,
  Zap,
  Check,
  X,
  Calendar,
  Layers,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText
} from 'lucide-react';
import { AutomatedProcessItem } from '../types';
import { PageHeader, StatusBadge } from './common';

interface AutomaticProcessViewProps {
  processes: AutomatedProcessItem[];
  onUpdateProcess?: (updated: AutomatedProcessItem) => void;
  onRunProcess?: (id: string) => void;
  onShowToast?: (message: string) => void;
}

type ProcessTab = 'System' | 'Admin Customer' | 'POP' | 'POP Customer' | 'Bandwidth POP';

export const AutomaticProcessView: React.FC<AutomaticProcessViewProps> = ({
  processes: initialProcesses,
  onUpdateProcess,
  onRunProcess,
  onShowToast
}) => {
  const [processes, setProcesses] = useState<AutomatedProcessItem[]>(initialProcesses);
  const [activeTab, setActiveTab] = useState<ProcessTab>('System');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [runningProcessId, setRunningProcessId] = useState<string | null>(null);

  // Modals state
  const [editingProcess, setEditingProcess] = useState<AutomatedProcessItem | null>(null);
  const [infoProcess, setInfoProcess] = useState<AutomatedProcessItem | null>(null);
  const [logProcess, setLogProcess] = useState<AutomatedProcessItem | null>(null);

  // Sync prop changes
  React.useEffect(() => {
    setProcesses(initialProcesses);
  }, [initialProcesses]);

  // Filter by active tab & search
  const filteredProcesses = useMemo(() => {
    return processes.filter((proc) => {
      const matchCategory = (proc.category || 'System') === activeTab;
      const matchSearch =
        searchTerm === '' ||
        proc.processName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.executeAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.interval.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.executionDay.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [processes, activeTab, searchTerm]);

  // Pagination calculation
  const totalEntries = filteredProcesses.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const currentEntries = filteredProcesses.slice(startIndex, endIndex);

  const handleTabChange = (tab: ProcessTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const handleRunNow = (proc: AutomatedProcessItem) => {
    setRunningProcessId(proc.id);
    if (onRunProcess) {
      onRunProcess(proc.id);
    }
    
    // Simulate background worker response
    setTimeout(() => {
      setRunningProcessId(null);
      const now = new Date();
      const timestamp = `${now.getDate().toString().padStart(2, '0')}-${now.toLocaleString('default', { month: 'short' })}-${now.getFullYear()} ${now.toTimeString().split(' ')[0]}`;
      
      const updated = {
        ...proc,
        lastRun: timestamp,
        lastRunStatus: 'Success' as const,
        recordsAffected: Math.floor(Math.random() * 20) + 1
      };

      setProcesses((prev) =>
        prev.map((p) => (p.id === proc.id ? updated : p))
      );

      if (onUpdateProcess) {
        onUpdateProcess(updated);
      }

      if (onShowToast) {
        onShowToast(`Process "${proc.processName}" completed successfully! (${updated.recordsAffected} records updated)`);
      }
    }, 1200);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProcess) return;

    setProcesses((prev) =>
      prev.map((p) => (p.id === editingProcess.id ? editingProcess : p))
    );

    if (onUpdateProcess) {
      onUpdateProcess(editingProcess);
    }

    if (onShowToast) {
      onShowToast(`Schedule for "${editingProcess.processName}" updated.`);
    }

    setEditingProcess(null);
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      System: processes.filter((p) => (p.category || 'System') === 'System').length,
      'Admin Customer': processes.filter((p) => p.category === 'Admin Customer').length,
      POP: processes.filter((p) => p.category === 'POP').length,
      'POP Customer': processes.filter((p) => p.category === 'POP Customer').length,
      'Bandwidth POP': processes.filter((p) => p.category === 'Bandwidth POP').length
    };
  }, [processes]);

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Standardized Page Header */}
      <PageHeader
        title="Automatic Process"
        subtitle="Application Auto Process and Scheduling"
        icon={Sliders}
        breadcrumbs={[
          { label: 'System' },
          { label: 'Automatic Process' }
        ]}
        badge={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Cron Daemon Active
          </span>
        }
        actions={
          <button
            onClick={() => {
              if (onShowToast) {
                onShowToast('Refreshed scheduled tasks daemon status from server.');
              }
            }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600" />
            <span>Sync Daemon</span>
          </button>
        }
      />

      {/* Main Container Card matching Real Portal Screenshot */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Category Navigation Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 pt-3 flex flex-wrap items-center gap-1">
          {(['System', 'Admin Customer', 'POP', 'POP Customer', 'Bandwidth POP'] as ProcessTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-t-2 ${
                  isActive
                    ? 'bg-white text-cyan-700 border-cyan-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/80'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tabCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Header Banner */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {activeTab} Automatic Process
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              ({filteredProcesses.length} Scheduled Tasks)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Server Time: <strong className="text-slate-700">14-Sep-2026 10:24:18 AM</strong> (BST)
            </span>
          </div>
        </div>

        {/* Controls: Entries per page & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs shadow-2xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="search-process" className="text-xs font-semibold text-slate-600">
              Search:
            </label>
            <div className="relative">
              <input
                id="search-process"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search processes..."
                className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-2xs w-48 sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#162e3d] text-white uppercase text-[11px] tracking-wider select-none">
              <tr>
                <th className="py-3 px-4 font-semibold border-b border-slate-700">Branch</th>
                <th className="py-3 px-4 font-semibold border-b border-slate-700 min-w-[280px]">Process Name</th>
                <th className="py-3 px-3 font-semibold border-b border-slate-700 text-center">Execute At</th>
                <th className="py-3 px-3 font-semibold border-b border-slate-700 text-center">Interval</th>
                <th className="py-3 px-3 font-semibold border-b border-slate-700 text-center">Execution Day</th>
                <th className="py-3 px-4 font-semibold border-b border-slate-700 text-center min-w-[150px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/90 font-medium">
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Sliders className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No automatic processes found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                currentEntries.map((proc, index) => {
                  const isRunning = runningProcessId === proc.id;
                  const isEven = index % 2 === 0;
                  const isToday = proc.executionDay.trim().toLowerCase() === 'today';

                  return (
                    <tr
                      key={proc.id}
                      className={`transition-colors hover:bg-cyan-50/40 ${isEven ? 'bg-white' : 'bg-slate-50/50'}`}
                    >
                      {/* Branch */}
                      <td className="py-3 px-4 text-slate-800 font-semibold whitespace-nowrap">
                        {proc.branch}
                      </td>

                      {/* Process Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{proc.processName}</span>
                          {proc.lastRunStatus === 'Success' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Last run succeeded" />
                          )}
                        </div>
                        {proc.description && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                            {proc.description}
                          </div>
                        )}
                      </td>

                      {/* Execute At */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {proc.executeAt}
                        </span>
                      </td>

                      {/* Interval */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            proc.interval === 'Daily'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : proc.interval === 'Hourly'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : proc.interval === 'Minutely'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : proc.interval === 'Yearly'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {proc.interval}
                        </span>
                      </td>

                      {/* Execution Day */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isToday
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {proc.executionDay}
                        </span>
                      </td>

                      {/* Action Column: 4 Distinct Buttons matching Image 7 */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* 1. Edit / Configure (Green) */}
                          <button
                            onClick={() => setEditingProcess(proc)}
                            title="Edit / Configure Schedule"
                            className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Info / Details (Cyan) */}
                          <button
                            onClick={() => setInfoProcess(proc)}
                            title="View Process Details"
                            className="p-1.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white shadow-2xs transition-colors"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. History / Logs (Sky/Blue) */}
                          <button
                            onClick={() => setLogProcess(proc)}
                            title="View Execution Log & Audit"
                            className="p-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white shadow-2xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Run Now / Execute (Amber/Orange) */}
                          <button
                            disabled={isRunning}
                            onClick={() => handleRunNow(proc)}
                            title="Execute / Run Process Now"
                            className={`p-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-all ${
                              isRunning ? 'opacity-50 cursor-not-allowed animate-spin' : ''
                            }`}
                          >
                            {isRunning ? (
                              <RefreshCw className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div>
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex} of {totalEntries} entries
            {searchTerm && ` (filtered from ${processes.filter((p) => (p.category || 'System') === activeTab).length} total)`}
          </div>

          <div className="flex items-center space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
            >
              First
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
              .map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-cyan-700 text-white shadow-2xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

            <button
              disabled={currentPage === totalPages || totalEntries === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              disabled={currentPage === totalPages || totalEntries === 0}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* 1. Modal: Edit / Configure Schedule */}
      {editingProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-[#162e3d] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Configure Process Schedule</h3>
              </div>
              <button
                onClick={() => setEditingProcess(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Process Name</label>
                <input
                  type="text"
                  value={editingProcess.processName}
                  onChange={(e) =>
                    setEditingProcess({ ...editingProcess, processName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <select
                    value={editingProcess.branch}
                    onChange={(e) =>
                      setEditingProcess({ ...editingProcess, branch: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    <option value="Main Branch">Main Branch</option>
                    <option value="Joymonirhat Branch">Joymonirhat Branch</option>
                    <option value="All Branches">All Branches</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Execution Day</label>
                  <select
                    value={editingProcess.executionDay}
                    onChange={(e) =>
                      setEditingProcess({ ...editingProcess, executionDay: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Daily">Daily</option>
                    <option value="1st of Month">1st of Month</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Execute At (Time)</label>
                  <input
                    type="text"
                    value={editingProcess.executeAt}
                    onChange={(e) =>
                      setEditingProcess({ ...editingProcess, executeAt: e.target.value })
                    }
                    placeholder="e.g. 00:05 or Default"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Format: HH:MM or "Default"</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interval</label>
                  <select
                    value={editingProcess.interval}
                    onChange={(e) =>
                      setEditingProcess({
                        ...editingProcess,
                        interval: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Minutely">Minutely</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Description</label>
                <textarea
                  rows={2}
                  value={editingProcess.description || ''}
                  onChange={(e) =>
                    setEditingProcess({ ...editingProcess, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Task Daemon Status</div>
                  <div className="text-[11px] text-slate-500">Enable or pause this automatic task</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingProcess({
                      ...editingProcess,
                      status: editingProcess.status === 'Active' ? 'Paused' : 'Active'
                    })
                  }
                  className={`px-3 py-1 rounded-full font-bold text-xs transition-colors ${
                    editingProcess.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  {editingProcess.status === 'Active' ? 'Active' : 'Paused'}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProcess(null)}
                  className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Process Details & Technical Info */}
      {infoProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-xs">
            <div className="px-5 py-4 bg-[#162e3d] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm">Process Technical Specification</h3>
              </div>
              <button
                onClick={() => setInfoProcess(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Process Name</span>
                <p className="font-bold text-slate-900 text-sm">{infoProcess.processName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Target Subsystem</span>
                  <p className="font-semibold text-cyan-800 mt-0.5">{infoProcess.targetSubsystem || 'MikroTik CCR & CRM Core'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Cron Pattern</span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{infoProcess.cronPattern || '00 00 * * *'}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Detailed Description</span>
                <p className="text-slate-700 leading-relaxed mt-0.5 bg-slate-50 p-3 rounded border border-slate-200">
                  {infoProcess.description || 'Executes internal automated workflow for network state enforcement and billing ledger consistency.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Last Executed</span>
                  <p className="font-mono text-slate-700 mt-0.5">{infoProcess.lastRun || '14-Sep-2026 00:05:01'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Next Scheduled</span>
                  <p className="font-mono text-slate-700 mt-0.5">{infoProcess.nextRun || 'Tomorrow at scheduled time'}</p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-snug">
                  This task communicates directly with physical edge routers. Changes to parameters will take effect during the next cron loop.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInfoProcess(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Execution Logs & Audit Trail */}
      {logProcess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-xs">
            <div className="px-5 py-4 bg-[#162e3d] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm">Execution Audit Logs</h3>
              </div>
              <button
                onClick={() => setLogProcess(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="font-bold text-slate-900 text-sm">{logProcess.processName}</div>
                <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                  <span>Branch: <strong>{logProcess.branch}</strong></span>
                  <span>•</span>
                  <span>Interval: <strong>{logProcess.interval}</strong></span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Status</div>
                  <div className="text-emerald-700 font-bold mt-0.5 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Success</span>
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Duration</div>
                  <div className="font-bold text-slate-800 mt-0.5 font-mono">
                    {logProcess.lastRunDuration || '1.24s'}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Affected</div>
                  <div className="font-bold text-cyan-800 mt-0.5 font-mono">
                    {logProcess.recordsAffected || 18} records
                  </div>
                </div>
              </div>

              {/* Console Output Log */}
              <div>
                <div className="font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Daemon Console Trace:</span>
                  <span className="text-[10px] font-mono text-slate-400">PID: 49102</span>
                </div>
                <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded-lg overflow-x-auto space-y-1 max-h-48 border border-slate-800">
                  <div className="text-slate-400">[14-Sep-2026 10:24:00] [CRON_DISPATCHER] Spawning worker subprocess</div>
                  <div className="text-cyan-400">[14-Sep-2026 10:24:00] Connected to MikroTik API 157.10.238.100:8728 (TLS 1.3)</div>
                  <div>[14-Sep-2026 10:24:01] Querying database for target records... {logProcess.recordsAffected || 18} candidates identified</div>
                  <div>[14-Sep-2026 10:24:01] Synchronizing state with RouterOS PPPoE profile registry...</div>
                  <div className="text-emerald-300">[14-Sep-2026 10:24:02] Command batch executed successfully (Exit Code: 0)</div>
                  <div className="text-slate-400">[14-Sep-2026 10:24:02] Completed in {logProcess.lastRunDuration || '1.24s'} - Database commit verified</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setLogProcess(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded shadow-xs"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
