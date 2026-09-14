import React, { useState } from 'react';
import {
  ShoppingCart,
  Zap,
  Film,
  Server,
  Radio,
  Tv,
  ExternalLink,
  Download,
  Play,
  Shield,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export const VasBdixView: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-2xl text-xs z-50 flex items-center gap-2 border border-cyan-500 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#162e3d] text-cyan-400 rounded">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
              VAS & BDIX Local Peering Services
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                100 Mbps Local Loop Unlimited
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Bangladesh Internet Exchange (BDIX) Cache, Live TV Streams & Local BBN Media Servers
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('BDIX route filters flushed and re-synced with IXP!')}
          className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Sync BDIX BGP Routes</span>
        </button>
      </div>

      {/* Caching Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Google Global Cache (GGC)</span>
            <div className="text-lg font-black text-cyan-700 font-mono mt-0.5">380 Mbps Live</div>
            <span className="text-[10px] text-emerald-600 font-semibold">YouTube & Play Store 4K Cache</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
            <Play className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Facebook FNA Cache</span>
            <div className="text-lg font-black text-indigo-700 font-mono mt-0.5">240 Mbps Live</div>
            <span className="text-[10px] text-indigo-600 font-semibold">Instagram, Reels & FB CDN</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">BBN Local FTP Server</span>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">ftp.bbnisp.net</div>
            <span className="text-[10px] text-emerald-600 font-semibold">100TB High-Speed Media Storage</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Live BDIX IPTV Channels</span>
            <div className="text-lg font-black text-amber-700 font-mono mt-0.5">140 Channels</div>
            <span className="text-[10px] text-amber-600 font-semibold">Buffer-Free Sports & HD News</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Tv className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Media & Value-Added Services Portal Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
          <span>Active BDIX Value Added Services Catalog</span>
          <span className="text-xs text-slate-500">Accessible exclusively for BBN network subscribers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                <th className="p-2.5">Service Name</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Local BDIX URL / IP</th>
                <th className="p-2.5">Speed Allocation</th>
                <th className="p-2.5">Latency</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'BBN Flix HD', category: 'Movie & Series VOD', url: 'http://10.10.10.5/movies', speed: 'Up to 100 Mbps', ping: '1 ms', status: 'Online' },
                { name: 'BBN Sports Live TV', category: 'Live HLS Stream', url: 'http://10.10.10.5/tv', speed: 'Up to 50 Mbps', ping: '2 ms', status: 'Online' },
                { name: 'CircleFTP BDIX', category: 'Fast Download Hub', url: 'http://circleftp.net', speed: 'BDIX Peered', ping: '6 ms', status: 'Online' },
                { name: 'SamOnline Media', category: 'Entertainment Server', url: 'http://samonline.net.bd', speed: 'BDIX Peered', ping: '7 ms', status: 'Online' },
                { name: 'Roar BDIX Torrent Cache', category: 'P2P High Speed Cache', url: 'http://10.10.10.8:8080', speed: 'Up to 100 Mbps', ping: '1 ms', status: 'Online' }
              ].map((vas, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-800 flex items-center gap-2">
                    <Film className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{vas.name}</span>
                  </td>
                  <td className="p-2.5 text-slate-600">{vas.category}</td>
                  <td className="p-2.5 font-mono text-cyan-700 font-medium">{vas.url}</td>
                  <td className="p-2.5 font-bold font-mono text-emerald-700">{vas.speed}</td>
                  <td className="p-2.5 font-mono text-slate-500">{vas.ping}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {vas.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => showToast(`Opened portal link: ${vas.url}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 mx-auto"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Launch</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
