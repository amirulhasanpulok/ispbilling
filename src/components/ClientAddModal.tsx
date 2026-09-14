import React, { useState, useEffect } from 'react';
import { X, UserPlus, Server, Wifi, User, Check, Phone, MapPin, AlertCircle } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter customer full name.');
      return;
    }
    if (!mobile.trim()) {
      setErrorMessage('Please enter customer mobile number.');
      return;
    }
    if (!username.trim()) {
      setErrorMessage('Please enter a PPPoE username.');
      return;
    }

    const newCode = (1041 + Math.floor(Math.random() * 50)).toString().padStart(4, '0');
    const newClient: Client = {
      id: `client-${Date.now()}`,
      code: newCode,
      username: username.trim(),
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || `${username.trim()}@bbn.net`,
      nid: nid.trim(),
      zone,
      subzone,
      connectionType,
      clientType,
      address: address.trim(),
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-add-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="bg-[#162e3d] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 id="client-add-title" className="font-bold text-sm leading-tight">
                Add New Client
              </h3>
              <p className="text-[11px] text-slate-300 font-normal">
                Customer provisioning &amp; MikroTik PPPoE configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="m-4 mb-0 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Section 1: Personal Information */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-cyan-600 text-white font-bold px-3.5 py-2 flex items-center gap-1.5 text-xs">
              <User className="w-4 h-4" />
              <span>1. Personal Information</span>
            </div>
            <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
              <div>
                <label htmlFor="client-name-input" className="block text-slate-700 font-semibold mb-1">
                  Customer Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  required
                  placeholder="e.g. Md Tariqul Islam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-800 transition-all"
                />
              </div>

              <div>
                <label htmlFor="client-nid-input" className="block text-slate-700 font-semibold mb-1">
                  National ID / NID
                </label>
                <input
                  id="client-nid-input"
                  type="text"
                  placeholder="10 or 17 digit NID"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-800 transition-all"
                />
              </div>

              <div>
                <label htmlFor="client-type-select" className="block text-slate-700 font-semibold mb-1">
                  Client Type
                </label>
                <select
                  id="client-type-select"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as 'Home' | 'Shop User' | 'Corporate')}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
                >
                  <option value="Home">Home User</option>
                  <option value="Shop User">Shop User</option>
                  <option value="Corporate">Corporate Office</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-cyan-600 text-white font-bold px-3.5 py-2 flex items-center gap-1.5 text-xs">
              <Phone className="w-4 h-4" />
              <span>2. Contact Information</span>
            </div>
            <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
              <div>
                <label htmlFor="client-mobile-input" className="block text-slate-700 font-semibold mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="client-mobile-input"
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="client-email-input" className="block text-slate-700 font-semibold mb-1">
                  Email Address
                </label>
                <input
                  id="client-email-input"
                  type="email"
                  placeholder="client@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="client-address-input" className="block text-slate-700 font-semibold mb-1">
                  Address
                </label>
                <input
                  id="client-address-input"
                  type="text"
                  placeholder="Village / Ward / Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Network & Product Information */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-cyan-600 text-white font-bold px-3.5 py-2 flex items-center gap-1.5 text-xs">
              <Server className="w-4 h-4" />
              <span>3. Network &amp; Product Information</span>
            </div>
            <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
              <div>
                <label htmlFor="client-server-select" className="block text-slate-700 font-semibold mb-1">
                  Mikrotik Server
                </label>
                <select
                  id="client-server-select"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-semibold text-cyan-800 bg-white"
                >
                  <option value="BBN-CORE">BBN-CORE (157.10.238.100)</option>
                  <option value="MikroTik Backup">MikroTik Backup (157.10.238.38)</option>
                </select>
              </div>

              <div>
                <label htmlFor="client-zone-select" className="block text-slate-700 font-semibold mb-1">
                  Zone
                </label>
                <select
                  id="client-zone-select"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white"
                >
                  <option value="Jamtola">Jamtola</option>
                  <option value="College Para">College Para</option>
                  <option value="Stand">Stand</option>
                  <option value="Saddam Mor">Saddam Mor</option>
                </select>
              </div>

              <div>
                <label htmlFor="client-subzone-input" className="block text-slate-700 font-semibold mb-1">
                  Sub Zone
                </label>
                <input
                  id="client-subzone-input"
                  type="text"
                  value={subzone}
                  onChange={(e) => setSubzone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label htmlFor="client-connection-select" className="block text-slate-700 font-semibold mb-1">
                  Connection Type
                </label>
                <select
                  id="client-connection-select"
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value as 'Optical Fiber' | 'Cat5' | 'Wireless')}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white"
                >
                  <option value="Optical Fiber">Optical Fiber</option>
                  <option value="Cat5">Cat5 UTP Cable</option>
                  <option value="Wireless">Wireless PTP</option>
                </select>
              </div>

              <div>
                <label htmlFor="client-package-select" className="block text-slate-700 font-semibold mb-1">
                  Internet Package
                </label>
                <select
                  id="client-package-select"
                  onChange={handlePackageChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-semibold bg-white"
                >
                  <option value="10mb">10Mbps (৳500 / month)</option>
                  <option value="20mb">20Mbps (৳600 / month)</option>
                  <option value="50mb">50Mbps (৳800 / month)</option>
                  <option value="100mb">100Mbps (৳1000 / month)</option>
                </select>
              </div>

              <div>
                <label htmlFor="client-mac-input" className="block text-slate-700 font-semibold mb-1">
                  MAC Address
                </label>
                <input
                  id="client-mac-input"
                  type="text"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-800"
                />
              </div>

              <div>
                <label htmlFor="client-bill-input" className="block text-slate-700 font-semibold mb-1">
                  Monthly Bill (৳)
                </label>
                <input
                  id="client-bill-input"
                  type="number"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="client-expire-input" className="block text-slate-700 font-semibold mb-1">
                  Billing Expire Day
                </label>
                <input
                  id="client-expire-input"
                  type="number"
                  min="1"
                  max="31"
                  value={expireDate}
                  onChange={(e) => setExpireDate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="client-username-input" className="block text-slate-700 font-semibold mb-1">
                  PPPoE Username <span className="text-rose-500">*</span>
                </label>
                <input
                  id="client-username-input"
                  type="text"
                  required
                  placeholder="e.g. haven, tariqul"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 border border-cyan-500 rounded-lg font-mono font-bold text-cyan-800 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label htmlFor="client-password-input" className="block text-slate-700 font-semibold mb-1">
                  PPPoE Password
                </label>
                <input
                  id="client-password-input"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-800"
                />
              </div>

              <div className="flex items-center sm:col-span-2 pt-2 sm:pt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-slate-700 font-medium">
                    Auto-push secret to MikroTik router
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-cyan-500"
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
