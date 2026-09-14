import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  DollarSign,
  UserCheck,
  ExternalLink,
  Users,
  AlertCircle
} from 'lucide-react';
import { Client } from '../types';
import { PageHeader, StatusBadge, EmptyState, Toast } from './common';

interface ClientListViewProps {
  clients?: Client[];
  onSelectClient?: (client: Client | any) => void;
  onOpenAddClient?: () => void;
  onOpenBillReceive?: (clientCode: string) => void;
  onCollectBill?: (clientCode: string) => void;
  onToggleMikrotikStatus?: (clientId: string) => void;
  onToggleStatus?: (clientId: string) => void;
}

export const ClientListView: React.FC<ClientListViewProps> = ({
  clients = [],
  onSelectClient,
  onOpenAddClient,
  onOpenBillReceive,
  onCollectBill,
  onToggleMikrotikStatus,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const safeClients = Array.isArray(clients) ? clients : [];

  const handleSelectClient = (client: Client) => {
    if (onSelectClient) {
      onSelectClient(client);
    }
  };

  const handleBillReceive = (clientCode: string) => {
    if (onOpenBillReceive) onOpenBillReceive(clientCode);
    else if (onCollectBill) onCollectBill(clientCode);
  };

  const handleToggle = (clientId: string) => {
    if (onToggleMikrotikStatus) onToggleMikrotikStatus(clientId);
    else if (onToggleStatus) onToggleStatus(clientId);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClientIds(safeClients.map((c) => c.id));
    } else {
      setSelectedClientIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedClientIds((prev) =>
      Array.isArray(prev)
        ? prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
        : [id]
    );
  };

  const filteredClients = safeClients.filter((client) => {
    const matchesSearch =
      (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.code || '').includes(searchTerm) ||
      (client.mobile || '').includes(searchTerm) ||
      (client.macAddress || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = selectedZone === 'All' || client.zone === selectedZone;
    const matchesType = selectedType === 'All' || client.clientType === selectedType;

    return matchesSearch && matchesZone && matchesType;
  });

  return (
    <div className="p-4 sm:p-5 space-y-4 bg-slate-50 min-h-[calc(100vh-3.5rem)] text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Unified Page Header */}
      <PageHeader
        title="Client Management & Provisioning"
        subtitle="Manage subscriber profiles, PPPoE credentials, MikroTik sync, and service packages"
        icon={Users}
        breadcrumbs={[
          { label: 'Home', onClick: () => {} },
          { label: 'Client', onClick: () => {} },
          { label: 'Client List' }
        ]}
        actions={
          <>
            <button
              onClick={() => showToast('Exporting Client List to Excel (.xlsx)...')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => showToast('Syncing all active clients with MikroTik RouterOS...')}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors bg-white shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Sync MikroTik</span>
            </button>

            <button
              onClick={onOpenAddClient}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-cyan-500"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Client</span>
            </button>
          </>
        }
      />

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Clients</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{safeClients.length}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Online / Active</div>
            <div className="text-xl font-bold text-emerald-600 mt-0.5">
              {safeClients.filter((c) => c.mikrotikStatus).length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Offline / Paused</div>
            <div className="text-xl font-bold text-rose-600 mt-0.5">
              {safeClients.filter((c) => !c.mikrotikStatus).length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Monthly MRR</div>
            <div className="text-xl font-bold text-cyan-800 mt-0.5">
              ৳{safeClients.reduce((acc, c) => acc + (c.monthlyBill || 0), 0).toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <input
              type="text"
              placeholder="Search by Code, Username, Mobile, Name, or MAC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Zones</option>
            <option value="Jamtola">Jamtola</option>
            <option value="College Para">College Para</option>
            <option value="Stand">Stand</option>
            <option value="Saddam Mor">Saddam Mor</option>
          </select>

          {/* Client Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Client Types</option>
            <option value="Home">Home</option>
            <option value="Shop User">Shop User</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredClients.length}</span> of {safeClients.length} clients
        </div>
      </div>

      {/* Clients Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredClients.length === 0 ? (
          <EmptyState
            title="No Clients Found"
            description="No clients match your filter criteria. Try clearing search keywords or resetting zone filter."
            action={{
              label: 'Reset Filters',
              onClick: () => {
                setSearchTerm('');
                setSelectedZone('All');
                setSelectedType('All');
              }
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-[#162e3d] text-white uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3 w-8 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedClientIds.length > 0 &&
                        selectedClientIds.length === filteredClients.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                  </th>
                  <th className="p-3">C.Code</th>
                  <th className="p-3">ID / PPPoE</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Conn.</th>
                  <th className="p-3">Package / Speed</th>
                  <th className="p-3 text-right">M.Bill (৳)</th>
                  <th className="p-3">Server</th>
                  <th className="p-3 text-center">Billing</th>
                  <th className="p-3 text-center">MikroTik</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const isSelected = selectedClientIds.includes(client.id);
                  const isPasswordRevealed = Boolean(revealedPasswords[client.id]);

                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-cyan-50/50 transition-colors ${
                        isSelected ? 'bg-cyan-50/80' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(client.id)}
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                      </td>

                      {/* C.Code */}
                      <td className="p-3 font-bold text-[#162e3d] font-mono">
                        <button
                          onClick={() => handleSelectClient(client)}
                          className="hover:underline text-cyan-700 focus:outline-none"
                          title="View Full Client 360 Profile"
                        >
                          {client.code}
                        </button>
                      </td>

                      {/* ID/IP */}
                      <td className="p-3 font-semibold text-slate-900">
                        <button
                          onClick={() => handleSelectClient(client)}
                          className="hover:text-cyan-600 focus:outline-none"
                        >
                          {client.username}
                        </button>
                      </td>

                      {/* Password with Eye Toggle */}
                      <td className="p-3 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-600">
                            {isPasswordRevealed ? 'haven123' : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordReveal(client.id)}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded focus:outline-none"
                            title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                          >
                            {isPasswordRevealed ? (
                              <EyeOff className="w-3.5 h-3.5 text-cyan-600" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Customer Name */}
                      <td className="p-3 font-medium text-slate-900 whitespace-nowrap">
                        {client.name}
                      </td>

                      {/* Mobile */}
                      <td className="p-3 font-mono text-slate-600">{client.mobile}</td>

                      {/* Zone */}
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {client.zone}
                        </span>
                      </td>

                      {/* Conn. Type */}
                      <td className="p-3 whitespace-nowrap text-slate-600">{client.connectionType}</td>

                      {/* Package/Speed */}
                      <td className="p-3 font-mono text-[11px] font-medium text-slate-800">
                        {client.packageSpeed}
                      </td>

                      {/* Monthly Bill */}
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {client.monthlyBill.toFixed(2)}
                      </td>

                      {/* Server */}
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold text-[10px]">
                          {client.server}
                        </span>
                      </td>

                      {/* Billing Status */}
                      <td className="p-3 text-center">
                        <StatusBadge status={client.billingStatus} type="billing" />
                      </td>

                      {/* Mikrotik Status Toggle */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggle(client.id)}
                          className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                            client.mikrotikStatus ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                          title={
                            client.mikrotikStatus
                              ? 'MikroTik Session Active - Click to Disable'
                              : 'MikroTik Disabled - Click to Enable'
                          }
                        >
                          <span
                            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              client.mikrotikStatus ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Action */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* 360 View */}
                          <button
                            onClick={() => handleSelectClient(client)}
                            className="p-1.5 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-md transition-colors"
                            title="View 360-degree Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Bill Receive */}
                          <button
                            onClick={() => handleBillReceive(client.code)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Collect Bill for this client"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination Bar */}
        {filteredClients.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-700">1</span> to{' '}
              <span className="font-semibold text-slate-700">{filteredClients.length}</span> of{' '}
              <span className="font-semibold text-slate-700">{filteredClients.length}</span> entries
            </div>
            <div className="flex items-center space-x-1">
              <button
                disabled
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-400 cursor-not-allowed opacity-60"
              >
                Previous
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-[#162e3d] text-white font-semibold shadow-xs">
                1
              </button>
              <button
                disabled
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-400 cursor-not-allowed opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
