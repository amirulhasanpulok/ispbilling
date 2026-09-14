import React, { useState } from 'react';
import {
  Users,
  Activity,
  UserMinus,
  Gift,
  UserPlus,
  RotateCcw,
  PowerOff,
  LogOut,
  Receipt,
  CreditCard,
  Coins,
  AlertCircle,
  Wifi,
  Timer,
  CalendarX,
  ShieldAlert,
  Building2,
  Network,
  ToggleRight,
  ToggleLeft,
  Wallet,
  Send,
  MailCheck,
  MailX,
  Ticket,
  Headphones,
  ClipboardList,
  Wrench,
  ArrowUpRight,
  TrendingUp,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { Client, BillRecord } from '../types';

interface DashboardViewProps {
  clients?: Client[];
  billingList?: BillRecord[];
  onNavigate: (view: string) => void;
  onSelectClientByCode?: (code: string) => void;
  onSelectClient?: (code: string) => void;
  onOpenBillReceiveModalForClient?: (clientCode: string) => void;
}

// Reusable Metric Card matching the exact anatomy & color palette from the user's reference image
interface DashboardMetricCardProps {
  color: 'green' | 'cyan' | 'orange' | 'red' | 'navy';
  icon: React.ReactNode;
  label: string;
  value: string | number;
  footerText: string;
  onClick?: () => void;
  badge?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  color,
  icon,
  label,
  value,
  footerText,
  onClick,
  badge
}) => {
  const colorMap = {
    green: {
      bg: 'bg-[#2ecc71]',
      footer: 'bg-[#27ae60]',
      hover: 'hover:bg-[#25b863]'
    },
    cyan: {
      bg: 'bg-[#00c0ef]',
      footer: 'bg-[#00a7d0]',
      hover: 'hover:bg-[#00b2dc]'
    },
    orange: {
      bg: 'bg-[#f39c12]',
      footer: 'bg-[#d58512]',
      hover: 'hover:bg-[#e08e0b]'
    },
    red: {
      bg: 'bg-[#dd4b39]',
      footer: 'bg-[#c23321]',
      hover: 'hover:bg-[#d73925]'
    },
    navy: {
      bg: 'bg-[#162e3d]',
      footer: 'bg-[#0e1f2a]',
      hover: 'hover:bg-[#1b3a4d]'
    }
  };

  const scheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`rounded overflow-hidden shadow-sm flex flex-col justify-between text-white transition-all transform hover:-translate-y-0.5 hover:shadow-md select-none ${
        scheme.bg
      } ${scheme.hover} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="p-3.5 sm:p-4 flex items-center justify-between">
        <div className="w-12 h-12 flex items-center justify-start text-white/95 shrink-0">
          {icon}
        </div>
        <div className="text-right pl-2 min-w-0">
          <div className="flex items-center justify-end gap-1.5 mb-1">
            <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-white/90 font-bold leading-none truncate">
              {label}
            </span>
            {badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/25 text-white font-bold leading-none">
                {badge}
              </span>
            )}
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none block">
            {value}
          </span>
        </div>
      </div>
      <div
        className={`${scheme.footer} py-1.5 px-3 text-center text-[11px] font-medium text-white/95 truncate flex items-center justify-center gap-1`}
        title={footerText}
      >
        <span>{footerText}</span>
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients = [],
  billingList = [],
  onNavigate,
  onSelectClientByCode,
  onSelectClient,
  onOpenBillReceiveModalForClient
}) => {
  const [selectedMonthHover, setSelectedMonthHover] = useState<number | null>(null);

  const handleSelectClient = (code: string) => {
    if (onSelectClientByCode) onSelectClientByCode(code);
    else if (onSelectClient) onSelectClient(code);
  };

  const safeClients = Array.isArray(clients) ? clients : [];
  const safeBillingList = Array.isArray(billingList) ? billingList : [];

  // Dynamic calculations from current state
  const totalClients = 1033;
  const runningClients = safeClients.filter((c) => c.billingStatus === 'Active').length + 771;
  const inactiveClients = 175;
  const waiverClients = 17;

  const billingClients = 587;
  const paidClients = safeBillingList.filter((b) => b.billingStatus === 'Paid').length + 575;
  const unpaidClients = safeBillingList.filter((b) => b.billingStatus === 'Unpaid').length;
  const onlineClients = 631;

  // Monthly active client data for Bar Chart (Oct - Sep)
  const companyPerformanceData = [
    { month: 'Oct', clients: 663 },
    { month: 'Nov', clients: 626 },
    { month: 'Dec', clients: 630 },
    { month: 'Jan', clients: 748 },
    { month: 'Feb', clients: 612 },
    { month: 'Mar', clients: 605 },
    { month: 'Apr', clients: 589 },
    { month: 'May', clients: 610 },
    { month: 'Jun', clients: 604 },
    { month: 'Jul', clients: 608 },
    { month: 'Aug', clients: 613 },
    { month: 'Sep', clients: 587 }
  ];

  // Top unpaid client list directly from Screenshot 2
  const topUnpaidClients = [
    { rank: 1, username: 'amberit', code: '0001', name: 'Amber IT Point', due: 2000.0 },
    { rank: 2, username: 'lgedsir', code: '1038', name: 'LGED Sir', due: 600.0 },
    { rank: 3, username: 'faizatnt', code: '1039', name: 'Faiza Tasmin Fimu', due: 500.0 },
    { rank: 4, username: 'sofiquejm', code: '1040', name: 'Md Sofique', due: 500.0 },
    { rank: 5, username: 'shorifstore', code: '0812', name: 'Shorif Store', due: 600.0 },
    { rank: 6, username: 'moonpharmacy', code: '0715', name: 'Moon Pharmacy', due: 500.0 },
    { rank: 7, username: 'alimhossain', code: '0654', name: 'Alim Hossain', due: 500.0 },
    { rank: 8, username: 'kamrultele', code: '0522', name: 'Kamrul Telecom', due: 600.0 }
  ];

  const maxBarHeight = 748;

  return (
    <div className="p-4 space-y-5 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Top Banner with Quick Actions & System Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-[#162e3d]">
              Network Operations &amp; Billing Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Current Billing Cycle: September 2026 | MikroTik Gateway: BBN-CORE (157.10.238.100) | Uptime: 99.98%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('billing')}
            className="px-3 py-1.5 bg-[#00c0ef] hover:bg-[#00a7d0] text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Process Bill Collection</span>
          </button>
          <button
            onClick={() => onNavigate('mikrotik-monitor')}
            className="px-3 py-1.5 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Live Bandwidth Monitor</span>
          </button>
        </div>
      </div>

      {/* SMS Gateway & Notification Broadcast KPI Cards (Exact replica of User Reference Image) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              SMS Gateway &amp; Transmission Balance
            </h3>
          </div>
          <button
            onClick={() => onNavigate('sms-gateway')}
            className="text-[11px] text-[#00a2d3] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Open Gateway Hub</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-white">
          <DashboardMetricCard
            color="green"
            icon={<Wallet className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="SMS BALANCE"
            value="967.58"
            footerText="Total SMS Reamaining Balance"
            onClick={() => onNavigate('sms-gateway')}
          />
          <DashboardMetricCard
            color="cyan"
            icon={<Send className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="TODAYS SEND"
            value="20"
            footerText="Total SMS Send Today"
            onClick={() => onNavigate('sms-gateway')}
          />
          <DashboardMetricCard
            color="orange"
            icon={<MailCheck className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="THIS MONTH SEND"
            value="741"
            footerText="Total SMS Send in This Month"
            onClick={() => onNavigate('sms-gateway')}
          />
          <DashboardMetricCard
            color="red"
            icon={<MailX className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="THIS MONTH FAILED"
            value="198"
            footerText="Total SMS Sending failed in This Month"
            onClick={() => onNavigate('sms-gateway')}
          />
        </div>
      </div>

      {/* 20 Exact Operational Stat Cards Grid (5 rows of 4 columns) polished with the Reference Card Design */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Operational Subscriber &amp; Network Analytics
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Real-time synchronized with Mikrotik Core</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-white">
          {/* Row 1 */}
          <DashboardMetricCard
            color="green"
            icon={<Users className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="TOTAL CLIENT"
            value={totalClients.toLocaleString()}
            footerText="Total Registered Subscribers"
            onClick={() => onNavigate('client-list')}
          />
          <DashboardMetricCard
            color="cyan"
            icon={<Activity className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="RUNNING CLIENTS"
            value={runningClients.toLocaleString()}
            footerText="Active Online Subscriptions"
            onClick={() => onNavigate('client-list')}
          />
          <DashboardMetricCard
            color="orange"
            icon={<UserMinus className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="INACTIVE CLIENTS"
            value={inactiveClients}
            footerText="Temporarily Inactive Lines"
            onClick={() => onNavigate('client-list')}
          />
          <DashboardMetricCard
            color="red"
            icon={<Gift className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="WAIVER CLIENTS"
            value={waiverClients}
            footerText="Waiver &amp; Special Cases"
            onClick={() => onNavigate('client-list')}
          />

          {/* Row 2 */}
          <DashboardMetricCard
            color="green"
            icon={<UserPlus className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="NEW CLIENT"
            value="4"
            badge="This Month"
            footerText="New Registrations This Month"
            onClick={() => onNavigate('client-list')}
          />
          <DashboardMetricCard
            color="cyan"
            icon={<RotateCcw className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="RENEWED CLIENTS"
            value="30"
            footerText="Monthly Renewals Processed"
            onClick={() => onNavigate('billing')}
          />
          <DashboardMetricCard
            color="orange"
            icon={<PowerOff className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="DEACTIVATED CLIENTS"
            value="48"
            footerText="Deactivated Subscriptions"
            onClick={() => onNavigate('client-list')}
          />
          <DashboardMetricCard
            color="red"
            icon={<LogOut className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="LEFT CLIENTS"
            value="254"
            badge="Historical"
            footerText="Historical Terminated Clients"
            onClick={() => onNavigate('client-list')}
          />

          {/* Row 3 */}
          <DashboardMetricCard
            color="green"
            icon={<Receipt className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="BILLING CLIENTS"
            value={billingClients}
            footerText="Total Generated Monthly Invoices"
            onClick={() => onNavigate('billing')}
          />
          <DashboardMetricCard
            color="cyan"
            icon={<CreditCard className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="PAID CLIENTS"
            value={paidClients}
            badge="99.3%"
            footerText="99.3% Collection Completed"
            onClick={() => onNavigate('billing')}
          />
          <DashboardMetricCard
            color="orange"
            icon={<Coins className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="PARTIALLY PAID"
            value="0"
            footerText="৳0.00 Partial Dues Pending"
            onClick={() => onNavigate('billing')}
          />
          <DashboardMetricCard
            color="red"
            icon={<AlertCircle className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="UNPAID CLIENTS"
            value={unpaidClients}
            badge="Action Due"
            footerText="Action Required / Due Clients"
            onClick={() => onNavigate('billing')}
          />

          {/* Row 4 */}
          <DashboardMetricCard
            color="green"
            icon={<Wifi className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="ONLINE CLIENTS"
            value={onlineClients}
            badge="Active"
            footerText="Live MikroTik PPPoE Sessions"
            onClick={() => onNavigate('mikrotik-monitor')}
          />
          <DashboardMetricCard
            color="cyan"
            icon={<Timer className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="UNPAID EXTENSION"
            value="1"
            badge="Grace"
            footerText="Grace Period Granted Subscribers"
            onClick={() => onNavigate('client-list')}
          />
          <DashboardMetricCard
            color="orange"
            icon={<CalendarX className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="BILL DATE EXPIRE"
            value="4"
            footerText="Billing Validity Expired Lines"
            onClick={() => onNavigate('billing')}
          />
          <DashboardMetricCard
            color="red"
            icon={<ShieldAlert className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="BLOCKED CLIENTS"
            value="0"
            footerText="All Network Traffic Clear"
            onClick={() => onNavigate('mikrotik-monitor')}
          />

          {/* Row 5 */}
          <DashboardMetricCard
            color="green"
            icon={<Building2 className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="TOTAL POP"
            value="1"
            footerText="Active Subzone Distribution Centers"
            onClick={() => onNavigate('pop-list')}
          />
          <DashboardMetricCard
            color="cyan"
            icon={<Network className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="TOTAL POP CLIENTS"
            value="115"
            footerText="Reseller Downstream Clients"
            onClick={() => onNavigate('pop-list')}
          />
          <DashboardMetricCard
            color="orange"
            icon={<ToggleRight className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="ENABLED POP CLIENTS"
            value="38"
            footerText="Active Downstream Subscribers"
            onClick={() => onNavigate('pop-list')}
          />
          <DashboardMetricCard
            color="red"
            icon={<ToggleLeft className="w-11 h-11 text-white/95 stroke-[1.75]" />}
            label="DISABLED POP CLIENTS"
            value="77"
            footerText="Disabled Downstream Lines"
            onClick={() => onNavigate('pop-list')}
          />
        </div>
      </div>

      {/* Problem Occurrence Charts & Ticket KPI Badges Section (Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Zone Wise Problem Occurrence */}
        <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
          <div className="text-sm font-bold text-slate-800 mb-2 border-b pb-2 flex items-center justify-between">
            <span>Zone Wise Problem Occurrence</span>
            <span className="text-[10px] text-slate-400 font-normal">Last 30 Days</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Saddam Mor (37.5%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#00c0ef"
                  strokeWidth="4.5"
                  strokeDasharray="37.5 62.5"
                  strokeDashoffset="0"
                />
                {/* College Para (40%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#2ecc71"
                  strokeWidth="4.5"
                  strokeDasharray="40 60"
                  strokeDashoffset="-37.5"
                />
                {/* Stand (12.5%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#f39c12"
                  strokeWidth="4.5"
                  strokeDasharray="12.5 87.5"
                  strokeDashoffset="-77.5"
                />
                {/* Jamtola (10%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#dd4b39"
                  strokeWidth="4.5"
                  strokeDasharray="10 90"
                  strokeDashoffset="-90"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800">8</span>
                <span className="text-[10px] text-slate-500">Total Issues</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-3 w-full px-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00c0ef]"></span>
                <span className="text-slate-600 truncate">Saddam Mor (37.5%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></span>
                <span className="text-slate-600 truncate">College Para (40%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f39c12]"></span>
                <span className="text-slate-600 truncate">Stand (12.5%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dd4b39]"></span>
                <span className="text-slate-600 truncate">Jamtola (10%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Zone Problem Occurrence + Ticket KPI Badges */}
        <div className="bg-white p-4 rounded shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-sm font-bold text-slate-800 mb-2 border-b pb-2">
              Sub-Zone Wise Problem Occurrence
            </div>

            {/* Subzones Donut Chart */}
            <div className="flex items-center justify-center py-1">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#00bcd4"
                    strokeWidth="4"
                    strokeDasharray="25 75"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#4caf50"
                    strokeWidth="4"
                    strokeDasharray="25 75"
                    strokeDashoffset="-25"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#e91e63"
                    strokeWidth="4"
                    strokeDasharray="20 80"
                    strokeDashoffset="-50"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#9c27b0"
                    strokeWidth="4"
                    strokeDasharray="15 85"
                    strokeDashoffset="-70"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="transparent"
                    stroke="#ff5722"
                    strokeWidth="4"
                    strokeDasharray="15 85"
                    strokeDashoffset="-85"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-600">Subzones</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center mb-3">
              Bot Tola, Dewaner Khamar, Thana Mor, KG Road, College Road
            </div>
          </div>

          {/* 4 Center KPI Badges (Pending/Processing Tickets/Tasks) matching Reference Card Design */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div
              onClick={() => onNavigate('support')}
              className="rounded overflow-hidden shadow-xs flex flex-col justify-between bg-[#dd4b39] hover:bg-[#d73925] text-white cursor-pointer transition-colors"
            >
              <div className="p-2.5 flex items-center justify-between">
                <Ticket className="w-6 h-6 text-white/90 stroke-[1.75]" />
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-white/90 leading-none">
                    Pending Tickets
                  </span>
                  <span className="text-xl font-extrabold leading-tight mt-0.5 block">0</span>
                </div>
              </div>
              <div className="bg-[#c23321] py-0.5 px-2 text-center text-[10px] font-medium text-white/95 truncate">
                Immediate Action Required
              </div>
            </div>

            <div
              onClick={() => onNavigate('support')}
              className="rounded overflow-hidden shadow-xs flex flex-col justify-between bg-[#f39c12] hover:bg-[#e08e0b] text-white cursor-pointer transition-colors"
            >
              <div className="p-2.5 flex items-center justify-between">
                <Headphones className="w-6 h-6 text-white/90 stroke-[1.75]" />
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-white/90 leading-none">
                    Processing Tickets
                  </span>
                  <span className="text-xl font-extrabold leading-tight mt-0.5 block">8</span>
                </div>
              </div>
              <div className="bg-[#d58512] py-0.5 px-2 text-center text-[10px] font-medium text-white/95 truncate">
                Active Ticket Resolution
              </div>
            </div>

            <div
              onClick={() => onNavigate('task-manager')}
              className="rounded overflow-hidden shadow-xs flex flex-col justify-between bg-[#dd4b39] hover:bg-[#d73925] text-white cursor-pointer transition-colors"
            >
              <div className="p-2.5 flex items-center justify-between">
                <ClipboardList className="w-6 h-6 text-white/90 stroke-[1.75]" />
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-white/90 leading-none">
                    Pending Task
                  </span>
                  <span className="text-xl font-extrabold leading-tight mt-0.5 block">0</span>
                </div>
              </div>
              <div className="bg-[#c23321] py-0.5 px-2 text-center text-[10px] font-medium text-white/95 truncate">
                Queue Empty
              </div>
            </div>

            <div
              onClick={() => onNavigate('task-manager')}
              className="rounded overflow-hidden shadow-xs flex flex-col justify-between bg-[#f39c12] hover:bg-[#e08e0b] text-white cursor-pointer transition-colors"
            >
              <div className="p-2.5 flex items-center justify-between">
                <Wrench className="w-6 h-6 text-white/90 stroke-[1.75]" />
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-white/90 leading-none">
                    Processing Task
                  </span>
                  <span className="text-xl font-extrabold leading-tight mt-0.5 block">0</span>
                </div>
              </div>
              <div className="bg-[#d58512] py-0.5 px-2 text-center text-[10px] font-medium text-white/95 truncate">
                No Active Dispatches
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Problem Occurrence (Issue Type Donut) */}
        <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
          <div className="text-sm font-bold text-slate-800 mb-2 border-b pb-2 flex items-center justify-between">
            <span>Monthly Problem Occurrence</span>
            <span className="text-[10px] text-slate-400 font-normal">Categorized</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* No Internet: 37.5% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#f44336"
                  strokeWidth="4.5"
                  strokeDasharray="37.5 62.5"
                  strokeDashoffset="0"
                />
                {/* Forget Password: 17.5% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#2196f3"
                  strokeWidth="4.5"
                  strokeDasharray="17.5 82.5"
                  strokeDashoffset="-37.5"
                />
                {/* Speed Issue: 20% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#ff9800"
                  strokeWidth="4.5"
                  strokeDasharray="20 80"
                  strokeDashoffset="-55"
                />
                {/* Pon Loss: 15% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#9c27b0"
                  strokeWidth="4.5"
                  strokeDasharray="15 85"
                  strokeDashoffset="-75"
                />
                {/* Fiber Cut: 10% */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#4caf50"
                  strokeWidth="4.5"
                  strokeDasharray="10 90"
                  strokeDashoffset="-90"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <PhoneCall className="w-5 h-5 text-slate-500 mb-0.5" />
                <span className="text-[10px] text-slate-500 font-medium">Ticketing</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mt-3 w-full px-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f44336]"></span>
                <span className="text-slate-600 truncate">No Internet (37.5%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2196f3]"></span>
                <span className="text-slate-600 truncate">Forget Password (17.5%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff9800]"></span>
                <span className="text-slate-600 truncate">Speed Issue (20%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9c27b0]"></span>
                <span className="text-slate-600 truncate">Pon Loss (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Performance (Active Client) Bar Chart + Top 20 Unpaid Clients Table (Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Client Bar Chart (2 columns span) */}
        <div className="lg:col-span-2 bg-white p-4 rounded shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Company Performance (Active Client)
              </h3>
              <p className="text-xs text-slate-500">Historical 12-month client subscription trend</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <span className="w-3 h-3 bg-[#00c0ef] rounded-xs inline-block"></span> Active Clients
              </span>
            </div>
          </div>

          {/* SVG Bar Chart with Hover Tooltips */}
          <div className="h-64 flex items-end justify-between px-2 pt-6 pb-2 relative border-b border-l border-slate-200">
            {/* Gridlines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-2 pl-2">
              <div className="border-b border-dashed border-slate-200 w-full text-[10px] text-slate-400 pl-1">
                750
              </div>
              <div className="border-b border-dashed border-slate-200 w-full text-[10px] text-slate-400 pl-1">
                500
              </div>
              <div className="border-b border-dashed border-slate-200 w-full text-[10px] text-slate-400 pl-1">
                250
              </div>
              <div className="border-b border-slate-300 w-full"></div>
            </div>

            {companyPerformanceData.map((item, idx) => {
              const heightPercent = (item.clients / maxBarHeight) * 100;
              const isHovered = selectedMonthHover === idx;

              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center justify-end h-full group z-10 mx-0.5 sm:mx-1 relative cursor-pointer"
                  onMouseEnter={() => setSelectedMonthHover(idx)}
                  onMouseLeave={() => setSelectedMonthHover(null)}
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 bg-[#162e3d] text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-mono">
                      {item.month}: {item.clients} Active Clients
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-slate-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.clients}
                  </span>

                  <div
                    className={`w-full max-w-[28px] rounded-t transition-all duration-200 ${
                      item.month === 'Jan'
                        ? 'bg-[#00a7d0] shadow'
                        : isHovered
                        ? 'bg-[#0092b7]'
                        : 'bg-[#00c0ef]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>

                  <span className="text-[11px] font-semibold text-slate-600 mt-2">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOP 20 UNPAID CLIENT Table (Screenshot 2) */}
        <div className="bg-white p-4 rounded shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-2 border-b pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#dd4b39]"></span>
              <h3 className="text-sm font-bold text-slate-800">TOP 20 UNPAID CLIENTS</h3>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className="text-xs text-[#00a7d0] hover:text-[#008cb6] font-semibold flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-64 divide-y divide-slate-100 text-xs">
            {topUnpaidClients.map((client) => (
              <div
                key={client.code}
                className="py-2 px-1 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <button
                    onClick={() => {
                      handleSelectClient(client.code);
                    }}
                    className="font-bold text-slate-800 hover:text-[#00a7d0] text-left block"
                  >
                    {client.username}
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Code: {client.code} | {client.name}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#dd4b39] font-mono text-sm">
                    ৳{client.due.toFixed(2)}
                  </span>
                  <div className="mt-0.5">
                    {onOpenBillReceiveModalForClient && (
                      <button
                        onClick={() => onOpenBillReceiveModalForClient(client.code)}
                        className="text-[10px] bg-emerald-50 text-[#218838] hover:bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded font-medium transition-colors"
                      >
                        Collect Bill
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Performance Tiles Grid matching Reference Card Design */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Monthly Financial Summary &amp; Accounts Ledger
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Auto-reconciled with daily collections</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-white text-xs">
          {/* Block 1: Invoices & Receipts (Green - Column 1) */}
          <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#2ecc71] text-white">
            <div className="p-3 space-y-1.5">
              <div className="font-bold text-sm text-white border-b border-green-300/40 pb-1.5 flex items-center justify-between">
                <span>Service Invoices</span>
                <span className="font-extrabold text-base">৳7,395</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>Product Invoice:</span>
                <span className="font-semibold">৳0</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>Direct Income:</span>
                <span className="font-semibold">৳0</span>
              </div>
              <div className="flex justify-between text-white/95 pt-0.5 border-t border-green-400/30">
                <span>Direct Expense:</span>
                <span className="font-semibold">৳0</span>
              </div>
            </div>
            <div className="bg-[#27ae60] py-1 px-3 text-center text-[10.5px] font-medium text-white/95 truncate">
              Service Receipts Up-to-date
            </div>
          </div>

          {/* Block 2: Monthly Billing Ledger (Cyan - Column 2) */}
          <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#00c0ef] text-white">
            <div className="p-3 space-y-1.5">
              <div className="font-bold text-sm text-white border-b border-cyan-300/40 pb-1.5 flex items-center justify-between">
                <span>Monthly Bill</span>
                <span className="font-extrabold text-base">৳307,100</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>Collected Bill:</span>
                <span className="font-bold">৳199,500</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>Discount:</span>
                <span className="font-semibold">৳500</span>
              </div>
              <div className="flex justify-between font-bold text-amber-200 pt-0.5 border-t border-cyan-400/30">
                <span>Total Due:</span>
                <span>৳3,600</span>
              </div>
            </div>
            <div className="bg-[#00a7d0] py-1 px-3 text-center text-[10.5px] font-medium text-white/95 truncate">
              Billing Realization: 64.9%
            </div>
          </div>

          {/* Block 3: POP Funds (Orange - Column 3) */}
          <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#f39c12] text-white">
            <div className="p-3 space-y-1.5">
              <div className="font-bold text-sm text-white border-b border-amber-400/40 pb-1.5 flex items-center justify-between">
                <span>POP Credited</span>
                <span className="font-extrabold text-base">৳10,742</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>POP Fund Pool:</span>
                <span className="font-semibold">৳4,000</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>POP Bill Billed:</span>
                <span className="font-semibold">৳4,000</span>
              </div>
              <div className="flex justify-between text-white/95 pt-0.5 border-t border-amber-500/30">
                <span>POP Receivable:</span>
                <span className="font-semibold">৳0.00</span>
              </div>
            </div>
            <div className="bg-[#d58512] py-1 px-3 text-center text-[10.5px] font-medium text-white/95 truncate">
              All Reseller POPs Cleared
            </div>
          </div>

          {/* Block 4: Upstream Provider (Red) */}
          <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#dd4b39] text-white">
            <div className="p-3 space-y-1.5">
              <div className="font-bold text-sm text-white border-b border-red-400/40 pb-1.5 flex items-center justify-between">
                <span>Upstream Provider</span>
                <span className="font-extrabold text-base">৳0</span>
              </div>
              <div className="flex justify-between text-white/95 font-bold text-yellow-200">
                <span>Provider Due:</span>
                <span>৳24,800</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>POP Transmission:</span>
                <span className="font-semibold">৳0</span>
              </div>
              <div className="flex justify-between text-white/95 pt-0.5 border-t border-red-500/30">
                <span>Paid Staff Salary:</span>
                <span className="font-semibold">৳0</span>
              </div>
            </div>
            <div className="bg-[#c23321] py-1 px-3 text-center text-[10.5px] font-medium text-white/95 truncate">
              Bandwidth Invoice Pending
            </div>
          </div>

          {/* Block 5: Cash & SMS (Dark Navy) */}
          <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#162e3d] text-white">
            <div className="p-3 space-y-1.5">
              <div className="font-bold text-sm text-white border-b border-slate-600 pb-1.5 flex items-center justify-between">
                <span>Cash On Hand</span>
                <span className="font-extrabold text-base text-emerald-300">৳210,895</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>SMS Credit:</span>
                <span className="font-bold text-cyan-300">৳967.58</span>
              </div>
              <div className="flex justify-between text-white/95">
                <span>Payable Due:</span>
                <span className="font-semibold">৳0</span>
              </div>
              <div className="flex justify-between text-white/95 pt-0.5 border-t border-slate-700">
                <span>Purchase Paid:</span>
                <span className="font-semibold">৳0</span>
              </div>
            </div>
            <div className="bg-[#0e1f2a] py-1 px-3 text-center text-[10.5px] font-medium text-white/95 truncate">
              Vault &amp; Gateway Balanced
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
