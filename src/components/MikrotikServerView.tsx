import React, { useState, useEffect } from 'react';
import {
  Server,
  Wifi,
  Activity,
  ArrowDown,
  ArrowUp,
  Cpu,
  HardDrive,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Database,
  Download,
  Eye,
  Zap,
  Sliders
} from 'lucide-react';
import { MikrotikServerItem } from '../types';

interface MikrotikServerViewProps {
  servers: MikrotikServerItem[];
  onToggleServer: (id: string) => void;
  onImportClients: () => void;
}

export const MikrotikServerView: React.FC<MikrotikServerViewProps> = ({
  servers,
  onToggleServer,
  onImportClients
}) => {
  const [activeTab, setActiveTab] = useState<'servers' | 'realtime' | 'import'>('realtime');
  const [rxSpeed, setRxSpeed] = useState(1842.5); // Mbps
  const [txSpeed, setTxSpeed] = useState(742.8); // Mbps
  const [pingLatency, setPingLatency] = useState(4); // ms
  const [history, setHistory] = useState<number[]>([40, 65, 55, 78, 85, 92, 70, 80, 88, 95, 82, 90, 85, 93, 89, 94]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Real-time dynamic pulse simulation for live traffic
  useEffect(() => {
    const interval = setInterval(() => {
      setRxSpeed((prev) => +(prev + (Math.random() * 40 - 20)).toFixed(1));
      setTxSpeed((prev) => +(prev + (Math.random() * 20 - 10)).toFixed(1));
      setPingLatency(Math.floor(3 + Math.random() * 3));
      setHistory((prev) => {
        const nextVal = Math.floor(75 + Math.random() * 20);
        return [...prev.slice(1), nextVal];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setImportSuccess(true);
      onImportClients();
      setTimeout(() => setImportSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Top Breadcrumb & View Selector */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-500">Home</span>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-slate-800">Mikrotik Server &amp; Core Bandwidth</span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded text-xs font-semibold">
          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'realtime'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-emerald-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Real-Time Traffic</span>
          </button>

          <button
            onClick={() => setActiveTab('servers')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'servers'
                ? 'bg-[#162e3d] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#162e3d]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Routers &amp; Gateways</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'import'
                ? 'bg-[#00a2d3] text-white shadow-sm'
                : 'text-slate-700 hover:text-cyan-700'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Import From Mikrotik</span>
          </button>
        </div>
      </div>

      {/* Real-time Bandwidth Monitoring Tab */}
      {activeTab === 'realtime' && (
        <div className="space-y-4">
          {/* Top Live Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-white">
            <div className="bg-[#162e3d] p-3.5 rounded shadow-sm flex items-center justify-between border-l-4 border-cyan-400">
              <div>
                <div className="text-xs text-cyan-300 font-medium flex items-center gap-1">
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Aggregate (RX)</span>
                </div>
                <div className="text-2xl font-black tracking-tight mt-1 font-mono">
                  {rxSpeed} <span className="text-sm font-normal text-slate-300">Mbps</span>
                </div>
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>

            <div className="bg-[#162e3d] p-3.5 rounded shadow-sm flex items-center justify-between border-l-4 border-emerald-400">
              <div>
                <div className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload Aggregate (TX)</span>
                </div>
                <div className="text-2xl font-black tracking-tight mt-1 font-mono">
                  {txSpeed} <span className="text-sm font-normal text-slate-300">Mbps</span>
                </div>
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="bg-white text-slate-800 p-3.5 rounded shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Active PPPoE Sessions</div>
                <div className="text-2xl font-black text-slate-900 mt-1 font-mono">631</div>
              </div>
              <div className="w-10 h-10 rounded bg-cyan-50 flex items-center justify-center text-cyan-700 font-bold">
                <Wifi className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white text-slate-800 p-3.5 rounded shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">BBN-CORE Gateway Ping</div>
                <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                  {pingLatency} <span className="text-sm font-normal text-slate-500">ms</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <div>CPU: 14%</div>
                <div>RAM: 1.8 / 4GB</div>
              </div>
            </div>
          </div>

          {/* Large Live Canvas / SVG Waveform Graph */}
          <div className="bg-slate-900 text-white p-4 rounded-lg shadow-md border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h3 className="font-bold text-sm text-cyan-400">
                    BBN-CORE [157.10.238.100] - sfp-plus1 Optical WAN Interface
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time MikroTik RouterOS API stream | Link Capacity: 10 Gbps Full-Duplex
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 bg-cyan-400 rounded-sm"></span>
                  <span>RX (Download)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 bg-emerald-400 rounded-sm"></span>
                  <span>TX (Upload)</span>
                </div>
              </div>
            </div>

            {/* Dynamic Graph */}
            <div className="h-60 w-full relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="rxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00a2d3" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00a2d3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#334155" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="800" y2="90" stroke="#334155" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="800" y2="140" stroke="#334155" strokeDasharray="4 4" />

                {/* Download Curve Filled */}
                <path
                  d={`M0,150 ${history
                    .map((val, idx) => `L${(idx / (history.length - 1)) * 800},${200 - val * 1.6}`)
                    .join(' ')} L800,200 L0,200 Z`}
                  fill="url(#rxGradient)"
                />

                {/* Download Line (Cyan) */}
                <path
                  d={`M0,150 ${history
                    .map((val, idx) => `L${(idx / (history.length - 1)) * 800},${200 - val * 1.6}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="#00a2d3"
                  strokeWidth="3"
                />

                {/* Upload Line (Emerald) */}
                <path
                  d={`M0,170 ${history
                    .map((val, idx) => `L${(idx / (history.length - 1)) * 800},${200 - val * 0.7}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Interface Table */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">ether1-WAN (IIG Fiber)</div>
                  <div className="text-[11px] text-slate-400">10G SFP+ Optical Link</div>
                </div>
                <div className="text-right font-mono text-cyan-300 font-bold">1,842 Mbps</div>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">ether2-BDIX Peering</div>
                  <div className="text-[11px] text-slate-400">National Internet Exchange</div>
                </div>
                <div className="text-right font-mono text-emerald-300 font-bold">894 Mbps</div>
              </div>

              <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">ether3-OLT Distribution</div>
                  <div className="text-[11px] text-slate-400">FiberHome 16-Port GPON</div>
                </div>
                <div className="text-right font-mono text-purple-300 font-bold">1,410 Mbps</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mikrotik Server List Tab matching Screenshot 5 */}
      {activeTab === 'servers' && (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Connected MikroTik Server Nodes</h3>
            <button className="px-3 py-1 bg-[#00a2d3] hover:bg-[#008cb6] text-white text-xs font-semibold rounded shadow-sm">
              + Add Server
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-2.5">Serial</th>
                  <th className="p-2.5">ServerName</th>
                  <th className="p-2.5">Server IP</th>
                  <th className="p-2.5">Username</th>
                  <th className="p-2.5">Port</th>
                  <th className="p-2.5">Version</th>
                  <th className="p-2.5">Timeout</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-center">Ping / Load</th>
                  <th className="p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {servers.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono">{srv.serial}</td>
                    <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{srv.name}</span>
                      {srv.status && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          Active Gateway
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-cyan-800">{srv.ip}</td>
                    <td className="p-2.5 font-mono">{srv.username}</td>
                    <td className="p-2.5 font-mono">{srv.port}</td>
                    <td className="p-2.5">{srv.version}</td>
                    <td className="p-2.5 text-slate-500">{srv.timeout}</td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => onToggleServer(srv.id)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          srv.status ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            srv.status ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="p-2.5 text-center font-mono">
                      {srv.status ? (
                        <span className="text-emerald-700 font-bold">
                          {srv.latencyMs}ms / {srv.cpuUsage}% CPU
                        </span>
                      ) : (
                        <span className="text-slate-400">Offline</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => setActiveTab('realtime')}
                        className="px-2 py-1 bg-slate-100 hover:bg-cyan-100 text-cyan-800 rounded font-semibold text-[11px] transition-colors"
                      >
                        Monitor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import From Mikrotik Tab matching Screenshot 6 */}
      {activeTab === 'import' && (
        <div className="bg-white rounded shadow-sm border border-slate-200 p-4 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                MikroTik RouterOS PPP Secret Synchronizer
              </h3>
              <p className="text-slate-500">
                Fetch and reconcile unregistered PPPoE users directly from BBN-CORE
              </p>
            </div>

            <button
              onClick={handleImport}
              disabled={isImporting}
              className="px-4 py-2 bg-[#00a2d3] hover:bg-[#008cb6] text-white font-bold rounded shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isImporting ? 'animate-spin' : ''}`} />
              <span>{isImporting ? 'Syncing RouterOS...' : 'Import From Mikrotik'}</span>
            </button>
          </div>

          {importSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Successfully imported and verified 12 PPPoE secrets into billing engine!</span>
            </div>
          )}

          {/* Filters matching Screenshot 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Server</label>
              <select className="w-full p-1.5 border border-slate-300 rounded bg-white font-bold text-cyan-800">
                <option>BBN-CORE (157.10.238.100)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Protocol</label>
              <select className="w-full p-1.5 border border-slate-300 rounded bg-white">
                <option>PPPOE</option>
                <option>Static IP</option>
                <option>Hotspot</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Profile</label>
              <select className="w-full p-1.5 border border-slate-300 rounded bg-white">
                <option>All Profiles</option>
                <option>10mb_pkg_500tk</option>
                <option>20mb_pkg_600tk</option>
                <option>50mb_pkg_800tk</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">User Status</label>
              <select className="w-full p-1.5 border border-slate-300 rounded bg-white">
                <option>Unique / Synced</option>
                <option>Unregistered Only</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
