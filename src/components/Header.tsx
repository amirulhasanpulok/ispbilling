import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  AlertCircle,
  Calendar,
  Ticket,
  Activity,
  Bell,
  Info,
  User,
  ArrowRightLeft,
  ChevronDown,
  ArrowLeft,
  Settings,
  LogOut,
  Sliders,
  Mail,
  ShieldCheck,
  X
} from 'lucide-react';
import { Client } from '../types';

interface HeaderProps {
  currentView?: string;
  activeNav?: string;
  onNavigate: (view: string) => void;
  portalMode: 'admin' | 'customer';
  onTogglePortalMode: (mode: 'admin' | 'customer') => void;
  clients?: Client[];
  onSelectClient?: (client: Client) => void;
  onQuickSearchSelect?: (code: string) => void;
  onOpenNewTicketModal?: () => void;
  onOpenLiveMonitorModal?: () => void;
  onOpenAddClient?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  portalMode,
  onTogglePortalMode,
  clients = [],
  onSelectClient,
  onQuickSearchSelect,
  onOpenNewTicketModal,
  onOpenLiveMonitorModal,
  onOpenAddClient,
  onToggleSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchDropdownOpen(false);
        setUserDropdownOpen(false);
        setMobileSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const safeClients = Array.isArray(clients) ? clients : [];
  const filteredClients = safeClients.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.code || '').includes(searchQuery) ||
      (c.mobile || '').includes(searchQuery)
  );

  const handleSelectSearchResult = (client: Client) => {
    if (onSelectClient) onSelectClient(client);
    if (onQuickSearchSelect) onQuickSearchSelect(client.code);
    onNavigate('clientProfile');
    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-[#162e3d] text-white h-14 px-3 md:px-4 flex items-center justify-between shadow-sm select-none sticky top-0 z-50 border-b border-[#0f212c]">
      {/* Left side brand & Back Button & Mobile Toggle */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
          title="Toggle Navigation Menu"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Circular Back button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-7 h-7 rounded-full border border-slate-500/60 flex items-center justify-center text-slate-300 hover:text-white hover:border-white transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
          title="Return to Dashboard"
          aria-label="Return to Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2.5 text-white hover:text-cyan-300 transition-colors text-left focus:outline-none"
          title="Return to Dashboard"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-base shadow border border-cyan-400/40 shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight hidden sm:block">
            <h1 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
              Bhurungamari Broadband Network <span className="text-cyan-400 font-semibold">(BBN)</span>
            </h1>
            <p className="text-[10px] text-slate-300 font-normal">ISP Billing &amp; Core Network Control</p>
          </div>
        </button>
      </div>

      {/* Center Search & Quick Action Badges */}
      <div className="hidden lg:flex items-center space-x-2.5">
        {/* Customer Quick Search */}
        <div ref={searchContainerRef} className="relative">
          <div className="flex items-center bg-[#203c4f] rounded-lg border border-[#2b4c63] px-2.5 py-1.5 text-xs text-white w-52 focus-within:w-64 focus-within:border-cyan-400 transition-all shadow-xs">
            <Search className="w-3.5 h-3.5 text-slate-300 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search Customer..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchDropdownOpen(true);
              }}
              onFocus={() => setSearchDropdownOpen(true)}
              className="bg-transparent text-white placeholder-slate-400 focus:outline-none w-full text-xs"
              aria-label="Search customer by name, code or mobile"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchDropdownOpen(false);
                }}
                className="text-slate-400 hover:text-white text-xs p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {searchDropdownOpen && searchQuery.length > 0 && (
            <div className="absolute left-0 mt-1 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 max-h-64 overflow-y-auto">
              <div className="p-2 text-[11px] font-semibold text-slate-500 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span>Search Results</span>
                <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                  {filteredClients.length}
                </span>
              </div>
              {filteredClients.length === 0 ? (
                <div className="p-4 text-xs text-slate-500 text-center">No customers found</div>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectSearchResult(client)}
                    className="w-full text-left p-2.5 hover:bg-cyan-50/80 border-b border-slate-100 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">
                        {client.name}{' '}
                        <span className="text-[10px] text-cyan-600 font-mono">({client.username})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Code: {client.code} | {client.mobile}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {client.packageName}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Invoice details yellow badge */}
        <button
          onClick={() => onNavigate('billing')}
          className="flex items-center space-x-1.5 bg-[#e5b200] hover:bg-[#d6a500] text-slate-900 font-semibold px-2.5 py-1 rounded-md text-xs transition-colors shadow-xs"
          title="Go to billing list and invoicing"
        >
          <span className="font-bold text-slate-950">Inv.</span>
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Billing Overview</span>
        </button>

        {/* Next Bill Date */}
        <div className="flex items-center space-x-1.5 bg-[#e5b200] text-slate-900 font-semibold px-2.5 py-1 rounded-md text-xs shadow-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>Next Cycle: 29 Sep 2026</span>
        </div>

        {/* Support Ticket Quick Button */}
        {onOpenNewTicketModal && (
          <button
            onClick={onOpenNewTicketModal}
            className="flex items-center space-x-1.5 bg-[#1e4259] hover:bg-[#25526f] text-white px-2.5 py-1 rounded-md text-xs border border-[#2d5c7c] transition-colors"
            title="Create or view support tickets"
          >
            <Ticket className="w-3.5 h-3.5 text-cyan-400" />
            <span>Support</span>
          </button>
        )}

        {/* Online Monitoring */}
        {onOpenLiveMonitorModal && (
          <button
            onClick={onOpenLiveMonitorModal}
            className="flex items-center space-x-1.5 bg-[#1e4259] hover:bg-[#25526f] text-white px-2.5 py-1 rounded-md text-xs border border-[#2d5c7c] transition-colors"
            title="Open real-time bandwidth & MikroTik monitor"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Network Live</span>
          </button>
        )}
      </div>

      {/* Right side: Mode Switcher & User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
          title="Search Customers"
          aria-label="Search Customers"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Portal View Switcher (Admin vs Customer Self-Service) */}
        <div className="flex items-center bg-[#0d1d27] rounded-lg p-0.5 border border-[#203c4f]">
          <button
            onClick={() => onTogglePortalMode('admin')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              portalMode === 'admin'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => onTogglePortalMode('customer')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 transition-all ${
              portalMode === 'customer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Switch to customer self-service portal"
          >
            <User className="w-3 h-3" />
            <span className="hidden sm:inline">Customer</span>
          </button>
        </div>

        {/* Notification bell */}
        <button
          onClick={() => onNavigate('support')}
          className="relative p-1.5 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-700/40"
          title="Active Support Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
            8
          </span>
        </button>

        {/* User avatar badge with dropdown menu */}
        <div ref={userDropdownRef} className="relative pl-1 border-l border-slate-700/60">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 text-left hover:opacity-90 transition-opacity focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-md p-0.5"
            title="User Profile & Quick Links"
            aria-expanded={userDropdownOpen}
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-amber-300 flex items-center justify-center font-bold text-xs text-slate-900 shadow-xs">
                A
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#162e3d]" />
            </div>
            <div className="hidden md:block text-left text-xs">
              <span className="block font-semibold text-white leading-none">
                {portalMode === 'admin' ? 'bbnasad' : 'Younus Ali'}
              </span>
              <span className="text-[10px] text-cyan-300">
                {portalMode === 'admin' ? 'Super Operator' : 'Client: haven'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-100">
              <div className="bg-[#1b3a4b] text-white p-3 border-b border-slate-700">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{portalMode === 'admin' ? 'Md Assaduzzman Asad' : 'Younus Ali'}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                  {portalMode === 'admin' ? 'user: bbnasad (Admin)' : 'Code: 0006'}
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    onNavigate('app-users');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center space-x-2 text-slate-700"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Application Users</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('sms-gateway');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center space-x-2 text-slate-700"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>SMS Gateway Setup</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('system-setup');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center space-x-2 text-slate-700"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>System Configuration</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    onTogglePortalMode(portalMode === 'admin' ? 'customer' : 'admin');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center space-x-2 text-cyan-700 font-medium"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>
                    Switch to {portalMode === 'admin' ? 'Customer View' : 'Admin View'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-14 bg-[#1b3a4b] p-2.5 border-b border-slate-700 z-50 lg:hidden shadow-lg animate-in slide-in-from-top duration-150">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customer by name, phone or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-white rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {searchQuery.length > 0 && (
            <div className="mt-2 bg-white rounded-lg shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs text-slate-800">
              {filteredClients.length === 0 ? (
                <div className="p-3 text-center text-slate-500">No customers found</div>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectSearchResult(client)}
                    className="w-full text-left p-2 hover:bg-cyan-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{client.name}</div>
                      <div className="text-[11px] text-slate-500">Code: {client.code} | {client.mobile}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 font-medium">
                      {client.packageName}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
