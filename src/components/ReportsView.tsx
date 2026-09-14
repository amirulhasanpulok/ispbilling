import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Building,
  Users,
  Wifi,
  ShieldCheck,
  TrendingUp,
  PieChart,
  CheckCircle2
} from 'lucide-react';
import { Client, BillRecord } from '../types';

interface ReportsViewProps {
  clients?: Client[];
  billingList?: BillRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  clients = [],
  billingList = []
}) => {
  const [reportType, setReportType] = useState<'btrc' | 'zone' | 'package' | 'due'>('btrc');
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Category,Metric,Value\n' +
      'ISP Name,Bhurungamari Broadband Network,BBN\n' +
      'BTRC License,BTRC/LL-ISP/NAT-2021/889,Upazila ISP\n' +
      'Allocated Bandwidth,Summit Comm 1Gbps,1000 Mbps\n' +
      'Total Active Subscribers,580,Home & Corporate\n' +
      'Monthly Revenue,234500,BDT\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BTRC_Monthly_Report_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV successfully generated and downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800 print:bg-white print:p-0">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-2xl text-xs z-50 flex items-center gap-2 border border-cyan-500 animate-fade-in print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#162e3d] text-cyan-400 rounded">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
              BTRC Regulatory & ISP Analytics Report
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                Official Compliance Format
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Bangladesh Telecommunication Regulatory Commission (BTRC) Standard Monthly Returns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Switcher */}
      <div className="flex border-b border-slate-200 bg-white px-4 py-2 rounded-t text-xs font-semibold text-slate-600 gap-4 print:hidden">
        <button
          onClick={() => setReportType('btrc')}
          className={`pb-2 transition-colors border-b-2 ${
            reportType === 'btrc' ? 'border-cyan-600 text-cyan-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          BTRC Monthly Form A & B
        </button>
        <button
          onClick={() => setReportType('zone')}
          className={`pb-2 transition-colors border-b-2 ${
            reportType === 'zone' ? 'border-cyan-600 text-cyan-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Zone & POP Distribution
        </button>
        <button
          onClick={() => setReportType('package')}
          className={`pb-2 transition-colors border-b-2 ${
            reportType === 'package' ? 'border-cyan-600 text-cyan-700 font-bold' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Package & Bandwidth Mix
        </button>
      </div>

      {/* Official BTRC Document Layout */}
      {reportType === 'btrc' && (
        <div className="bg-white p-6 rounded-b border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto font-sans print:border-none print:shadow-none">
          {/* Document Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              Bangladesh Telecommunication Regulatory Commission (BTRC)
            </h2>
            <p className="text-xs text-slate-600">IEB Bhaban, Ramna, Dhaka-1000</p>
            <h3 className="text-base font-black text-slate-900 mt-2 underline">
              MONTHLY OPERATIONAL REPORT OF INTERNET SERVICE PROVIDER (ISP)
            </h3>
            <p className="text-xs font-semibold text-slate-500 font-mono">
              Reporting Month: {selectedMonth} | Licensee Category: Nationwide / Upazila ISP
            </p>
          </div>

          {/* Section 1: Licensee Information */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 bg-slate-100 p-2 border-l-4 border-cyan-600">
              SECTION 1: LICENSEE CREDENTIALS
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-700 p-2">
              <div><span className="font-bold">Name of ISP:</span> Bhurungamari Broadband Network (BBN)</div>
              <div><span className="font-bold">BTRC License No:</span> BTRC/ISP/NAT-2021/889</div>
              <div><span className="font-bold">Contact Person:</span> Md. Asaduzzaman (Managing Partner)</div>
              <div><span className="font-bold">Helpline / NOC:</span> 01710-287818, 01925-112233</div>
              <div><span className="font-bold">Office Address:</span> Jamtola Mor, Bhurungamari, Kurigram</div>
              <div><span className="font-bold">NTTN Connectivity:</span> Fiber@Home & Summit Comm</div>
            </div>
          </div>

          {/* Section 2: Bandwidth Allocation */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 bg-slate-100 p-2 border-l-4 border-cyan-600">
              SECTION 2: BANDWIDTH PROCUREMENT & USAGE
            </h4>
            <table className="w-full text-left border border-slate-300">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Upstream IIG Provider</th>
                  <th className="p-2 border-r border-slate-300">Link Capacity</th>
                  <th className="p-2 border-r border-slate-300">Actual Peak Utilization</th>
                  <th className="p-2 border-r border-slate-300">BDIX / Peering</th>
                  <th className="p-2">NTTN Core Handoff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="p-2 border-r border-slate-300 font-semibold">Summit Communications Ltd</td>
                  <td className="p-2 border-r border-slate-300 font-mono">1,000 Mbps (1 Gbps)</td>
                  <td className="p-2 border-r border-slate-300 font-mono text-cyan-800 font-bold">842 Mbps (84.2%)</td>
                  <td className="p-2 border-r border-slate-300 font-mono">1,500 Mbps</td>
                  <td className="p-2">10G SFP+ Rangpur Node</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Subscriber Statistics by Speed */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 bg-slate-100 p-2 border-l-4 border-cyan-600">
              SECTION 3: SUBSCRIBER NUMBERS BY TARIFF BAND
            </h4>
            <table className="w-full text-left border border-slate-300">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Speed Tier</th>
                  <th className="p-2 border-r border-slate-300">BTRC Approved Monthly Tariff</th>
                  <th className="p-2 border-r border-slate-300">Home Users</th>
                  <th className="p-2 border-r border-slate-300">Corporate</th>
                  <th className="p-2">Total Subscriptions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">10 Mbps (One Nation One Rate)</td>
                  <td className="p-2 border-r border-slate-300 font-mono">৳ 500 / month</td>
                  <td className="p-2 border-r border-slate-300 font-mono">312</td>
                  <td className="p-2 border-r border-slate-300 font-mono">14</td>
                  <td className="p-2 font-mono font-bold">326</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">20 Mbps (Standard Fast)</td>
                  <td className="p-2 border-r border-slate-300 font-mono">৳ 800 / month</td>
                  <td className="p-2 border-r border-slate-300 font-mono">180</td>
                  <td className="p-2 border-r border-slate-300 font-mono">22</td>
                  <td className="p-2 font-mono font-bold">202</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300 font-medium">30 Mbps (Ultra HD / Pro)</td>
                  <td className="p-2 border-r border-slate-300 font-mono">৳ 1,200 / month</td>
                  <td className="p-2 border-r border-slate-300 font-mono">42</td>
                  <td className="p-2 border-r border-slate-300 font-mono">10</td>
                  <td className="p-2 font-mono font-bold">52</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={4} className="p-2 border-r border-slate-300 text-right uppercase">
                    Total Connected Base:
                  </td>
                  <td className="p-2 font-mono text-cyan-800 text-sm">580 Subscribers</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Signatures */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-700">
            <div>
              <div className="w-48 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-bold">Prepared By: Network Operations</p>
              <p className="text-slate-500">BBN Technical Dept.</p>
            </div>
            <div>
              <div className="w-48 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-bold">Authorized Signatory</p>
              <p className="text-slate-500">Chief Executive Officer / Managing Partner</p>
            </div>
          </div>
        </div>
      )}

      {/* Zone Analytics Report */}
      {reportType === 'zone' && (
        <div className="bg-white p-5 rounded-b border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Upazila Node & POP Distribution Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Jamtola Bazar (Central)', users: 210, rev: '৳ 112,000', pop: 'Main Server Room', health: '99.8%' },
              { name: 'Bot Tola & Hospital Mor', users: 145, rev: '৳ 78,500', pop: 'Secondary Splice Node', health: '99.2%' },
              { name: 'Joymonirhat Branch (POP)', users: 115, rev: '৳ 35,000', pop: 'Reseller POP (Level 1)', health: '98.9%' },
              { name: 'College Road & Pilot School', users: 65, rev: '৳ 34,200', pop: 'Distribution Box 04', health: '99.6%' },
              { name: 'Sonahat Landport Route', users: 45, rev: '৳ 28,000', pop: 'Armored Trunk 02', health: '99.9%' }
            ].map((z, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900 text-sm">{z.name}</div>
                <div className="flex justify-between text-slate-600">
                  <span>Subscribers:</span>
                  <span className="font-bold font-mono text-slate-800">{z.users}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Monthly Invoiced:</span>
                  <span className="font-bold font-mono text-emerald-700">{z.rev}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Uptime SLA:</span>
                  <span className="font-bold font-mono text-cyan-700">{z.health}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
