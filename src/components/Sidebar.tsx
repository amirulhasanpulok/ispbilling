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
  Search
} from 'lucide-react';

interface SidebarProps {
  currentView?: string;
  activeNav?: string;
  onNavigate: (view: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      action: () => onNavigate('dashboard')
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: Settings,
      hasSub: true,
      subItems: [
        { id: 'settings', label: 'General Settings', action: () => onNavigate('settings') },
        { id: 'system-setup', label: 'System Setup', action: () => onNavigate('system-setup') }
      ]
    },
    {
      id: 'vas',
      label: 'VAS',
      icon: ShoppingCart,
      badge: 'BDIX',
      action: () => onNavigate('vas')
    },
    {
      id: 'client',
      label: 'Client',
      icon: Users,
      hasSub: true,
      subItems: [
        { id: 'client-new-req', label: 'New Request', action: () => onNavigate('client-new-req') },
        { id: 'client-add', label: 'Add New', action: () => onNavigate('client-add') },
        { id: 'client-list', label: 'Client List', action: () => onNavigate('client-list') },
        { id: 'client-left', label: 'Left Client', action: () => onNavigate('client-left') },
        { id: 'client-scheduler', label: 'Scheduler', action: () => onNavigate('client-scheduler') },
        { id: 'client-change-req', label: 'Change Request', action: () => onNavigate('client-change-req') },
        { id: 'portal-manage', label: 'Portal Manage', action: () => onNavigate('portal-manage') }
      ]
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: FileText,
      hasSub: true,
      subItems: [
        { id: 'billing-list', label: 'Billing List', action: () => onNavigate('billing') },
        { id: 'daily-collection', label: 'Daily Bill Collection', action: () => onNavigate('daily-collection') }
      ]
    },
    {
      id: 'mikrotik',
      label: 'Mikrotik Server',
      icon: Server,
      hasSub: true,
      subItems: [
        { id: 'mikrotik-server', label: 'Server', action: () => onNavigate('mikrotik-server') },
        { id: 'mikrotik-monitor', label: 'Real-Time Bandwidth', action: () => onNavigate('mikrotik-monitor') },
        { id: 'mikrotik-backup', label: 'Server Backup', action: () => onNavigate('mikrotik-server') },
        { id: 'mikrotik-import', label: 'Import From Mikrotik', action: () => onNavigate('mikrotik-import') },
        { id: 'mikrotik-bulk', label: 'Bulk Clients Import', action: () => onNavigate('mikrotik-import') }
      ]
    },
    {
      id: 'hr',
      label: 'HR & Payroll',
      icon: UserCheck,
      hasSub: true,
      subItems: [
        { id: 'hr-dept', label: 'Department', action: () => onNavigate('hr-payslip') },
        { id: 'hr-payslip', label: 'Payslip', action: () => onNavigate('hr-payslip') },
        { id: 'hr-employees', label: 'Employee List', action: () => onNavigate('hr-payslip') }
      ]
    },
    {
      id: 'olt',
      label: 'OLT Management',
      icon: Cpu,
      action: () => onNavigate('olt')
    },
    {
      id: 'network',
      label: 'Network Diagram',
      icon: Network,
      action: () => onNavigate('network')
    },
    {
      id: 'leave',
      label: 'Leave Management',
      icon: UserMinus,
      action: () => onNavigate('leave')
    },
    {
      id: 'pop',
      label: 'POP',
      icon: Briefcase,
      hasSub: true,
      subItems: [
        { id: 'pop-package', label: 'Package', action: () => onNavigate('pop-list') },
        { id: 'pop-list', label: 'POP List', action: () => onNavigate('pop-list') },
        { id: 'pop-funding', label: 'POP Funding', action: () => onNavigate('pop-list') }
      ]
    },
    {
      id: 'events',
      label: 'Events & Holidays',
      icon: Calendar,
      action: () => onNavigate('events')
    },
    {
      id: 'support',
      label: 'Support & Ticketing',
      icon: Headphones,
      hasSub: true,
      subItems: [
        { id: 'support-category', label: 'Support Category', action: () => onNavigate('support') },
        { id: 'support-tickets', label: 'Client Support', action: () => onNavigate('support') },
        { id: 'support-history', label: 'Support History', action: () => onNavigate('support') }
      ]
    },
    {
      id: 'task',
      label: 'Task Management',
      icon: CheckSquare,
      action: () => onNavigate('task')
    },
    {
      id: 'bandwidth-buy',
      label: 'Bandwidth Buy',
      icon: Handshake,
      action: () => onNavigate('bandwidth-buy')
    },
    {
      id: 'bandwidth-sale',
      label: 'Bandwidth Sale',
      icon: DollarSign,
      action: () => onNavigate('bandwidth-sale')
    },
    {
      id: 'purchase',
      label: 'Purchase',
      icon: ShoppingBag,
      action: () => onNavigate('purchase')
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      action: () => onNavigate('inventory')
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: Layers,
      action: () => onNavigate('assets')
    },
    {
      id: 'sales-service',
      label: 'Sales & Service',
      icon: Tag,
      action: () => onNavigate('sales-service')
    },
    {
      id: 'income',
      label: 'Income',
      icon: TrendingUp,
      action: () => onNavigate('income')
    },
    {
      id: 'expense',
      label: 'Expense',
      icon: TrendingDown,
      action: () => onNavigate('expense')
    },
    {
      id: 'daily-account',
      label: 'Daily Account',
      icon: CalendarCheck,
      action: () => onNavigate('daily-account')
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: Scale,
      hasSub: true,
      subItems: [
        { id: 'acc-dash', label: 'Accounting Dashboard', action: () => onNavigate('accounting-dash') },
        { id: 'acc-coa', label: 'Chart of Accounts', action: () => onNavigate('accounting-dash') },
        { id: 'acc-income', label: 'Income', action: () => onNavigate('accounting-dash') },
        { id: 'acc-expense', label: 'Expense', action: () => onNavigate('accounting-dash') },
        { id: 'acc-balances', label: 'Account Balances', action: () => onNavigate('accounting-dash') },
        { id: 'acc-pl', label: 'Profit Loss', action: () => onNavigate('accounting-dash') },
        { id: 'acc-cash', label: 'Cash Book', action: () => onNavigate('accounting-dash') }
      ]
    },
    {
      id: 'report',
      label: 'Report',
      icon: FileBarChart,
      hasSub: true,
      subItems: [
        { id: 'rep-collection', label: 'Bill Collection', action: () => onNavigate('btrc-report') },
        { id: 'rep-btrc', label: 'BTRC Monthly Report', action: () => onNavigate('btrc-report') },
        { id: 'rep-customer', label: 'Customer Report', action: () => onNavigate('btrc-report') },
        { id: 'rep-financial', label: 'Financial Transactions', action: () => onNavigate('btrc-report') }
      ]
    },
    {
      id: 'sms',
      label: 'SMS Service',
      icon: Mail,
      hasSub: true,
      subItems: [
        { id: 'sms-individual', label: 'Individual SMS', action: () => onNavigate('sms-individual') },
        { id: 'sms-template', label: 'SMS Template', action: () => onNavigate('sms-templates') },
        { id: 'sms-group', label: 'SMS Group', action: () => onNavigate('sms-group') },
        { id: 'sms-send', label: 'Send SMS', action: () => onNavigate('sms-templates') },
        { id: 'sms-gateway', label: 'SMS Gateway', action: () => onNavigate('sms-gateway') }
      ]
    },
    {
      id: 'affiliation',
      label: 'Affiliation',
      icon: Share2,
      action: () => onNavigate('affiliation')
    },
    {
      id: 'system',
      label: 'System',
      icon: Sliders,
      hasSub: true,
      subItems: [
        { id: 'sys-app-users', label: 'App Users', action: () => onNavigate('app-users') },
        { id: 'sys-company', label: 'Company SetUp', action: () => onNavigate('company-settings') },
        { id: 'sys-invoice', label: 'Invoice SetUp', action: () => onNavigate('company-settings') },
        { id: 'sys-periods', label: 'Periods SetUp', action: () => onNavigate('company-settings') },
        { id: 'sys-gateways', label: 'Payment Gateways', action: () => onNavigate('system-setup') },
        { id: 'sys-email', label: 'EMail SetUp', action: () => onNavigate('system-setup') },
        { id: 'sys-setup', label: 'System SetUp', action: () => onNavigate('system-setup') },
        { id: 'sys-fee', label: 'P. Processing Fee', action: () => onNavigate('system-setup') },
        { id: 'sys-vat', label: 'VAT SetUp', action: () => onNavigate('system-setup') },
        { id: 'sys-activity', label: 'Activity Loggers', action: () => onNavigate('system-setup') },
        { id: 'sys-auto', label: 'Automatic Process', action: () => onNavigate('automatic-process') }
      ]
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: Video,
      action: () => onNavigate('tutorials')
    },
    {
      id: 'release',
      label: 'Release (v8.2.4)',
      icon: Wrench,
      action: () => onNavigate('release')
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

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-3.5rem)] select-none shrink-0 shadow-sm overflow-hidden">
      {/* Menu Search Box */}
      <div className="p-2.5 border-b border-slate-200 bg-slate-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Menu Search..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white rounded border border-slate-300 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-1 text-xs divide-y divide-slate-100 scrollbar-thin">
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

          if (!item.hasSub) {
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                  isItemActive
                    ? 'bg-[#162e3d] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isItemActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          }

          const isOpen = openMenus[item.id] || Boolean(menuSearch);

          return (
            <div key={item.id} className="bg-white">
              <button
                onClick={() => toggleMenu(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                  isItemActive
                    ? 'bg-[#162e3d] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isItemActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {isOpen && item.subItems && (
                <div className="bg-slate-50 border-l-2 border-slate-300 ml-4 py-1 space-y-0.5">
                  {item.subItems.map((sub) => {
                    const isSubActive =
                      (sub.id === 'client-list' && currentView === 'client-list') ||
                      (sub.id === 'client-add' && currentView === 'client-add') ||
                      (sub.id === 'billing-list' && currentView === 'billing') ||
                      (sub.id === 'mikrotik-server' && currentView === 'mikrotik-server') ||
                      (sub.id === 'mikrotik-monitor' && currentView === 'mikrotik-monitor') ||
                      (sub.id === 'support-tickets' && currentView === 'support') ||
                      (sub.id === 'pop-list' && currentView === 'pop-list') ||
                      (sub.id === 'rep-btrc' && currentView === 'btrc-report') ||
                      (sub.id === 'acc-dash' && (currentView === 'accounting-dash' || currentView === 'accounting')) ||
                      (sub.id === 'acc-income' && currentView === 'income') ||
                      (sub.id === 'acc-expense' && currentView === 'expense') ||
                      (sub.id === 'acc-cash' && currentView === 'daily-account') ||
                      (sub.id === 'sys-auto' && (currentView === 'automatic-process' || currentView === 'automation')) ||
                      (sub.id === 'sms-individual' && currentView === 'sms-individual') ||
                      (sub.id === 'sms-group' && currentView === 'sms-group') ||
                      (sub.id === 'sms-send' && (currentView === 'sms-send' || currentView === 'sms-templates')) ||
                      (sub.id === 'sms-template' && (currentView === 'sms-templates' || activeId === 'sms-templates')) ||
                      (sub.id === 'sms-gateway' && (currentView === 'sms-gateway' || activeId === 'sms-gateway')) ||
                      (sub.id === 'sys-company' && currentView === 'company-settings') ||
                      (sub.id === 'sys-invoice' && currentView === 'company-settings') ||
                      (sub.id === 'sys-periods' && currentView === 'company-settings') ||
                      (sub.id === 'sys-setup' && currentView === 'system-setup') ||
                      (sub.id === 'sys-gateways' && currentView === 'system-setup') ||
                      (sub.id === 'sys-email' && currentView === 'system-setup') ||
                      (sub.id === 'sys-vat' && currentView === 'system-setup') ||
                      (sub.id === 'sys-activity' && currentView === 'system-setup') ||
                      (sub.id === 'sys-app-users' && (currentView === 'app-users' || currentView === 'application-users' || activeId === 'app-users' || activeId === 'application-users')) ||
                      (sub.id === 'hr-payslip' && currentView === 'hr-payslip');

                    return (
                      <button
                        key={sub.id}
                        onClick={sub.action}
                        className={`w-full flex items-center space-x-2 px-3 py-1.5 text-left text-xs transition-colors rounded-r ${
                          isSubActive
                            ? 'bg-[#162e3d] text-white font-semibold'
                            : 'text-slate-600 hover:text-cyan-600 hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSubActive ? 'bg-cyan-400' : 'bg-slate-400'
                          }`}
                        />
                        <span>{sub.label}</span>
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
      <div className="p-2 border-t border-slate-200 bg-slate-100 text-[10px] text-slate-500 text-center flex items-center justify-between">
        <span>BBN Core ISP v8.2.4</span>
        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
        </span>
      </div>
    </aside>
  );
};
