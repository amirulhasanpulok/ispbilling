import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Plus,
  Eye,
  EyeOff,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit,
  DollarSign,
  UserCheck,
  Send,
  ExternalLink
} from 'lucide-react';
import { Client } from '../types';

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
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-xl text-xs z-50 flex items-center gap-2 animate-fade-in border border-cyan-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Action Toolbar matching Screenshot 3 */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Home</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-bold text-slate-800">Client List</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={onOpenAddClient}
              className="px-3 py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white font-semibold rounded shadow-sm flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Client</span>
            </button>

            <button
              onClick={() => showToast('Exporting Client List to Excel (.xlsx)...')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded flex items-center gap-1 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Generate Excel</span>
            </button>

            <button
              onClick={() => showToast('Generating PDF Client Report...')}
              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Pdf</span>
            </button>

            <button
              onClick={() => showToast('Syncing all PPPoE clients with Mikrotik BBN-CORE...')}
              className="px-2.5 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white font-medium rounded flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Clients &amp; Servers</span>
            </button>

            <button
              onClick={() => showToast('Batch PPPoE MAC binding updated on RouterOS')}
              className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded transition-colors hidden sm:block"
            >
              Bind All PPOE MAC
            </button>
          </div>
        </div>

        {/* 4 Stat Cards Row matching Screenshot 3 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-white">
          <div className="bg-[#00a2d3] p-3 rounded flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xl font-bold">779</div>
              <div className="text-xs text-cyan-100">Running Clients</div>
            </div>
            <UserCheck className="w-6 h-6 text-cyan-200/60" />
          </div>

          <div className="bg-[#009688] p-3 rounded flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xl font-bold">4</div>
              <div className="text-xs text-teal-100">New Clients</div>
            </div>
            <Plus className="w-6 h-6 text-teal-200/60" />
          </div>

          <div className="bg-[#673ab7] p-3 rounded flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xl font-bold">30</div>
              <div className="text-xs text-purple-100">Renewed Clients</div>
            </div>
            <RefreshCw className="w-6 h-6 text-purple-200/60" />
          </div>

          <div className="bg-[#455a64] p-3 rounded flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xl font-bold">17</div>
              <div className="text-xs text-slate-300">Waiver Clients</div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-slate-400/60" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              placeholder="Search by Code, Username, Mobile, Name, or MAC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-700 focus:outline-none focus:border-cyan-500"
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
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-700 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Client Types</option>
            <option value="Home">Home</option>
            <option value="Shop User">Shop User</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>

        <div className="text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredClients.length}</span> of {clients.length} clients
        </div>
      </div>

      {/* Clients Data Table matching Screenshot 3 */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#162e3d] text-white uppercase text-[11px] font-semibold tracking-wider">
              <tr>
                <th className="p-2.5 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedClientIds.length > 0 &&
                      selectedClientIds.length === clients.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                  />
                </th>
                <th className="p-2.5">C.Code</th>
                <th className="p-2.5">ID/IP</th>
                <th className="p-2.5">Password</th>
                <th className="p-2.5">Cus. Name</th>
                <th className="p-2.5">Mobile</th>
                <th className="p-2.5">Zone</th>
                <th className="p-2.5">Conn. Type</th>
                <th className="p-2.5">Cus. Type</th>
                <th className="p-2.5">R.Address</th>
                <th className="p-2.5">Package/Speed</th>
                <th className="p-2.5 text-right">M.Bill</th>
                <th className="p-2.5">MAC Addrs</th>
                <th className="p-2.5">Server</th>
                <th className="p-2.5 text-center">B.Status</th>
                <th className="p-2.5 text-center">M.Status</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClients.map((client) => {
                const isSelected = selectedClientIds.includes(client.id);
                const isPasswordRevealed = Boolean(revealedPasswords[client.id]);

                return (
                  <tr
                    key={client.id}
                    className={`hover:bg-cyan-50/60 transition-colors ${
                      isSelected ? 'bg-cyan-50/80' : ''
                    }`}
                  >
                    <td className="p-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(client.id)}
                        className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                      />
                    </td>

                    {/* C.Code */}
                    <td className="p-2.5 font-bold text-[#162e3d] font-mono">
                      <button
                        onClick={() => handleSelectClient(client)}
                        className="hover:underline text-cyan-700"
                        title="View Full Client 360 Profile"
                      >
                        {client.code}
                      </button>
                    </td>

                    {/* ID/IP */}
                    <td className="p-2.5 font-semibold text-slate-900">
                      <button
                        onClick={() => handleSelectClient(client)}
                        className="hover:text-cyan-600"
                      >
                        {client.username}
                      </button>
                    </td>

                    {/* Password with Eye Toggle */}
                    <td className="p-2.5 font-mono">
                      <div className="flex items-center space-x-1.5">
                        <span>{isPasswordRevealed ? 'haven123' : '••••••••'}</span>
                        <button
                          onClick={() => togglePasswordReveal(client.id)}
                          className="text-slate-400 hover:text-slate-600"
                          title={isPasswordRevealed ? 'Hide Password' : 'Show Password'}
                        >
                          {isPasswordRevealed ? (
                            <EyeOff className="w-3 h-3 text-cyan-600" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Customer Name */}
                    <td className="p-2.5 font-medium text-slate-900 whitespace-nowrap">
                      {client.name}
                    </td>

                    {/* Mobile */}
                    <td className="p-2.5 font-mono text-slate-700">{client.mobile}</td>

                    {/* Zone */}
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {client.zone}
                      </span>
                    </td>

                    {/* Conn. Type */}
                    <td className="p-2.5 whitespace-nowrap">{client.connectionType}</td>

                    {/* Customer Type */}
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          client.clientType === 'Corporate'
                            ? 'bg-purple-100 text-purple-800'
                            : client.clientType === 'Shop User'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {client.clientType}
                      </span>
                    </td>

                    {/* R.Address */}
                    <td className="p-2.5 text-slate-600 max-w-[150px] truncate" title={client.address}>
                      {client.address}
                    </td>

                    {/* Package/Speed */}
                    <td className="p-2.5 font-mono text-[11px] font-medium text-slate-800">
                      {client.packageSpeed}
                    </td>

                    {/* Monthly Bill */}
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                      {client.monthlyBill.toFixed(2)}
                    </td>

                    {/* MAC Addrs */}
                    <td className="p-2.5 font-mono text-[11px] text-slate-600">
                      {client.macAddress}
                    </td>

                    {/* Server */}
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 font-semibold text-[10px]">
                        {client.server}
                      </span>
                    </td>

                    {/* Billing Status */}
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {client.billingStatus}
                      </span>
                    </td>

                    {/* Mikrotik Status Toggle */}
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleToggle(client.id)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          client.mikrotikStatus ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={
                          client.mikrotikStatus
                            ? 'Mikrotik Session Enabled - Click to Disable'
                            : 'Mikrotik Disabled - Click to Enable'
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
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {/* 360 View */}
                        <button
                          onClick={() => handleSelectClient(client)}
                          className="p-1 text-slate-500 hover:text-cyan-700 hover:bg-slate-100 rounded"
                          title="View 360-degree Profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Bill Receive */}
                        <button
                          onClick={() => handleBillReceive(client.code)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
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

        {/* Footer Pagination Bar */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Showing 1 to {filteredClients.length} of {filteredClients.length} entries
          </div>
          <div className="flex items-center space-x-1">
            <button className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50">
              Previous
            </button>
            <button className="px-2.5 py-1 rounded bg-[#162e3d] text-white font-semibold">
              1
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
