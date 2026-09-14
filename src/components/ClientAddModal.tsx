import React, { useState } from 'react';
import { X, UserPlus, Server, Wifi, User, Check, Phone, MapPin } from 'lucide-react';
import { Client } from '../types';

interface ClientAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (newClient: Client) => void;
}

export const ClientAddModal: React.FC<ClientAddModalProps> = ({
  isOpen,
  onClose,
  onAddClient
}) => {
  if (!isOpen) return null;

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [nid, setNid] = useState('');
  const [address, setAddress] = useState('');
  const [clientType, setClientType] = useState<'Home' | 'Shop User' | 'Corporate'>('Home');
  const [zone, setZone] = useState('Jamtola');
  const [subzone, setSubzone] = useState('Bot Tola');
  const [server, setServer] = useState('BBN-CORE');
  const [connectionType, setConnectionType] = useState<'Optical Fiber' | 'Cat5' | 'Wireless'>('Optical Fiber');
  const [packageName, setPackageName] = useState('10Mbps');
  const [packageSpeed, setPackageSpeed] = useState('10Mbps/10mb_pkg_500tk');
  const [monthlyBill, setMonthlyBill] = useState(500);
  const [expireDate, setExpireDate] = useState(27);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('bbn1234');
  const [macAddress, setMacAddress] = useState('1C:EF:03:E4:EB:C1');

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '10mb') {
      setPackageName('10Mbps');
      setPackageSpeed('10Mbps/10mb_pkg_500tk');
      setMonthlyBill(500);
    } else if (val === '20mb') {
      setPackageName('20Mbps');
      setPackageSpeed('20Mbps/20mb_pkg_600tk');
      setMonthlyBill(600);
    } else if (val === '50mb') {
      setPackageName('50Mbps');
      setPackageSpeed('50Mbps/50mb_pkg_800tk');
      setMonthlyBill(800);
    } else if (val === '100mb') {
      setPackageName('100Mbps');
      setPackageSpeed('100Mbps/100mb_pkg_1000tk');
      setMonthlyBill(1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !mobile) {
      alert('Please fill out Name, Mobile and PPPoE Username.');
      return;
    }

    const newCode = (1041 + Math.floor(Math.random() * 50)).toString().padStart(4, '0');
    const newClient: Client = {
      id: `client-${Date.now()}`,
      code: newCode,
      username,
      name,
      mobile,
      email: email || `${username}@bbn.net`,
      nid,
      zone,
      subzone,
      connectionType,
      clientType,
      address,
      packageName,
      packageSpeed,
      monthlyBill,
      macAddress,
      server,
      billingStatus: 'Active',
      mikrotikStatus: true,
      joiningDate: '14 Sep 2026',
      expireDate,
      balanceDue: 0,
      allocatedIp: `10.10.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 250)}`
    };

    onAddClient(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-fade-in my-6">
        {/* Header */}
        <div className="bg-[#162e3d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm">Add New Client (Provisioning &amp; PPPoE)</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form matching Screenshots 7 & 8 */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Section 1: Personal Information */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-[#00a2d3] text-white font-bold px-3 py-2 flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>1. Personal Information</span>
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Customer Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Md Tariqul Islam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-cyan-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">National ID / NID</label>
                <input
                  type="text"
                  placeholder="10 or 17 digit NID"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-cyan-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client Type</label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Home">Home User</option>
                  <option value="Shop User">Shop User</option>
                  <option value="Corporate">Corporate Office</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-[#00a2d3] text-white font-bold px-3 py-2 flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <span>2. Contact Information</span>
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Village / Ward / Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Network & Product Information */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-[#00a2d3] text-white font-bold px-3 py-2 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              <span>3. Network &amp; Product Information</span>
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mikrotik Server</label>
                <select
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 font-bold text-cyan-800"
                >
                  <option value="BBN-CORE">BBN-CORE (157.10.238.100)</option>
                  <option value="MikroTik Backup">MikroTik Backup (157.10.238.38)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Zone</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                >
                  <option value="Jamtola">Jamtola</option>
                  <option value="College Para">College Para</option>
                  <option value="Stand">Stand</option>
                  <option value="Saddam Mor">Saddam Mor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sub Zone</label>
                <input
                  type="text"
                  value={subzone}
                  onChange={(e) => setSubzone(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Connection Type</label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                >
                  <option value="Optical Fiber">Optical Fiber</option>
                  <option value="Cat5">Cat5 / Cat6 Cable</option>
                  <option value="Wireless">Wireless Bridge</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Device MAC Address</label>
                <input
                  type="text"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Distribution Box</label>
                <input
                  type="text"
                  defaultValue="Box-04"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Service Information */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-[#00a2d3] text-white font-bold px-3 py-2 flex items-center gap-1.5">
              <Wifi className="w-4 h-4" />
              <span>4. Service Information &amp; Mikrotik Secret</span>
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Package Plan</label>
                <select
                  onChange={handlePackageChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 font-semibold"
                >
                  <option value="10mb">Starter Fiber 10Mbps (৳500/mo)</option>
                  <option value="20mb">Standard Pro 20Mbps (৳600/mo)</option>
                  <option value="50mb">Turbo Speed 50Mbps (৳800/mo)</option>
                  <option value="100mb">Ultra Corporate 100Mbps (৳1000/mo)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Monthly Bill (৳)</label>
                <input
                  type="number"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billing Expire Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={expireDate}
                  onChange={(e) => setExpireDate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  PPPoE Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. haven, tariqul"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-cyan-500 rounded font-mono font-bold text-cyan-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">PPPoE Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                  />
                  <span className="text-slate-700 font-medium">
                    Auto-push secret to Mikrotik router
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white font-bold rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Provision Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
