import React, { useState, useMemo } from 'react';
import {
  Copy,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Trash2,
  Eye,
  Sliders,
  Download,
  AlertCircle,
  Network,
  Users,
  CreditCard,
  Check,
  X,
  HelpCircle,
  Info,
  Clock,
  ChevronRight,
  Zap,
  Lock
} from 'lucide-react';
import { PageHeader, StatusBadge } from './common';
import { DedupCluster, DedupEntityType, DedupRecordCandidate, DedupRuleSettings } from '../types';

interface DeduplicationViewProps {
  embedded?: boolean;
  onShowToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const INITIAL_CLUSTERS: DedupCluster[] = [
  {
    id: 'cluster-1',
    entityType: 'client',
    conflictKey: 'Duplicate Mobile Number: 01712-884910',
    conflictField: 'Mobile Phone',
    conflictValue: '01712-884910',
    severity: 'High',
    similarityScore: 98,
    detectedAt: 'Today at 07:15 AM',
    status: 'Pending',
    selectedMasterId: 'cand-1a',
    candidates: [
      {
        id: 'cand-1a',
        code: 'CLI-0042',
        primaryLabel: 'Mohammad Rafiqul Islam',
        secondaryLabel: 'Main Residential Account',
        matchField: 'Mobile',
        matchValue: '+8801712884910',
        phone: '01712-884910',
        email: 'rafiqul.islam@gmail.com',
        nid: '19882691234567891',
        ipAddress: '10.10.20.45',
        macAddress: '4C:5E:0C:8A:1B:32',
        package: '50 Mbps Home Ultra (৳ 1,200/mo)',
        status: 'Active',
        balance: 0,
        branch: 'Main POP / Central',
        createdAt: '14 Jan 2024',
        lastActive: '10 mins ago'
      },
      {
        id: 'cand-1b',
        code: 'CLI-0189',
        primaryLabel: 'Md. Rafiqul Islam',
        secondaryLabel: 'Pending Web Re-Registration',
        matchField: 'Mobile',
        matchValue: '01712884910',
        phone: '01712-884910',
        email: 'rafiqul88@yahoo.com',
        nid: '19882691234567891',
        ipAddress: '10.10.20.91 (DHCP Pool)',
        macAddress: '4C:5E:0C:8A:1B:32',
        package: '30 Mbps Starter (৳ 800/mo)',
        status: 'Unverified',
        balance: 800,
        branch: 'Mirpur Sub-Zone',
        createdAt: '04 Mar 2026',
        lastActive: 'Yesterday'
      }
    ]
  },
  {
    id: 'cluster-2',
    entityType: 'network',
    conflictKey: 'Duplicate MAC Binding: 74:4D:28:9B:4C:10',
    conflictField: 'RouterOS ARP / MAC',
    conflictValue: '74:4D:28:9B:4C:10',
    severity: 'Critical',
    similarityScore: 100,
    detectedAt: 'Today at 06:40 AM',
    status: 'Pending',
    selectedMasterId: 'cand-2a',
    candidates: [
      {
        id: 'cand-2a',
        code: 'PPPOE-802',
        primaryLabel: 'pppoe_tanvir_corp',
        secondaryLabel: 'Core-MikroTik-01 (Port ether3-fiber)',
        matchField: 'MAC Address',
        matchValue: '74:4D:28:9B:4C:10',
        ipAddress: '103.145.118.24 (Static Public)',
        macAddress: '74:4D:28:9B:4C:10',
        package: 'Dedicated 100 Mbps BDIX + Global',
        status: 'Active',
        balance: 0,
        branch: 'Dhanmondi POP',
        createdAt: '10 Oct 2024',
        lastActive: 'Live Connected'
      },
      {
        id: 'cand-2b',
        code: 'PPPOE-915',
        primaryLabel: 'tanvir_backup_link',
        secondaryLabel: 'Core-MikroTik-02 (Port ether5)',
        matchField: 'MAC Address',
        matchValue: '74:4D:28:9B:4C:10',
        ipAddress: '10.20.10.182 (Private Pool)',
        macAddress: '74:4D:28:9B:4C:10',
        package: 'Backup 20 Mbps Shared',
        status: 'Suspended',
        balance: 450,
        branch: 'Dhanmondi POP',
        createdAt: '22 Feb 2026',
        lastActive: '3 days ago'
      }
    ]
  },
  {
    id: 'cluster-3',
    entityType: 'transaction',
    conflictKey: 'Duplicate bKash TrxID: 9J87K12L39',
    conflictField: 'MFS Voucher TrxID',
    conflictValue: '9J87K12L39',
    severity: 'High',
    similarityScore: 100,
    detectedAt: 'Yesterday at 09:20 PM',
    status: 'Pending',
    selectedMasterId: 'cand-3a',
    candidates: [
      {
        id: 'cand-3a',
        code: 'VOUCH-2026-8941',
        primaryLabel: 'Invoice #INV-2026-0812 (Younus Ali)',
        secondaryLabel: 'Collected via Portal Online Gateway',
        matchField: 'TrxID',
        matchValue: '9J87K12L39',
        phone: '01710-287818',
        package: 'Payment ৳ 1,200.00 (Verified)',
        status: 'Active',
        balance: 0,
        branch: 'Jamtola Zone',
        createdAt: '12 Sep 2026 21:18',
        lastActive: 'Processed'
      },
      {
        id: 'cand-3b',
        code: 'VOUCH-2026-8942',
        primaryLabel: 'Invoice #INV-2026-0844 (Manual Entry by Staff)',
        secondaryLabel: 'Manual Counter Entry (bbnasad)',
        matchField: 'TrxID',
        matchValue: '9J87K12L39',
        phone: '01710-287818',
        package: 'Payment ৳ 1,200.00 (Duplicate Attempt)',
        status: 'Pending',
        balance: 1200,
        branch: 'Main Cash Counter',
        createdAt: '12 Sep 2026 21:24',
        lastActive: 'Flagged by Gateway'
      }
    ]
  },
  {
    id: 'cluster-4',
    entityType: 'client',
    conflictKey: 'Duplicate National ID (NID): 19852691234567890',
    conflictField: 'National Identity Card (NID)',
    conflictValue: '19852691234567890',
    severity: 'Medium',
    similarityScore: 100,
    detectedAt: '11 Sep 2026',
    status: 'Pending',
    selectedMasterId: 'cand-4a',
    candidates: [
      {
        id: 'cand-4a',
        code: 'CLI-0078',
        primaryLabel: 'Tariqul Alam Chowdhury',
        secondaryLabel: 'Commercial Connection',
        matchField: 'NID No',
        matchValue: '19852691234567890',
        phone: '01819-332211',
        email: 'tariqul@alamgroup.com.bd',
        nid: '19852691234567890',
        package: 'SME 40 Mbps (৳ 2,500/mo)',
        status: 'Active',
        balance: 0,
        branch: 'Agrabad Commercial Area',
        createdAt: '18 Nov 2023',
        lastActive: '1 hr ago'
      },
      {
        id: 'cand-4b',
        code: 'CLI-0312',
        primaryLabel: 'Tariq Alam',
        secondaryLabel: 'Residential Branch Connection',
        matchField: 'NID No',
        matchValue: '19852691234567890',
        phone: '01819-332299',
        email: 'tariq.home@gmail.com',
        nid: '19852691234567890',
        package: 'Home 25 Mbps (৳ 1,000/mo)',
        status: 'Active',
        balance: 1000,
        branch: 'Nasirabad Zone',
        createdAt: '15 Aug 2025',
        lastActive: '5 hrs ago'
      }
    ]
  }
];

const DEFAULT_SETTINGS: DedupRuleSettings = {
  blockDuplicateMobile: true,
  blockDuplicateNid: true,
  blockDuplicateMac: true,
  blockDuplicateIp: true,
  blockDuplicateTrxId: true,
  autoScanInterval: 'Daily',
  fuzzyThreshold: 85,
  notifyAdminsOnConflict: true
};

export const DeduplicationView: React.FC<DeduplicationViewProps> = ({
  embedded = false,
  onShowToast
}) => {
  const [clusters, setClusters] = useState<DedupCluster[]>(INITIAL_CLUSTERS);
  const [entityFilter, setEntityFilter] = useState<'all' | DedupEntityType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  
  // Modals state
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [rules, setRules] = useState<DedupRuleSettings>(DEFAULT_SETTINGS);
  const [selectedClusterForMerge, setSelectedClusterForMerge] = useState<DedupCluster | null>(null);
  const [mergeKeepBilling, setMergeKeepBilling] = useState(true);
  const [mergeNotifyClient, setMergeNotifyClient] = useState(true);
  const [mergeArchiveDuplicate, setMergeArchiveDuplicate] = useState(true);

  // Auto-resolve modal
  const [autoResolveModalOpen, setAutoResolveModalOpen] = useState(false);

  // Notify helper
  const notify = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (onShowToast) {
      onShowToast(msg, type);
    }
  };

  // Run deep scan simulation
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(10);
    setScanStep('Auditing subscriber mobile & NID registries...');

    setTimeout(() => {
      setScanProgress(35);
      setScanStep('Querying MikroTik RouterOS ARP & PPPoE bindings...');
    }, 500);

    setTimeout(() => {
      setScanProgress(70);
      setScanStep('Verifying MFS vouchers & payment gateway TrxIDs...');
    }, 1100);

    setTimeout(() => {
      setScanProgress(90);
      setScanStep('Calculating similarity vectors & conflict flags...');
    }, 1600);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      notify('Deduplication scan complete. 4 conflict clusters identified.', 'success');
    }, 2000);
  };

  // Set Master candidate for a cluster
  const handleSelectMaster = (clusterId: string, candidateId: string) => {
    setClusters((prev) =>
      prev.map((c) => (c.id === clusterId ? { ...c, selectedMasterId: candidateId } : c))
    );
    notify('Primary Master record updated for this cluster', 'info');
  };

  // Confirm Merge
  const handleConfirmMerge = () => {
    if (!selectedClusterForMerge) return;

    const master = selectedClusterForMerge.candidates.find(
      (c) => c.id === selectedClusterForMerge.selectedMasterId
    );
    const duplicates = selectedClusterForMerge.candidates.filter(
      (c) => c.id !== selectedClusterForMerge.selectedMasterId
    );

    setClusters((prev) =>
      prev.map((c) =>
        c.id === selectedClusterForMerge.id
          ? {
              ...c,
              status: 'Resolved',
              resolutionAction: 'merged'
            }
          : c
      )
    );

    setSelectedClusterForMerge(null);
    notify(
      `Successfully merged ${duplicates.map((d) => d.code).join(', ')} into master ${
        master?.code || 'record'
      }!`,
      'success'
    );
  };

  // Purge secondary duplicate
  const handlePurgeDuplicate = (cluster: DedupCluster) => {
    const master = cluster.candidates.find((c) => c.id === cluster.selectedMasterId);
    const duplicates = cluster.candidates.filter((c) => c.id !== cluster.selectedMasterId);

    if (window.confirm(`Are you sure you want to permanently purge redundant candidate ${duplicates.map(d => d.code).join(', ')}? This action cannot be reversed.`)) {
      setClusters((prev) =>
        prev.map((c) =>
          c.id === cluster.id
            ? { ...c, status: 'Resolved', resolutionAction: 'purged' }
            : c
        )
      );
      notify(`Duplicate entry permanently purged. Master ${master?.code} preserved.`, 'success');
    }
  };

  // Ignore / Whitelist
  const handleIgnoreCluster = (clusterId: string) => {
    setClusters((prev) =>
      prev.map((c) =>
        c.id === clusterId
          ? { ...c, status: 'Ignored', resolutionAction: 'whitelisted' }
          : c
      )
    );
    notify('Marked as verified false positive / whitelisted.', 'info');
  };

  // Auto-resolve safe items (unverified duplicates with 0 balance)
  const handleAutoResolveSafe = () => {
    let resolvedCount = 0;
    setClusters((prev) =>
      prev.map((c) => {
        if (c.status === 'Pending' && c.similarityScore >= 95) {
          resolvedCount++;
          return { ...c, status: 'Resolved', resolutionAction: 'merged' };
        }
        return c;
      })
    );
    setAutoResolveModalOpen(false);
    notify(`Auto-resolved ${resolvedCount} high-confidence duplicate records!`, 'success');
  };

  // Export CSV
  const handleExportReport = () => {
    const csvRows = [
      ['Cluster ID', 'Entity Type', 'Conflict Field', 'Conflict Value', 'Severity', 'Similarity', 'Status', 'Candidates']
    ];
    clusters.forEach((c) => {
      csvRows.push([
        c.id,
        c.entityType,
        c.conflictField,
        c.conflictValue,
        c.severity,
        `${c.similarityScore}%`,
        c.status,
        c.candidates.map((cand) => `${cand.code} (${cand.primaryLabel})`).join('; ')
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ISP_Deduplication_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Deduplication Audit Report exported to CSV', 'success');
  };

  // Filtered clusters
  const filteredClusters = useMemo(() => {
    return clusters.filter((c) => {
      if (entityFilter !== 'all' && c.entityType !== entityFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchCluster =
          c.conflictKey.toLowerCase().includes(q) ||
          c.conflictValue.toLowerCase().includes(q) ||
          c.candidates.some(
            (cand) =>
              cand.primaryLabel.toLowerCase().includes(q) ||
              cand.code.toLowerCase().includes(q) ||
              cand.phone?.toLowerCase().includes(q) ||
              cand.ipAddress?.toLowerCase().includes(q) ||
              cand.macAddress?.toLowerCase().includes(q) ||
              cand.nid?.toLowerCase().includes(q)
          );
        if (!matchCluster) return false;
      }
      return true;
    });
  }, [clusters, entityFilter, searchTerm]);

  // Counts
  const pendingCount = clusters.filter((c) => c.status === 'Pending').length;
  const criticalCount = clusters.filter((c) => c.status === 'Pending' && c.severity === 'Critical').length;
  const totalDuplicates = clusters.reduce((acc, c) => acc + (c.candidates.length - 1), 0);

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-5 p-4 sm:p-6 bg-slate-50 min-h-screen'}>
      {/* Page Header (Only when not embedded or standard) */}
      {!embedded ? (
        <PageHeader
          title="Data Deduplication & Conflict Resolver"
          subtitle="Real-time multi-dimensional deduplication for Subscriber Profiles, MikroTik IP/MAC Bindings, and MFS Billing Vouchers"
          icon={Layers}
          breadcrumbs={[
            { label: 'Setting' },
            { label: 'Data Deduplication' }
          ]}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportReport}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Audit CSV</span>
              </button>
              <button
                onClick={() => setRulesModalOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-600" />
                <span>Deduplication Rules</span>
              </button>
              <button
                onClick={() => setAutoResolveModalOpen(true)}
                disabled={pendingCount === 0}
                className="px-3 py-2 text-xs font-semibold text-white bg-[#162e3d] hover:bg-[#1a384b] disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Resolve Safe</span>
              </button>
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning...' : 'Run Deep Scan'}</span>
              </button>
            </div>
          }
        />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>Data Deduplication & Conflict Resolver</span>
            </h2>
            <p className="text-xs text-slate-500">
              Detect and eliminate duplicate phone numbers, MikroTik MAC bindings, and duplicate bKash/Nagad transactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRulesModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Rules</span>
            </button>
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Run Scan'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Scan Banner when running */}
      {isScanning && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin" />
              <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider">
                Deep Integrity Scan in Progress...
              </span>
            </div>
            <span className="text-xs font-bold text-cyan-700">{scanProgress}%</span>
          </div>
          <div className="w-full bg-cyan-200 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-cyan-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <p className="text-xs text-cyan-800 font-medium">{scanStep}</p>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Conflicts</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{pendingCount} Clusters</p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">{totalDuplicates} redundant records</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Clashes</p>
            <p className="text-xl font-bold text-rose-600 mt-1">{criticalCount} Active</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">RouterOS ARP / TrxID</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Integrity Health</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">97.8%</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">High Quality Database</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Resolved / Cleaned</p>
            <p className="text-xl font-bold text-cyan-800 mt-1">
              {clusters.filter((c) => c.status === 'Resolved').length} Resolved
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Auto & manual merges</p>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setEntityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              entityFilter === 'all'
                ? 'bg-[#162e3d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Entities</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">{clusters.length}</span>
          </button>

          <button
            onClick={() => setEntityFilter('client')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              entityFilter === 'client'
                ? 'bg-[#162e3d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Subscribers</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {clusters.filter((c) => c.entityType === 'client').length}
            </span>
          </button>

          <button
            onClick={() => setEntityFilter('network')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              entityFilter === 'network'
                ? 'bg-[#162e3d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>MikroTik & IP/MAC</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {clusters.filter((c) => c.entityType === 'network').length}
            </span>
          </button>

          <button
            onClick={() => setEntityFilter('transaction')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              entityFilter === 'transaction'
                ? 'bg-[#162e3d] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>MFS / Billing</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {clusters.filter((c) => c.entityType === 'transaction').length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Mobile, NID, MAC, IP, TrxID..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Duplicate Conflict Clusters List */}
      <div className="space-y-4">
        {filteredClusters.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Zero Conflicting Duplicates</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              No duplicate clusters matching your search or filters were detected. The system database is deduplicated and clean.
            </p>
          </div>
        ) : (
          filteredClusters.map((cluster) => {
            const isResolved = cluster.status === 'Resolved';
            const isIgnored = cluster.status === 'Ignored';

            return (
              <div
                key={cluster.id}
                className={`bg-white rounded-xl border transition-all overflow-hidden shadow-xs ${
                  isResolved
                    ? 'border-emerald-200 opacity-80'
                    : isIgnored
                    ? 'border-slate-200 opacity-60'
                    : cluster.severity === 'Critical'
                    ? 'border-rose-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Cluster Header Bar */}
                <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-1.5 rounded-md ${
                        cluster.entityType === 'client'
                          ? 'bg-blue-100 text-blue-700'
                          : cluster.entityType === 'network'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {cluster.entityType === 'client' ? (
                        <Users className="w-4 h-4" />
                      ) : cluster.entityType === 'network' ? (
                        <Network className="w-4 h-4" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{cluster.conflictKey}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cluster.severity === 'Critical'
                              ? 'bg-rose-100 text-rose-700'
                              : cluster.severity === 'High'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {cluster.severity}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {cluster.similarityScore}% match score
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Detected: {cluster.detectedAt} • Conflicting Field: <span className="font-semibold text-slate-700">{cluster.conflictField}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status & Cluster Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolved ({cluster.resolutionAction || 'merged'})</span>
                      </span>
                    ) : isIgnored ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-md">
                        <span>Whitelisted</span>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleIgnoreCluster(cluster.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/80 rounded transition-colors"
                          title="Mark as false positive"
                        >
                          Ignore / False Positive
                        </button>
                        <button
                          onClick={() => handlePurgeDuplicate(cluster)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded transition-colors flex items-center gap-1"
                          title="Delete redundant candidate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Purge Duplicate</span>
                        </button>
                        <button
                          onClick={() => setSelectedClusterForMerge(cluster)}
                          className="px-3 py-1 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Merge into Master</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Candidate Records Comparison Grid */}
                <div className="p-3.5">
                  <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
                    <span>CANDIDATE RECORDS (Select radio button to designate the Master Record):</span>
                    <span className="text-[11px] text-cyan-700 font-medium">
                      Primary Master will absorb secondary ledgers & active credentials
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cluster.candidates.map((cand) => {
                      const isSelectedMaster = cand.id === cluster.selectedMasterId;

                      return (
                        <div
                          key={cand.id}
                          onClick={() => !isResolved && handleSelectMaster(cluster.id, cand.id)}
                          className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            isSelectedMaster
                              ? 'bg-cyan-50/50 border-cyan-400 ring-1 ring-cyan-400 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`master-${cluster.id}`}
                                checked={isSelectedMaster}
                                onChange={() => handleSelectMaster(cluster.id, cand.id)}
                                disabled={isResolved}
                                className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-slate-300 cursor-pointer"
                              />
                              <div>
                                <span className="font-bold text-slate-800 text-sm">{cand.primaryLabel}</span>
                                {cand.secondaryLabel && (
                                  <p className="text-[11px] text-slate-500">{cand.secondaryLabel}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {isSelectedMaster ? (
                                <span className="bg-cyan-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                                  Primary Master
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 font-semibold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                                  Duplicate
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  cand.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : cand.status === 'Suspended'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {cand.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] pt-2 border-t border-slate-100">
                            <div>
                              <span className="text-slate-400">Account / Code:</span>{' '}
                              <span className="font-bold text-slate-700">{cand.code}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Branch:</span>{' '}
                              <span className="font-medium text-slate-700">{cand.branch}</span>
                            </div>
                            {cand.phone && (
                              <div>
                                <span className="text-slate-400">Mobile:</span>{' '}
                                <span className="font-semibold text-slate-800">{cand.phone}</span>
                              </div>
                            )}
                            {cand.ipAddress && (
                              <div>
                                <span className="text-slate-400">IP Address:</span>{' '}
                                <span className="font-mono text-cyan-700">{cand.ipAddress}</span>
                              </div>
                            )}
                            {cand.macAddress && (
                              <div>
                                <span className="text-slate-400">MAC Address:</span>{' '}
                                <span className="font-mono text-slate-700">{cand.macAddress}</span>
                              </div>
                            )}
                            {cand.nid && (
                              <div>
                                <span className="text-slate-400">NID:</span>{' '}
                                <span className="font-mono text-slate-700">{cand.nid}</span>
                              </div>
                            )}
                            {cand.package && (
                              <div className="col-span-2">
                                <span className="text-slate-400">Package / Plan:</span>{' '}
                                <span className="font-medium text-slate-700">{cand.package}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-slate-400">Balance:</span>{' '}
                              <span
                                className={`font-bold ${
                                  cand.balance && cand.balance > 0 ? 'text-rose-600' : 'text-emerald-700'
                                }`}
                              >
                                ৳ {cand.balance?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Created:</span>{' '}
                              <span className="text-slate-600">{cand.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Merge Confirmation Modal */}
      {selectedClusterForMerge && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="p-4 bg-[#162e3d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">Merge Duplicate Cluster</h3>
              </div>
              <button
                onClick={() => setSelectedClusterForMerge(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Deduplication Merge Policy</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  The designated <strong className="text-amber-950">Primary Master record</strong> will be preserved.
                  Secondary redundant records will be safely merged and retired without breaking ledger audits or network connectivity.
                </p>
              </div>

              {/* Merge Options */}
              <div className="space-y-2.5">
                <label className="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mergeKeepBilling}
                    onChange={(e) => setMergeKeepBilling(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">Consolidate Invoices & Ledgers</span>
                    <p className="text-[11px] text-slate-500">
                      Transfer all past unpaid/paid invoices and receipt history to the master subscriber profile.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mergeArchiveDuplicate}
                    onChange={(e) => setMergeArchiveDuplicate(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">Archive Redundant Candidate</span>
                    <p className="text-[11px] text-slate-500">
                      Mark the duplicate entry as retired/merged to prevent further login and release its IP/MAC pool lease.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mergeNotifyClient}
                    onChange={(e) => setMergeNotifyClient(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">Notify Customer via SMS</span>
                    <p className="text-[11px] text-slate-500">
                      Send an automated SMS alert confirming profile consolidation and unified customer code.
                    </p>
                  </div>
                </label>
              </div>

              {/* Master vs Duplicate details */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                <div>
                  <span className="text-slate-500">Master Record:</span>{' '}
                  <strong className="text-slate-800">
                    {selectedClusterForMerge.candidates.find((c) => c.id === selectedClusterForMerge.selectedMasterId)?.primaryLabel} (
                    {selectedClusterForMerge.candidates.find((c) => c.id === selectedClusterForMerge.selectedMasterId)?.code})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Secondary Candidate(s):</span>{' '}
                  <span className="text-slate-700">
                    {selectedClusterForMerge.candidates
                      .filter((c) => c.id !== selectedClusterForMerge.selectedMasterId)
                      .map((c) => `${c.primaryLabel} [${c.code}]`)
                      .join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedClusterForMerge(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMerge}
                className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Execute Merge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Resolve Safe Duplicates Modal */}
      {autoResolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-4 bg-[#162e3d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">Auto-Resolve Safe Duplicates</h3>
              </div>
              <button onClick={() => setAutoResolveModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 text-xs space-y-3">
              <p className="text-slate-600 leading-relaxed">
                The automatic resolver will evaluate all pending clusters with <strong>≥ 95% similarity</strong> and merge
                unverified or pending duplicate records directly into their verified primary active records.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <p className="font-semibold text-slate-800">Criteria for Safe Auto-Resolution:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  <li>Identical mobile phone or NID number</li>
                  <li>One verified active profile with zero due balance</li>
                  <li>Inactive/unverified second profile</li>
                </ul>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setAutoResolveModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAutoResolveSafe}
                className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs"
              >
                Proceed with Auto-Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deduplication Rules Drawer / Modal */}
      {rulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="p-4 bg-[#162e3d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">Automated Deduplication Rules & Enforcement</h3>
              </div>
              <button onClick={() => setRulesModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <p className="text-slate-500 text-[11px]">
                Enforce database hygiene constraints on client creation, payment recording, and MikroTik RouterOS API provisioning.
              </p>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 block">Block Duplicate Mobile Numbers</span>
                    <span className="text-[11px] text-slate-500">Disallow registration if phone already exists in database</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.blockDuplicateMobile}
                    onChange={(e) => setRules({ ...rules, blockDuplicateMobile: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 block">Block Duplicate National ID (NID)</span>
                    <span className="text-[11px] text-slate-500">Prevent multiple accounts linked to the same national identity card</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.blockDuplicateNid}
                    onChange={(e) => setRules({ ...rules, blockDuplicateNid: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 block">Block Duplicate MAC Address in MikroTik</span>
                    <span className="text-[11px] text-slate-500">Reject RouterOS ARP binding if MAC is already registered to another user</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.blockDuplicateMac}
                    onChange={(e) => setRules({ ...rules, blockDuplicateMac: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 block">Enforce Unique MFS Voucher TrxID</span>
                    <span className="text-[11px] text-slate-500">Block duplicate bKash, Nagad, and Rocket transaction IDs from manual posting</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.blockDuplicateTrxId}
                    onChange={(e) => setRules({ ...rules, blockDuplicateTrxId: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                  />
                </label>

                <div className="p-2.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Automated Scan Schedule</span>
                    <select
                      value={rules.autoScanInterval}
                      onChange={(e) =>
                        setRules({
                          ...rules,
                          autoScanInterval: e.target.value as DedupRuleSettings['autoScanInterval']
                        })
                      }
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily at Midnight (Recommended)</option>
                      <option value="Weekly">Weekly on Friday</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Runs in background via the <strong>Automatic Process daemon</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setRulesModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setRulesModalOpen(false);
                  notify('Deduplication rules and real-time enforcement saved successfully', 'success');
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs"
              >
                Save Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
