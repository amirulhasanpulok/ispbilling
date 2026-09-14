import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Cpu,
  RefreshCw,
  Server,
  Zap,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Search,
  PowerOff,
  Layers,
  Network
} from 'lucide-react';
import { Client } from '../types';
import { PageHeader, StatusBadge, EmptyState, Toast, MetricCard } from './common';

interface NetworkMonitorViewProps {
  clients?: Client[];
  onDisconnectSession?: (username: string) => void;
  onSelectClient?: (client: Client) => void;
}

interface ActiveSession {
  id: string;
  username: string;
  ipAddress: string;
  macAddress: string;
  uptime: string;
  rxMbps: number;
  txMbps: number;
  interfaceName: string;
  ponPort: string;
  opticalPowerDbm: number;
  status: 'active' | 'warning' | 'idle';
}

export const NetworkMonitorView: React.FC<NetworkMonitorViewProps> = ({
  clients = [],
  onDisconnectSession,
  onSelectClient
}) => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'olt' | 'topology'>('realtime');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Live fluctuating bandwidth metrics
  const [downloadRate, setDownloadRate] = useState(842.6);
  const [uploadRate, setUploadRate] = useState(314.2);
  const [bdixRate, setBdixRate] = useState(1240.8);

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: 'sess-1',
      username: 'haven',
      ipAddress: '10.10.12.45',
      macAddress: '48:8D:36:11:A2:90',
      uptime: '4d 18h 22m',
      rxMbps: 8.9,
      txMbps: 2.3,
      interfaceName: '<pppoe-haven>',
      ponPort: 'PON 1/1',
      opticalPowerDbm: -19.4,
      status: 'active'
    },
    {
      id: 'sess-2',
      username: 'sofiquejm',
      ipAddress: '10.10.12.88',
      macAddress: '70:4F:57:9B:C3:14',
      uptime: '1d 06h 14m',
      rxMbps: 14.2,
      txMbps: 4.8,
      interfaceName: '<pppoe-sofiquejm>',
      ponPort: 'PON 1/2',
      opticalPowerDbm: -22.1,
      status: 'active'
    },
    {
      id: 'sess-3',
      username: 'faruk77',
      ipAddress: '10.10.12.102',
      macAddress: 'DC:99:B4:72:08:FE',
      uptime: '12h 45m',
      rxMbps: 18.5,
      txMbps: 7.1,
      interfaceName: '<pppoe-faruk77>',
      ponPort: 'PON 1/3',
      opticalPowerDbm: -27.8,
      status: 'warning'
    },
    {
      id: 'sess-4',
      username: 'kabir_net',
      ipAddress: '10.10.12.115',
      macAddress: 'BC:24:11:80:F3:19',
      uptime: '22d 04h 01m',
      rxMbps: 4.1,
      txMbps: 1.2,
      interfaceName: '<pppoe-kabir_net>',
      ponPort: 'PON 1/1',
      opticalPowerDbm: -18.7,
      status: 'active'
    },
    {
      id: 'sess-5',
      username: 'alamin_bbn',
      ipAddress: '10.10.12.140',
      macAddress: '5C:F9:DD:44:A1:02',
      uptime: '0d 02h 19m',
      rxMbps: 0.2,
      txMbps: 0.1,
      interfaceName: '<pppoe-alamin_bbn>',
      ponPort: 'PON 1/4',
      opticalPowerDbm: -21.3,
      status: 'idle'
    }
  ]);

  // Live ticker for traffic fluctuations
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      const deltaRx = (Math.random() - 0.48) * 15;
      const deltaTx = (Math.random() - 0.48) * 8;
      setDownloadRate((prev) => Math.max(700, Math.min(980, parseFloat((prev + deltaRx).toFixed(1)))));
      setUploadRate((prev) => Math.max(250, Math.min(420, parseFloat((prev + deltaTx).toFixed(1)))));

      // Random jitter for sessions
      setActiveSessions((prev) =>
        prev.map((s) => ({
          ...s,
          rxMbps: Math.max(0.1, parseFloat((s.rxMbps + (Math.random() - 0.5) * 1.2).toFixed(1))),
          txMbps: Math.max(0.1, parseFloat((s.txMbps + (Math.random() - 0.5) * 0.6).toFixed(1)))
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleKickSession = (username: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.username !== username));
    if (onDisconnectSession) onDisconnectSession(username);
    showToast(`PPPoE session <pppoe-${username}> cleared and terminated from MikroTik.`);
  };

  const filteredSessions = activeSessions.filter(
    (s) =>
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ipAddress.includes(searchTerm) ||
      s.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ponPort.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-5 space-y-4 bg-slate-50 min-h-[calc(100vh-3.5rem)] text-slate-800">
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Unified Page Header */}
      <PageHeader
        title="Real-Time Network Diagnostics & MRTG"
        subtitle="MikroTik BBN-CORE (CCR1036-8G-2S+) & Huawei MA5608T EPON OLT Telemetry"
        icon={Activity}
        breadcrumbs={[
          { label: 'Home', onClick: () => {} },
          { label: 'Network', onClick: () => {} },
          { label: 'Live Diagnostics' }
        ]}
        actions={
          <>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border shadow-xs ${
                autoRefresh
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto-Polling Active' : 'Polling Paused'}</span>
            </button>

            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs font-medium">
              <button
                onClick={() => setActiveTab('realtime')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'realtime'
                    ? 'bg-white shadow-xs text-cyan-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Traffic MRTG
              </button>
              <button
                onClick={() => setActiveTab('olt')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'olt'
                    ? 'bg-white shadow-xs text-cyan-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                OLT PON Optical
              </button>
              <button
                onClick={() => setActiveTab('topology')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'topology'
                    ? 'bg-white shadow-xs text-cyan-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fiber Topology
              </button>
            </div>
          </>
        }
      />

      {/* Key Real-Time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Download (WAN Rx)"
          value={`${downloadRate} Mbps`}
          subValue="Peak 980 Mbps (Cap 1 Gbps)"
          icon={ArrowDown}
          color="cyan"
        />

        <MetricCard
          label="Upload (WAN Tx)"
          value={`${uploadRate} Mbps`}
          subValue="Symmetrical upstream"
          icon={ArrowUp}
          color="indigo"
        />

        <MetricCard
          label="BDIX / Local Peering"
          value={`${bdixRate} Mbps`}
          subValue="YouTube GGC + BDIX Direct"
          icon={Zap}
          color="emerald"
        />

        <MetricCard
          label="Router CPU & Temp"
          value="18% / 41°C"
          subValue="36 Cores CCR Normal"
          icon={Cpu}
          color="slate"
        />
      </div>

      {/* Main Content by Tab */}
      {activeTab === 'realtime' && (
        <div className="space-y-4">
          {/* Traffic Graph Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Real-time Traffic Graph (ether1-gateway to NTTN)
                </h2>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-cyan-700">
                  <span className="w-3 h-3 rounded bg-cyan-500 inline-block"></span>
                  In / Download ({downloadRate} Mbps)
                </span>
                <span className="flex items-center gap-1.5 font-medium text-indigo-700">
                  <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
                  Out / Upload ({uploadRate} Mbps)
                </span>
              </div>
            </div>

            {/* Custom SVG MRTG Area Chart */}
            <div className="h-48 w-full relative bg-[#0b1924] rounded-lg p-3 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="40" x2="800" y2="40" stroke="#1e3a4f" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="800" y2="80" stroke="#1e3a4f" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="800" y2="120" stroke="#1e3a4f" strokeDasharray="3 3" />

                {/* Download Curve */}
                <polygon
                  fill="url(#cyanGrad)"
                  points="0,160 0,65 100,55 200,45 300,58 400,35 500,48 600,42 700,38 800,45 800,160"
                />
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  points="0,65 100,55 200,45 300,58 400,35 500,48 600,42 700,38 800,45"
                />

                {/* Upload Curve */}
                <polygon
                  fill="url(#indigoGrad)"
                  points="0,160 0,115 100,110 200,105 300,112 400,98 500,105 600,102 700,100 800,104 800,160"
                />
                <polyline
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2"
                  points="0,115 100,110 200,105 300,112 400,98 500,105 600,102 700,100 800,104"
                />
              </svg>

              {/* Real-time overlay badges */}
              <div className="absolute top-2 left-4 text-[10px] font-mono text-slate-400">
                Max In: 980 Mbps | Current In: {downloadRate} Mbps | Average: 840 Mbps
              </div>
              <div className="absolute bottom-2 right-4 text-[10px] font-mono text-cyan-400 bg-black/40 px-2 py-0.5 rounded">
                MikroTik SNMP v2c / 3000ms Poll
              </div>
            </div>
          </div>

          {/* Active PPPoE Sessions Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-cyan-600" />
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Active PPPoE Sessions &amp; Optical Signal ({activeSessions.length} Online)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search User, IP, MAC, PON..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 pr-2.5 py-1 text-xs rounded-lg border border-slate-300 w-52 focus:outline-none focus:border-cyan-500 bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                </div>
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <EmptyState
                title="No Active Sessions Found"
                description="No active PPPoE sessions match your search query."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#162e3d] text-white font-semibold uppercase text-[10px]">
                      <th className="p-3">User / Interface</th>
                      <th className="p-3">Allocated IP</th>
                      <th className="p-3">MAC Address</th>
                      <th className="p-3">PON Port</th>
                      <th className="p-3">Optical Power</th>
                      <th className="p-3">Rx Rate</th>
                      <th className="p-3">Tx Rate</th>
                      <th className="p-3">Uptime</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold font-mono text-[#162e3d]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                session.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                            ></span>
                            <span>{session.username}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">{session.interfaceName}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-700">{session.ipAddress}</td>
                        <td className="p-3 font-mono text-slate-500 text-[11px]">{session.macAddress}</td>
                        <td className="p-3 font-semibold text-slate-700">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] border border-slate-200">
                            {session.ponPort}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] ${
                              session.opticalPowerDbm < -26
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {session.opticalPowerDbm} dBm
                          </span>
                        </td>
                        <td className="p-3 font-mono font-semibold text-cyan-700">
                          <span className="flex items-center gap-1">
                            <ArrowDown className="w-3 h-3 text-cyan-500" /> {session.rxMbps} Mbps
                          </span>
                        </td>
                        <td className="p-3 font-mono font-semibold text-indigo-700">
                          <span className="flex items-center gap-1">
                            <ArrowUp className="w-3 h-3 text-indigo-500" /> {session.txMbps} Mbps
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{session.uptime}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleKickSession(session.username)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-semibold border border-rose-200 transition-colors inline-flex items-center gap-1"
                            title="Terminate active MikroTik session to force reconnect"
                          >
                            <PowerOff className="w-3 h-3" />
                            <span>Kick</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OLT PON Port Management Tab */}
      {activeTab === 'olt' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">OLT Model</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">Huawei SmartAX MA5608T</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Firmware V800R018C10</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total PON Ports</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">8 EPON / GPON Ports</p>
              <span className="text-[10px] text-cyan-600 font-semibold">8 SFP Modules Active</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Online ONUs</span>
              <p className="text-sm font-bold text-emerald-700 font-mono mt-0.5">582 / 600 Online</p>
              <span className="text-[10px] text-slate-400 font-medium">18 Offline / Power Off</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Laser Class &amp; Power</span>
              <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">+4.2 dBm Tx Class C++</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Wavelength 1490nm</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
              <span>8-Port EPON OLT Slot 0/1 Interface Health</span>
              <button
                onClick={() => showToast('OLT optical diagnostics refreshed successfully!')}
                className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded-lg hover:bg-slate-50 font-medium shadow-xs"
              >
                Refresh Optical Levels
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#162e3d] text-white border-b border-slate-200 uppercase text-[10px]">
                    <th className="p-3">Port</th>
                    <th className="p-3">Admin State</th>
                    <th className="p-3">Zone Coverage</th>
                    <th className="p-3">ONUs (Active/Total)</th>
                    <th className="p-3">Avg Rx Power</th>
                    <th className="p-3">Current Traffic</th>
                    <th className="p-3">Temperature</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { port: 'PON 0/1/0', zone: 'Jamtola Bazar & Bot Tola', on: 64, total: 64, rx: '-19.2 dBm', traffic: '112 Mbps', temp: '42°C', status: 'Optimal' },
                    { port: 'PON 0/1/1', zone: 'College Road & Hospital Area', on: 62, total: 64, rx: '-20.1 dBm', traffic: '138 Mbps', temp: '43°C', status: 'Optimal' },
                    { port: 'PON 0/1/2', zone: 'Thana Road & Thana Parishad', on: 60, total: 64, rx: '-21.4 dBm', traffic: '98 Mbps', temp: '41°C', status: 'Optimal' },
                    { port: 'PON 0/1/3', zone: 'Joymonirhat Branch (POP Feed)', on: 115, total: 120, rx: '-23.8 dBm', traffic: '240 Mbps', temp: '44°C', status: 'Warning' },
                    { port: 'PON 0/1/4', zone: 'Sonahat Landport Route', on: 58, total: 64, rx: '-18.5 dBm', traffic: '85 Mbps', temp: '40°C', status: 'Optimal' },
                    { port: 'PON 0/1/5', zone: 'Bhurungamari Pilot High School', on: 55, total: 64, rx: '-19.8 dBm', traffic: '72 Mbps', temp: '41°C', status: 'Optimal' },
                    { port: 'PON 0/1/6', zone: 'South Jamtola Village', on: 48, total: 60, rx: '-22.1 dBm', traffic: '64 Mbps', temp: '39°C', status: 'Optimal' },
                    { port: 'PON 0/1/7', zone: 'Spare / Expansion Core', on: 0, total: 0, rx: '0.0 dBm', traffic: '0 Mbps', temp: '36°C', status: 'Standby' }
                  ].map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold font-mono text-[#162e3d]">{p.port}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          UP / Enabled
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{p.zone}</td>
                      <td className="p-3 font-mono font-semibold text-slate-700">
                        {p.on} / {p.total}
                      </td>
                      <td className="p-3 font-mono text-slate-700">{p.rx}</td>
                      <td className="p-3 font-mono font-bold text-cyan-700">{p.traffic}</td>
                      <td className="p-3 font-mono text-slate-500">{p.temp}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Optimal'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : p.status === 'Warning'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Topology Diagram Tab */}
      {activeTab === 'topology' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">BBN Optical Distribution Network (ODN) Map</h2>
              <p className="text-xs text-slate-500">Core Network Backbone &amp; Splice Box Hierarchy</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200">
              Active Network Topology
            </span>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl text-white font-mono text-xs space-y-6 overflow-x-auto">
            {/* Level 1: Core Router */}
            <div className="flex items-center justify-center">
              <div className="p-3.5 bg-cyan-900/80 border-2 border-cyan-400 rounded-xl text-center w-72 shadow-lg">
                <Server className="w-5 h-5 mx-auto mb-1 text-cyan-300" />
                <div className="font-bold text-cyan-200">BBN-CORE (CCR1036)</div>
                <div className="text-[10px] text-slate-300">IP: 157.10.238.100 | SFP+ 10G Uplink</div>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-cyan-500 mx-auto"></div>

            {/* Level 2: OLT */}
            <div className="flex items-center justify-center">
              <div className="p-3.5 bg-emerald-900/80 border-2 border-emerald-400 rounded-xl text-center w-72 shadow-lg">
                <Layers className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-emerald-200">MA5608T EPON OLT</div>
                <div className="text-[10px] text-slate-300">8 PON Ports | 600 Active Optical ONUs</div>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-emerald-500 mx-auto"></div>

            {/* Level 3: Optical Splitter Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-center">
                <div className="font-bold text-amber-400">Jamtola Node (Box-01)</div>
                <div className="text-[10px] text-slate-400 mt-1">1:8 PLC Splitter</div>
                <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">Signal: -19 dBm (64 Users)</div>
              </div>

              <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-center">
                <div className="font-bold text-amber-400">Bot Tola Node (Box-02)</div>
                <div className="text-[10px] text-slate-400 mt-1">1:8 PLC Splitter</div>
                <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">Signal: -21 dBm (58 Users)</div>
              </div>

              <div className="p-3.5 bg-slate-800 border border-slate-700 rounded-xl text-center">
                <div className="font-bold text-amber-400">Joymonirhat Sub-POP</div>
                <div className="text-[10px] text-slate-400 mt-1">24-Core Armored Trunk</div>
                <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">Signal: -23 dBm (115 Users)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
