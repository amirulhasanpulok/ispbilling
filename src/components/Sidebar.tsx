import React, { useState } from 'react';
import {
  Home,
  Settings,
  ShoppingCart,
  Users,
  FileText,
  Server,
  UserCheck,
  Cpu,
  Network,
  UserMinus,
  Briefcase,
  Calendar,
  Headphones,
  CheckSquare,
  Handshake,
  DollarSign,
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Tag,
  CalendarCheck,
  Receipt,
  Scale,
  FileBarChart,
  Mail,
  Share2,
  Sliders,
  Video,
  Wrench,
  ChevronRight,
  ChevronDown,
  Search,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView?: string;
  activeNav?: string;
  onNavigate: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  badgeCounts?: {
    clients?: number;
    billingDue?: number;
    tickets?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeNav,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  badgeCounts
}) => {
  const activeId = activeNav || currentView || 'dashboard';
  const [menuSearch, setMenuSearch] = useState('');
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    client: true,
    billing: true,
    mikrotik: true,
    support: true,
    accounting: false,
    report: false,
    sms: true,
    system: true,
    hr: false,
    pop: false
  });

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleItemClick = (action: () => void) => {
    action();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      action: () => handleItemClick(() => onNavigate('dashboard'))
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: Settings,
      hasSub: true,
      subItems: [
        { id: 'settings', label: 'General Settings', action: () => handleItemClick(() => onNavigate('settings')) },
        { id: 'system-setup', label: 'System Setup', action: () => handleItemClick(() => onNavigate('system-setup')) }
      ]
    },
    {
      id: 'vas',
      label: 'VAS',
      icon: ShoppingCart,
      badge: 'BDIX',
      action: () => handleItemClick(() => onNavigate('vas'))
    },
    {
      id: 'client',
      label: 'Client',
      icon: Users,
      hasSub: true,
      subItems: [
        { id: 'client-new-req', label: 'New Request', action: () => handleItemClick(() => onNavigate('client-new-req')) },
        { id: 'client-add', label: 'Add New', action: () => handleItemClick(() => onNavigate('client-add')) },
        { id: 'client-list', label: 'Client List', action: () => handleItemClick(() => onNavigate('client-list')) },
        { id: 'client-left', label: 'Left Client', action: () => handleItemClick(() => onNavigate('client-left')) },
        { id: 'client-scheduler', label: 'Scheduler', action: () => handleItemClick(() => onNavigate('client-scheduler')) },
        { id: 'client-change-req', label: 'Change Request', action: () => handleItemClick(() => onNavigate('client-change-req')) },
        { id: 'portal-manage', label: 'Portal Manage', action: () => handleItemClick(() => onNavigate('portal-manage')) }
      ]
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: FileText,
      hasSub: true,
      subItems: [
        { id: 'billing-list', label: 'Billing List', action: () => handleItemClick(() => onNavigate('billing')) },
        { id: 'daily-collection', label: 'Daily Bill Collection', action: () => handleItemClick(() => onNavigate('daily-collection')) }
      ]
    },
    {
      id: 'mikrotik',
      label: 'Mikrotik Server',
      icon: Server,
      hasSub: true,
      subItems: [
        { id: 'mikrotik-server', label: 'Server', action: () => handleItemClick(() => onNavigate('mikrotik-server')) },
        { id: 'mikrotik-monitor', label: 'Real-Time Bandwidth', action: () => handleItemClick(() => onNavigate('mikrotik-monitor')) },
        { id: 'mikrotik-backup', label: 'Server Backup', action: () => handleItemClick(() => onNavigate('mikrotik-server')) },
        { id: 'mikrotik-import', label: 'Import From Mikrotik', action: () => handleItemClick(() => onNavigate('mikrotik-import')) },
        { id: 'mikrotik-bulk', label: 'Bulk Clients Import', action: () => handleItemClick(() => onNavigate('mikrotik-import')) }
      ]
    },
    {
      id: 'hr',
      label: 'HR & Payroll',
      icon: UserCheck,
      hasSub: true,
      subItems: [
        { id: 'hr-dept', label: 'Department', action: () => handleItemClick(() => onNavigate('hr-payslip')) },
        { id: 'hr-payslip', label: 'Payslip', action: () => handleItemClick(() => onNavigate('hr-payslip')) },
        { id: 'hr-employees', label: 'Employee List', action: () => handleItemClick(() => onNavigate('hr-payslip')) }
      ]
    },
    {
      id: 'olt',
      label: 'OLT Management',
      icon: Cpu,
      action: () => handleItemClick(() => onNavigate('olt'))
    },
    {
      id: 'network',
      label: 'Network Diagram',
      icon: Network,
      action: () => handleItemClick(() => onNavigate('network'))
    },
    {
      id: 'leave',
      label: 'Leave Management',
      icon: UserMinus,
      action: () => handleItemClick(() => onNavigate('leave'))
    },
    {
      id: 'pop',
      label: 'POP',
      icon: Briefcase,
      hasSub: true,
      subItems: [
        { id: 'pop-package', label: 'Package', action: () => handleItemClick(() => onNavigate('pop-list')) },
        { id: 'pop-list', label: 'POP List', action: () => handleItemClick(() => onNavigate('pop-list')) },
        { id: 'pop-funding', label: 'POP Funding', action: () => handleItemClick(() => onNavigate('pop-list')) }
      ]
    },
    {
      id: 'events',
      label: 'Events & Holidays',
      icon: Calendar,
      action: () => handleItemClick(() => onNavigate('events'))
    },
    {
      id: 'support',
      label: 'Support & Ticketing',
      icon: Headphones,
      hasSub: true,
      subItems: [
        { id: 'support-category', label: 'Support Category', action: () => handleItemClick(() => onNavigate('support')) },
        { id: 'support-tickets', label: 'Client Support', action: () => handleItemClick(() => onNavigate('support')) },
        { id: 'support-history', label: 'Support History', action: () => handleItemClick(() => onNavigate('support')) }
      ]
    },
    {
      id: 'task',
      label: 'Task Management',
      icon: CheckSquare,
      action: () => handleItemClick(() => onNavigate('task'))
    },
    {
      id: 'bandwidth-buy',
      label: 'Bandwidth Buy',
      icon: Handshake,
      action: () => handleItemClick(() => onNavigate('bandwidth-buy'))
    },
    {
      id: 'bandwidth-sale',
      label: 'Bandwidth Sale',
      icon: DollarSign,
      action: () => handleItemClick(() => onNavigate('bandwidth-sale'))
    },
    {
      id: 'purchase',
      label: 'Purchase',
      icon: ShoppingBag,
      action: () => handleItemClick(() => onNavigate('purchase'))
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      action: () => handleItemClick(() => onNavigate('inventory'))
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: Layers,
      action: () => handleItemClick(() => onNavigate('assets'))
    },
    {
      id: 'sales-service',
      label: 'Sales & Service',
      icon: Tag,
      action: () => handleItemClick(() => onNavigate('sales-service'))
    },
    {
      id: 'income',
      label: 'Income',
      icon: TrendingUp,
      action: () => handleItemClick(() => onNavigate('income'))
    },
    {
      id: 'expense',
      label: 'Expense',
      icon: TrendingDown,
      action: () => handleItemClick(() => onNavigate('expense'))
    },
    {
      id: 'daily-account',
      label: 'Daily Account',
      icon: CalendarCheck,
      action: () => handleItemClick(() => onNavigate('daily-account'))
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: Scale,
      hasSub: true,
      subItems: [
        { id: 'acc-dash', label: 'Accounting Dashboard', action: () => handleItemClick(() => onNavigate('accounting-dash')) },
        { id: 'acc-coa', label: 'Chart of Accounts', action: () => handleItemClick(() => onNavigate('accounting-dash')) },
        { id: 'acc-income', label: 'Income', action: () => handleItemClick(() => onNavigate('accounting-dash')) },
        { id: 'acc-expense', label: 'Expense', action: () => handleItemClick(() => onNavigate('accounting-dash')) },
        { id: 'acc-balances', label: 'Account Balances', action: () => handleItemClick(() => onNavigate('accounting-dash')) },
        { id: 'acc-pl', label: 'Profit Loss', action: () => handleItemClick(() => onNavigate('accounting-dash')) },
        { id: 'acc-cash', label: 'Cash Book', action: () => handleItemClick(() => onNavigate('accounting-dash')) }
      ]
    },
    {
      id: 'report',
      label: 'Report',
      icon: FileBarChart,
      hasSub: true,
      subItems: [
        { id: 'rep-collection', label: 'Bill Collection', action: () => handleItemClick(() => onNavigate('btrc-report')) },
        { id: 'rep-btrc', label: 'BTRC Monthly Report', action: () => handleItemClick(() => onNavigate('btrc-report')) },
        { id: 'rep-customer', label: 'Customer Report', action: () => handleItemClick(() => onNavigate('btrc-report')) },
        { id: 'rep-financial', label: 'Financial Transactions', action: () => handleItemClick(() => onNavigate('btrc-report')) }
      ]
    },
    {
      id: 'sms',
      label: 'SMS Service',
      icon: Mail,
      hasSub: true,
      subItems: [
        { id: 'sms-individual', label: 'Individual SMS', action: () => handleItemClick(() => onNavigate('sms-individual')) },
        { id: 'sms-template', label: 'SMS Template', action: () => handleItemClick(() => onNavigate('sms-templates')) },
        { id: 'sms-group', label: 'SMS Group', action: () => handleItemClick(() => onNavigate('sms-group')) },
        { id: 'sms-send', label: 'Send SMS', action: () => handleItemClick(() => onNavigate('sms-templates')) },
        { id: 'sms-gateway', label: 'SMS Gateway', action: () => handleItemClick(() => onNavigate('sms-gateway')) }
      ]
    },
    {
      id: 'affiliation',
      label: 'Affiliation',
      icon: Share2,
      action: () => handleItemClick(() => onNavigate('affiliation'))
    },
    {
      id: 'system',
      label: 'System',
      icon: Sliders,
      hasSub: true,
      subItems: [
        { id: 'sys-app-users', label: 'App Users', action: () => handleItemClick(() => onNavigate('app-users')) },
        { id: 'sys-company', label: 'Company SetUp', action: () => handleItemClick(() => onNavigate('company-settings')) },
        { id: 'sys-invoice', label: 'Invoice SetUp', action: () => handleItemClick(() => onNavigate('company-settings')) },
        { id: 'sys-periods', label: 'Periods SetUp', action: () => handleItemClick(() => onNavigate('company-settings')) },
        { id: 'sys-gateways', label: 'Payment Gateways', action: () => handleItemClick(() => onNavigate('system-setup')) },
        { id: 'sys-email', label: 'EMail SetUp', action: () => handleItemClick(() => handleItemClick(() => onNavigate('system-setup'))) },
        { id: 'sys-setup', label: 'System SetUp', action: () => handleItemClick(() => onNavigate('system-setup')) },
        { id: 'sys-fee', label: 'P. Processing Fee', action: () => handleItemClick(() => onNavigate('system-setup')) },
        { id: 'sys-vat', label: 'VAT SetUp', action: () => handleItemClick(() => onNavigate('system-setup')) },
        { id: 'sys-activity', label: 'Activity Loggers', action: () => handleItemClick(() => onNavigate('system-setup')) },
        { id: 'sys-auto', label: 'Automatic Process', action: () => handleItemClick(() => onNavigate('automatic-process')) }
      ]
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: Video,
      action: () => handleItemClick(() => onNavigate('tutorials'))
    },
    {
      id: 'release',
      label: 'Release (v8.2.4)',
      icon: Wrench,
      action: () => handleItemClick(() => onNavigate('release'))
    }
  ];

  const filteredItems = navItems.filter((item) => {
    if (!menuSearch) return true;
    const matchesSelf = item.label.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesSub = item.subItems?.some((sub) =>
      sub.label.toLowerCase().includes(menuSearch.toLowerCase())
    );
    return matchesSelf || matchesSub;
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden">
      {/* Search Header when not collapsed */}
      {!collapsed ? (
        <div className="p-3 border-b border-slate-200/80 bg-slate-50/60">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Menu..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white rounded-lg border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            {menuSearch && (
              <button
                onClick={() => setMenuSearch('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-2.5 border-b border-slate-200/80 flex justify-center bg-slate-50/60">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-1.5 text-xs divide-y divide-slate-100/60 scrollbar-thin">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isItemActive =
            activeId === item.id ||
            (item.subItems &&
              item.subItems.some((sub) => {
                if ((sub.id === 'client-list' || sub.id === 'clients') && (activeId === 'clients' || activeId === 'client-list' || activeId === 'clientProfile')) return true;
                if (sub.id === 'client-add' && activeId === 'client-add') return true;
                if (sub.id === 'billing-list' && activeId === 'billing') return true;
                if (sub.id === 'mikrotik-server' && (activeId === 'mikrotik' || activeId === 'mikrotik-server')) return true;
                if (sub.id === 'mikrotik-monitor' && (activeId === 'mikrotik' || activeId === 'mikrotik-monitor')) return true;
                if (sub.id === 'support-tickets' && (activeId === 'support' || activeId === 'support-tickets')) return true;
                if (sub.id === 'pop-list' && (activeId === 'resellers' || activeId === 'pop-list')) return true;
                if (sub.id === 'rep-btrc' && (activeId === 'btrc-report' || activeId === 'reports')) return true;
                if (sub.id === 'acc-dash' && (activeId === 'accounting-dash' || activeId === 'accounts' || activeId === 'accounting')) return true;
                if (sub.id === 'acc-income' && activeId === 'income') return true;
                if (sub.id === 'acc-expense' && activeId === 'expense') return true;
                if (sub.id === 'acc-cash' && activeId === 'daily-account') return true;
                if (sub.id === 'sms-gateway' && activeId === 'sms-gateway') return true;
                if (sub.id === 'sms-template' && (activeId === 'sms-templates' || activeId === 'sms-template')) return true;
                if (sub.id === 'sms-individual' && activeId === 'sms-individual') return true;
                if (sub.id === 'sms-group' && activeId === 'sms-group') return true;
                if (sub.id === 'sms-send' && activeId === 'sms-send') return true;
                if (sub.id === 'sys-auto' && (activeId === 'automatic-process' || activeId === 'automation')) return true;
                if (sub.id === 'sys-app-users' && (activeId === 'app-users' || activeId === 'application-users')) return true;
                if (sub.id === 'sys-company' && activeId === 'company-settings') return true;
                if (sub.id === 'sys-setup' && activeId === 'system-setup') return true;
                return sub.id === activeId;
              }));

          if (collapsed) {
            return (
              <button
                key={item.id}
                onClick={item.action}
                title={item.label}
                className={`w-full flex items-center justify-center py-2.5 transition-colors ${
                  isItemActive
                    ? 'bg-[#162e3d] text-cyan-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          }

          if (!item.hasSub) {
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left transition-colors ${
                  isItemActive
                    ? 'bg-[#162e3d] text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isItemActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }

          const isOpen = openMenus[item.id] || Boolean(menuSearch);

          return (
            <div key={item.id} className="bg-white">
              <button
                onClick={() => toggleMenu(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left transition-colors ${
                  isItemActive
                    ? 'bg-slate-100/90 text-slate-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isItemActive ? 'text-cyan-600' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && item.subItems && (
                <div className="bg-slate-50/70 border-l-2 border-cyan-500/50 ml-4 py-1 space-y-0.5">
                  {item.subItems.map((sub) => {
                    const isSubActive =
                      (sub.id === 'client-list' && (activeId === 'client-list' || activeId === 'clients')) ||
                      (sub.id === 'client-add' && activeId === 'client-add') ||
                      (sub.id === 'billing-list' && activeId === 'billing') ||
                      (sub.id === 'mikrotik-server' && (activeId === 'mikrotik-server' || activeId === 'mikrotik')) ||
                      (sub.id === 'mikrotik-monitor' && activeId === 'mikrotik-monitor') ||
                      (sub.id === 'support-tickets' && activeId === 'support') ||
                      (sub.id === 'pop-list' && activeId === 'pop-list') ||
                      (sub.id === 'rep-btrc' && (activeId === 'btrc-report' || activeId === 'reports')) ||
                      (sub.id === 'acc-dash' && (activeId === 'accounting-dash' || activeId === 'accounting')) ||
                      (sub.id === 'acc-income' && activeId === 'income') ||
                      (sub.id === 'acc-expense' && activeId === 'expense') ||
                      (sub.id === 'acc-cash' && activeId === 'daily-account') ||
                      (sub.id === 'sys-auto' && (activeId === 'automatic-process' || activeId === 'automation')) ||
                      (sub.id === 'sms-individual' && activeId === 'sms-individual') ||
                      (sub.id === 'sms-group' && activeId === 'sms-group') ||
                      (sub.id === 'sms-send' && activeId === 'sms-send') ||
                      (sub.id === 'sms-template' && activeId === 'sms-templates') ||
                      (sub.id === 'sms-gateway' && activeId === 'sms-gateway') ||
                      (sub.id === 'sys-company' && activeId === 'company-settings') ||
                      (sub.id === 'sys-setup' && activeId === 'system-setup') ||
                      (sub.id === 'sys-app-users' && (activeId === 'app-users' || activeId === 'application-users')) ||
                      (sub.id === 'hr-payslip' && activeId === 'hr-payslip');

                    return (
                      <button
                        key={sub.id}
                        onClick={sub.action}
                        className={`w-full flex items-center space-x-2 px-3 py-1.5 text-left text-xs transition-colors rounded-r ${
                          isSubActive
                            ? 'bg-[#162e3d] text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100/90'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSubActive ? 'bg-cyan-400' : 'bg-slate-400'
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Version Tag */}
      {!collapsed ? (
        <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="font-mono text-[10px]">BBN v8.2.4</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Online
          </span>
        </div>
      ) : (
        <div className="py-2 border-t border-slate-200 flex justify-center bg-slate-50">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide in) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-200 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-3.5 bg-[#162e3d] text-white">
          <span className="font-bold text-sm">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-300 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[calc(100vh-3.5rem)]">{sidebarContent}</div>
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200/80 shrink-0 h-[calc(100vh-3.5rem)] transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
