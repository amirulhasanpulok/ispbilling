import React, { useState } from 'react';
import { Network, Plus, Search, DollarSign, RefreshCw, CheckCircle2, Shield, Users } from 'lucide-react';
import { PopReseller } from '../types';

interface ResellerPopViewProps {
  resellers?: PopReseller[];
  onAddReseller: (reseller: PopReseller) => void;
  onRechargeReseller: (id: string, amount: number) => void;
}

export const ResellerPopView: React.FC<ResellerPopViewProps> = ({
  resellers = [],
  onAddReseller,
  onRechargeReseller
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [resellerName, setResellerName] = useState('');
  const [proprietor, setProprietor] = useState('');
  const [mobile, setMobile] = useState('');
  const [zone, setZone] = useState('Jamtola');
  const [bwAllocated, setBwAllocated] = useState('200 Mbps');
  const [monthlyBill, setMonthlyBill] = useState(35000);

  const safeResellers = Array.isArray(resellers) ? resellers : [];

  const filtered = safeResellers.filter(
    (r) =>
      (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.proprietor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.zone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newPop: PopReseller = {
      id: `pop-${Date.now()}`,
      name: resellerName,
      proprietor,
      mobile,
      zone,
      server: 'BBN-CORE',
      bandwidthAllocated: bwAllocated,
      clientCount: 45,
      balanceDue: 0,
      monthlyBill,
      status: 'Active'
    };
    onAddReseller(newPop);
    setShowAddModal(false);
  };

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Header */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-500">Home</span>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-slate-800">POP Reseller &amp; Sub-Network Management</span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white font-bold text-xs rounded shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add New POP Reseller</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-white">
        <div className="bg-[#162e3d] p-3 rounded shadow-sm border-l-4 border-cyan-400">
          <div className="text-xs text-slate-300">Active Distribution POPs</div>
          <div className="text-2xl font-black mt-1 font-mono">{resellers.length} Nodes</div>
        </div>

        <div className="bg-emerald-700 p-3 rounded shadow-sm">
          <div className="text-xs text-emerald-200">Reseller Monthly Revenue</div>
          <div className="text-2xl font-black mt-1 font-mono">৳95,000</div>
        </div>

        <div className="bg-amber-700 p-3 rounded shadow-sm">
          <div className="text-xs text-amber-200">Total POP Due Balance</div>
          <div className="text-2xl font-black mt-1 font-mono">৳17,000</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden text-xs">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search POP reseller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-slate-50"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <span className="text-slate-500">
            Total POPs: <strong>{filtered.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700">
            <thead className="bg-[#162e3d] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-2.5">POP Name</th>
                <th className="p-2.5">Proprietor</th>
                <th className="p-2.5">Mobile</th>
                <th className="p-2.5">Coverage Zone</th>
                <th className="p-2.5">Mikrotik Server</th>
                <th className="p-2.5">Allocated Bandwidth</th>
                <th className="p-2.5 text-center">Sub-Clients</th>
                <th className="p-2.5 text-right">Monthly Bill</th>
                <th className="p-2.5 text-right">Balance Due</th>
                <th className="p-2.5 text-center">Status</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((pop) => (
                <tr key={pop.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{pop.name}</td>
                  <td className="p-2.5 font-medium">{pop.proprietor}</td>
                  <td className="p-2.5 font-mono">{pop.mobile}</td>
                  <td className="p-2.5">{pop.zone}</td>
                  <td className="p-2.5 font-semibold text-cyan-800">{pop.server}</td>
                  <td className="p-2.5 font-mono font-bold text-slate-800">
                    {pop.bandwidthAllocated}
                  </td>
                  <td className="p-2.5 text-center font-mono font-semibold">{pop.clientCount}</td>
                  <td className="p-2.5 text-right font-mono font-bold">
                    ৳{pop.monthlyBill.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold">
                    {pop.balanceDue > 0 ? (
                      <span className="text-red-600">৳{pop.balanceDue.toFixed(2)}</span>
                    ) : (
                      <span className="text-emerald-600">৳0.00</span>
                    )}
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {pop.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => onRechargeReseller(pop.id, pop.balanceDue)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>Collect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add POP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="bg-[#162e3d] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Distribution POP Reseller</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">POP Station Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhurungamari Stand Fiber Hub"
                  value={resellerName}
                  onChange={(e) => setResellerName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Proprietor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Owner / Operator Name"
                  value={proprietor}
                  onChange={(e) => setProprietor(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Mobile</label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bandwidth Limit</label>
                  <input
                    type="text"
                    value={bwAllocated}
                    onChange={(e) => setBwAllocated(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Monthly Bill (৳)</label>
                  <input
                    type="number"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white rounded font-bold"
                >
                  Save POP Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
