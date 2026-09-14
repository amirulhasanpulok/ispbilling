import React, { useState } from 'react';
import {
  Cog,
  MessageSquare,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Edit2,
  RefreshCw,
  Power
} from 'lucide-react';
import { AutomatedProcessItem, SmsTemplateItem } from '../types';

interface AutomatedSettingsViewProps {
  automatedProcesses: AutomatedProcessItem[];
  smsTemplates: SmsTemplateItem[];
  onToggleProcess: (id: string) => void;
  onRunProcessManually: (id: string) => void;
  onSaveSmsTemplate: (id: string, text: string) => void;
  initialTab?: 'automation' | 'sms' | 'individual' | 'group';
}

export const AutomatedSettingsView: React.FC<AutomatedSettingsViewProps> = ({
  automatedProcesses,
  smsTemplates,
  onToggleProcess,
  onRunProcessManually,
  onSaveSmsTemplate,
  initialTab = 'automation'
}) => {
  const [activeTab, setActiveTab] = useState<'automation' | 'sms' | 'individual' | 'group'>(initialTab);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [tempTemplateText, setTempTemplateText] = useState('');
  const [testSmsModal, setTestSmsModal] = useState(false);
  const [testMobile, setTestMobile] = useState('01710287818');
  const [testSent, setTestSent] = useState(false);

  // Individual SMS state
  const [singleRecipient, setSingleRecipient] = useState('01710287818');
  const [singleMessage, setSingleMessage] = useState('Dear Customer, your internet bill is due on 10th of this month. Please pay to avoid line suspension.');
  const [singleSentToast, setSingleSentToast] = useState(false);

  // Group SMS state
  const [groupTarget, setGroupTarget] = useState('All Active Clients');
  const [groupTemplate, setGroupTemplate] = useState('bill_due');
  const [groupSentToast, setGroupSentToast] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const startEdit = (t: SmsTemplateItem) => {
    setEditingTemplateId(t.id);
    setTempTemplateText(t.template);
  };

  const handleSaveEdit = (id: string) => {
    onSaveSmsTemplate(id, tempTemplateText);
    setEditingTemplateId(null);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    setTestSent(true);
    setTimeout(() => {
      setTestSent(false);
      setTestSmsModal(false);
    }, 2000);
  };

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Header */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-500">Home</span>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-slate-800">Automated Billing &amp; SMS Engine</span>
        </div>

        <div className="flex flex-wrap items-center space-x-1 bg-slate-100 p-1 rounded text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('automation')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'automation'
                ? 'bg-[#162e3d] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#162e3d]'
            }`}
          >
            <Cog className="w-3.5 h-3.5" />
            <span>Automated Processes</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'sms'
                ? 'bg-[#00a2d3] text-white shadow-sm'
                : 'text-slate-700 hover:text-cyan-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS Notification Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('individual')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'individual'
                ? 'bg-[#162e3d] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#162e3d]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Individual SMS</span>
          </button>

          <button
            onClick={() => setActiveTab('group')}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'group'
                ? 'bg-[#162e3d] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#162e3d]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS Group Campaign</span>
          </button>
        </div>
      </div>

      {/* Automated Processes Tab matching Screenshot 11 */}
      {activeTab === 'automation' && (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden text-xs">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                Scheduled ISP Automation Engine
              </h3>
              <p className="text-slate-500 text-[11px]">
                Cron tasks running inside core billing server for auto invoicing and Mikrotik rate-limiting
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Daemon Running
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-700">
              <thead className="bg-[#162e3d] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Process Name</th>
                  <th className="p-3">Scheduled Frequency</th>
                  <th className="p-3">Last Executed</th>
                  <th className="p-3">Next Execution</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {automatedProcesses.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.description}</div>
                    </td>
                    <td className="p-3 font-semibold text-cyan-800">{p.frequency}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{p.lastRun}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{p.nextRun}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onToggleProcess(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          p.enabled
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {p.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onRunProcessManually(p.id)}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold text-[11px] shadow-sm flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Now</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SMS Templates Tab matching Screenshot 9 */}
      {activeTab === 'sms' && (
        <div className="space-y-4">
          <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden text-xs">
            <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50">
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  SMS Notification Templates (Bangla / English)
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Configured dynamic placeholders: [CustomerName], [ClientCode], [Month], [Amount], [ExpireDate], [ReceiptNo]
                </p>
              </div>

              <button
                onClick={() => setTestSmsModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs shadow-sm flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Gateway SMS</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-slate-700">
                <thead className="bg-[#162e3d] text-white uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Template Title</th>
                    <th className="p-3">Trigger Event</th>
                    <th className="p-3">Message Content</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {smsTemplates.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{item.title}</td>
                      <td className="p-3 font-semibold text-cyan-800">{item.type}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-700 max-w-md">
                        {editingTemplateId === item.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              value={tempTemplateText}
                              onChange={(e) => setTempTemplateText(e.target.value)}
                              className="w-full p-2 border border-cyan-500 rounded text-slate-900 bg-white"
                            />
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() => setEditingTemplateId(null)}
                                className="px-2 py-1 text-slate-600 bg-slate-200 rounded text-[10px]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                              >
                                Save Template
                              </button>
                            </div>
                          </div>
                        ) : (
                          item.template
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {editingTemplateId !== item.id && (
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-slate-100 rounded"
                            title="Edit template"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Individual SMS */}
      {activeTab === 'individual' && (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Dispatch Individual SMS</h3>
              <p className="text-slate-500 text-[11px]">Send direct alerts or custom notices to any client or custom phone</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-100 text-cyan-800 font-bold text-[11px]">
              Active Gateway: Khudebarta v2.0
            </span>
          </div>

          <div className="p-5 max-w-2xl space-y-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Customer Mobile Number</label>
              <input
                type="text"
                value={singleRecipient}
                onChange={(e) => setSingleRecipient(e.target.value)}
                placeholder="e.g. 01710287818"
                className="w-full p-2 border border-slate-300 rounded font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Message Content (Bangla / English Supported)</label>
              <textarea
                rows={4}
                value={singleMessage}
                onChange={(e) => setSingleMessage(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded text-slate-800 focus:border-cyan-500 focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Characters: {singleMessage.length} / 160 (1 SMS)</span>
                <span>Masking: BBN_NET</span>
              </div>
            </div>

            {singleSentToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 font-medium text-xs">
                ✓ Individual SMS has been dispatched successfully! Message ID: MSG-{Date.now()}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSingleSentToast(true);
                  setTimeout(() => setSingleSentToast(false), 3000);
                }}
                className="px-4 py-2 bg-[#162e3d] hover:bg-[#1b3a4b] text-white rounded font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Individual SMS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SMS Group & Bulk Campaign */}
      {activeTab === 'group' && (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Broadcast SMS Group Campaign</h3>
              <p className="text-slate-500 text-[11px]">Send bulk announcements to target client categories across Bhurungamari</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">
              Available SMS Balance: ৳1,480.00
            </span>
          </div>

          <div className="p-5 max-w-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Client Group</label>
                <select
                  value={groupTarget}
                  onChange={(e) => setGroupTarget(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="All Active Clients">All Active Clients (54 Subscribers)</option>
                  <option value="Expired Clients">Expired & Due Clients (12 Subscribers)</option>
                  <option value="Jamtola Zone">Jamtola Mor Subzone (28 Subscribers)</option>
                  <option value="Bot Tola Zone">Bot Tola Subzone (19 Subscribers)</option>
                  <option value="All Corporate Leased Lines">Corporate Leased Lines (6 Subscribers)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Template Preset</label>
                <select
                  value={groupTemplate}
                  onChange={(e) => setGroupTemplate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="bill_due">Bill Due Reminder Notice</option>
                  <option value="line_lock">Auto Line Lock Final Warning</option>
                  <option value="optical_maintenance">Optical Fiber Maintenance Alert</option>
                  <option value="festive_greeting">Eid / Puja Festive Greeting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Broadcast Preview Text</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 font-mono text-[11px]">
                {groupTemplate === 'bill_due' &&
                  'BBN Notice: Dear Valued Subscriber, your monthly internet bill is due on 10th of this month. Please pay to avoid automatic line disconnection. Helpline: 01710287818.'}
                {groupTemplate === 'line_lock' &&
                  'BBN Warning: Dear Subscriber, your line will be temporarily locked due to unpaid bill. Please clear the pending dues immediately via bKash or local agent.'}
                {groupTemplate === 'optical_maintenance' &&
                  'BBN Update: Scheduled optical fiber splicing maintenance will be carried out tonight from 02:00 AM to 04:00 AM. Internet service may briefly fluctuate. Thank you for your patience.'}
                {groupTemplate === 'festive_greeting' &&
                  'BBN Greetings: Wishing you and your family a joyous festival! May peace and happiness connect our lives. From Bhurungamari Broadband Network.'}
              </div>
            </div>

            {groupSentToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 font-medium text-xs">
                ✓ Bulk broadcast queued! 54 SMS dispatches initiated via gateway queue.
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setGroupSentToast(true);
                  setTimeout(() => setGroupSentToast(false), 3000);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Trigger Group Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {testSmsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-fade-in">
            <div className="bg-[#162e3d] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm">Send Test Gateway SMS</h3>
              <button onClick={() => setTestSmsModal(false)} className="text-slate-300 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestSms} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={testMobile}
                  onChange={(e) => setTestMobile(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Test Message</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  BBN TEST: Dear Younus Ali (0006), your BBN Broadband connection is active with 10Mbps package. Thank you!
                </div>
              </div>

              {testSent && (
                <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-center font-bold">
                  ✓ SMS dispatched via BBN Gateway!
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setTestSmsModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testSent}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
                >
                  Send SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
