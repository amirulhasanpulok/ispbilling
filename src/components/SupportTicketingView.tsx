import React, { useState } from 'react';
import {
  Headphones,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Phone,
  Wrench,
  Check
} from 'lucide-react';
import { SupportTicket } from '../types';

interface SupportTicketingViewProps {
  tickets?: SupportTicket[];
  onOpenNewTicket: () => void;
  onResolveTicket: (ticketNo: string) => void;
  onReassignTicket: (ticketNo: string, newTechnician: string) => void;
}

export const SupportTicketingView: React.FC<SupportTicketingViewProps> = ({
  tickets = [],
  onOpenNewTicket,
  onResolveTicket,
  onReassignTicket
}) => {
  const [activeTab, setActiveTab] = useState<'accepted' | 'pending' | 'reseller' | 'pop'>('accepted');
  const [statusFilter, setStatusFilter] = useState('All');
  const [problemFilter, setProblemFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const filteredTickets = safeTickets.filter((t) => {
    const matchesSearch =
      (t.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.ticketNo || '').includes(searchTerm) ||
      (t.clientCode || '').includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesProblem = problemFilter === 'All' || t.problem === problemFilter;

    return matchesSearch && matchesStatus && matchesProblem;
  });

  const totalCount = safeTickets.length;
  const pendingCount = safeTickets.filter((t) => t.status === 'Pending').length;
  const processingCount = safeTickets.filter((t) => t.status === 'Processing').length;
  const solvedCount = safeTickets.filter((t) => t.status === 'Solved').length;

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Top Banner & Title */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-500">Home</span>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-slate-800">Client Support &amp; Daily Complain List</span>
        </div>

        <button
          onClick={onOpenNewTicket}
          className="px-3 py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white font-bold rounded shadow-sm text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Open New Ticket</span>
        </button>
      </div>

      {/* 4 Ticket Stat Badges matching Screenshot 13 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-white text-center">
        <div className="bg-[#00a2d3] p-3 rounded shadow-sm">
          <div className="text-2xl font-black">{totalCount}</div>
          <div className="text-xs font-semibold text-cyan-100">Total Tickets</div>
        </div>

        <div className="bg-[#c62828] p-3 rounded shadow-sm">
          <div className="text-2xl font-black">{pendingCount}</div>
          <div className="text-xs font-semibold text-red-100">Pending Tickets</div>
        </div>

        <div className="bg-[#ef6c00] p-3 rounded shadow-sm">
          <div className="text-2xl font-black">{processingCount}</div>
          <div className="text-xs font-semibold text-amber-100">Processing Tickets</div>
        </div>

        <div className="bg-[#2e7d32] p-3 rounded shadow-sm">
          <div className="text-2xl font-black">{solvedCount}</div>
          <div className="text-xs font-semibold text-emerald-100">Solved Tickets</div>
        </div>
      </div>

      {/* Tabs matching Screenshot 13 */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2.5 transition-colors border-b-2 ${
              activeTab === 'accepted'
                ? 'border-cyan-600 bg-white text-cyan-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Accepted (Client's)
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 transition-colors border-b-2 ${
              activeTab === 'pending'
                ? 'border-cyan-600 bg-white text-cyan-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending (Client's)
          </button>
          <button
            onClick={() => setActiveTab('reseller')}
            className={`px-4 py-2.5 transition-colors border-b-2 ${
              activeTab === 'reseller'
                ? 'border-cyan-600 bg-white text-cyan-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            MAC Reseller's
          </button>
          <button
            onClick={() => setActiveTab('pop')}
            className={`px-4 py-2.5 transition-colors border-b-2 ${
              activeTab === 'pop'
                ? 'border-cyan-600 bg-white text-cyan-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Bandwidth POP's
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <input
                type="text"
                placeholder="Search ticket, client or issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded bg-slate-50 text-slate-800 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={problemFilter}
              onChange={(e) => setProblemFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50 text-slate-700"
            >
              <option value="All">All Problems</option>
              <option value="No Internet">No Internet</option>
              <option value="Pon Loss">Pon Loss</option>
              <option value="Speed Issue">Speed Issue</option>
              <option value="Forget Password">Forget Password</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50 text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <div className="text-slate-500">
            Total <span className="font-bold text-slate-800">{filteredTickets.length}</span> tickets
          </div>
        </div>

        {/* Table matching Screenshot 13 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="p-2.5">TicketNo</th>
                <th className="p-2.5">ClientCode</th>
                <th className="p-2.5">ID/IP</th>
                <th className="p-2.5">CustomerName</th>
                <th className="p-2.5">Mobile</th>
                <th className="p-2.5">Zone / Subzone</th>
                <th className="p-2.5">Problem</th>
                <th className="p-2.5 text-center">Priority</th>
                <th className="p-2.5">Complain Time</th>
                <th className="p-2.5">CreatedBy</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5">Assign To</th>
                <th className="p-2.5">Duration</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.ticketNo} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2.5 font-mono font-bold text-cyan-800">#{ticket.ticketNo}</td>
                  <td className="p-2.5 font-mono font-semibold">{ticket.clientCode}</td>
                  <td className="p-2.5 font-bold text-slate-900">{ticket.username}</td>
                  <td className="p-2.5 whitespace-nowrap font-medium">{ticket.customerName}</td>
                  <td className="p-2.5 font-mono">{ticket.mobile}</td>
                  <td className="p-2.5">
                    <span className="font-semibold">{ticket.zone}</span>
                    <span className="text-[11px] text-slate-500 block">{ticket.subzone}</span>
                  </td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-800">
                      {ticket.problem}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-red-100 text-red-700">
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500">{ticket.complainTime}</td>
                  <td className="p-2.5 font-mono text-slate-600">{ticket.createdBy}</td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        ticket.status === 'Solved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ticket.status === 'Processing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <div className="font-medium text-slate-900">{ticket.assignTo}</div>
                    <button
                      onClick={() =>
                        onReassignTicket(
                          ticket.ticketNo,
                          ticket.assignTo.includes('Sobuj')
                            ? 'Rasel Hossain (Field Lead)'
                            : 'Sobuj Biplob (Fiber Tech)'
                        )
                      }
                      className="text-[10px] text-cyan-600 hover:text-cyan-800 hover:underline font-semibold"
                    >
                      Re-Assign
                    </button>
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-500">{ticket.duration}</td>
                  <td className="p-2.5 text-center">
                    {ticket.status !== 'Solved' ? (
                      <button
                        onClick={() => onResolveTicket(ticket.ticketNo)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-sm mx-auto transition-colors"
                        title="Mark as Solved"
                      >
                        <Check className="w-3 h-3" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center justify-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Closed</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
