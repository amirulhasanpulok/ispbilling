import React, { useState } from 'react';
import {
  Mail,
  CheckSquare,
  Hourglass,
  XCircle,
  MessageSquare,
  User,
  Key,
  Edit2,
  CheckCircle2,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  Radio,
  FileText,
  AlertCircle
} from 'lucide-react';
import { SmsGatewayConfig } from '../types';

interface SmsGatewayViewProps {
  embedded?: boolean;
  onShowToast?: (message: string) => void;
}

const INITIAL_GATEWAY_CONFIG: SmsGatewayConfig = {
  provider: 'Khudebarta (v2.0)',
  senderId: 'BBN_bhurungamari',
  username: 'd1b4ba3d0db7d4a0',
  password: '••••••••',
  smsBalance: 967.58,
  todaysSend: 20,
  thisMonthSend: 741,
  thisMonthFailed: 198,
  apiEndpoint: 'https://api.khudebarta.com/v2/sms/send',
  isConnected: true
};

interface SmsLogItem {
  id: string;
  recipient: string;
  recipientName: string;
  message: string;
  type: 'Billing' | 'Welcome' | 'OTP' | 'Alert';
  status: 'Delivered' | 'Failed' | 'Sent';
  time: string;
}

const INITIAL_RECENT_LOGS: SmsLogItem[] = [
  {
    id: 'sms-1',
    recipient: '01710287818',
    recipientName: 'Younus Ali (0006)',
    message: 'Dear Younus Ali, your BBN internet bill ৳500 for Sep 2026 is due. Pay online to avoid disconnection.',
    type: 'Billing',
    status: 'Delivered',
    time: 'Today 09:15 AM'
  },
  {
    id: 'sms-2',
    recipient: '01723456789',
    recipientName: 'Rahim Uddin (0012)',
    message: 'Payment received! ৳800 received for account 0012. Thank you for choosing BBN Broadband.',
    type: 'Billing',
    status: 'Delivered',
    time: 'Today 10:42 AM'
  },
  {
    id: 'sms-3',
    recipient: '01798765432',
    recipientName: 'Mizanur Rahman (0045)',
    message: 'Welcome to Bhurungamari Broadband! Your PPPoE username: mizan45. Hotline: 01711-000000',
    type: 'Welcome',
    status: 'Delivered',
    time: 'Today 11:20 AM'
  },
  {
    id: 'sms-4',
    recipient: '01855667788',
    recipientName: 'Jahangir Alam (0088)',
    message: 'Dear Client, emergency optical fiber maintenance in Bot Tola zone from 2:00PM to 3:00PM.',
    type: 'Alert',
    status: 'Failed',
    time: 'Today 01:10 PM'
  }
];

export const SmsGatewayView: React.FC<SmsGatewayViewProps> = ({ embedded = false, onShowToast }) => {
  const [config, setConfig] = useState<SmsGatewayConfig>(INITIAL_GATEWAY_CONFIG);
  const [showPassword, setShowPassword] = useState(false);
  const [actualPassword, setActualPassword] = useState('bbn_khude_secret_2026');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testMobile, setTestMobile] = useState('01710287818');
  const [testMessage, setTestMessage] = useState('BBN Gateway Test: Connection with Khudebarta v2.0 is successful.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [recentLogs, setRecentLogs] = useState<SmsLogItem[]>(INITIAL_RECENT_LOGS);
  const [showLogsTable, setShowLogsTable] = useState(false);

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  const handleUpdateInformation = (e: React.FormEvent) => {
    e.preventDefault();
    notify('Company SMS Gateway settings updated successfully!');
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMobile.trim()) {
      notify('Please enter a recipient mobile number.');
      return;
    }

    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setIsTestModalOpen(false);

      // Decrement balance and increment today's count
      setConfig((prev) => ({
        ...prev,
        smsBalance: +(prev.smsBalance - 0.35).toFixed(2),
        todaysSend: prev.todaysSend + 1,
        thisMonthSend: prev.thisMonthSend + 1
      }));

      // Add to logs
      const newLog: SmsLogItem = {
        id: `sms-${Date.now()}`,
        recipient: testMobile,
        recipientName: 'Test Recipient',
        message: testMessage,
        type: 'Alert',
        status: 'Delivered',
        time: 'Just now'
      };
      setRecentLogs((prev) => [newLog, ...prev]);

      notify(`Test SMS sent successfully to ${testMobile}! (Charge: ৳0.35)`);
    }, 1000);
  };

  return (
    <div className={embedded ? "space-y-4" : "p-4 md:p-6 bg-[#f4f7f9] min-h-[calc(100vh-3.5rem)] text-slate-800"}>
      {/* Top Header & Breadcrumb (shown only in standalone view) */}
      {!embedded && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded flex items-center justify-center text-slate-700">
              <MessageSquare className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">SMS Service</h2>
              <span className="text-xs text-slate-500 font-normal">SMS Gateway Setup</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1 text-slate-500 font-medium">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>SMS Service</span>
              <span className="text-slate-400">&gt;</span>
              <span className="text-slate-700 font-semibold">SMS Gateway Setup</span>
            </div>

            <button
              title="Refresh Gateway"
              onClick={() => notify('SMS Gateway balance & connection refreshed')}
              className="w-7 h-7 rounded-full bg-[#162e3d] hover:bg-[#1b3a4b] text-white flex items-center justify-center shadow-xs transition-colors ml-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4 Stat Metric Cards (Exact match to screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Card 1: SMS Balance (Green) */}
        <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#388e3c] text-white">
          <div className="p-4 flex items-center justify-between">
            <Mail className="w-12 h-12 text-white/90 stroke-[1.75]" />
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-white/90 font-medium">
                SMS Balance
              </span>
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                {config.smsBalance.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="bg-[#2e7d32] py-1 px-3 text-center text-[11px] font-medium text-white/95">
            Total SMS Reamaining Balance
          </div>
        </div>

        {/* Card 2: Todays Send (Cyan) */}
        <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#00c0ef] text-white">
          <div className="p-4 flex items-center justify-between">
            <CheckSquare className="w-12 h-12 text-white/90 stroke-[1.75]" />
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-white/90 font-medium">
                Todays Send
              </span>
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                {config.todaysSend}
              </span>
            </div>
          </div>
          <div className="bg-[#00a7d0] py-1 px-3 text-center text-[11px] font-medium text-white/95">
            Total SMS Send Today
          </div>
        </div>

        {/* Card 3: This Month Send (Orange) */}
        <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#f39c12] text-white">
          <div className="p-4 flex items-center justify-between">
            <Hourglass className="w-12 h-12 text-white/90 stroke-[1.75]" />
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-white/90 font-medium">
                This Month Send
              </span>
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                {config.thisMonthSend}
              </span>
            </div>
          </div>
          <div className="bg-[#d58512] py-1 px-3 text-center text-[11px] font-medium text-white/95">
            Total SMS Send in This Month
          </div>
        </div>

        {/* Card 4: This Month Failed (Red) */}
        <div className="rounded overflow-hidden shadow-sm flex flex-col justify-between bg-[#dd4b39] text-white">
          <div className="p-4 flex items-center justify-between">
            <XCircle className="w-12 h-12 text-white/90 stroke-[1.75]" />
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-white/90 font-medium">
                This Month Failed
              </span>
              <span className="text-2xl md:text-3xl font-bold tracking-tight">
                {config.thisMonthFailed}
              </span>
            </div>
          </div>
          <div className="bg-[#c23321] py-1 px-3 text-center text-[11px] font-medium text-white/95">
            Total SMS Sending failed in This Month
          </div>
        </div>
      </div>

      {/* Main Settings Card: SMS Settings */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Card Navy Header */}
        <div className="bg-[#1b3a4b] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-xs tracking-wide">SMS Settings</h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Connected
            </span>
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="text-[11px] bg-cyan-600 hover:bg-cyan-700 text-white px-2.5 py-0.5 rounded font-medium shadow-xs transition-colors flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Test SMS</span>
            </button>
          </div>
        </div>

        {/* Card Body / Form */}
        <form onSubmit={handleUpdateInformation} className="p-5 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Field 1: Sms Provider */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sms Provider
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <select
                    id="sms-provider-select"
                    value={config.provider}
                    onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                    className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer"
                  >
                    <option value="Khudebarta (v2.0)">Khudebarta (v2.0)</option>
                    <option value="BulkSMSBD">BulkSMSBD</option>
                    <option value="Greenweb Bangladesh">Greenweb Bangladesh</option>
                    <option value="Teletalk SMS Gateway">Teletalk SMS Gateway</option>
                    <option value="Banglalink Enterprise">Banglalink Enterprise</option>
                    <option value="Grameenphone Bullseye">Grameenphone Bullseye</option>
                    <option value="Custom HTTP/REST API">Custom HTTP/REST API</option>
                  </select>
                </div>
              </div>

              {/* Field 2: SMS Sender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  SMS Sender
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <Edit2 className="w-4 h-4" />
                  </span>
                  <input
                    id="sms-sender-input"
                    type="text"
                    value={config.senderId}
                    onChange={(e) => setConfig({ ...config, senderId: e.target.value })}
                    placeholder="e.g. BBN_bhurungamari"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Field 3: SMS User Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  SMS User Name
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="sms-username-input"
                    type="text"
                    value={config.username}
                    onChange={(e) => setConfig({ ...config, username: e.target.value })}
                    placeholder="Enter SMS API username"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Field 4: SMS Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  SMS Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    id="sms-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={showPassword ? actualPassword : '••••••••'}
                    onChange={(e) => setActualPassword(e.target.value)}
                    placeholder="Enter SMS API secret / password"
                    className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Button (Update Company Information) */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowLogsTable(!showLogsTable)}
              className="text-xs text-cyan-700 hover:text-cyan-900 font-medium flex items-center gap-1.5 hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showLogsTable ? 'Hide Delivery Log' : 'View Recent Delivery Log (20 Today)'}</span>
            </button>

            <button
              id="btn-update-company-info"
              type="submit"
              className="bg-[#1b3a4b] hover:bg-[#162e3d] text-white text-xs font-semibold px-4 py-2 rounded shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Update Company Information</span>
            </button>
          </div>
        </form>
      </div>

      {/* Expandable Recent Delivery Log Table */}
      {showLogsTable && (
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden mb-6 animate-in fade-in duration-150">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Recent SMS Delivery Stream
            </span>
            <span className="text-[11px] text-slate-500">Live Gateway Queue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Recipient</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Message Content</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 text-[11px] whitespace-nowrap text-slate-500">
                      {log.time}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{log.recipient}</div>
                      <div className="text-[10px] text-slate-400">{log.recipientName}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {log.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-md truncate">
                      {log.message}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'Failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Test SMS Gateway */}
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-[#1b3a4b] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-xs tracking-wide">Test SMS Gateway Delivery</h3>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="text-slate-300 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestSms} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="017xxxxxxxx"
                  value={testMobile}
                  onChange={(e) => setTestMobile(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Test SMS Body
                </label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 resize-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Characters: {testMessage.length}</span>
                  <span>1 SMS Part (Standard GSM 3.38)</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Sending a test SMS uses live Khudebarta v2.0 API and will deduct approximately ৳0.35 from your SMS balance.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-1.5 bg-[#1b3a4b] hover:bg-[#162e3d] text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
